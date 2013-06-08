function Human(parent)
{
  this.parent = parent;
  this.movementSpeed = 2;

  ++JSEngine.game.humanCount;
}

Human.prototype.killed = function(angle)
{
  createBloodSpray(10, this.parent.position, angle);
  this.parent.destroy();
}

Human.prototype.update = function(dt)
{
  var angleToCenter = Math.atan2(-this.parent.position.z, -this.parent.position.x);
  this.parent.position.x += Math.cos(angleToCenter) * this.movementSpeed * dt;
  this.parent.position.z += Math.sin(angleToCenter) * this.movementSpeed * dt;
}