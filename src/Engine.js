function Engine()
{
  JSEngine = this;

  this.lastTime = new Date();
}

Engine.prototype.start = function()
{
  engineUpdate();
}

function engineUpdate()
{
  // Time tracking
  var newTime = new Date();
  var dt = (newTime - JSEngine.lastTime) / 1000.0;
  if (dt > 0.1) dt = 0.1;
  JSEngine.lastTime = newTime;

  requestAnimFrame(engineUpdate);
}