function GameObject()
{
  this.id = -1;
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.components = {};
}

function Factory()
{
  this.currentId = 0;
  this.objects = {};
  this.objectsDeleted = [];
}

Factory.prototype.update = function(dt)
{
  // Delete objects
  for (var i in this.objectsDeleted)
  {
    delete this.objects[this.objectsDeleted[i].id];
  }

  // Update components
  for (var i in this.objects)
  {
    var obj = this.objects[i];
    for (var j in obj.components)
    {
      if (obj.components[j].update)
        obj.components[j].update(dt);
    }
  }
}