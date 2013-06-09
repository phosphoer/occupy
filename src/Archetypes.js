function createPlayer(inputProfile, playerColor, offsetY)
{
  var newPlayer = JSEngine.factory.createObject();
  newPlayer.components.player = new Player(newPlayer, inputProfile);
  newPlayer.components.cube = new Cube(newPlayer, { emissive:0x440000, color:playerColor });
  newPlayer.components.collider = new Collider(newPlayer);
  newPlayer.position.y = 1;
  if (inputProfile == 0)
    newPlayer.position.x = -0;
  else
    newPlayer.position.x = 0;

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
  obj.components.cube = new Cube(obj, {});
  obj.components.human = new Human(obj, type);
  obj.components.collider = new Collider(obj);
  obj.components.collider.isSolid = false;
  obj.position.y = 1;

  var side = JSEngine.game.spawnSide;

  if (Math.random() < 0.1)
    side = -side;

  if (side == -1)
    obj.position.x = -30 + Math.random() * 5;
  else
    obj.position.x = 30 - Math.random() * 5;
  
  obj.position.z = Math.round(-10 + Math.random() * 20);
}

function createEnemyProjectile(pos, vel, damage)
{
  var obj = JSEngine.factory.createObject();
  obj.components.cube = new BloodCube(obj, { emissive:0x111111, color:0xFFFFFF });
  obj.components.collider = new Collider(obj);
  obj.components.collider.isSolid = false;
  obj.components.projectile = new Projectile(obj, vel);
  obj.components.projectile.damage = damage;
  obj.components.lifetime = new LifeTime(obj, 5);
  obj.components.lifetime.destroyOnEnd = true;
  obj.scale.set(0.3, 0.3, 0.3);
  obj.position.y = 1;
  obj.position.x = pos.x;
  obj.position.z = pos.z;
}

function createBloodSpray(amount, pos, angle, extraScale)
{
  var player;
  for(var i in JSEngine.game.players)
  {
    player = JSEngine.game.players[i];
  }

  for (var i = 0; i < amount; ++i)
  {
    var obj = JSEngine.factory.createObject();
    var v = {};
    var speed = 10 + Math.random() * 10;
    v.x = Math.cos(angle - 0.3 + Math.random() * 0.6) * speed;
    v.y = Math.random() * 10;
    v.z = Math.sin(angle - 0.3 + Math.random() * 0.6) * speed;
    obj.components.lifetime = new LifeTime(obj, 0.7);
    obj.components.cube = new BloodCube(obj, { color: 0xFF0000 });

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
    var scale = Math.random() * 0.3 * extraScale + 0.2;
    obj.components.cube.mesh.scale.set(scale, scale, scale);
    obj.position.x = pos.x;
    obj.position.y = pos.y || 1;
    obj.position.z = pos.z;

  }
}