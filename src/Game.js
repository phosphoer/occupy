function Game()
{
  this.nextWaveCount = 5;
  this.humanCount = 0;
}

Game.prototype.update = function(dt)
{
  // Spawn more humans
  if (this.humanCount === 0)
  {
    for (var i = 0; i < this.nextWaveCount; ++i)
    {
      createHuman();
    }

    // Scale up difficulty
    this.nextWaveCount *= 1.2;
  }
}