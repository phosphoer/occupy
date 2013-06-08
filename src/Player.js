function Player(parent)
{
  this.parent = parent;
  this.normalSpeed = 5;
  this.dashSpeed = 25;
  this.dashTime = 0.2;
  this.dashTimer = 0;
  this.movementSpeed = this.normalSpeed;
}

Player.prototype.update = function(dt)
{
  if (this.dashTimer > 0)
    this.dashTimer -= dt;
  else
    this.movementSpeed = this.normalSpeed;

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

  if (JSEngine.input.isDown(JSEngine.input.SPACE) && this.dashTimer <= 0)
  {
    this.movementSpeed = this.dashSpeed;
    this.dashTimer = this.dashTime;
  }
}