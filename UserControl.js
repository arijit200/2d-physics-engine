// handles user inputs
"use strict";
//prevents default actions of mouse clicks ------------------------>
window.addEventListener('contextmenu', function (e) { 
    e.preventDefault(); 
  }, false);


//user controls ------------------------------>

var width = gEngine.Core.mWidth;
var height = gEngine.Core.mHeight;
var context = gEngine.Core.mContext;

var cw = width;
var ch = height;

var gObjectNum = 0;

function userControl(event){
    var keycode;

    if(window.event) //IE
    {
        keycode = event.keyCode;
    }
    else if(event.which) // firefox, chrome
    {
        keycode = event.which;
    }
    //============= object selection ===================================
    if(keycode === 38) // up arrow
    {
        if(gObjectNum < gEngine.Core.mAllObjects.length - 1)
        gObjectNum++;
    }
    if(keycode === 40) // down arrow
    {
        if(gObjectNum > 0)
        gObjectNum--;
    }


    //=============== object movement ======================================
    if(keycode === 87){ // W
        gEngine.Core.mAllObjects[gObjectNum].move(new Vec2(0, -10));
    }
    if(keycode === 83){ // S
        gEngine.Core.mAllObjects[gObjectNum].move(new Vec2(0, 10));
    }
    if(keycode === 65){ // A
        gEngine.Core.mAllObjects[gObjectNum].move(new Vec2(-10, 0));
    }
    if(keycode === 68){ // D
        gEngine.Core.mAllObjects[gObjectNum].move(new Vec2(10, 0));
    }
    if(keycode === 81){ // Q
        gEngine.Core.mAllObjects[gObjectNum].rotate(-0.1);
    }
    if(keycode === 69){ // E
        gEngine.Core.mAllObjects[gObjectNum].rotate(0.1);
    }


    if (keycode === 73) { //I
        gEngine.Core.mAllObjects[gObjectNum].mVelocity.y -= 1;
    }
    if (keycode === 75) { //k
        gEngine.Core.mAllObjects[gObjectNum].mVelocity.y += 1;
    }
    if (keycode === 74) { //j
        gEngine.Core.mAllObjects[gObjectNum].mVelocity.x -= 1;
    }
    if (keycode === 76) { //l
        gEngine.Core.mAllObjects[gObjectNum].mVelocity.x += 1;
    }
    if (keycode === 85) { //U
        gEngine.Core.mAllObjects[gObjectNum].mAngularVelocity -= 0.1;
    }
    if (keycode === 79) { //O
        gEngine.Core.mAllObjects[gObjectNum].mAngularVelocity += 0.1;
    }
    if (keycode === 90) { //Z
        gEngine.Core.mAllObjects[gObjectNum].updateMass(-1);
    }
    if (keycode === 88) { //X
        gEngine.Core.mAllObjects[gObjectNum].updateMass(1);
    }
    if (keycode === 67) { //C
        gEngine.Core.mAllObjects[gObjectNum].mFriction -= 0.01;
    }
    if (keycode === 86) { //V
        gEngine.Core.mAllObjects[gObjectNum].mFriction += 0.01;
    }
    if (keycode === 66) { //B
        gEngine.Core.mAllObjects[gObjectNum].mRestitution -= 0.01;
    }
    if (keycode === 78) { //N
        gEngine.Core.mAllObjects[gObjectNum].mRestitution += 0.01;
    }

    if (keycode === 32) { //spacebar --> play or pause
        gEngine.Core.mMovement = !gEngine.Core.mMovement;
    }


    //================ scene settings================================================
    
    if (keycode === 72) {//H --> excite system
        var i;
        for (i = 0; i < gEngine.Core.mAllObjects.length; i++) {
            if (gEngine.Core.mAllObjects[i].mInvMass !== 0) {
                gEngine.Core.mAllObjects[i].mVelocity = new Vec2(Math.random() * 500 - 250, Math.random() * 500 - 250);
            }
        }
    }
    
    if(keycode === 82){ // R --> reset scene
        var t = loadScene();
        if(t === 1)
        {
            gEngine.Core.mAllObjects.splice(2, gEngine.Core.mAllObjects.length);
        }
        else if(t===2)
        {
            gEngine.Core.mAllObjects.splice(6, gEngine.Core.mAllObjects.length);
        }
        else if(t===3)
        {
            gEngine.Core.mAllObjects.splice(12, gEngine.Core.mAllObjects.length);
        }
       
        gObjectNum = 0;
    }
    // if(keycode === 32){ // Spcaebar --.> toggle gravity
    //     if(gEngine.Core.mAllObjects[gObjectNum].mFix === 0)
    //         gEngine.Core.mAllObjects[gObjectNum].mFix = 1;
    //     else 
    //         gEngine.Core.mAllObjects[gObjectNum].mFix = 0;
    // }
}


// creates shapes ---> rects and circles
// -10 is given to remove margins or padding whatever they call it
function createShapes(event){
    if(event.button == 2)
    {
        var x = event.x-15;
        var y = event.y-15;
        var w = Math.random()*50+15;
        var h = Math.random()*50+15
        // var ang = Math.random();
        if(x + w/2 <= cw && x - w/2 >= 0 && y - h/2 >=0 && y + h/2 <= ch) 
        var r1 = new Rectangle(new Vec2(x, y), w, h, Math.random() * 30, Math.random(), Math.random());
        
    }
    else if(event.button == 0)
    {   
        // context.beginPath();
        // context.arc(event.x-10 , event.y-10, Math.random()*30+10, 0, Math.PI*2, true);
        // context.closePath();
        // context.stroke();
        var x = event.x-15;
        var y = event.y-15;
        var radius = Math.random()*30+10;
        if(x + radius <= cw && x - radius >= 0 && y - radius >= 0 && y + radius <= ch) 
        var r1 = new Circle(new Vec2(x , y), radius, Math.random() * 30, Math.random(), Math.random());
        
    }
}