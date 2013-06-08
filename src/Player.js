function Player(parent)
{
  this.parent = parent;
  this.movementSpeed = 5;
}

Player.prototype.update = function(dt)
{
  if (JSEngine.input.isDown(JSEngine.input.W))
  {
    this.parent.position.z -= this.movementSpeed * dt;
  }

  if (JSEngine.input.isDown(JSEngine.input.S))
  {
    this.parent.position.z += this.movementSpeed * dt;
  }

  if (JSEngine.input.isDown(JSEngine.input.A))
  {
    this.parent.position.x -= this.movementSpeed * dt;
  }

  if (JSEngine.input.isDown(JSEngine.input.D))
  {
    this.parent.position.x += this.movementSpeed * dt;
  }
}