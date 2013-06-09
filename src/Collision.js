function Collider(parent)
{
  this.parent = parent;
  this.width = 1;
  this.height = 1;
  this.isSolid = true;
  this.stopOnGround = true;
  this.frictionOnGround = false;
  this.collidesWithOthers = true;
}

Collider.prototype.update = function(dt)
{
  var obj;
  var c;

  if (this.collidesWithOthers)
  {
    for (var i in JSEngine.factory.objects)
    {
      obj = JSEngine.factory.objects[i];
      if (!obj.components.collider || obj === this.parent)
        continue;

      this.collide(obj.components.collider);
    }
  }

  var pos = this.parent.position;
  if (pos.x < -30)
    pos.x = -30;
  if (pos.x > 29)
    pos.x = 29;
  if (pos.z < -15)
    pos.z = -15;
  if (pos.z > 14)
    pos.z = 14;

  if (this.stopOnGround && pos.y < 1)
    pos.y = 1;
  if (this.frictionOnGround && this.parent.components.velocity && pos.y <= 1)
  {
    this.parent.components.velocity.x *= 0.96;
    this.parent.components.velocity.z *= 0.96;
  }
}

Collider.prototype.collide = function(c)
{
  var myPos = this.parent.position;
  var pos = c.parent.position;

  var w = this.width  * this.parent.scale.x;
  var h = this.height * this.parent.scale.y;

  var cw = c.width  * c.parent.scale.x;
  var ch = c.height * c.parent.scale.y;

  // Check for intersection
  if (myPos.x + w / 2 < pos.x - cw / 2)
    return false;
  if (myPos.x - w / 2 > pos.x + cw / 2)
    return false;
  if (myPos.z + h / 2 < pos.z - ch / 2)
    return false;
  if (myPos.z - h / 2 > pos.z + ch / 2)
    return false;

  // Send the oncollide message if we are colliding
  this.parent.sendEvent("onCollide", c.parent);

  if (!c.collidesWithOthers)
  {
    return;
  }


  var penScalar = 1;

  // Don't resolve if other is not solid (but doesn't matter if we are?)
  if (!c.isSolid)
  {
    if (this.isSolid)
    {
      return;
    }
    else
    {
      penScalar = 0.1;
    }
  }

  // Resolve penetration
  var pen = {x: 0, z: 0};
  if (myPos.x < pos.x)
    pen.x = (myPos.x + w / 2) - (pos.x - cw / 2);
  else
    pen.x = (myPos.x - w / 2) - (pos.x + cw / 2);

  if (myPos.z < pos.z)
    pen.z = (myPos.z + h / 2) - (pos.z - ch / 2);
  else
    pen.z = (myPos.z - h / 2) - (pos.z + ch / 2);

  if (Math.abs(pen.x) < Math.abs(pen.z))
    myPos.x -= pen.x * penScalar;
  else
    myPos.z -= pen.z * penScalar;

  return true;
}