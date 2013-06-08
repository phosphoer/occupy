// Input system
function Input()
{
  // Object thats going to be used as a dictionary
  this.pressedKeys = {};

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

Input.prototype.isDown = function(keyCode)
{
  return this.pressedKeys[keyCode];
}

