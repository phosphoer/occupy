function Game()
{
  this.nextWaveCount = 5;
  this.humanCount = 0;
}

Game.prototype.update = function(dt)
{
  // Look for end of wave
  if (this.humanCount === 0)
  {
    this.waveEnd();
  }
}

Game.prototype.waveEnd = function()
{
  var ui = $("<div />").appendTo($("body"));
  ui.text("blah");
  ui.css("position", "absolute");
  ui.css("left", "200px");
  ui.css("top", "10px");
  ui.css("color", "#fff");

  this.nextWave();
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