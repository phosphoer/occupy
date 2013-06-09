function main()
{
  var e = new Engine();

  // var player2 = createPlayer(1, 0xFF0000, 0.5);

  var tower = e.factory.createObject();
  tower.components.tower = new Tower(tower);
  tower.components.collider = new Collider(tower);
  tower.components.collider.width = tower.components.tower.sizeX;
  tower.components.collider.height = tower.components.tower.sizeZ;

  
  var player1 = createPlayer(0, 0x440000, 0.0);

  e.game.tower = tower;
  
  // center tower on ground
  tower.position.set(0, 1, -11);

  var prefix = "res/skybox";
  var suffix = ".bmp";

  var skyGeometry = new THREE.CubeGeometry(100, 100, 100);


  skyGeometry.faces[0].vertexColors[0] = new THREE.Color(0x111199);
  skyGeometry.faces[0].vertexColors[1] = new THREE.Color(0);
  skyGeometry.faces[0].vertexColors[2] = new THREE.Color(0);
  skyGeometry.faces[0].vertexColors[3] = new THREE.Color(0x111199);

  skyGeometry.faces[1].vertexColors[0] = new THREE.Color(0x111199);
  skyGeometry.faces[1].vertexColors[1] = new THREE.Color(0);
  skyGeometry.faces[1].vertexColors[2] = new THREE.Color(0);
  skyGeometry.faces[1].vertexColors[3] = new THREE.Color(0x111199);

  skyGeometry.faces[3].vertexColors[0] = new THREE.Color(0);
  skyGeometry.faces[3].vertexColors[1] = new THREE.Color(0);
  skyGeometry.faces[3].vertexColors[2] = new THREE.Color(0);
  skyGeometry.faces[3].vertexColors[3] = new THREE.Color(0);  

  skyGeometry.faces[5].vertexColors[0] = new THREE.Color(0x111199);
  skyGeometry.faces[5].vertexColors[1] = new THREE.Color(0);
  skyGeometry.faces[5].vertexColors[2] = new THREE.Color(0);
  skyGeometry.faces[5].vertexColors[3] = new THREE.Color(0x111199);   

  var material = new THREE.MeshLambertMaterial({side: THREE.BackSide, vertexColors: THREE.VertexColors});
  console.log(skyGeometry.faces);

  var skybox = new THREE.Mesh(skyGeometry, material);
  skybox.position.y = -10;
  JSEngine.graphics.scene.add(skybox);

  e.start();
}
