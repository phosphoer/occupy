function Player(parent, inputProfile)
{
  this.parent = parent;
  this.normalSpeed = 10;
  this.dashSpeed = 20;
  this.dashTime = 0.3;
  this.dashTimer = 0;
  this.isDashing = false;
  this.movementSpeed = this.normalSpeed;
  this.bloodLevel = 1;
  this.bloodLevelMax = 1;
  this.rotationSmoothing = 0.2;
  this.usesMouse = false;

  this.knockBack = new THREE.Vector3();
  this.knockBackSlowdown = 0.7;

  JSEngine.game.players[parent.id] = this;

  if (inputProfile == 0)
  {
    this.forwardKey = JSEngine.input.W;
    this.backwardKey = JSEngine.input.S;
    this.leftKey = JSEngine.input.A;
    this.rightKey = JSEngine.input.D;
    this.boostKey = JSEngine.input.SPACE;
    this.jumpKey = JSEngine.input.SHIFT;
    this.usesMouse = true;
  }
  else
  {
    this.forwardKey = JSEngine.input.I;
    this.backwardKey = JSEngine.input.K;
    this.leftKey = JSEngine.input.J;
    this.rightKey = JSEngine.input.L;
    this.boostKey = JSEngine.input.DOWN_ARROW;
    this.jumpKey = JSEngine.input.UP_ARROW;
  }

  this.light = new THREE.PointLight(0xFFFFFF, 1, 100);
  JSEngine.graphics.scene.add(this.light);

  this.bloodMeterContainer = $("<div class='BloodMeterContainer' />").appendTo($("body"));
  this.bloodMeter = $("<div class='BloodMeter' />").appendTo(this.bloodMeterContainer);

}

Player.prototype.upgradedStuff = function()
{
  this.bloodLevelMax = 1 + JSEngine.game.vampireLevel;
  this.bloodLevel = this.bloodLevelMax;
}

Player.prototype.onCollide = function(obj)
{
  var human = obj.components.human;
  if (human && this.isDashing)
  {
    obj.sendEvent("killed", Math.atan2(obj.position.z - this.parent.position.z, obj.position.x - this.parent.position.x));
    this.bloodLevel += 0.1;
    if (this.bloodLevel > this.bloodLevelMax)
      this.bloodLevel = this.bloodLevelMax;
  }
}

Player.prototype.destroy = function()
{
  delete JSEngine.game.players[this.parent.id];
}

Player.prototype.update = function(dt)
{
  if (!JSEngine.game.inMenu)
    this.bloodLevel -= dt * 0.05;
  this.bloodMeterContainer.css("width", 200 + this.bloodLevelMax * 50 + "px");
  this.bloodMeter.css("width", (this.bloodLevel / this.bloodLevelMax) * 100 + "%");

  this.dashTimer -= dt;
  if (this.dashTimer <= 0 && this.isDashing)
  {
    this.isDashing = false;
    this.movementSpeed = this.normalSpeed;
    this.parent.components.cube.trailLength = 0;
  }

  var moveX = 0;
  var moveZ = 0;

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
    if (JSEngine.input.isMouseDown(JSEngine.input.MOUSE_LEFT))
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

  this.parent.position.x += this.knockBack.x;
  this.parent.position.z += this.knockBack.z;

  this.knockBack.x *= this.knockBackSlowdown;
  this.knockBack.z *= this.knockBackSlowdown;

  if (moveX != 0 || moveZ != 0)
  {
    this.parent.rotation.y = Math.atan2(moveZ, -moveX);
  }

  if (JSEngine.input.isKeyDown(this.boostKey) && this.dashTimer <= -0.5)
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

  this.light.position.copy(this.parent.position);
  this.light.position.y += 1;
}