
var renderer;
var levelCubes;

function createLevelChunk(xWidth, zWidth, height)
{
    var level = [];
    for (var i = 0; i < xWidth; ++i)
    {
        for(var j = 0; j < zWidth; ++j)
        {
            var material;
            if(Math.random() < 0.5)
            {
                material = 0x202020;
            }
            else
            {
                material = 0x221111;
            }
            level.push(material);
        }
    }

    return level;
}


function Graphics()
{
    this.scene = new THREE.Scene();
    this.cameras = {};

    this.projector = new THREE.Projector();

    this.UnitCube = new THREE.CubeGeometry(1, 1, 1);

    renderer = new THREE.WebGLRenderer({ antialias:true });
    renderer.setClearColor(0x101010, 1)
    renderer.autoClear = false;
    document.body.appendChild(renderer.domElement);

    var levelWidth = 60;
    var levelDepth = 30;
    var base = new THREE.Object3D();
    base.position.x = -levelWidth/2;
    base.position.z = -levelDepth/2;
    this.scene.add(base);

    var light = new THREE.AmbientLight(0x141414);
    this.scene.add(light);
    light = new THREE.PointLight( 0xFFFFFF, 1, 120 );
    light.position.set( 0, 80, levelDepth / 2);
    this.scene.add( light );


    var levelChunk = createLevelChunk(levelWidth, levelDepth, 1);
    for(var i = 0; i < levelWidth; ++i)
    {
        for(var j = 0; j < levelDepth; ++j)
        {
            var block = levelChunk[i * levelDepth + j];
            if(block != null)
            {
                var material = new THREE.MeshLambertMaterial( { color: block} );
                var cube = new THREE.Mesh( this.UnitCube, material );
                cube.position = new THREE.Vector3(i, 0, j);
                //base.add(cube);
            }
        }
    }

    var geo = buildGeometryFromChunk(levelChunk, levelWidth, 1, levelDepth);
    base.add(new THREE.Mesh(geo, new THREE.MeshLambertMaterial({vertexColors:true})));
}

Graphics.prototype.rayCast = function(pixelX, pixelY)
{
    var mouseNX = (pixelX / window.innerWidth);
    var mouseNY = 1 - (pixelY / window.innerHeight);

    var mouseNDCX = mouseNX * 2 - 1;
    var mouseNDCY = mouseNY * 2 - 1;

    for (var i in this.cameras)
    {
        var camera = this.cameras[i];

        if (mouseNX < camera.offsetX || mouseNY < camera.offsetY)
        {
            continue;
        }

        if (mouseNX > camera.offsetX + camera.sizeX || mouseNY > camera.offsetY + camera.sizeY)
        {
            continue;
        }

        var vector = new THREE.Vector3(mouseNDCX, mouseNDCY, 0.5);
        return this.projector.pickingRay(vector, camera.cam);
    }

    return null;
}

Graphics.prototype.update = function(dt)
{
    // This is basically the entire canvas size (note we use viewports below)
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.clear();

    for (var i in this.cameras)
    {
        var camera = this.cameras[i];

        if (camera.active)
        {
            renderer.setViewport(camera.pixelOffsetX, camera.pixelOffsetY, camera.pixelSizeX, camera.pixelSizeY);
            renderer.render( this.scene, camera.cam );
        }
    }
}

function onWindowResize()
{
    renderer.setSize( window.innerWidth, window.innerHeight );
}