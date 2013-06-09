function Stocks()
{
  this.ui = $('<div id="placeholder" class="graph"></div>').appendTo($("body"));

  this.tempColor = "rgb(200, 200, 50)";
  this.tempColorFrames = 0;


  var container = $("#placeholder");

  // Determine how many data points to keep based on the placeholder's initial size;
  // this gives us a nice high-res plot while avoiding more than one point per pixel.
  var maximum = container.outerWidth() / 2 || 300;

  this.data = [];

  var that = this;
  function getRandomData()
  {
    if (that.data.length)
    {
      that.data = that.data.slice(1);
    }

    while (that.data.length < maximum)
    {
      var previous = that.data.length ? that.data[that.data.length - 1] : 50;
      var y = previous + Math.random() * 10 - 5;
      that.data.push(y < 0 ? 0 : y > 100 ? 100 : y);
    }

    // zip the generated y values with the x values
    var res = [];
    for (var i = 0; i < that.data.length; ++i)
    {
      res.push([i, that.data[i]])
    }

    return res;
  }


  var data2 = [
    //[0.7,3.0,0.2,0.4],
    //[1.5,2.2,0.3,0.4],
    [maximum,100.0,0.0,0.0]
  ];

  var data2_points = {
    show: true,
    radius: 5,
    errorbars: "y", 
    yerr: {show:true, asymmetric:true}
  };

  series = [
    {
      data: getRandomData(),
      color: "rgb(200, 50, 50)",
      lines:
      {
        fill: true
      }
    },
    {
      data: data2,
      color: "rgb(200, 50, 50)",
      points: data2_points,
    }
  ];

  var plot = $.plot(container, series,
  {
    grid:
    {
      borderWidth: 1,
      minBorderMargin: 20,
      labelMargin: 10,
      margin:
      {
        top: 8,
        bottom: 20,
        left: 20
      },
      markings: function(axes)
      {
        var markings = [];
        var xaxis = axes.xaxis;
        return markings;
      }
    },
    xaxis:
    {
      tickFormatter: function()
      {
        return "";
      }
    },
    yaxis:
    {
      min: 0,
      max: 110,
      show: false
    },
    legend:
    {
      show: false
    }
  });

  self = this;

  // Update the random dataset at 25FPS for a smoothly-animating chart
  setInterval(function updateRandom()
  {
    if (self.tempColorFrames > 0)
    {
      series[0].color = self.tempColor;
    }
    else
    {
      series[0].color = "rgb(200, 50, 50)";
    }
    --self.tempColorFrames;

    series[0].data = getRandomData();


    //series[1]

    plot.setData(series);
    plot.draw();
  }, 40);
}

Stocks.prototype.hide = function()
{
  this.ui.css("display", "none");
}

Stocks.prototype.show = function()
{
  this.ui.css("display", "block");
}