
var camera,  renderer;
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

function Graphics() {

    var levelWidth = 60;
    var levelDepth = 20;

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.lookAt(new THREE.Vector3(0, 0, 0));


    this.scene = new THREE.Scene();

    geometry = new THREE.CubeGeometry( 1, 1, 1 );
    material = new THREE.MeshLambertMaterial( { color: 0x1100ff} );

    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = -levelWidth/2;
    mesh.position.z = -levelDepth/2;
    this.scene.add( mesh );

    var light = new THREE.AmbientLight(0x404040);
    //this.scene.add(light);

    light = new THREE.PointLight( 0xFFFFFF, 1, 60 );
    light.position.set( 0, 40, levelDepth / 2);
    this.scene.add( light );

    renderer = new THREE.WebGLRenderer({ antialias:true });
    renderer.setClearColor(0x101010, 1)
   
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

    var levelChunk = createLevelChunk(levelWidth, levelDepth, 1);
    for(var i = 0; i < levelWidth; ++i)
    {
        for(var j = 0; j < levelDepth; ++j)
        {
            if(levelChunk[i][j] != null)
            {
                var material = new THREE.MeshLambertMaterial( { color: levelChunk[i][j].color} );
                var cube = new THREE.Mesh( geometry, material );
                cube.position = new THREE.Vector3(i, 0, j);
                mesh.add(cube);
            }
        }
    }

    camera.position.z = 40;
    camera.position.y = 20;
    //camera.position.x = levelWidth / 2;


}

Graphics.prototype.update = function(dt)
{

    // note: three.js includes requestAnimationFrame shim
    //requestAnimationFrame( animate );

    //mesh.rotation.x += 0.01;
    //mesh.rotation.y += 0.02;

    renderer.render( this.scene, camera );

}

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}   