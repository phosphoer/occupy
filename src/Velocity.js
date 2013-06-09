function Velocity(parent, vel, omega)
{
  this.parent = parent;
  this.x = vel.x;
  this.y = vel.y;
  this.z = vel.z;

  this.omega = omega;
}

Velocity.prototype.update = function(dt)
{
  this.parent.position.x += this.x * dt;
  this.parent.position.y += this.y * dt;
  this.parent.position.z += this.z * dt;

  this.parent.rotation.x += this.omega.x * dt;
  this.parent.rotation.y += this.omega.y * dt;
  this.parent.rotation.z += this.omega.z * dt;
}