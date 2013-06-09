function Human(parent)
{
  this.parent = parent;
  this.movementSpeed = 2;
  this.dead = false;

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
  // Move towards center
  var angleToCenter = Math.atan2(-this.parent.position.z, -this.parent.position.x);
  this.parent.position.x += Math.cos(angleToCenter) * this.movementSpeed * dt;
  this.parent.position.z += Math.sin(angleToCenter) * this.movementSpeed * dt;
}