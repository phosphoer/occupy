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
      var obj = JSEngine.factory.createObject();
      obj.components.human = new Human(obj);
      obj.components.cube = new Cube(obj, { color:0x00FF00 });
      obj.position.y = 1;
      if (Math.random() < 0.5)
        obj.position.x = -20;
      else
        obj.position.x = 20;
      obj.position.z = Math.round(-5 + Math.random() * 10);
    }
  }
}