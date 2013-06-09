

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
  this.mesh = new THREE.Object3D();

  JSEngine.graphics.scene.add(this.mesh);
  
  this.mesh.position = this.parent.position;
  this.mesh.rotation = this.parent.rotation;
  this.mesh.scale = this.parent.scale;

  var cube = new THREE.Mesh(CUBE_GEOMETRY, this.material);
  this.mesh.add(cube);

  this.head = new THREE.Mesh(CUBE_GEOMETRY, this.material);
  this.head.position.set(0, .7, 0);
  this.head.scale.set(0.7, 0.5, 0.7);
  this.mesh.add(this.head);

  this.armOuterA = new THREE.Object3D;
  this.armOuterA.position.set(0, .2, .5);
  
  var armInner = new THREE.Mesh(CUBE_GEOMETRY, this.material);
  armInner.position.set(-.35, 0, 0);
  armInner.scale.set(.8, .35, .35);
  
  this.mesh.add(this.armOuterA);
  this.armOuterA.add(armInner);

  this.armOuterB = new THREE.Object3D;
  this.armOuterB.position.set(0, .15, -.5);
  
  armInner = new THREE.Mesh(CUBE_GEOMETRY, this.material);
  armInner.position.set(-.35, 0, 0);
  armInner.scale.set(.8, .35, .35);
  
  this.mesh.add(this.armOuterB);
  this.armOuterB.add(armInner);  


  this.minRotation = -.5;
  this.maxRotation = .4;

  // -.5 - .3
  this.armOuterA.rotation.z = this.minRotation + (this.maxRotation - this.minRotation) * Math.random();
  this.armOuterB.rotation.z = this.minRotation + (this.maxRotation - this.minRotation) * Math.random();
  this.armADir = Math.random() > 0.5 ? 1 : -1;
  this.armBDir = Math.random() > 0.5 ? 1 : -1;

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
  this.armOuterA.rotation.z += dt * 2 * this.armADir;
  this.armOuterB.rotation.z += dt * 2 * this.armBDir;

  if(this.armOuterA.rotation.z > this.maxRotation)
  {
    this.armOuterA.rotation.z = this.maxRotation;
    this.armADir *= -1;
  }

  if(this.armOuterA.rotation.z < this.minRotation)
  {
    this.armOuterA.rotation.z = this.minRotation;
    this.armADir *= -1;
  }

  if(this.armOuterB.rotation.z > this.maxRotation)
  {
    this.armOuterB.rotation.z = this.maxRotation;
    this.armBDir *= -1;
  }

  if(this.armOuterB.rotation.z < this.minRotation)
  {
    this.armOuterB.rotation.z = this.minRotation;
    this.armBDir *= -1;
  }
  if (this.trailLength > 0)
  {
    var trailMaterial = new THREE.MeshLambertMaterial( { emissive: this.emissive, color: this.color, transparent: true, opacity: 0.5 } );
    var trailMesh = new THREE.Mesh(CUBE_GEOMETRY, trailMaterial);

    trailMesh.position.set(this.parent.position.x, this.parent.position.y, this.parent.position.z);
    trailMesh.rotation.set(this.parent.rotation.x, this.parent.rotation.y, this.parent.rotation.z);
    trailMesh.scale = this.mesh.scale;

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