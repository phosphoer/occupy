function Game()
{
  this.nextWaveCount = 3;
  this.humanCount = 0;
  this.players = {};
  this.firstRun = true;
  this.numStocks = 0;
  this.stockPrice = 0;
  this.money = 1000;
  this.menuTime = 12;
  this.menuTimer = 0;
  this.hasAccepted = false;

  this.increaseSpeedPrice = 2500;
  this.increaseSizePrice = 2500;
  this.increaseDashPrice = 2500;

  this.moneyDisplay = $("<div class='MoneyCounter'></div>").appendTo($("body"));
  this.moneyCountUI = $("<div />").appendTo(this.moneyDisplay);
  this.stockCountUI = $("<div />").appendTo(this.moneyDisplay);
}

Game.prototype.update = function(dt)
{
  this.menuTimer += dt;
  this.stockPrice = JSEngine.stocks.data[JSEngine.stocks.data.length - 1];
  this.moneyCountUI.text("Blood Money: " + Math.round(this.money) + " pints ");
  this.stockCountUI.text("Blood Stocks: " + Math.round(this.numStocks));

  if(this.inMenu)
  {
    $('#waveTimer').text((this.menuTime - this.menuTimer).toFixed(2));
  }

  // Look for end of wave
  if (this.humanCount === 0 && !this.inMenu)
  {
    if (!this.firstRun)
      this.waveEnd();
    else
      this.nextWave();
  }

  if (this.menuTimer >= this.menuTime && this.inMenu)
  {
    this.inMenu = false;
    this.menuUI.remove();
    this.stockMenu.remove();
    this.waveCompleteMenu.remove();
    JSEngine.stocks.hide();
    this.nextWave();
  }

  this.firstRun = false;
}

Game.prototype.waveEnd = function()
{
  this.inMenu = true;
  this.menuTimer = 0;
  JSEngine.stocks.show();

  this.menuUI = $("<div class='Menu' />").appendTo($("body"));
  this.menuUI.append("<div class='MenuTitle'>Upgrades</div>");

  this.stockMenu = $("<div class='StockMenu' />").appendTo($("body"));
  this.stockMenu.append("<div class='MenuTitle'>Stock Market</div>");

  this.waveCompleteMenu = $("<div class='WaveMenu' />").appendTo($("body"));
  this.waveCompleteMenu.append("<div class='MenuTitle'>Wave 1 Complete</div>");

  var next = $("<div class='WaveTimer'>Next Wave <span id='waveTimer'></span></div>").appendTo(this.waveCompleteMenu);

  var buy = $("<div class='ButtonIcon'></div>").appendTo(this.stockMenu).css("width", "120px");
  buy.append("<div>Buy</div>");
  buy.append("<img width='100px' height='100px' src='res/icons/buy.png' />");

  var sell = $("<div class='ButtonIcon'></div>").appendTo(this.stockMenu).css("width", "120px");
  sell.append("<div>Sell</div>");
  sell.append("<img width='100px' height='100px' src='res/icons/sell.png' />");

  var upgradeSpeed = $("<div class='ButtonIcon'></div>").appendTo(this.menuUI).css("width", "120px");
  upgradeSpeed.append("<div>Speed</div>");
  upgradeSpeed.append("<img width='100px' height='100px' src='res/icons/speed.png' />");
  upgradeSpeed.append("<div>" + this.increaseSpeedPrice + " pints</div>");

  var upgradeSize = $("<div class='ButtonIcon'></div>").appendTo(this.menuUI).css("width", "120px");
  upgradeSize.append("<div>Size</div>");
  upgradeSize.append("<img width='100px' height='100px' src='res/icons/size.png' />");
  upgradeSize.append("<div>" + this.increaseSizePrice + " pints</div>");

  var upgradeDash = $("<div class='ButtonIcon'></div>").appendTo(this.menuUI).css("width", "120px");
  upgradeDash.append("<div>Dash</div>");
  upgradeDash.append("<img width='100px' height='100px' src='res/icons/dash.png' />");
  upgradeDash.append("<div>" + this.increaseDashPrice + " pints</div>");


  var that = this;
  function closeMenu()
  {
    that.inMenu = false;
    that.menuUI.remove();
    that.stockMenu.remove();
    that.waveCompleteMenu.remove();
    that.nextWave();
    JSEngine.stocks.hide();
  }

  upgradeSpeed.bind("click", function()
    {
      if (that.money >= that.increaseSpeedPrice)
      {
        that.money -= that.increaseSpeedPrice;
        JSEngine.factory.sendEventToAll("upgradeSpeed");
        that.increaseSpeedPrice = Math.round(that.increaseSpeedPrice * 1.5);
        closeMenu();
      }
    });
  upgradeSize.bind("click", function()
    {
      if (that.money >= that.increaseSizePrice)
      {
        that.money -= that.increaseSizePrice;
        that.increaseSizePrice = Math.round(that.increaseSizePrice * 1.5);
        JSEngine.factory.sendEventToAll("upgradeSize");
        closeMenu();
      }
    });
  upgradeDash.bind("click", function()
    {
      if (that.money >= that.increaseDashPrice)
      {
        that.money -= that.increaseDashPrice;
        JSEngine.factory.sendEventToAll("upgradeDash");
        that.increaseDashPrice = Math.round(that.increaseDashPrice * 1.5);
        closeMenu();
      }
    });

  next.bind('click', function () 
  {
    closeMenu();
  });

  buy.bind("click", function()
    {
      that.buyStocks();
    });
  sell.bind("click", function()
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

Game.prototype.nextWave = function()
{
  // Spawn humans
  for (var i = 0; i < this.nextWaveCount; ++i)
  {
    createHuman(2);
  }

  // Scale up difficulty
  this.nextWaveCount *= 1.1;
}