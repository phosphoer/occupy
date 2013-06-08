
var camera, scene, renderer;
var geometry, material, mesh;

function init() {

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 10;

    scene = new THREE.Scene();

    geometry = new THREE.CubeGeometry( 1, 1, 1 );
    material = new THREE.MeshLambertMaterial( { color: 0x1100ff} );

    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    var light = new THREE.AmbientLight(0x404040);
    scene.add(light);

    light = new THREE.PointLight( 0xFFFFFF, 1, 1000 );
    light.position.set( 10, 10, 0 );
    scene.add( light );

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x101010, 1)
   
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

    animate();

}

function animate() {

    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( animate );

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    renderer.render( scene, camera );

}
