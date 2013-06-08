
var renderer;
var geometry, material;


var levelCubes;

function Material(config)
{
    this.color = config.color || 0xFFFFFF;
};

function createLevelChunk(xWidth, zWidth, height)
{
    var level = [];
    for (var i = 0; i < xWidth; ++i)
    {
        level.push([]);

        for(var j = 0; j < zWidth; ++j)
        {
            var material;
            if((i + j) % 2 == 0)
            {
                material = new Material({ color: 0x1100ff });
            }
            else
            {
                material = new Material({ color: 0x110088 });
            }
            level[i][j] = material;
        }
    }

    return level;
}

function Graphics()
{
    this.scene = new THREE.Scene();
    this.cameras = {};

    renderer = new THREE.WebGLRenderer({ antialias:true });
    renderer.setClearColor(0x101010, 1)
    renderer.autoClear = false;
    document.body.appendChild(renderer.domElement);

    this.UnitCube = new THREE.CubeGeometry(1, 1, 1);

    material = new THREE.MeshLambertMaterial( { color: 0x1100ff} );

    var levelWidth = 60;
    var levelDepth = 20;
    var mesh = new THREE.Mesh( this.UnitCube, material );
    mesh.position.x = -levelWidth/2;
    mesh.position.z = -levelDepth/2;
    this.scene.add( mesh );

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
            if(levelChunk[i][j] != null)
            {
                var material = new THREE.MeshLambertMaterial( { color: levelChunk[i][j].color} );
                var cube = new THREE.Mesh( this.UnitCube, material );
                cube.position = new THREE.Vector3(i, 0, j);
                mesh.add(cube);
            }
        }
    }


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