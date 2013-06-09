function Human(parent, type)
{
  this.parent = parent;
  this.dead = false;
  this.type = type;
  this.hittingTower = false;
  this.rotateSpeed = 5 + Math.random() * 10;
  this.rotateSpeed *= Math.random() > 0.5 ? 1 : -1;
  this.timeAlive = 0;
  this.lastTargetAngle = 0;
  this.refireTime = 0;
  this.refireTimer = 0;
  this.minTargetRange = -10000;

  // Standard drone
  if (type == 0)
  {
    this.blood = 20;
    this.damage = 5;
    this.movementSpeed = 3;
    this.parent.components.cube.material.color.setHex(0xCC6600);
    this.parent.components.cube.material.emissive.setHex(0x606060);
    this.target = JSEngine.game.tower;
  }
  // Big drone
  else if (type == 1)
  {
    this.blood = 100;
    this.damage = 50.0;
    this.movementSpeed = 1.5;
    this.parent.scale.set(3, 3, 3);
    this.parent.components.cube.material.color.setHex(0x44FF44);
    this.parent.components.cube.material.emissive.setHex(0x020902);
    this.target = JSEngine.game.tower;
  }
  // Archers
  else if (type == 2)
  {
    this.refireTime = 2;
    this.projectileSpeed = 10;
    this.minTargetRange = 15;
    this.blood = 25;
    this.damage = 1.5;
    this.movementSpeed = 4;
    this.parent.scale.set(0.6, 2.2, 0.6);
    this.parent.components.cube.material.color.setHex(0x4444FF);
    this.parent.components.cube.material.emissive.setHex(0x020209);
    this.target = JSEngine.game.tower;
  }
  // Annoying little shits
  else if (type == 3)
  {
    this.bouncer = true;
    this.blood = 10;
    this.damage = 1;
    this.movementSpeed = 3 + Math.random() * 8;
    this.parent.scale.set(0.5, 0.5, 0.5);
    this.parent.components.cube.material.color.setHex(0x4F4444);
    this.parent.components.cube.material.emissive.setHex(0x090202);
    this.target = pickRandomValue(JSEngine.game.players).parent;
  }

  ++JSEngine.game.humanCount;
}

Human.prototype.killed = function(angle)
{
  createBloodSpray(this.blood, this.parent.position, angle);
  this.parent.destroy();

  if (!this.dead)
    --JSEngine.game.humanCount;
  this.dead = true;
}

Human.prototype.onCollide = function(obj)
{
  var player = obj.components.player;
  if (player && this.bouncer)
  {
    player.knockBack.set(this.parent.position.x - obj.position.x, 0, this.parent.position.z - obj.position.z);
    player.knockBack.normalize();
  }
}

Human.prototype.update = function(dt)
{
  this.timeAlive += dt;

  if(this.hittingTower)
  {
    this.parent.components.cube.mesh.rotation.y += this.rotateSpeed * dt;
    this.parent.position.y += Math.sin(this.parent.components.cube.mesh.rotation.y * 20) * 0.2;
    return;
  }

  var targetPos = this.target.position;
  var toTargetX = targetPos.x - this.parent.position.x;
  var toTargetZ = targetPos.z - this.parent.position.z;
  var targetAngle = Math.atan2(toTargetZ, toTargetX);

  if (this.refireTime > 0)
  {
    this.refireTimer += dt;

    if (this.refireTimer > this.refireTime)
    {
      this.refireTimer = 0;
      var vel = new THREE.Vector3(Math.cos(targetAngle) * this.projectileSpeed, 10, Math.sin(targetAngle) * this.projectileSpeed);
      createEnemyProjectile(this.parent.position, vel, this.damage);
    }
  }

  if (this.bouncer)
  {
    this.parent.position.y = 1 + Math.abs(Math.sin(this.timeAlive * 10)) * 3;
    targetAngle = targetAngle * 0.1 + (Math.random() - 0.5) * 0.3 + this.lastTargetAngle * 0.9;
  }

  var range = Math.sqrt(toTargetX * toTargetX + toTargetZ * toTargetZ);
  
  this.parent.rotation.y = -targetAngle;

  if (range > this.minTargetRange)
  {
    this.parent.position.x += Math.cos(targetAngle) * this.movementSpeed * dt;
    this.parent.position.z += Math.sin(targetAngle) * this.movementSpeed * dt;
  }

  this.lastTargetAngle = targetAngle;
}