function Game()
{
  this.nextWaveCount = 5;
  this.humanCount = 0;
  this.players = {};
  this.firstRun = true;
  this.vampireLevel = 0;
  this.towerLevel = 0;
  this.tower;
  this.numStocks = 0;
  this.stockPrice = 0;
  this.money = 1000;

  this.moneyDisplay = $("<div class='MoneyCounter'></div>").appendTo($("body"));
  this.moneyCountUI = $("<div />").appendTo(this.moneyDisplay);
  this.stockCountUI = $("<div />").appendTo(this.moneyDisplay);
}

Game.prototype.update = function(dt)
{
  this.stockPrice = JSEngine.stocks.data[JSEngine.stocks.data.length - 1];
  this.moneyCountUI.text("Blood Money: " + Math.round(this.money) + " pints ");
  this.stockCountUI.text("Blood Stocks: " + Math.round(this.numStocks));

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
      that.buyStocks();
    });
  sellStocks.bind("click", function()
    {
      that.sellStocks();
    });
}

Game.prototype.buyStocks = function()
{
  if (this.money >= this.stockPrice)
  {
    ++this.numStocks;
    this.money -= this.stockPrice;
  }
}

Game.prototype.sellStocks = function()
{
  if (this.numStocks > 0)
  {
    --this.numStocks;
    this.money += this.stockPrice;
  }
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
    createHuman(0);
  }

  // Scale up difficulty
  this.nextWaveCount *= 1.1;
}