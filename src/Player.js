function Player(parent, inputProfile)
{
  this.parent = parent;
  this.normalSpeed = 5;
  this.dashSpeed = 15;
  this.dashTime = 0.2;
  this.dashTimer = 0;
  this.isDashing = false;
  this.movementSpeed = this.normalSpeed;
  this.bloodLevel = 1;
  this.bloodLevelMax = 1;
  this.rotationSmoothing = 0.2;
  JSEngine.game.players[parent.id] = this;

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

  this.light = new THREE.PointLight(0xFFFFFF, 1, 50);
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
  }

  var moveX = 0;
  var moveZ = 0;

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

  angle = Math.atan2(moveZ, -moveX);

  //this.parent.rotation.y = angle * this.rotationSmoothing + this.parent.rotation.y * (1.0 - this.rotationSmoothing);
  this.parent.rotation.y = angle;

  if (JSEngine.input.isDown(this.boostKey) && this.dashTimer <= -0.5)
  {
    this.movementSpeed = this.dashSpeed;
    this.dashTimer = this.dashTime;
    this.isDashing = true;
  }

  if (JSEngine.input.isDown(JSEngine.input.P))
  {
    this.parent.destroy();
  }

  this.light.position.copy(this.parent.position);
  this.light.position.y += 1;
}