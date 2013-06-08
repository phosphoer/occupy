function main()
{
  var e = new Engine();

  var player = e.factory.createObject();
  player.components.player = new Player(player);
  player.components.cube = new Cube(player, { color:0xFF0000 });
  player.position.y = 1;


  e.start();
}