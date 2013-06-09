function main()
{
  var e = new Engine();

  var player1 = createPlayer(0, 0x440000, 0.0);
  // var player2 = createPlayer(1, 0xFF0000, 0.5);

  var tower = e.factory.createObject();
  tower.components.tower = new Tower(tower);
  tower.components.collider = new Collider(tower);
  tower.components.collider.width = tower.components.tower.sizeX;
  tower.components.collider.height = tower.components.tower.sizeZ;

  // center tower on ground
  tower.position.set(0, 1, 0);

  e.start();
}
