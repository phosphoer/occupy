function createPlayer(inputProfile, playerColor, offsetY)
{
  var newPlayer = JSEngine.factory.createObject();
  newPlayer.components.player = new Player(newPlayer, inputProfile);
  newPlayer.components.cube = new Cube(newPlayer, { emissive:0x440000, color:playerColor });
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
  chaseCam.components.camera.sizeY = 1;
  chaseCam.components.camera.offsetY = offsetY;
}

function createHuman(type)
{
  var obj = JSEngine.factory.createObject();
  obj.components.human = new Human(obj, type);
  obj.components.cube = new Cube(obj, { emissive:0x606060, color:0xCC6600 });
  obj.components.collider = new Collider(obj);
  obj.components.collider.isSolid = false;
  obj.position.y = 1;
  if (Math.random() < 0.5)
    obj.position.x = -30 + Math.random() * 5;
  else
    obj.position.x = 30 - Math.random() * 5;
  obj.position.z = Math.round(-10 + Math.random() * 20);
}

function createBloodSpray(amount, pos, angle)
{
  var player;
  for(var i in JSEngine.game.players)
  {
    player = JSEngine.game.players[i];
  }
  console.log(player);

  for (var i = 0; i < amount; ++i)
  {
    var obj = JSEngine.factory.createObject();
    var v = {};
    var speed = 10 + Math.random() * 10;
    v.x = Math.cos(angle - 0.3 + Math.random() * 0.6) * speed;
    v.y = Math.random() * 10;
    v.z = Math.sin(angle - 0.3 + Math.random() * 0.6) * speed;
    obj.components.lifetime = new LifeTime(obj, .2);
    obj.components.cube = new Cube(obj, { color: 0xFF0000 });

    var w = {};
    w.x = speed * Math.random();
    w.y = speed * Math.random();
    w.z = speed * Math.random();
    obj.components.velocity = new Velocity(obj, v, w, player.parent.position);
    obj.components.gravity = new Gravity(obj, 8);
    obj.components.collider = new Collider(obj);
    obj.components.collider.isSolid = false;
    obj.components.collider.frictionOnGround = true;
    obj.components.collider.collidesWithOthers = false;
    var scale = Math.random() * 0.3 + 0.2;
    obj.components.cube.mesh.scale.set(scale, scale, scale);
    obj.position.x = pos.x;
    obj.position.y = pos.y || 1;
    obj.position.z = pos.z;

  }
}