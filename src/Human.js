function Human(parent)
{
  this.parent = parent;
  this.movementSpeed = 2;

  ++JSEngine.game.humanCount;
}

Human.prototype.update = function(dt)
{
}