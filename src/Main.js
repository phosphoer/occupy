function main()
{
  var e = new Engine();

  var player = e.factory.createObject();
  player.components.player = new Player(player);

  e.start();
}