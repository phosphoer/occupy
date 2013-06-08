
var CUBE_GEOMETRY = new THREE.CubeGeometry(1, 1, 1);

function Cube(parent)
{
  this.parent = parent;
  
  this.material = new THREE.MeshLambertMaterial({ color:0x110ff} );
  this.mesh = new THREE.Mesh(CUBE_GEOMETRY, material);

  JSEngine.graphics.scene.add(mesh);
}

Cube.prototype.update = function(dt)
{
  // should change mesh position if parent position changed
}