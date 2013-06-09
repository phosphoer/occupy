

var CUBE_GEOMETRY = new THREE.CubeGeometry(1, 1, 1);

function Cube(parent, config)
{
  var cubeColor = config.color || 0xFFFFFF;
  var cubeEmissive = config.emissive || 0x000000;
  this.color = cubeColor;
  this.emissive = cubeEmissive;

  this.parent = parent;

  this.trailLength = 0;

  this.trail = [];

  this.material = new THREE.MeshLambertMaterial({ emissive:cubeEmissive, color:cubeColor });
  this.mesh = new THREE.Mesh(CUBE_GEOMETRY, this.material);

  JSEngine.graphics.scene.add(this.mesh);
  
  this.mesh.position = this.parent.position;
  this.mesh.rotation = this.parent.rotation;
  this.mesh.scale = this.parent.scale;
}

Cube.prototype.destroy = function()
{
  JSEngine.graphics.scene.remove(this.mesh);

  this.clearTrail();
}

Cube.prototype.clearTrail = function()
{
  for (var i in this.trail)
  {
    var mesh = this.trail[i];
    JSEngine.graphics.scene.remove(mesh);
  }

  this.trail.length = 0;
}

Cube.prototype.update = function(dt)
{
  if (this.trailLength > 0)
  {
    var trailMaterial = new THREE.MeshLambertMaterial( { emissive: this.emissive, color: this.color, transparent: true, opacity: 0.5 } );
    var trailMesh = new THREE.Mesh(CUBE_GEOMETRY, trailMaterial);

    trailMesh.position.set(this.parent.position.x, this.parent.position.y, this.parent.position.z);
    trailMesh.rotation.set(this.parent.rotation.x, this.parent.rotation.y, this.parent.rotation.z);

    JSEngine.graphics.scene.add(trailMesh);
    this.trail.push(trailMesh);

    if (this.trail.length > this.trailLength)
    {
      var mesh = this.trail[0];
      JSEngine.graphics.scene.remove(mesh);
      this.trail.splice(0, 1);
    }

    for (var i in this.trail)
    {
      this.trail[i].material.opacity = i / this.trail.length;
    }
  }
  else
  {
    this.clearTrail();
  }
}