function GameObject()
{
  this.id = -1;
  this.isAlive = true;
  this.position = new THREE.Vector3(0, 0, 0);
  this.rotation = new THREE.Vector3(0, 0, 0);
  this.scale = new THREE.Vector3(1, 1, 1);
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
  // Construct arguments
  var message_args = [];
  for (var i = 1; i < arguments.length; ++i)
    message_args.push(arguments[i]);

  for (var j in this.components)
  {
    if (this.components[j][name])
      this.components[j][name].apply(this.components[j], message_args);
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
    obj.sendEvent.apply(obj, arguments);
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
