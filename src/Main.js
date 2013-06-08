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



  var ui = $("<div />").appendTo($("body"));
  ui.text("blah");
  ui.css("position", "absolute");
  ui.css("left", "200px");
  ui.css("top", "10px");
  ui.css("color", "#fff");

  $('<div id="placeholder"></div>').appendTo($("body"));

  $(function() {

    var d1 = [];
    for (var i = 0; i < 14; i += 0.5) {
      d1.push([i, Math.sin(i)]);
    }

    var d2 = [[0, 3], [4, 8], [8, 5], [9, 13]];

    // A null signifies separate line segments

    var d3 = [[0, 12], [7, 12], null, [7, 2.5], [12, 2.5]];

    $.plot("#placeholder", [ d1, d2, d3 ]);

    // Add the Flot version string to the footer

    $("#footer").prepend("Flot " + $.plot.version + " &ndash; ");
  });

  // center tower on ground
  tower.position.set(0, 1, 0);

  e.start();
}
