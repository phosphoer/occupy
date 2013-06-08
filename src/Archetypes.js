function createPlayer(inputProfile, playerColor, offsetY)
{
  var newPlayer = JSEngine.factory.createObject();
  newPlayer.components.player = new Player(newPlayer, inputProfile);
  newPlayer.components.cube = new Cube(newPlayer, { color:playerColor });
  newPlayer.components.collider = new Collider(newPlayer);
  newPlayer.position.y = 1;
  if (inputProfile == 0)
    newPlayer.position.x = -10;
  else
    newPlayer.position.x = 10;

  chaseCam = JSEngine.factory.createObject();
  chaseCam.position.set(0, 20, 40);
  chaseCam.components.camera = new Camera(chaseCam);
  chaseCam.components.camera.target = newPlayer;
  chaseCam.components.camera.sizeY = 0.5;
  chaseCam.components.camera.offsetY = offsetY;
}

function createHuman()
{
  var obj = JSEngine.factory.createObject();
  obj.components.human = new Human(obj);
  obj.components.cube = new Cube(obj, { color:0x00FF00 });
  obj.components.collider = new Collider(obj);
  obj.components.collider.isSolid = false;
  obj.position.y = 1;
  if (Math.random() < 0.5)
    obj.position.x = -30 + Math.random() * 5;
  else
    obj.position.x = 30 - Math.random() * 5;
  obj.position.z = Math.round(-10 + Math.random() * 20);
}