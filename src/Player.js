function Player(parent, inputProfile)
{
  this.parent = parent;
  this.normalSpeed = 5;
  this.dashSpeed = 15;
  this.dashTime = 0.2;
  this.dashTimer = 0;
  this.isDashing = false;
  this.movementSpeed = this.normalSpeed;
  this.rotationSmoothing = 0.2;
  this.usesMouse = false;

  JSEngine.game.players[parent.id] = this;

  if (inputProfile == 0)
  {
    this.forwardKey = JSEngine.input.W;
    this.backwardKey = JSEngine.input.S;
    this.leftKey = JSEngine.input.A;
    this.rightKey = JSEngine.input.D;
    this.boostKey = JSEngine.input.SPACE;
    this.usesMouse = true;
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

Player.prototype.destroy = function()
{
  delete JSEngine.game.players[this.parent.id];
}

Player.prototype.update = function(dt)
{
  if (this.dashTimer > 0)
    this.dashTimer -= dt;
  else
  {
    this.isDashing = false;
    this.movementSpeed = this.normalSpeed;
    this.parent.components.cube.trailLength = 0;
  }

  moveX = 0;
  moveZ = 0;

  if (JSEngine.input.isKeyDown(this.forwardKey))
  {
    moveZ -= 1;
  }

  if (JSEngine.input.isKeyDown(this.backwardKey))
  {
    moveZ += 1;
  }

  if (JSEngine.input.isKeyDown(this.leftKey))
  {
    moveX -= 1;
  }

  if (JSEngine.input.isKeyDown(this.rightKey))
  {
    moveX += 1;
  }

  if (this.usesMouse)
  {
    if (JSEngine.input.isMouseDown(JSEngine.input.MOUSE_MIDDLE))
    {
      moveX = JSEngine.input.mouseWorldPosition.x - this.parent.position.x;
      moveZ = JSEngine.input.mouseWorldPosition.z - this.parent.position.z;
    }
  }

  var magnitude = Math.sqrt(moveX * moveX + moveZ * moveZ);

  if (magnitude != 0)
  {
    moveX /= magnitude;
    moveZ /= magnitude;
  }

  this.parent.position.x += moveX * this.movementSpeed * dt;
  this.parent.position.z += moveZ * this.movementSpeed * dt;

  if (moveX != 0 || moveZ != 0)
  {
    this.parent.rotation.y = Math.atan2(moveZ, -moveX);
  }

  if (JSEngine.input.isKeyDown(this.boostKey) && this.dashTimer <= 0)
  {
    this.movementSpeed = this.dashSpeed;
    this.dashTimer = this.dashTime;
    this.isDashing = true;
    this.parent.components.cube.trailLength = 40;
  }

  if (JSEngine.input.isKeyDown(JSEngine.input.P))
  {
    this.parent.destroy();
  }
}