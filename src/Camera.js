function Camera(parent)
{
  this.target = null;
  this.offset = new THREE.Vector3(0, 5, 10);
  this.parent = parent;

  this.smoothing = 0.05;
  this.fov = 90;

  this.cam = new THREE.PerspectiveCamera(this.fov, window.innerWidth / window.innerHeight, 1, 1000);
  this.cam.position = parent.position;
}

Camera.prototype.update = function(dt)
{
  this.cam.aspect = window.innerWidth / window.innerHeight;

  if (this.target)
  {
    var newPosition = new THREE.Vector3();
    newPosition.addVectors(this.target.position, this.offset);

    this.parent.position.lerp(newPosition, this.smoothing);

    this.cam.fov = this.fov;

    this.cam.lookAt(this.target.position);
  }
  else
  {
    this.offset.negate();
    this.cam.lookAt(this.offset);
    this.offset.negate();
  }
}
