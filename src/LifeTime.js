function LifeTime(parent, life)
{
  this.parent = parent;
  this.life = life;
}

LifeTime.prototype.update = function(dt)
{
  this.life -= dt;
  if (this.life <= 0)
  {
    this.parent.destroy();
  }
}