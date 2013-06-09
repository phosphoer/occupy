

var CUBE_GEOMETRY = new THREE.CubeGeometry(1, 1, 1);

function Cube(parent, config)
{
  var cubeColor = config.color || 0xFFFFFF;

  this.parent = parent;
  
  this.material = new THREE.MeshLambertMaterial({ color:cubeColor });
  this.mesh = new THREE.Mesh(CUBE_GEOMETRY, this.material);

  JSEngine.graphics.scene.add(this.mesh);
  
  this.mesh.position = this.parent.position;
  this.mesh.rotation = this.parent.rotation;
}

Cube.prototype.destroy = function()
{
  JSEngine.graphics.scene.remove(this.mesh);
}

Cube.prototype.update = function(dt)
{
}