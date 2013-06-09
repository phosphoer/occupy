

function Tower(parent)
{
  this.parent = parent;
  this.health = 1;

  this.base = new THREE.Object3D();
  JSEngine.graphics.scene.add(this.base);
  this.base.position = this.parent.position;


  this.sizeX = ZeBestTower.x;
  this.sizeY = ZeBestTower.y;
  this.sizeZ = ZeBestTower.z;


  this.chunk = buildChunkFromAsset(ZeBestTower);
  var geometry = buildGeometryFromChunk(this.chunk, ZeBestTower.x, ZeBestTower.y, ZeBestTower.z);
  var material = new THREE.MeshLambertMaterial( { vertexColors: true} );
  var mesh = new THREE.Mesh(geometry, material);

  var offset = new THREE.Object3D();
  this.base.add(offset);
  offset.add(mesh)
  offset.position.set(-this.sizeX / 2 + 0.5, 0, -this.sizeZ / 2 + 0.5);

}

Tower.prototype.update = function(dt)
{
}

function buildChunkFromAsset(asset)
{
    var chunk = [];
    
    var sizeX = asset.x;
    var sizeY = asset.y;
    var sizeZ = asset.z;

    // load mesh from file
    for(var j = 0; j < sizeY; ++j)
    {
        for(var k = 0; k < sizeZ; ++k)
        {
            for(var i = 0; i < sizeX; ++i)
            {
                var assetId = j * sizeX * sizeZ + k * sizeX + i;
                var chunkId = i * sizeY * sizeZ + (sizeY - j - 1) * sizeZ + k;

                chunk[chunkId] = asset.data[assetId];

            }
        }
    } 

    return chunk;   
}

function buildGeometryFromChunk(chunk, sizeX, sizeY, sizeZ)
{
    var geometry = new THREE.Geometry();

    var n1 = new THREE.Vector3(0, -1, 0);
    var n2 = new THREE.Vector3(0,  1, 0);
    var n3 = new THREE.Vector3(0,  0, -1);
    var n4 = new THREE.Vector3(-1, 0, 0);
    var n5 = new THREE.Vector3( 1, 0, 0);

    for(var i = 0; i < sizeX; ++i)
    {
        for (var j = 0; j < sizeY; ++j)
        {
            for (var k = 0; k < sizeZ; ++k)
            {
                var index = i * sizeY * sizeZ + j * sizeZ + k;
                var block = chunk[index];
                if(block != 0 && block != null)
                {
                    var n = geometry.vertices.length;
                    geometry.vertices.push(new THREE.Vector3(i - 0.5, j - 0.5, k - 0.5));
                    geometry.vertices.push(new THREE.Vector3(i + 0.5, j - 0.5, k - 0.5));
                    geometry.vertices.push(new THREE.Vector3(i + 0.5, j - 0.5, k + 0.5));
                    geometry.vertices.push(new THREE.Vector3(i - 0.5, j - 0.5, k + 0.5));

                    geometry.vertices.push(new THREE.Vector3(i - 0.5, j + 0.5, k - 0.5));
                    geometry.vertices.push(new THREE.Vector3(i + 0.5, j + 0.5, k - 0.5));
                    geometry.vertices.push(new THREE.Vector3(i + 0.5, j + 0.5, k + 0.5));
                    geometry.vertices.push(new THREE.Vector3(i - 0.5, j + 0.5, k + 0.5));

                    var color = new THREE.Color(block);
                    geometry.faces.push(new THREE.Face4(n + 0, n + 1, n + 2, n + 3, 
                                        n1, 
                                        color));

                    // top
                    geometry.faces.push(new THREE.Face4(n + 7, n + 6, n + 5, n + 4, 
                                        n2, 
                                        color));

                    // back

                    //geometry.faces.push(new THREE.Face4(n + 0, n + 1, n + 5, n + 4, 
                    //                    new THREE.Vector3(1, 0, 0), 
                    //  

                    // front                
                   geometry.faces.push(new THREE.Face4(n + 3, n + 2, n + 6, n + 7, 
                                       n3, 
                                       color));  
                    
                    // left
                    geometry.faces.push(new THREE.Face4(n + 0, n + 3, n + 7, n + 4, 
                                        n4, 
                                        color));   

                    // right       
                    geometry.faces.push(new THREE.Face4(n + 5, n + 6, n + 2, n + 1, 
                                        n5, 
                                        color));                                                                             
                }
            }
        }
    }

    return geometry;
}
