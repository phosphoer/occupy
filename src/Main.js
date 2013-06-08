function main()
{
  var e = new Engine();

  var player1 = createPlayer(0, 0x440000, 0.0);
  // var player2 = createPlayer(1, 0xFF0000, 0.5);

  var tower = e.factory.createObject();
  tower.components.tower = new Tower(tower);

  // center tower on ground
  tower.position.set(-tower.components.tower.sizeX / 2, 1,
                     -tower.components.tower.sizeZ / 2);

  e.start();
}
