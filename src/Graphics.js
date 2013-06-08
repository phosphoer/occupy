
var camera, scene, renderer;
var geometry, material, mesh;


var levelCubes;

function createLevelChunk(xWidth, zWidth, height)
{
    var level = [];
    for (var i = 0; i < xWidth; ++i)
    {
        level.push([]);

        for(var j = 0; j < zWidth; ++j)
        {
            level[i][j] = 1;
        }
    }

    return level;
}

function init() {

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.lookAt(new THREE.Vector3(0, 0, 0));


    scene = new THREE.Scene();

    geometry = new THREE.CubeGeometry( 1, 1, 1 );
    material = new THREE.MeshLambertMaterial( { color: 0x1100ff} );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    var light = new THREE.AmbientLight(0x404040);
    //scene.add(light);

    light = new THREE.PointLight( 0xFFFFFF, 1, 1000 );
    light.position.set( 10, 10, 0 );
    scene.add( light );

    renderer = new THREE.WebGLRenderer({ antialias:true });
    renderer.setClearColor(0x101010, 1)
   
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

    var levelWidth = 40;
    var levelDepth = 10;
    var levelChunk = createLevelChunk(levelWidth, levelDepth, 1);
    for(var i = 0; i < levelWidth; ++i)
    {
        for(var j = 0; j < levelDepth; ++j)
        {
            if(levelChunk[i][j])
            {
                var cube = new THREE.Mesh( geometry, material );
                cube.position = new THREE.Vector3(i, 0, j);
                mesh.add(cube);
            }
        }
    }

    camera.position.z = 40;
    camera.position.y = 10;
    camera.position.x = levelWidth / 2;


    animate();

}

function animate() {

    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( animate );

    //mesh.rotation.x += 0.01;
    //mesh.rotation.y += 0.02;

    renderer.render( scene, camera );

}

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}   