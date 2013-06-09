function Camera(parent)
{
  this.parent = parent;

  // Who we are focusing on
  this.target = null;

  // The offset to the object we are focusing on
  this.offset = new THREE.Vector3(0, 15, 15);

  // Any smoothing we apply to the camera
  this.smoothing = 0.05;

  // The field of view
  this.fov = 70;

  // Whether or not this camera is being rendered
  this.active = true;

  // How much screen space we take up from [0, 1]
  this.sizeX = 1.0;
  this.sizeY = 1.0;

  // The offset onto the screen where 0 is left/top, 1 is right/bottom
  this.offsetX = 0.0;
  this.offsetY = 0.0;

  // Add ourselves to the list of cameras
  JSEngine.graphics.cameras[parent.id] = this;

  // The scene camera
  this.cam = new THREE.PerspectiveCamera(this.fov, window.innerWidth / window.innerHeight, 1, 1000);
  this.cam.position = parent.position;

  // These values are computed (not to be externally modified)
  this.pixelSizeX = 0;
  this.pixelSizeY = 0;
  this.pixelOffsetX = 0;
  this.pixelOffsetY = 0;
}

Camera.prototype.destroy = function()
{
  // Remove ourselves to the list of cameras
  delete JSEngine.graphics.cameras[this.parent.id];
}

Camera.prototype.update = function(dt)
{
  this.pixelSizeX = this.sizeX * window.innerWidth;
  this.pixelSizeY = this.sizeY * window.innerHeight;

  this.pixelOffsetX = this.offsetX * window.innerWidth;
  this.pixelOffsetY = this.offsetY * window.innerHeight;

  this.cam.aspect = this.pixelSizeX / this.pixelSizeY;
  this.cam.updateProjectionMatrix();

  if (this.target && this.target.isAlive)
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
