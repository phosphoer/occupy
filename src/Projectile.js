function Projectile(parent, vel)
{
  this.parent = parent;
  this.vel = vel;
  this.damage = 30;
  this.gravity = -10;
}

Projectile.prototype.onCollide = function(obj)
{
  var tower = obj.components.tower;
  if (tower)
  {
    tower.applyDamage(this.damage);
    this.parent.destroy();
  }
}

Projectile.prototype.update = function(dt)
{
  this.vel.y += this.gravity * dt;

  this.parent.position.x += this.vel.x * dt;
  this.parent.position.y += this.vel.y * dt;
  this.parent.position.z += this.vel.z * dt;

  if (this.parent.position.y < 1)
  {
    this.parent.position.y = 1;
  }
}
