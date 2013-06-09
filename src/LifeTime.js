function LifeTime(parent, life)
{
  this.parent = parent;
  this.life = life;
  this.destroyOnEnd = false;
}

LifeTime.prototype.update = function(dt)
{
  this.life -= dt;
  if (this.life <= 0 && this.destroyOnEnd)
  {
    this.parent.destroy();
  }
}