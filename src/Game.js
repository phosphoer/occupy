function Game()
{
  this.nextWaveCount = 5;
  this.humanCount = 0;
  this.players = {};
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
  // var ui = $("<div class='Menu' />").appendTo($("body"));
  // ui.text("blah");
  this.nextWave();
}

Game.prototype.nextWave = function()
{
  // Spawn humans
  for (var i = 0; i < this.nextWaveCount; ++i)
  {
    createHuman(1);
  }

  // Scale up difficulty
  this.nextWaveCount *= 1.2;
}