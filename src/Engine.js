function Engine()
{
  JSEngine = this;

  // Add "systems"
  this.input = new Input();
  this.factory = new Factory();
  this.game = new Game();
  this.graphics = new Graphics();
  this.stocks = new Stocks();
  this.stocks.hide();

  this.lastTime = new Date();

  this.stats = new Stats();
  this.stats.domElement.style.position = 'absolute';
  this.stats.domElement.style.top = '0px';
  this.stats.domElement.style.zIndex = 100;

  var container = document.createElement('div');
  container.appendChild(this.stats.domElement);
  document.body.appendChild(container);
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

  // Get update called again
  requestAnimFrame(engineUpdate);

  // Update stuff
  JSEngine.factory.update(dt);
  JSEngine.game.update(dt);
  JSEngine.graphics.update(dt);

  JSEngine.stats.update();
}