function Player()
{
  this.movementSpeed = 5;
}

Player.prototype.update = function(dt)
{
  if (JSEngine.input.isDown(JSEngine.input.W))
    this.parent.z -= this.movementSpeed * dt;
  if (JSEngine.input.isDown(JSEngine.input.A))
    this.parent.z += this.movementSpeed * dt;
  if (JSEngine.input.isDown(JSEngine.input.S))
    this.parent.x -= this.movementSpeed * dt;
  if (JSEngine.input.isDown(JSEngine.input.D))
    this.parent.x += this.movementSpeed * dt;
}