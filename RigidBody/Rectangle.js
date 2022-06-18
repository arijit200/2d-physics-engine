
"use strict";

class SupportStruct {
    constructor() {
        this.mSupportPoint = null;
        this.mSupportPointDist = 0;
    }
}
var tmpSupport = new SupportStruct();


class Rectangle extends RigidShape{
    constructor(center, width, height, mass, friction, restitution) {

        // RigidShape.call(this, center);
        super(center, mass, friction, restitution);
        this.mType = "Rectangle";
        this.mWidth = width;
        this.mHeight = height;
        // this.mFix = fix;

        this.mBoundRadius = Math.sqrt(width * width + height * height) / 2;
        this.mVertex = [];
        this.mFaceNormal = [];

        //0--TopLeft;1--TopRight;2--BottomRight;3--BottomLeft
        this.mVertex[0] = new Vec2(center.x - width / 2, center.y - height / 2);
        this.mVertex[1] = new Vec2(center.x + width / 2, center.y - height / 2);
        this.mVertex[2] = new Vec2(center.x + width / 2, center.y + height / 2);
        this.mVertex[3] = new Vec2(center.x - width / 2, center.y + height / 2);

        //0--Top;1--Right;2--Bottom;3--Left
        //mFaceNormal is normal of face toward outside of rectangle
        this.mFaceNormal[0] = this.mVertex[1].subtract(this.mVertex[2]);
        this.mFaceNormal[0] = this.mFaceNormal[0].normalize();
        this.mFaceNormal[1] = this.mVertex[2].subtract(this.mVertex[3]);
        this.mFaceNormal[1] = this.mFaceNormal[1].normalize();
        this.mFaceNormal[2] = this.mVertex[3].subtract(this.mVertex[0]);
        this.mFaceNormal[2] = this.mFaceNormal[2].normalize();
        this.mFaceNormal[3] = this.mVertex[0].subtract(this.mVertex[1]);
        this.mFaceNormal[3] = this.mFaceNormal[3].normalize();


        this.updateInertia();

    }
    rotate(angle) {
        this.mAngle += angle;
        var i;
        for (i = 0; i < this.mVertex.length; i++) {
            this.mVertex[i] = this.mVertex[i].rotate(this.mCenter, angle);
        }
        this.mFaceNormal[0] = this.mVertex[1].subtract(this.mVertex[2]);
        this.mFaceNormal[0] = this.mFaceNormal[0].normalize();
        this.mFaceNormal[1] = this.mVertex[2].subtract(this.mVertex[3]);
        this.mFaceNormal[1] = this.mFaceNormal[1].normalize();
        this.mFaceNormal[2] = this.mVertex[3].subtract(this.mVertex[0]);
        this.mFaceNormal[2] = this.mFaceNormal[2].normalize();
        this.mFaceNormal[3] = this.mVertex[0].subtract(this.mVertex[1]);
        this.mFaceNormal[3] = this.mFaceNormal[3].normalize();
        return this;
    }
    move(v) {
        var i;
        for (i = 0; i < this.mVertex.length; i++) {
            this.mVertex[i] = this.mVertex[i].add(v);
        }
        this.mCenter = this.mCenter.add(v);
        return this;
    }
    draw(context) {
        context.save();

        context.translate(this.mVertex[0].x, this.mVertex[0].y);
        context.rotate(this.mAngle);
        context.strokeRect(0, 0, this.mWidth, this.mHeight);

        context.restore();
    }

    updateInertia(){
        if (this.mInvMass === 0) {
            this.mInertia = 0;
        } else {
            //inertia=mass*width^2+height^2
            this.mInertia = (1 / this.mInvMass) * (this.mWidth * this.mWidth + this.mHeight * this.mHeight) / 12;
            this.mInertia = 1 / this.mInertia;
        }
    }

    //collsion code =========================================>>>>>>>>>>>>>>>>>>>>>>>>>

    collisionTest(otherShape, collisionInfo){
        var status = false;
        if (otherShape.mType === "Circle") {
            status = this.collidedRectCirc(otherShape, collisionInfo);
        } else {
            status = this.collidedRectRect(this, otherShape, collisionInfo);
        }
        return status;
    }

    findSupportPoint(dir, ptOnEdge){
        //get longest project range
        var vToEdge;
        var projection;
        //intialise computed rersuls
        tmpSupport.mSupportPointDist = -9999999;
        tmpSupport.mSupportPoint = null;

        for(var i = 0; i < this.mVertex.length; i++)
        {
            vToEdge = this.mVertex[i].subtract(ptOnEdge);
            projection = vToEdge.dot(dir);

            //finding longest dist with certain edge
            //dir is -n direction, so the dirction shoul be +ve
            if(projection > 0 && projection > tmpSupport.mSupportPointDist)
            {
                tmpSupport.mSupportPoint = this.mVertex[i];
                tmpSupport.mSupportPointDist = projection;
            }
        }
    }

    findAxisLeastPenetration(otherRect, collisionInfo){
        var n;
        var supportPoint;
        var bestDistance = 999999;
        var bestIndex = null;
        var hasSupport = true;
        var i = 0;

        while((hasSupport) && (i < this.mFaceNormal.length))
        {
            //retieve face normal from A
            n = this.mFaceNormal[i];

            var dir = n.scale(-1);
            var ptOnEdge = this.mVertex[i];

            otherRect.findSupportPoint(dir, ptOnEdge);
            hasSupport = (tmpSupport.mSupportPoint != null);

            //get shortest support point depth
            if((hasSupport) && (tmpSupport.mSupportPointDist < bestDistance))
            {
                bestDistance = tmpSupport.mSupportPointDist;
                bestIndex = i;
                supportPoint = tmpSupport.mSupportPoint
            }

            i = i+1;
        }

        if(hasSupport){
            var bestVec = this.mFaceNormal[bestIndex].scale(bestDistance);
            collisionInfo.setInfo(bestDistance, this.mFaceNormal[bestIndex], supportPoint.add(bestVec));
        }

        return hasSupport;
    }

    collidedRectRect(r1, r2, collisionInfo){
        var status1 = false;
        var status2 = false;

        var collisionInfoR1 = new CollisionInfo();
        var collisionInfoR2 = new CollisionInfo();

        status1 = r1.findAxisLeastPenetration(r2, collisionInfoR1);
        if(status1)
        {
            status2 = r2.findAxisLeastPenetration(r1, collisionInfoR2);
            if(status2)
            {
                if(collisionInfoR1.getDepth() < collisionInfoR2.getDepth())
                {
                    var depthVec = collisionInfoR1.getNormal().scale(collisionInfoR1.getDepth());
                    collisionInfo.setInfo(collisionInfoR1.getDepth(), collisionInfoR1.getNormal(), collisionInfoR1.mStart.subtract(depthVec));
                }
                else{
                    collisionInfo.setInfo(collisionInfoR2.getDepth(), collisionInfoR2.getNormal().scale(-1), collisionInfoR2.mStart);
                }
            }
        }

        return status1 && status2;
    }

    // b/w rect and circle
    collidedRectCirc(otherCir, collisionInfo){
        var inside = true;
        var bestDistance = -99999;
        var nearestEdge = 0;
        var i, v;
        var circ2Pos, projection;
        for (i = 0; i < 4; i++) 
        {
            //find the nearest face for center of circle        
            circ2Pos = otherCir.mCenter;
            v = circ2Pos.subtract(this.mVertex[i]);
            projection = v.dot(this.mFaceNormal[i]);
            if (projection > 0) 
            {
                //if the center of circle is outside of rectangle
                bestDistance = projection;
                nearestEdge = i;
                inside = false;
                break;
            }
            if (projection > bestDistance) 
            {
                bestDistance = projection;
                nearestEdge = i;
            }
        }
        var dis, normal, radiusVec;
        if (!inside) 
        {
            //the center of circle is outside of rectangle

            //v1 is from left vertex of face to center of circle 
            //v2 is from left vertex of face to right vertex of face
            var v1 = circ2Pos.subtract(this.mVertex[nearestEdge]);
            var v2 = this.mVertex[(nearestEdge + 1) % 4].subtract(this.mVertex[nearestEdge]);

            var dot = v1.dot(v2);

            if (dot < 0) 
            {
                //the center of circle is in corner region of mVertex[nearestEdge]
                dis = v1.length();
                //compare the distance with radium to decide collision
                if (dis > otherCir.mRadius) {
                    return false;
                }

                normal = v1.normalize();
                radiusVec = normal.scale(-otherCir.mRadius);
                collisionInfo.setInfo(otherCir.mRadius - dis, normal, circ2Pos.add(radiusVec));
            } 
            else 
            {
                //the center of circle is in corner region of mVertex[nearestEdge+1]

                //v1 is from right vertex of face to center of circle 
                //v2 is from right vertex of face to left vertex of face
                v1 = circ2Pos.subtract(this.mVertex[(nearestEdge + 1) % 4]);
                v2 = v2.scale(-1);
                dot = v1.dot(v2); 
                if (dot < 0) 
                {
                    dis = v1.length();
                    //compare the distance with radium to decide collision
                    if (dis > otherCir.mRadius) {
                        return false;
                    }
                    normal = v1.normalize();
                    radiusVec = normal.scale(-otherCir.mRadius);
                    collisionInfo.setInfo(otherCir.mRadius - dis, normal, circ2Pos.add(radiusVec));
                } 
                else 
                {
                    //the center of circle is in face region of face[nearestEdge]
                    if (bestDistance < otherCir.mRadius) {
                        radiusVec = this.mFaceNormal[nearestEdge].scale(otherCir.mRadius);
                        collisionInfo.setInfo(otherCir.mRadius - bestDistance, this.mFaceNormal[nearestEdge], circ2Pos.subtract(radiusVec));
                    } 
                    else {
                        return false;
                    }
                }
            }
        }
        else 
        {
            //the center of circle is inside of rectangle
            radiusVec = this.mFaceNormal[nearestEdge].scale(otherCir.mRadius);
            collisionInfo.setInfo(otherCir.mRadius - bestDistance, this.mFaceNormal[nearestEdge], circ2Pos.subtract(radiusVec));
        }
        return true;
    }

}





