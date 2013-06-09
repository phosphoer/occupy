function Velocity(parent, vel, omega, target)
{
  this.parent = parent;
  this.x = vel.x;
  this.y = vel.y;
  this.z = vel.z;

  this.omega = omega;

  this.target = target;
}

Velocity.prototype.update = function(dt)
{
  if(this.parent.components.lifetime.life <= 0)
  {
    var dirx = this.target.x
    var dir = { x:this.target.x - this.parent.position.x,
                y:this.target.y - this.parent.position.y,
                z:this.target.z - this.parent.position.z };

    var len = dir.x * dir.x + dir.y * dir.y + dir.z * dir.z;
    len = Math.sqrt(len);

    if(len < 5 || JSEngine.game.inMenu)
    {
        toTargetForce = 0.5;

        if (JSEngine.game.inMenu)
        {
          toTargetForce = 1.5;
        }

        if(len != 0)
        {
            dir.x /= len;
            dir.y /= len;
            dir.z /= len;
        }

        if (len < 1)
        {
            this.parent.destroy();
            JSEngine.game.money += 1;
        }
        else
        {
            this.x += toTargetForce * dir.x;
            this.y += toTargetForce * dir.y;
            this.z += toTargetForce * dir.z;
        }
    }
  }

  this.omega.x *= .96;
  this.omega.y *= .96;
  this.omega.z *= .96;

  this.parent.position.x += this.x * dt;
  this.parent.position.y += this.y * dt;
  this.parent.position.z += this.z * dt;

  this.parent.rotation.x += this.omega.x * dt;
  this.parent.rotation.y += this.omega.y * dt;
  this.parent.rotation.z += this.omega.z * dt;
}