function main()
{
  var e = new Engine();

  var player = e.factory.createObject();
  player.components.player = new Player(player);
  player.components.cube = new Cube(player, { color:0xFF0000 });
  player.position.y = 1;

  mrSagat = e.factory.createObject();
  mrSagat.components.camera = new Camera(mrSagat);
  mrSagat.position.set(0, 20, 40);
  mrSagat.components.camera.target = player;

  e.graphics.camera = mrSagat.components.camera;

  e.start();
}