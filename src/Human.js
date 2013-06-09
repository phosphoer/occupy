function Human(parent, type)
{
  this.parent = parent;
  this.movementSpeed = 2;
  this.dead = false;
  this.type = type;
  this.target = null;

  ++JSEngine.game.humanCount;
}

Human.prototype.killed = function(angle)
{
  createBloodSpray(20, this.parent.position, angle);
  this.parent.destroy();

  if (!this.dead)
    --JSEngine.game.humanCount;
  this.dead = true;
}

Human.prototype.update = function(dt)
{
  var targetAngle = 0;

  // Move towards center
  if (this.type == 0)
  {
    targetAngle = Math.atan2(-this.parent.position.z, -this.parent.position.x);
  }
  else if (this.type == 1)
  {
    if (!this.target)
    {
      this.target = pickRandomValue(JSEngine.game.players).parent;
      return;
    }

    var result = new THREE.Vector3();
    result.subVectors(this.parent.position, this.target.position);

    targetAngle = Math.atan2(-result.z, -result.x);
  }

  this.parent.rotation.y = -targetAngle;
  this.parent.position.x += Math.cos(targetAngle) * this.movementSpeed * dt;
  this.parent.position.z += Math.sin(targetAngle) * this.movementSpeed * dt;
}