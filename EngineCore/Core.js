//Operate in Strict mode such that variables must be declared before used!

"use strict";

var gEngine = gEngine || {};
/*
This particular pattern when seen at the top of files is used to create
a namespace, i.e. a named object under which functions and variables
can be created without unduly polluting the global object.

The reason why it's used is so that if you have two (or more) files:

var MY_NAMESPACE = MY_NAMESPACE || {};
MY_NAMESPACE.func1 = {
}

var MY_NAMESPACE = MY_NAMESPACE || {};
MY_NAMESPACE.func2 = {
}

both of which share the same namespace it then doesn't matter in which
order the two files are loaded, you still get func1 and func2 
correctly defined within the MY_NAMESPACE object correctly.
*/

gEngine.Core = (function() {
    var mCanvas, mContext, mWidth=1080, mHeight=800;
    mCanvas = document.getElementById('canvas');
    mContext = mCanvas.getContext('2d');
    mCanvas.height = mHeight;
    mCanvas.width = mWidth;


    // fps, time, all necessities ======================================================
    var mCurrentTime, mElaspedTime, mPreviousTime = Date.now(), mLagTime = 0;
    var kFPS = 60;
    var kFrameTime = 1 / kFPS;
    var mUpdateIntervalInSeconds = kFrameTime;

    var kMPF = 1000 * kFrameTime; //ms per frame

    //==================================================================================

    var mGravity = new Vec2(0, 100);
    var mMovement = true;



    //stores all the objects on screen ===================================================
    var mAllObjects = [];

    //shows the info of the objects on screen ==============================================
    var updateUIEcho = function(){
        document.getElementById('uiEchoString').innerHTML=
        "<hr>"+
        "<p><b><------- Selected Object -------> </b></p>" + 
        "<ul style=\"margin:--10px\">" +
        "<li>Id --> " + gObjectNum + "</li>" + 
        "<li>Center --> x : " + mAllObjects[gObjectNum].mCenter.x.toPrecision(3) + " , y : " +
        mAllObjects[gObjectNum].mCenter.y.toPrecision(3) + "</li>" + 
        "<li>Angle --> " + mAllObjects[gObjectNum].mAngle.toPrecision(3) + "</li>" +
        "<li>Velocity --> " + mAllObjects[gObjectNum].mVelocity.x.toPrecision(3) + "," + mAllObjects[gObjectNum].mVelocity.y.toPrecision(3) + "</li>" +
        "<li>AngluarVelocity --> " + mAllObjects[gObjectNum].mAngularVelocity.toPrecision(3) + "</li>" +
        "<li>Mass --> " + 1 / mAllObjects[gObjectNum].mInvMass.toPrecision(3) + "</li>" +
        "<li>Friction --> " + mAllObjects[gObjectNum].mFriction.toPrecision(3) + "</li>" +
        "<li>Restitution --> " + mAllObjects[gObjectNum].mRestitution.toPrecision(3) + "</li>" +
        "<li>Movement --> " + gEngine.Core.mMovement + "</li>" +
        "</ul><hr>" + 


        "<p><b><------- Control of Selected Object -------></b></p>" + 
        "<ul style=\margin:-10px\">" + 
        "<li><b>Up/Down Arrow</b> --> SelectObject</li>" + 
        "<li><b>WASD</b> + <b>QE</b> --> Position [Move + Rotate]</li>" +
        "<li><b>IJKL</b> + <b>UO</b> --> Velocities [Linear + Angular]</li>" +
        "<li><b>Z/X</b> --> Mass [Decrease/Increase]</li>" +
        "<li><b>C/V</b> --> Friction [Decrease/Increase]</li>" +
        "<li><b>B/N</b> --> Restitution [Decrease/Increase]</li>" +
        "</ul><hr>" + 


        "<p><b><------- Global Control -------></b></p>" +
        "<ul style=\margin:-10px\>"+
        "<li><b>Left/Right Click</b> --> Spawn [Circle/Rectangle]</li>" + 
        "<li><b>Spacebar</b> --> [Play/Pause]</li>" +
        "<li><b>H</b> --> Excite all objects</li>" +
        "<li><b>R</b> --> Reset System</li>" +
        "</ul></br><hr>";
    };

    //updates the state of every object ================================================
    var update = function(){
        var i;
        for(i = 0; i < mAllObjects.length; i++)
        {   
            mAllObjects[i].update(mContext);
        }
        //update only those which have not crossed the lower canvas
    };

    //draws the objects on screen ========================================================
    var draw = function(){
        mContext.clearRect(0, 0, mWidth, mHeight);
        var i;
        for(i = 0; i < mAllObjects.length; i++)
        {
            if(mAllObjects[i].mCenter.y  < mHeight + 100)
            {
                if(i === gObjectNum) {
                    mContext.lineWidth = 2;
                    mContext.strokeStyle = 'red';
                    mAllObjects[i].draw(mContext);
                }else{
                    mContext.lineWidth = 1;
                    mContext.strokeStyle = 'blue';
                    mAllObjects[i].draw(mContext);
                }
            }
            else
            {
                mAllObjects.splice(i, 1);
            }
        }
    };


    //does animation for the engine runs every frame =======================================
    var runGameLoop = function(){
        requestAnimationFrame(function() {
            runGameLoop();
        });

        //time elasped till last loop
        mCurrentTime = Date.now();
        mElaspedTime = mCurrentTime - mPreviousTime;
        mPreviousTime = mCurrentTime;
        mLagTime += mElaspedTime;

        
        updateUIEcho();
        draw();
        // update the scene appropiate no. of times =======
        // update only ms per frame
        // if lag larger then update until it catches up
        while(mLagTime >= kMPF){
            mLagTime -= kMPF;
            gEngine.Physics.collision();
            update();
        }
        
    };


    // initiates the game engine =======================================================
    var initialiseEngineCore = function(){
        runGameLoop();
    };


    //public object that will be used later ===========================================
    var mPublic = {
        initialiseEngineCore : initialiseEngineCore,
        mAllObjects : mAllObjects,
        mHeight : mHeight,
        mWidth : mWidth,
        mContext : mContext,
        mGravity : mGravity,
        mUpdateIntervalInSeconds : mUpdateIntervalInSeconds,
        mMovement : mMovement
    };
    return mPublic;

}()); //--> self invoking functions