function GameObject()
{
  this.id = -1;
  this.isAlive = true;
  this.position = new THREE.Vector3(0, 0, 0);
  this.components = {};
}

GameObject.prototype.destroy = function()
{
  this.sendEvent("destroy");
  this.isAlive = false;
  this.factory.destroyObject(this.id);
}

GameObject.prototype.sendEvent = function(name, args)
{
  for (var j in this.components)
  {
    if (this.components[j][name])
      this.components[j][name](args);
  }
}

function Factory()
{
  this.currentId = 0;
  this.objects = {};
  this.objectsDeleted = [];
}

Factory.prototype.createObject = function()
{
  var obj = new GameObject();
  obj.id = this.currentId++;
  obj.factory = this;
  this.objects[obj.id] = obj;

  return obj;
}

Factory.prototype.destroyObject = function(id)
{
  this.objectsDeleted.push(id);
}

Factory.prototype.sendEventToAll = function(name, args)
{
  for (var i in this.objects)
  {
    var obj = this.objects[i];
    obj.sendEvent(name, args);
  }
}

Factory.prototype.update = function(dt)
{
  // Delete objects
  for (var i in this.objectsDeleted)
    delete this.objects[this.objectsDeleted[i]];
  this.objectsDeleted = [];

  this.sendEventToAll("update", dt);
}
