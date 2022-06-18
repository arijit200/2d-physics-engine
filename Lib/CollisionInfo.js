"use strict";

class CollisionInfo {
    constructor() {
        this.mDepth = 0; //scalar quantity
        this.mNormal = new Vec2(0, 0);
        this.mStart = new Vec2(0, 0);
        this.mEnd = new Vec2(0, 0);
    }

    setNormal(s){
        this.mNormal = s;
    }

    getNormal()
    {
        return this.mNormal;
    }

    getDepth(){
        return this.mDepth;
    }

    setInfo(d, n, s)
    {
        this.mDepth = d;
        this.mNormal = n;
        this.mStart = s;
        this.mEnd = s.add(n.scale(d));
    }

    changeDir(){
        this.mNormal = this.mNormal.scale(-1);
        //swap start and end vectos
        var x = this.mStart;
        this.mStart = this.mEnd;
        this.mEnd = x;
    }

}