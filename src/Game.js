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
  this.selectSound = new Audio("res/select.wav");
  this.stockMusic = new Audio("res/TheStockMarket.mp3");
  this.gameMusic = new Audio("res/TheBloodMarket.mp3");
  this.buySound.volume = 0.2;
  this.sellSound.volume = 0.2;
  this.selectSound.volume = 0.2;
  this.gameMusic.volume = 0.5;
  this.stockMusic.volume = 0.5;

  this.stockMusic.addEventListener("ended", function()
  {
    this.currentTime = 0;
    this.play();
  }, false);
  this.gameMusic.addEventListener("ended", function()
  {
    this.currentTime = 0;
    this.play();
  }, false);

  this.waveEnemyTypes = [];

  this.difficulty = 5;

  this.spawnSide = -1; // -1 Left, 1 Right
  this.spawnInterval = 1 - (this.difficulty * 0.1);
  this.spawnTimer = 0;
  this.spawnsPerCheck = 3;
  this.spawnCap = 10 + this.difficulty * 0.1;
  this.nextWaveCount = 2.5 + this.difficulty * 0.1;
  this.behemothCounter = 0;
  this.swagArcherCounter = 0;

  this.increaseSpeedPrice = 500;
  this.increaseSizePrice = 1000;
  this.increaseDashPrice = 600;

  this.introText = "10,000 years into the future vampires have taken over planet Earth - after the glorious setting of the sun, known to the pitiful humans as the 'Lights Out' incident. It's the humans last hope to cripple the vampire economy and win the war. For some reason only a single lone vampire has been left to defend the vampire stock market.  'We are leaving the vampire economy in your capable hands, please make sure to buy and sell when appropriate.' The last words of his departed vampire brethern ran through our young vampire hero's mind, like a flowing river of wisdom. He knew in his non-beating heart that it was his calling to manage the stocks in between murdering the relentless waves of human aggressors. Our hero knows that his journey will not be over until every last human is dead, and all the available upgrades to him have been purchased with the blood of the deceased. He also reflected that he could move about using the WASD keys or by clicking and holding the mouse. Using the tremendous power of the 'Spacebar', he could dash forward with inhuman speed, totally brutalizing all in his vampiric path.";
  this.introTextCounter = 0;

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
  $("<div id='agreement' class='Agreement'>10,000 years into the future, vampires have taken over planet Earth, after the great setting of the sun, known to the pitiful humans as the great 'Lights Out' incident. It's the humans last hope to cripple the vampire economy and win the war. For some reason only a single lone vampire has been left to defend the vampire stock market.  'We are leaving the vampire economy in your capable hands, please make sure to buy and sell when appropriate.' The last words of his departed vampire brethern ran through our young vampire hero's mind, like a flowing river of wisdom. He knew in his non-beating heart that it was his calling to manage the stocks in between murdering the relentless waves of human aggressors. Our hero knows that his  journey will not be over until every last human is dead, and all the available  upgrades to him have been purchased with the blood of the deceased. He also reflected that he could move about using the WASD keys or by clicking and holding the mouse. Using the tremendous power of the 'Spacebar', he could dash forward with inhuman speed, totally brutalizing all in his vampiric path. </div>").appendTo(mainMenuBody);
  
  $("#agreement").text("");

  me = this;

   // Update the random dataset at 25FPS for a smoothly-animating chart
  setInterval(function()
  {
    if (me.introTextCounter <= me.introText.length)
    {
      me.introTextCounter += 10;
      $("#agreement").text(me.introText.substring(0, me.introTextCounter));
    }
  }, 40);

  var startGame = $("<div class='Button'>I Accept</div>").appendTo(mainMenuBody);
  var that = this;

  startGame.bind('click', function ()
  {
    that.hasAccepted = true;
    JSEngine.start();
    that.mainMenuContainer.remove();

    var fade = $("<div />").appendTo($("body"));
    fade.css("position", "absolute");
    fade.css("display", "block");
    fade.css("left", "0px");
    fade.css("top", "0px");
    fade.css("width", "100%");
    fade.css("height", "100%");
    fade.css("background-color", "#000");
    fade.css("opacity", "1");

    fade.animate(
    {
      opacity: 0
    }, 2000, function()
    {
      fade.remove();
    });    

    that.gameMusic.play();

  });

}

Game.prototype.update = function(dt)
{
  // We're scared that physics can move the tower, because.. well.. things and stuff
  this.tower.position.set(0, 1, -12);

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
    this.stockMusic.pause();
    this.gameMusic.play();
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
  this.gameMusic.pause();
  this.stockMusic.play();
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
    that.stockMusic.pause();
    that.gameMusic.play();
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

  $(".Button").bind("mouseenter", function()
  {
    that.selectSound.play();
  });
  $(".ButtonIcon").bind("mouseenter", function()
  {
    that.selectSound.play();
  });
  $(".WaveTimer").bind("mouseenter", function()
  {
    that.selectSound.play();
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

    JSEngine.stocks.tempColor = "rgb(215, 80, 55)";
    JSEngine.stocks.tempColorFrames = 2;
    JSEngine.stocks.addBuyPoint();
  }
}

Game.prototype.sellStocks = function()
{
  if (this.numStocks > 0)
  {
    --this.numStocks;
    this.money += this.stockPrice;

    JSEngine.stocks.tempColor = "rgb(215, 80, 55)";
    JSEngine.stocks.tempColorFrames = 2;
    JSEngine.stocks.addSellPoint();
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

  if (this.wave >= 16)
  {
    typeCount[4] = Math.min(this.nextWaveCount * 0.06 - 18, this.spawnCap * 0.4);
  }

  if (this.wave >= 18)
  {
    ++this.behemothCounter;
    typeCount[5] = this.behemothCounter;
  }

  if (this.wave >= 24)
  {
    ++this.swagArcherCounter;
    typeCount[6] = this.swagArcherCounter;
  }


  // SPECIAL WAVES
  if (this.wave == 3)
  {
    typeCount[0] = 5;
    typeCount[1] = 2;
    typeCount[2] = 0;
    typeCount[3] = 0;
    typeCount[4] = 0;
  }
  if (this.wave == 5)
  {
    typeCount[0] = 0;
    typeCount[1] = 10;
    typeCount[2] = 0;
    typeCount[3] = 0;
    typeCount[4] = 0;
  }
  if (this.wave == 7)
  {
    typeCount[0] = 3;
    typeCount[1] = 2;
    typeCount[2] = 20;
    typeCount[3] = 0;
    typeCount[4] = 0;
  }
  if (this.wave == 8)
  {
    typeCount[0] = 3;
    typeCount[1] = 2;
    typeCount[2] = 10;
    typeCount[3] = 3;
    typeCount[4] = 0;
  }
  if (this.wave == 10)
  {
    typeCount[0] = 8;
    typeCount[1] = 3;
    typeCount[2] = 5;
    typeCount[3] = 7;
    typeCount[4] = 5;
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
  for(var j = 0; j <= 6; ++j)
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