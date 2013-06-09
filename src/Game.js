function Game()
{
  this.nextWaveCount = 5;
  this.humanCount = 0;
  this.inMenu = false;
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

  var ui = $("<div class='Menu' />").appendTo($("body"));
  ui.text("Upgrade your shit!");

  var upgradeVamp = ui.append("<div class='Button'>Upgrade your vampire</div>");
  var upgradeTower = ui.append("<div class='Button'>Upgrade your tower</div>");

  var that = this;
  upgradeVamp.bind("click", function()
    {
      that.inMenu = false;
      ui.remove();
      that.nextWave();
      that.upgradeVampire();
    });
  upgradeTower.bind("click", function()
    {
      that.inMenu = false;
      ui.remove();
      that.nextWave();
      that.upgradeTower();
    });
}

Game.prototype.upgradeVampire = function()
{
  ++this.vampireLevel;
}

Game.prototype.upgradeTower = function()
{
  ++this.towerLevel;
}

Game.prototype.nextWave = function()
{
  // Spawn humans
  for (var i = 0; i < this.nextWaveCount; ++i)
  {
    createHuman();
  }

  // Scale up difficulty
  this.nextWaveCount *= 1.2;
}