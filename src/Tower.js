

function Tower(parent)
{
  this.parent = parent;
  this.health = 1;

  this.base = new THREE.Object3D();
  this.buildFromAsset(ZeBestTower);
  JSEngine.graphics.scene.add(this.base);
  this.base.position = this.parent.position;
}

Tower.prototype.update = function(dt)
{
}

Tower.prototype.buildFromAsset = function(asset)
{
    var geometry = new THREE.CubeGeometry(1, 1, 1);

    this.sizeX = asset.x;
    this.sizeY = asset.y;
    this.sizeZ = asset.z;
    
    // load mesh from file
    for(var j = 0; j < asset.y; ++j)
    {
        for(var k = 0; k < asset.z; ++k)
        {
            for(var i = 0; i < asset.x; ++i)
            {
                var cubeColor = asset.data[j * asset.x * asset.z + k * asset.x + i];
                if(cubeColor != 0)
                {      
                    var material = new THREE.MeshLambertMaterial( { color: cubeColor} );
                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.position = new THREE.Vector3(i, asset.y - j - 1, k);
                    this.base.add(mesh);
                }   
            }
        }
    }
}