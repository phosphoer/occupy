function Game()
{
  this.nextWaveCount = 5;
  this.humanCount = 0;
  this.players = {};
  this.firstRun = true;
  this.vampireLevel = 0;
  this.towerLevel = 0;
}

Game.prototype.update = function(dt)
{
  // Look for end of wave
  if (this.humanCount === 0 && !this.inMenu)
  {
    if (!this.firstRun)
      this.waveEnd();
    else
      this.nextWave();
  }

  this.firstRun = false;
}

Game.prototype.waveEnd = function()
{
  this.inMenu = true;
  JSEngine.stocks.show();

  var ui = $("<div class='Menu' />").appendTo($("body"));
  ui.append("<div class='MenuTitle'>Upgrade your shit!</div>");

  var upgradeVamp = $("<div class='Button'>Upgrade your vampire</div>").appendTo(ui);
  var upgradeTower = $("<div class='Button'>Upgrade your tower</div>").appendTo(ui);
  var buyStocks = $("<div class='Button'>Buy stocks</div>").appendTo(ui);
  var sellStocks = $("<div class='Button'>Sell stocks</div>").appendTo(ui);

  var that = this;
  upgradeVamp.bind("click", function()
    {
      that.inMenu = false;
      ui.remove();
      JSEngine.stocks.hide();
      that.nextWave();
      that.upgradeVampire();
    });
  upgradeTower.bind("click", function()
    {
      that.inMenu = false;
      ui.remove();
      JSEngine.stocks.hide();
      that.nextWave();
      that.upgradeTower();
    });
  buyStocks.bind("click", function()
    {
    });
  sellStocks.bind("click", function()
    {
    });
}

Game.prototype.upgradeVampire = function()
{
  ++this.vampireLevel;
  JSEngine.factory.sendEventToAll("upgradedStuff");
}

Game.prototype.upgradeTower = function()
{
  ++this.towerLevel;
  JSEngine.factory.sendEventToAll("upgradedStuff");
}

Game.prototype.nextWave = function()
{
  // Spawn humans
  for (var i = 0; i < this.nextWaveCount; ++i)
  {
    createHuman(1);
  }

  // Scale up difficulty
  this.nextWaveCount *= 1.1;
}