// Input system
function Input()
{
  // Object thats going to be used as a dictionary
  this.pressedKeys = {};
  this.pressedMouseButtons = {};

  this.mouseX = 0;
  this.mouseY = 0;

  this.mouseWorldPosition = new THREE.Vector3();

  var self = this;

  // Register for events
  var that = this;
  window.addEventListener('keydown', function(event)
  {
    that.pressedKeys[event.keyCode] = true;
  }, false);

  window.addEventListener('keyup', function(event)
  {
    delete that.pressedKeys[event.keyCode];
  }, false);

  window.addEventListener('mousemove', function(event)
  {
    self.mouseX = event.x;
    self.mouseY = event.y;

    self.update();
  }, false);

  window.addEventListener('mousedown', function(event)
  {
    self.pressedMouseButtons[event.button] = true;
  }, false);

  window.addEventListener('mouseup', function(event)
  {
    delete self.pressedMouseButtons[event.button];
  }, false);


  this.MOUSE_LEFT = 0;
  this.MOUSE_MIDDLE = 1;
  this.MOUSE_RIGHT = 2;

  // List of all the keys we may need
  this.LEFT_ARROW = 37;
  this.UP_ARROW = 38;
  this.RIGHT_ARROW = 39;
  this.DOWN_ARROW = 40;
  this.SHIFT = 16;
  this.BACKSPACE = 8;
  this.ESCAPE = 27;
  this.SPACE = 32;
  this.CONTROL = 17;
  this.ALT = 18;
  this.SUPER = 91;
  this.A = 65;
  this.B = 66;
  this.C = 67;
  this.D = 68;
  this.E = 69;
  this.F = 70;
  this.G = 71;
  this.H = 72;
  this.I = 73;
  this.J = 74;
  this.K = 75;
  this.L = 76;
  this.M = 77;
  this.N = 78;
  this.O = 79;
  this.P = 80;
  this.Q = 81;
  this.R = 82;
  this.S = 83;
  this.T = 84;
  this.U = 85;
  this.V = 86;
  this.W = 87;
  this.X = 88;
  this.Y = 89;
  this.Z = 90;
  this.NUM1 = 49;
  this.NUM2 = 50;
  this.NUM3 = 51;
  this.NUM4 = 52;
  this.NUM5 = 53;
  this.NUM6 = 54;
  this.NUM7 = 55;
  this.NUM8 = 56;
  this.NUM9 = 57;
  this.NUM0 = 48;
}

Input.prototype.update = function()
{
    var rayCaster = JSEngine.graphics.rayCast(this.mouseX, this.mouseY);

    if (!rayCaster)
    {
      return;
    }

    var groundPlane = new THREE.Plane();
    groundPlane.normal = new THREE.Vector3(0, 1, 0);
    groundPlane.constant = 1;

    this.mouseWorldPosition = rayCaster.ray.intersectPlane(groundPlane);
}

Input.prototype.isKeyDown = function(keyCode)
{
  return this.pressedKeys[keyCode];
}

Input.prototype.isMouseDown = function(button)
{
  return this.pressedMouseButtons[button];
}

