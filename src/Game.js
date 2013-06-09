function Game()
{
  this.humanCount = 0;
  this.bloodCount = 0;
  this.tooMuchBlood = false;
  this.players = {};
  this.firstRun = true;
  this.numStocks = 0;
  this.stockPrice = 0;
  this.money = 1000;
  this.menuTime = 12;
  this.menuTimer = 0;
  this.hasAccepted = false;
  this.wave = 0;
  this.upgradeSound = new Audio("res/powerup.wav");
  this.buySound = new Audio("res/buy.wav");
  this.sellSound = new Audio("res/sell.wav");
  this.buySound.volume = 0.2;
  this.sellSound.volume = 0.2;

  this.waveEnemyTypes = [];

  this.difficulty = 5;

  this.spawnSide = -1; // -1 Left, 1 Right
  this.spawnInterval = 1 - (this.difficulty * 0.1);
  this.spawnTimer = 0;
  this.spawnsPerCheck = 3;
  this.spawnCap = 10 + this.difficulty * 0.1;
  this.nextWaveCount = 2.5 + this.difficulty * 0.1;

  this.increaseSpeedPrice = 500;
  this.increaseSizePrice = 1000;
  this.increaseDashPrice = 600;

  $("<div id='topHudContainer' />").appendTo($("body"));
  this.moneyDisplay = $("<div class='MoneyCounter'></div>").appendTo($("#topHudContainer"));
  $("<img width='75px' height='75px' src='res/icons/money.png' />").appendTo(this.moneyDisplay);
  $("<div id='moneyCount'></div>").appendTo(this.moneyDisplay);
  this.stockDisplay = $("<div class='StockCounter'></div>").appendTo($("#topHudContainer"));
  $("<img width='75px' height='75px' src='res/icons/stocks.png' />").appendTo(this.stockDisplay);
  $("<div id='stockCount'></div>").appendTo(this.stockDisplay);


  this.mainMenuContainer = $("<div class='MainMenuContainer'></div>").appendTo($("body"));

  $("<div class='MainMenuTitle'>#Occupy Vampire Wallstreet</div>").appendTo(this.mainMenuContainer);
  var mainMenuBody = $("<div class='MainMenuBody'></div>").appendTo(this.mainMenuContainer);
  $("<div class='Agreement'>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.</div>").appendTo(mainMenuBody);
  var startGame = $("<div class='Button'>I Accept</div>").appendTo(mainMenuBody);
  var that = this;

  startGame.bind('click', function ()
  {
    that.hasAccepted = true;
    JSEngine.start();
    that.mainMenuContainer.remove();
  });

}

Game.prototype.update = function(dt)
{
  if (!this.hasAccepted)
    JSEngine.stop();

  this.menuTimer += dt;
  this.stockPrice = JSEngine.stocks.data[JSEngine.stocks.data.length - 1];
  $("#moneyCount").text(Math.round(this.money));
  $("#stockCount").text(Math.round(this.numStocks));

  if(this.inMenu)
  {
    $('#waveTimer').text(Math.round(this.menuTime - this.menuTimer));

    if (this.money < this.increaseSpeedPrice && $("#buySpeed").hasClass("ButtonIcon"))
    {
      $("#buySpeed").removeClass("ButtonIcon");
      $("#buySpeed").addClass("ButtonIconDisabled");
    }
    else if (this.money >= this.increaseSpeedPrice)
    {
      $("#buySpeed").addClass("ButtonIcon");
      $("#buySpeed").removeClass("ButtonIconDisabled");
    }

    if (this.money < this.increaseSizePrice && $("#buySize").hasClass("ButtonIcon"))
    {
      $("#buySize").removeClass("ButtonIcon");
      $("#buySize").addClass("ButtonIconDisabled");
    }
    else if (this.money >= this.increaseSizePrice )
    {
      $("#buySize").addClass("ButtonIcon");
      $("#buySize").removeClass("ButtonIconDisabled");
    }

    if (this.money < this.increaseDashPrice && $("#buyDash").hasClass("ButtonIcon"))
    {
      $("#buyDash").removeClass("ButtonIcon");
      $("#buyDash").addClass("ButtonIconDisabled");
    }
    else if (this.money >= this.increaseDashPrice )
    {
      $("#buyDash").addClass("ButtonIcon");
      $("#buyDash").removeClass("ButtonIconDisabled");
    }
  }

  // Look for end of wave
  if (this.humanCount === 0 && !this.inMenu)
  {
    if (!this.firstRun)
      this.waveEnd();
    else
      this.nextWave();
  }

  if (this.inMenu)
  {
    this.tower.components.tower.health = this.tower.components.tower.health * 0.95 + this.tower.components.tower.maxHealth * 0.05;
  }

  if (this.menuTimer >= this.menuTime && this.inMenu)
  {
    this.inMenu = false;
    this.menuUIContainer.remove();
    JSEngine.stocks.hide();
    this.nextWave();
  }

  this.firstRun = false;

  this.updateSpawns(dt);
}

Game.prototype.restart = function()
{
  window.location = window.location;
}

Game.prototype.lose = function()
{
  var fade = $("<div />").appendTo($("body"));
  fade.css("position", "absolute");
  fade.css("display", "block");
  fade.css("left", "0px");
  fade.css("top", "0px");
  fade.css("width", "100%");
  fade.css("height", "100%");
  fade.css("background-color", "#000");
  fade.css("opacity", "0");

  fade.animate(
  {
    opacity: 1
  }, 2000, function()
  {
    fade.remove();
    JSEngine.game.restart();
  });
}

Game.prototype.waveEnd = function()
{
  this.inMenu = true;
  this.menuTimer = 0;
  JSEngine.stocks.show();


  this.menuUIContainer = $("<div class='MenuContainer' />").appendTo($("body"));

  this.menuUI = $("<div class='Menu' />").appendTo(this.menuUIContainer);
  this.menuUI.append("<div class='MenuTitle'>Upgrades</div>");

  this.stockMenu = $("<div class='StockMenu' />").appendTo(this.menuUIContainer);
  this.stockMenu.append("<div class='MenuTitle'>Stock Market</div>");

  this.waveCompleteMenu = $("<div class='WaveMenu' />").appendTo(this.menuUIContainer);
  this.waveCompleteMenu.append("<div class='MenuTitle'>Wave " + JSEngine.game.wave + " Complete</div>");

  var next = $("<div class='WaveTimer'>Next Wave <span id='waveTimer'></span></div>").appendTo(this.waveCompleteMenu);

  var buy = $("<div class='ButtonIcon'></div>").appendTo(this.stockMenu).css("width", "120px");
  buy.append("<div>Buy</div>");
  buy.append("<img width='100px' height='100px' src='res/icons/buy.png' />");

  var sell = $("<div class='ButtonIcon'></div>").appendTo(this.stockMenu).css("width", "120px");
  sell.append("<div>Sell</div>");
  sell.append("<img width='100px' height='100px' src='res/icons/sell.png' />");

  var upgradeSpeed = $("<div id='buySpeed' class='ButtonIcon'></div>").appendTo(this.menuUI).css("width", "120px");
  upgradeSpeed.append("<div>Speed</div>");
  upgradeSpeed.append("<img width='100px' height='100px' src='res/icons/speed.png' />");
  upgradeSpeed.append("<div id='buySpeedPrice'>" + this.increaseSpeedPrice + " pints</div>");

  var upgradeSize = $("<div id='buySize' class='ButtonIcon'></div>").appendTo(this.menuUI).css("width", "120px");
  upgradeSize.append("<div>Size</div>");
  upgradeSize.append("<img width='100px' height='100px' src='res/icons/size.png' />");
  upgradeSize.append("<div id='buySizePrice'>" + this.increaseSizePrice + " pints</div>");

  var upgradeDash = $("<div id='buyDash' class='ButtonIcon'></div>").appendTo(this.menuUI).css("width", "120px");
  upgradeDash.append("<div>Dash</div>");
  upgradeDash.append("<img width='100px' height='100px' src='res/icons/dash.png' />");
  upgradeDash.append("<div id='buyDashPrice'>" + this.increaseDashPrice + " pints</div>");

  var that = this;
  function closeMenu()
  {
    that.inMenu = false;
    that.menuUIContainer.remove();
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
        $("#buySpeedPrice").text(that.increaseSpeedPrice + " pints");
        that.upgradeSound.play();
      }
    });
  upgradeSize.bind("click", function()
    {
      if (that.money >= that.increaseSizePrice)
      {
        that.money -= that.increaseSizePrice;
        that.increaseSizePrice = Math.round(that.increaseSizePrice * 1.5);
        JSEngine.factory.sendEventToAll("upgradeSize");
        $("#buySizePrice").text(that.increaseSizePrice + " pints");
        that.upgradeSound.play();
      }
    });
  upgradeDash.bind("click", function()
    {
      if (that.money >= that.increaseDashPrice)
      {
        that.money -= that.increaseDashPrice;
        JSEngine.factory.sendEventToAll("upgradeDash");
        that.increaseDashPrice = Math.round(that.increaseDashPrice * 1.5);
        $("#buyDashPrice").text(that.increaseDashPrice + " pints");
        that.upgradeSound.play();
      }
    });

  next.bind('click', function ()
  {
    closeMenu();
  });

  buy.bind("click", function()
    {
      that.buyStocks();
      that.buySound.play();
    });
  sell.bind("click", function()
    {
      that.sellStocks();
      that.sellSound.play();
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

Game.prototype.updateSpawns = function(dt)
{
  this.spawnTimer += dt;

  if (this.spawnTimer >= this.spawnInterval)
  {
    this.spawnTimer = 0;

    // Loop for the number of spawns per check, and only while we have enemies to spawn
    for(var j = 0; j < this.spawnsPerCheck && this.waveEnemyTypes.length > 0; ++j)
    {
      var index = Math.floor(Math.random() * this.waveEnemyTypes.length);
      var type = this.waveEnemyTypes[index];

      // Swap with the last
      this.waveEnemyTypes[index] = this.waveEnemyTypes[this.waveEnemyTypes.length - 1];
      this.waveEnemyTypes.pop();

      // Create that enemy type
      createHuman(type);
    }
  }
}

Game.prototype.nextWave = function()
{
  ++this.wave;

  this.tooMuchBlood = false;

  this.tower.components.tower.health = this.tower.components.tower.maxHealth;

  JSEngine.game.humanCount = 0;

  if (Math.random() < 0.5)
    this.spawnSide = -1;
  else
    this.spawnSide = 1;

  typeCount = {};

  typeCount[0] = Math.min(this.nextWaveCount, this.spawnCap);

  if (this.wave >= 2)
  {
    typeCount[1] = Math.min(this.nextWaveCount * 0.4 - 1, this.spawnCap);
  }

  if (this.wave >= 6)
  {
    var cap = this.spawnCap;

    if (this.wave >= 12)
    {
      cap *= 0.6;
    }
    typeCount[2] = Math.min(this.nextWaveCount * 0.15 - 4, this.spawnCap);
  }

  if (this.wave >= 14)
  {
    typeCount[3] = Math.min(this.nextWaveCount * 0.2 - 8, this.spawnCap);
  }

  if (this.wave >= 18)
  {
    typeCount[4] = Math.min(this.nextWaveCount * 0.05 - 20, this.spawnCap * 0.3);
  }


  // SPECIAL WAVES
  if (this.wave == 5)
  {
    typeCount[0] = 0;
    typeCount[1] = 10;
    typeCount[2] = 0;
    typeCount[3] = 0;
    typeCount[4] = 0;
  }
  if (this.wave == 10)
  {
    typeCount[0] = 0;
    typeCount[1] = 2;
    typeCount[2] = 20;
    typeCount[3] = 0;
    typeCount[4] = 0;
  }
  if (this.wave == 15)
  {
    typeCount[0] = 6;
    typeCount[1] = 0;
    typeCount[2] = 0;
    typeCount[3] = 12;
    typeCount[4] = 0;
  }
  if (this.wave == 20)
  {
    typeCount[0] = 6;
    typeCount[1] = 6;
    typeCount[2] = 6;
    typeCount[3] = 6;
    typeCount[4] = 6;
  }
  if (this.wave == 30)
  {
    typeCount[0] = 12;
    typeCount[1] = 12;
    typeCount[2] = 12;
    typeCount[3] = 12;
    typeCount[4] = 12;
  }


  // Loop through enemy types
  for(var j = 0; j <= 4; ++j)
  {
    if (typeCount[j])
    {
      for (var i = 0; i < typeCount[j]; ++i)
      {
        this.waveEnemyTypes.push(j);
        ++JSEngine.game.humanCount;
      }
    }
  }

  // Scale up difficulty
  this.nextWaveCount *= 1.1 + this.difficulty * 0.05;
  this.spawnCap *= 1.01;
}