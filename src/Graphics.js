
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
                material = 0x22aa22;
            }
            else
            {
                material = 0x559933;
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

    this.UnitCube = new THREE.CubeGeometry(1, 1, 1);

    renderer = new THREE.WebGLRenderer({ antialias:true });
    renderer.setClearColor(0x101010, 1)
    renderer.autoClear = false;
    document.body.appendChild(renderer.domElement);

    var levelWidth = 60;
    var levelDepth = 20;
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