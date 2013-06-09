function Human(parent, type)
{
  this.parent = parent;
  this.dead = false;
  this.type = type;
  this.hittingTower = false;
  this.rotateSpeed = 5 + Math.random() * 10;
  this.rotateSpeed *= Math.random() > 0.5 ? 1 : -1;
  this.timeAlive = 0;
  this.lastHitTime = -10000;
  this.lastTargetAngle = 0;
  this.refireTime = 0;
  this.refireTimer = 0;
  this.minTargetRange = -10000;
  this.wormTime = 0;
  this.wormTimer = 0;
  this.wormDirectionIndex = 0;
  this.bloodScale = 1;
  this.maxHits = 1;
  this.blinkSpeed = 15;
  this.shootSound = new Audio("res/shoot.wav");

  // Standard drone
  if (type == 0)
  {
    this.damage = 5;
    this.movementSpeed = 3;
    this.parent.components.cube.material.color.setHex(0xCC6600);
    this.parent.components.cube.material.emissive.setHex(0x606060);
    this.target = JSEngine.game.tower;
  }
  // Big drone
  else if (type == 1)
  {
    this.maxHits = 20;
    this.bloodScale = 3;
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
    this.damage = 1.5;
    this.movementSpeed = 4;
    this.parent.scale.set(0.6, 2.2, 0.6);
    this.parent.components.cube.material.color.setHex(0x4444FF);
    this.parent.components.cube.material.emissive.setHex(0x020209);
    this.target = JSEngine.game.tower;
  }
  // Advanced archers
  else if (type == 3)
  {
    this.wormTime = 1;
    this.refireTime = 0.2;
    this.projectileSpeed = 20;
    this.damage = 0.5;
    this.movementSpeed = 10 + Math.random() * 2;
    this.parent.scale.set(0.6, 2.2, 0.6);
    this.parent.components.cube.material.color.setHex(0x82C9FA);
    this.parent.components.cube.material.emissive.setHex(0x0C030F);
    this.target = JSEngine.game.tower;
  }
  // Annoying little shits
  else if (type == 4)
  {
    this.bouncer = true;
    this.damage = 1;
    this.bloodScale = 0.5;
    this.movementSpeed = 3 + Math.random() * 8;
    this.parent.scale.set(0.5, 0.5, 0.5);
    this.parent.components.cube.material.color.setHex(0x4F4444);
    this.parent.components.cube.material.emissive.setHex(0x090202);
    this.target = pickRandomValue(JSEngine.game.players).parent;
  }

  this.originalColor = this.parent.components.cube.material.color.getHex();
}

Human.prototype.killed = function(angle)
{
  --this.maxHits;
  this.lastHitTime = this.timeAlive;

  if (this.maxHits <= 0)
  {
    createBloodSpray(20, this.parent.position, angle, this.bloodScale);
    this.parent.destroy();

    if (!this.dead)
      --JSEngine.game.humanCount;
    this.dead = true;
  }
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

  var materialColor = this.parent.components.cube.material.color;

  if (this.timeAlive - this.lastHitTime < 0.5)
  {
    if (Math.floor(this.timeAlive * this.blinkSpeed) % 2 == 0)
    {
      materialColor.setHex(0xFF0000);
    }
    else
    {
      materialColor.setHex(this.originalColor);
    }
  }
  else
  {
    materialColor.setHex(this.originalColor);
  }

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
      this.shootSound.play();
    }
  }

  if (this.bouncer)
  {
    this.parent.position.y = 1 + Math.abs(Math.sin(this.timeAlive * 10)) * 3;
    targetAngle = targetAngle * 0.1 + (Math.random() - 0.5) * 0.3 + this.lastTargetAngle * 0.9;
  }

  var range = Math.sqrt(toTargetX * toTargetX + toTargetZ * toTargetZ);

  this.parent.rotation.y = -targetAngle;


  if (this.wormTime > 0)
  {
    this.wormTimer += dt;

    if (this.wormTimer > this.wormTime)
    {
      this.wormTimer = 0;
      this.wormDirectionIndex = Math.floor(Math.random() * 4);
    }

    var dirIndex = this.wormDirectionIndex;

    if (dirIndex == 0)
    {
      toTargetX = 0;
      toTargetZ = 1;
    }
    else if (dirIndex == 1)
    {
      toTargetX = 0;
      toTargetZ = -1;
    }
    else if (dirIndex == 2)
    {
      toTargetX = 1;
      toTargetZ = 0;
    }
    else if (dirIndex == 3)
    {
      toTargetX = -1;
      toTargetZ = 0;
    }

    targetAngle = Math.atan2(toTargetZ, toTargetX);
  }

  if (range > this.minTargetRange)
  {
    this.parent.position.x += Math.cos(targetAngle) * this.movementSpeed * dt;
    this.parent.position.z += Math.sin(targetAngle) * this.movementSpeed * dt;
  }

  this.lastTargetAngle = targetAngle;
}