
var renderer;
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
        for(var j = 0; j < zWidth; ++j)
        {
            var material;
            if(Math.random() < 0.5)
            {
                material = new Material({ color: 0x22aa22 });
            }
            else
            {
                material = new Material({ color: 0x559933 });
            }
            level.push(material);
        }
    }

    return level;
}

/*
function buildGeometryFromChunk(chunk, sizeX, sizeY, sizeZ)
{
    var geometry = new THREE.BufferGeometry;

    for(var i = 0; i < sizeX; ++i)
    {
        for (var j = 0; j < sizeY; ++j)
        {
            for (var k = 0; k < sizeZ; ++k)
            {
                var index = i * sizeY * sizeZ + j * sizeZ + k;
                var block = chunk[index];
                if(block != null)
                {
                    var n = geometry.vertices.length;
                    geometry.vertices.push(new THREE.Vector3(i, j, k));
                    geometry.vertices.push(new THREE.Vector3(i + 1, j, k));
                    geometry.vertices.push(new THREE.Vector3(i + 1, j, k + 1));
                    geometry.vertices.push(new THREE.Vector3(i, j, k + 1));
                    geometry.vertices.push(new THREE.Vector3(i, j + 1, k));
                    geometry.vertices.push(new THREE.Vector3(i + 1, j + 1, k));
                    geometry.vertices.push(new THREE.Vector3(i + 1, j + 1, k + 1));
                    geometry.vertices.push(new THREE.Vector3(i, j + 1, k + 1));

                    var normal = new THREE.Vector3(0, -1, 0);
                    var color = new THREE.Vector3(0xFF0000);
                    geometry.faces.push(new THREE.Face4(n + 0, n + 1, n + 2, n + 3),
                                        normal, color);
                }
            }
        }
    }

    geometry.verticesNeedsUpdate = true;
    geometry.elementsNeedsUpdate = true;
    return geometry;
}
*/

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
                var material = new THREE.MeshLambertMaterial( { color: block.color} );
                var cube = new THREE.Mesh( this.UnitCube, material );
                cube.position = new THREE.Vector3(i, 0, j);
                base.add(cube);
            }
        }
    }

    //var geo = buildGeometryFromChunk(levelChunk);
    //base.add(new THREE.Mesh(geo, new THREE.MeshLambertMaterial({color:0xFFFFFF})));
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