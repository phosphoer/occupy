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