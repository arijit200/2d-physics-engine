// games --> scenes

function loadScene()
{
    var x = document.getElementById('scene');
    console.log(x.value);

    if(x.value === "Dummy"){
        return 0;
    }
    else if(x.value === "Scene1"){
        return 1;
    }
    else if(x.value === "Scene2"){
        return 2;
    }
    else if(x.value === "Scene3"){
        return 3;
    }
}


function MyGame() {

    var t = loadScene();
    
    if(t === 1)
    {   var sz = gEngine.Core.mAllObjects.length;
        gEngine.Core.mAllObjects.splice(0, sz);

        var dummy = new Circle(new Vec2(1400, -99999999), 1, 0, 1, 1);
        
        var base = new Rectangle(new Vec2(500, 700), 700, 20, 0, 1, 0.8);

    }
    else if(t === 2)
    {
        var sz = gEngine.Core.mAllObjects.length;
        gEngine.Core.mAllObjects.splice(0, sz);

        var dummy = new Circle(new Vec2(1400, -99999999), 1, 0, 1, 1);

        var tl = new Rectangle(new Vec2(300, 100), 300, 20, 0, 1, 0.9);
        tl.rotate(Math.PI/6);

        var tr = new Rectangle(new Vec2(600, 230), 400, 20, 0, 1, 0.9);
        tr.rotate(-Math.PI/6);

        var bl = new Rectangle(new Vec2(300, 400), 300, 20, 0, 1, 0.9);
        bl.rotate(Math.PI/6);

        var br = new Rectangle(new Vec2(600, 530), 400, 20, 0, 1, 0.9);
        br.rotate(-Math.PI/6);
        
        var base = new Rectangle(new Vec2(500, 750), 700, 20, 0, 1, 0.9);
        
        
    }
    else if(t === 3)
    {
        var sz = gEngine.Core.mAllObjects.length;
        gEngine.Core.mAllObjects.splice(0, sz);

        var dummy = new Circle(new Vec2(1400, -99999999), 1, 0, 1, 1);

        var le = new Rectangle(new Vec2(300, 200), 120, 120, 0, 1, 1);
        // le.rotate(Math.PI/4);
        var re = new Rectangle(new Vec2(700, 200), 120, 120, 0, 1, 1);
        // re.rotate(Math.PI/4);

        var tl = new Rectangle(new Vec2(150, 300), 20, 500, 0, 1, 1);
        var tr = new Rectangle(new Vec2(850, 300), 20, 500, 0, 1, 1);

        var bl = new Rectangle(new Vec2(250, 670), 20, 270, 0, 1, 1);
        bl.rotate(-Math.PI/4);

        var br = new Rectangle(new Vec2(750, 670), 20, 270, 0, 1, 1);
        br.rotate(Math.PI/4);

        var nose = new Rectangle(new Vec2(500, 350), 40, 150, 0, 1, 1);
 
        for(var i = 350; i <= 650; i += 100)
        {
            var mouth = new Rectangle(new Vec2(i, 600), 70, 70, 0, 1, 1);
            // mouth.rotate(Math.PI/4);
        }


    }

}