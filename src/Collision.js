function Collider(parent)
{
  this.parent = parent;
  this.width = 1;
  this.height = 1;
  this.isSolid = true;
}

Collider.prototype.update = function(dt)
{
  var obj;
  var c;
  for (var i in JSEngine.factory.objects)
  {
    obj = JSEngine.factory.objects[i];
    if (!obj.components.collider || obj === this.parent)
      continue;

    this.collide(obj.components.collider);
  }

  var pos = this.parent.position;
  if (pos.x < -30)
    pos.x = -30;
  if (pos.x > 29)
    pos.x = 29;
  if (pos.z < -10)
    pos.z = -10;
  if (pos.z > 9)
    pos.z = 9;
}

Collider.prototype.collide = function(c)
{
  var myPos = this.parent.position;
  var pos = c.parent.position;

  // Check for intersection
  if (myPos.x + this.width / 2 < pos.x - c.width / 2)
    return false;
  if (myPos.x - this.width / 2 > pos.x + c.width / 2)
    return false;
  if (myPos.z + this.height / 2 < pos.z - c.height / 2)
    return false;
  if (myPos.z - this.height / 2 > pos.z + c.height / 2)
    return false;

  // Send the oncollide message if we are colliding
  this.parent.sendEvent("onCollide", c.parent);

  // Don't resolve if other is not solid (but doesn't matter if we are?)
  if (!c.isSolid)
    return;

  // Resolve penetration
  var pen = {x: 0, z: 0};
  if (myPos.x < pos.x)
    pen.x = (myPos.x + this.width / 2) - (pos.x - c.width / 2);
  else
    pen.x = (myPos.x - this.width / 2) - (pos.x + c.width / 2);

  if (myPos.z < pos.z)
    pen.z = (myPos.z + this.height / 2) - (pos.z - c.height / 2);
  else
    pen.z = (myPos.z - this.height / 2) - (pos.z + c.height / 2);

  if (Math.abs(pen.x) < Math.abs(pen.z))
    myPos.x -= pen.x;
  else
    myPos.z -= pen.z;

  return true;
}