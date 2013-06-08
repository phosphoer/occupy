function Velocity(parent, vel)
{
  this.parent = parent;
  this.x = vel.x;
  this.y = vel.y;
  this.z = vel.z;
}

Velocity.prototype.update = function(dt)
{
  this.parent.position.x += this.x * dt;
  this.parent.position.y += this.y * dt;
  this.parent.position.z += this.z * dt;
}