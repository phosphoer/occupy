function main()
{
  var e = new Engine();

  player1 = createPlayer(0, 0x440000, 0.0);
  // var player2 = createPlayer(1, 0xFF0000, 0.5);

  var tower = e.factory.createObject();
  tower.components.tower = new Tower(tower);
  tower.components.collider = new Collider(tower);
  tower.components.collider.width = tower.components.tower.sizeX;
  tower.components.collider.height = tower.components.tower.sizeZ;

  // center tower on ground
  tower.position.set(0, 1, 0);

  var prefix = "res/skybox";
  var suffix = ".jpg";

  var materials = [];
  for(var i = 0; i < 6; ++i)
  {
   materials.push(new THREE.MeshBasicMaterial({map: THREE.ImageUtils.loadTexture(prefix + i + suffix), 
                                                side: THREE.BackSide}));
  }
  var skyGeometry = new THREE.CubeGeometry(100, 100, 100);

  var material = new THREE.MeshFaceMaterial(materials);

  var skybox = new THREE.Mesh(skyGeometry, material);
  JSEngine.graphics.scene.add(skybox);

  e.start();
}
