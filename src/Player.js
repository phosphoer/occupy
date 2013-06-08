function Player(parent, inputProfile)
{
  this.parent = parent;
  this.normalSpeed = 5;
  this.dashSpeed = 15;
  this.dashTime = 0.2;
  this.dashTimer = 0;
  this.isDashing = false;
  this.movementSpeed = this.normalSpeed;

  if (inputProfile == 0)
  {
    this.forwardKey = JSEngine.input.W;
    this.backwardKey = JSEngine.input.S;
    this.leftKey = JSEngine.input.A;
    this.rightKey = JSEngine.input.D;
    this.boostKey = JSEngine.input.SPACE;
  }
  else
  {
    this.forwardKey = JSEngine.input.I;
    this.backwardKey = JSEngine.input.K;
    this.leftKey = JSEngine.input.J;
    this.rightKey = JSEngine.input.L;
    this.boostKey = JSEngine.input.SHIFT;
  }
}

Player.prototype.onCollide = function(obj)
{
  var human = obj.components.human;
  if (human && this.isDashing)
  {
    obj.sendEvent("killed", Math.atan2(obj.position.z - this.parent.position.z, obj.position.x - this.parent.position.x));
  }
}

Player.prototype.update = function(dt)
{
  if (this.dashTimer > 0)
    this.dashTimer -= dt;
  else
  {
    this.isDashing = false;
    this.movementSpeed = this.normalSpeed;
  }

  moveX = 0;
  moveZ = 0;

  if (JSEngine.input.isDown(this.forwardKey))
  {
    moveZ -= this.movementSpeed * dt;
  }

  if (JSEngine.input.isDown(this.backwardKey))
  {
    moveZ += this.movementSpeed * dt;
  }

  if (JSEngine.input.isDown(this.leftKey))
  {
    moveX -= this.movementSpeed * dt;
  }

  if (JSEngine.input.isDown(this.rightKey))
  {
    moveX += this.movementSpeed * dt;
  }

  this.parent.position.x += moveX;
  this.parent.position.z += moveZ;

  angle = Math.atan2(-moveZ, -moveX);

  if (JSEngine.input.isDown(this.boostKey) && this.dashTimer <= 0)
  {
    this.movementSpeed = this.dashSpeed;
    this.dashTimer = this.dashTime;
    this.isDashing = true;
  }

  if (JSEngine.input.isDown(JSEngine.input.P))
  {
    this.parent.destroy();
  }
}