var efforts = {};

// Copy the array of efforts list to draw each debt/effort graph
var effortsMunicipality = effortList;
var effortProvince = effortList;
/*
* configuration for subgraphs
*/

var graph = {};

graph.margin = {top: 30, right: 10, bottom: 30, left: 20};
graph.width = 402;
graph.height = 300;

graph.y = d3.scale.linear()
  .range([0, graph.height - (graph.margin.left*1.5)].reverse());

graph.x = d3.scale.ordinal()
  .rangeRoundBands([0, graph.width], 0.2);

graph.xSubEffort = d3.scale.linear()
  .range([0, graph.width/1.1 - graph.margin.left*1.5]);

graph.ySubEffort = d3.scale.ordinal()
  .rangeRoundBands([0, graph.height], 0.2);

graph.xEffort = d3.scale.linear()
  .range([0, graph.width*2 - graph.margin.left*1.5]);

graph.yEffort = d3.scale.ordinal()
  .rangeRoundBands([0, graph.height], 0.2);

graph.emptyLine = d3.svg.line()
  .x(function (d) { return graph.x(d.year); })
  .y(function (d) { return graph.height; });

graph.line = d3.svg.line()
  .x(function(d) { return graph.x(d.year) + 15; })
  .y(function(d) { return graph.y(d.ratio); });

graph.yAxis = d3.svg.axis()
  .scale(graph.y)
  .orient('left');

/*
* Tips for Graphs & Map
*/
var tipOnDebtGraph = d3.tip()
  .attr('class', 'd3-tip')
  .offset(function (d) {
    return [0, 0];
  })
  .html(function(d) {
    return '<strong>지자체 채무액:</strong> <span>' + d.ratio + '%</span>';
  });

var tipOnMap = d3.tip()
  .attr('class', 'd3-tip')
  .offset(function (d) {
    return [0, 0];
  })
  .html(function(d) {
    return '<strong>지역:</strong> <span>' + d.properties.NAME_2 + d.properties.TYPE_2 + '</span>';
  });

var drawEffortGraph = function drawEffortGraph(svg, data, x, y) {
  data.sort(function (a, b) {
    return b.value - a.value;
  });

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient('top');

  x.domain(d3.extent(data, function(d) { return d.value; })).nice();
  y.domain(data.map(function(d) { return d.title; }));
  x.domain([-(data[0].value + 0.5), data[0].value + 0.5]);

  svg.selectAll('.bar')
    .data(data)
    .enter().append('rect')
      .attr('class', function (d) { return (d.value >= 0 ? 'bar bar-positive' : 'bar bar-negative'); })
      .attr('x', function(d) { return x(0); })
      .attr('y', function(d) { return y(d.title); })
      .attr('width', function(d) { return 0; })
      .attr('height', 13)
      .transition().duration(1000)
        .attr('width', function(d) { return Math.abs(x(d.value) - x(0)); })
        .attr('x', function (d) { return (d.value < 0) ? x(d.value) : x(0); });

  svg.selectAll('bar')
    .data(data)
    .enter().append('rect')
      .attr('x', function(d) { return -10; })
      .attr('y', function (d) { return y(d.title)-5; })
      .attr('width', function(d) { return 380; })
      .attr('height', 30)
      .attr('class', 'selectedEffortBar');

  svg.selectAll('bar')
    .data(data)
    .enter().append('text')
      .attr('x', function(d) { return (d.value >= 0) ? x(-1.2) : x(0.1); })
      .attr('y', function (d) { return y(d.title) + 10; })
      .attr('class', 'effort-title')
      .text(function(d) { return d.title; });

  svg.selectAll('bar')
    .data(data)
    .enter().append('text')
      .attr('x', function(d) {
        return (d.value >= 0) ? x(d.value + 0.1) : x(d.value - 0.5);
      })
      .attr('y', function (d) { return y(d.title) + 10; })
      .attr('class', 'effort-value')
      .text(function(d) { return d.value; });

  svg.append('g')
      .attr('class', 'x axis')
      .call(xAxis);

  var yAxis = svg.append('g')
    .attr('class', 'y axis');

  yAxis
  .append('line')
    .attr('x1', x(0))
    .attr('x2', x(0))
    .attr('y2', graph.height)
    .style('stroke', '#C4C4C4');

};

var drawDebtGraph = function drawDebtGraph(svg, data, x) {
  data.sort(function (a, b) {
    return a.year - b.year;
  });

  x.domain(data.map(function(d) { return d.year; }));
  graph.y.domain(d3.extent(data, function(d) { return d.ratio; })).nice();
  graph.y.domain([0, d3.max(data, function (d) { return d.ratio; }) + 15]);

  var xAxis = svg.append('g')
      .attr('class', 'x axis');

  var yAxis = d3.svg.axis()
    .scale(graph.y)
    .orient('left');

  svg.selectAll('g.y.axis')
    .call(yAxis);

  for (var i = 0; i <= d3.max(data, function (d) { return d.ratio; }) + 15; i += 10) {
    xAxis.append('line')
      .attr('x1', graph.width*2)
      .attr('y1', graph.y(i))
      .attr('y2', graph.y(i))
      .attr('class', 'xAxis')
      .style('stroke-width', 0.2);
  }

  svg.selectAll('.bar')
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', function(d) { return x(d.year); })
    .attr('y', function(d) { return graph.y(0); })
    .attr('width', 30)
    .attr('height', 0)
      .transition().duration(1000)
      .attr('y', function(d) { return graph.y(d.ratio); })
      .attr('height', function(d) {
        return (graph.height - graph.margin.left*1.5) - graph.y(d.ratio);
      });


  svg.selectAll('bar')
    .data(data)
    .enter().append('text')
      .attr('class', 'bar-year')
      .attr('x', function(d) { return x(d.year)-5; })
      .attr('y', function (d) { return graph.y(0) + 20; })
      .text(function(d) { return d.year + '년'; });

  svg.selectAll('bar')
    .data(data)
    .enter().append('text')
      .attr('class', 'bar-value')
      .attr('x', function(d) { return x(d.year); })
      .attr('y', function (d) { return graph.height; })
      .transition().duration(1000)
      .attr('y', function (d) { return graph.y(d.ratio) - 15; })
      .text(function(d) { return d.ratio + '%'; });

  svg
    .append("path")
    .attr("class", "line")
    .attr("d", graph.emptyLine(data))
    .transition().duration(1000)
      .attr("d", graph.line(data));

  svg.append("text")
    .attr("x", 180)
    .attr("y", 0 - (graph.margin.top / 3))
    .attr("class", "graph-region")
    .attr("text-anchor", "middle")
    .text(data[0].name);
}

var removeDebtGraph = function (svg) {
  svg.selectAll(".graph-region")
    .data([])
    .exit()
    .remove();

  svg.selectAll(".bar")
    .data([])
    .exit()
    .remove();

  svg.selectAll("text")
    .data([])
    .exit()
    .remove();

  svg.selectAll("line")
    .data([])
      .exit()
      .remove();

  svg.selectAll("path")
    .data([])
      .exit()
      .remove();
};


/*
* Draw a default subgraph for all municipalities(시/군/구)
*/
var subDebtGraph = d3.select("#municipal-debt .subgraph").append("svg")
    .attr("width", graph.width)
    .attr("height", graph.height+(graph.margin.top))
  .append("g")
    .attr("transform", "translate(" + graph.margin.left*1.5 + "," + graph.margin.top + ")")
  .call(tipOnDebtGraph);

subDebtGraph.append("g")
    .attr("class", "y axis")
//
// subDebtGraph.append("text")
//   .attr("x", 190)
//   .attr("y", 0 - (graph.margin.top / 1.5))
//   .attr("text-anchor", "middle")
//   .attr("class", "graph-title")
//   .text("2009년 이후 시/군/구 별 채무 현황?")

var subEffortGraph = d3.select("#municipal-effort .subgraph").append("svg")
    .attr("width", graph.width)
    .attr("height", graph.height + (graph.margin.top) + 30)
  .append("g")
    .attr("transform", "translate(" + graph.margin.left + "," + graph.margin.top + ")")

subEffortGraph.append("g")
    .attr("class", "y axis");




// subEffortGraph.append("text")
//   .attr("x", 190)
//   .attr("y", 0 - (graph.margin.top / 1.5))
//   .attr("text-anchor", "middle")
//   .attr("class", "effort-graph-title")
//   .text("2013년 시/군/구 별 노력도")

d3.select(".subgraph-guide")
  .html(function () {
    return "<img src='/img/pin.png'>";
  });


/*
/* Draw a default main fixed graph for main municipality(본청)
*/

var fixedDebtGraph = d3.select("#debt .main-graph-fixed").append("svg")
  .attr("width", graph.width*2)
  .attr("height", graph.height*1.5)
  .append("g")
    .attr("transform", "translate(30," + graph.margin.top*2 + ")")
  .call(tipOnDebtGraph);

fixedDebtGraph.append("g")
  .attr("class", "y axis");

// xAxis for a fixed graph of main-municipality
var xMain = d3.scale.ordinal()
    .rangeRoundBands([0, graph.width*2], .2);

d3.select('#main-municipality .title')
  .html(function () {
    return "<span>" + data[0].name + "</span>의 채무는?";
  });

d3.selectAll('.main-description')
  .html(function () {
    return "그래프에 마우스를 가져가면 더 자세한 정보를 보실 수 있습니다.";
  });


var fixedEffortGraph = d3.select("#effort .main-graph-fixed").append("svg")
  .attr("width", graph.width*2)
  .attr("height", graph.height*1.5)
  .append("g")
    .attr("transform", "translate(30," + graph.margin.top*2 + ")")
  .call(tipOnDebtGraph);

fixedEffortGraph.append("g")
  .attr("class", "y axis");


/*
* Configurations for drawing a map
*/

var map = {};

map.width = 600;
map.height = 700;

var colorScale = ["#fff5f0","#fee0d2","#fcbba1","#fc9272","#fb6a4a","#ef3b2c","#cb181d","#a50f15","#67000d"];

var quantize = function quantize(d) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].code == d.properties.code) {
      return colorScale[Math.floor(data[i].value/10)];
    }
  }
};

/**
* Manipulate the scale of each provinces
*/
var getMapSizeByProvince = function getMapSizeByProvince(id, w, h) {
  switch (Number(id)) {
    case 11:
      return {
        "scale": 82500,
        "translate": [w*2.9, h*4.6]
      };
      break;
    case 21:
      return {
        "scale": 89500,
        "translate": [-1300, -1200]
      };
      break;
    case 22:
      return {
        "scale": 69500,
        "translate": [-400, h/5]
      };
      break;
    case 23:
      return {
        "scale": 39500,
        "translate": [w*2.3, h*2.3]
      };
      break;
    case 24:
      return {
        "scale": 92500,
        "translate": [w*3.55, -1200]
      };
      break;
    case 25:
      return {
        "scale": 89500,
        "translate": [w*2, h*1.6]
      };
      break;
    case 26:
      return {
        "scale": 63500,
        "translate": [-1100, -250]
      };
      break;
    case 31:
      return {
        "scale": 23500,
        "translate": [w, h*1.6]
      };
      break;
    case 32:
      return {
        "scale": 17500,
        "translate": [w/3, h*1.5]
      };
      break;
    case 33:
      return {
        "scale": 24500,
        "translate": [w/1.7, h]
      };
      break;
    case 34:
      return {
        "scale": 24500,
        "translate": [w*1.3, h/1.2]
      };
      break;
    case 35:
      return {
        "scale": 22500,
        "translate": [w, h/4]
      };
      break;
    case 36:
      return {
        "scale": 16500,
        "translate": [w, -100]
      };
      break;
    case 37:
      return {
        "scale": 19500,
        "translate": [w/13, h/1.5]
      };
      break;
    case 38:
      return {
        "scale": 23500,
        "translate": [100, -50]
      };
      break;
    case 39:
      return {
        "scale": 33500,
        "translate": [w*1.9, -1500]
      };
      break;
    default:
      return {
        "scale": 9500,
        "translate": [w/2, h/2]
      };
  }
};

var proj = d3.geo.mercator()
  .center([128.0, 35.9])
  .translate(300,100)
  .scale(getMapSizeByProvince(provinceId, map.width, map.height).scale)
  .translate(getMapSizeByProvince(provinceId, map.width, map.height).translate);

var path = d3.geo.path().projection(proj);

var map = d3.select("#municipalities .map").append("svg")
  .attr("width", map.width)
  .attr("height", map.height);

d3.json("/map/skorea-municipalities-topo.json", function(error, kor) {

  var municipality = {};
  var municipalityMain = [];
  var provinces = topojson.object(kor, kor.objects['skorea-municipalities-geo']);
  var municipalities = provinces.geometries.filter(function (el) {
    return el.properties.ID_1 == provinceId;
  });

  /**
  * filtering the selected municipality
  */
  data.forEach(function (el) {
    if (municipality.hasOwnProperty(el.name.slice(2, -1))) municipality[el.name.slice(2, -1)].push(el);
    else {
      municipality[el.name.slice(2, -1)] = [];
      municipality[el.name.slice(2, -1)].push(el);
    }

    if (el.name.slice(-2) == "본청")  municipalityMain.push(el);
  });

  // Draw a map using data
  map.selectAll("path")
    .data(municipalities)
  .enter().append("path")
    .attr("class", "province")
    .attr("fill", "#E4DED2")
    .attr("cursor", "pointer")
    .attr("stroke", "#AFA590")
    .attr("stroke-dasharray", [2,2])
    .attr("stroke-width", 1.1)
    .attr("d", path)
    .call(tipOnMap)
    .on("mouseover", tipOnMap.show)
    .on("mouseout", tipOnMap.hide)
    .on("click", function (d) {
      // hiding subgraph-loading div
      d3.select('.subgraph-loading')
        .style('display', 'none');

      d3.select('.graph > ul.nav.nav-tabs > li:first-child')
        .attr('class', 'active');

      d3.select('.graph > ul.nav.nav-tabs > li:last-child')
        .attr('class', '');

      d3.select('.graph > .tab-content > .tab-pane:first-child')
        .attr('class', 'tab-pane fade in active');

      d3.select('.graph > .tab-content > .tab-pane:last-child')
        .attr('class', 'tab-pane fade');


      // Change the color of selected region
      d3.select(".province-selected")
        .attr("class", "province");
      d3.select(this)
        .attr("class", "province province-selected");

      d3.select(".subgraph-guide")
        .html(function () {
          return "";
        });

      // initialize description section of the subgraph
      d3.select(".subgraph-info .description")
      .html(function () {
        return "마우스를 그래프에 올리면 더 자세한 정보를 볼 수 있습니다.";
      });

      subDebtGraph.select(".subgraph-guide")
      .text("");

      // removed the previous subgraph and redraw a graph of selected region
      removeDebtGraph(subDebtGraph);
      drawDebtGraph(subDebtGraph, municipality[d.properties.NAME_2], graph.x);

      // add an event for the subgraph
      subDebtGraph.selectAll(".bar")
        .on("mouseover", function (d) {
          d3.select("#municipal-debt .subgraph-info .description")
          .html(function () {
            return d.year + "년 예산 대비 채무 비율은 <span>" + d.ratio + "%</span>입니다.<br>예산은 <span>" + d.budget + "백만원</span>이며<br>채무는 <span>" + d.remain + "백만원</span>입니다.";
          });
        });

      var selectedMunicipality = efforts.municipality.filter(function (el) {
        return el.name.substring(3, 3 + d.properties.NAME_2.length) == d.properties.NAME_2;
      });

      effortsMunicipality.forEach(function (el) {
        el.value = Number(selectedMunicipality[0][el.title]);
      });

      removeDebtGraph(subEffortGraph);
      drawEffortGraph(subEffortGraph, effortsMunicipality, graph.xSubEffort, graph.ySubEffort);
      subEffortGraph.selectAll('.bar')
        .on('mouseover', function (d) {
          d3.select('#municipal-effort .subgraph-info .icon img')
            .attr('src', '/img/effort/' + d.id + '.png');

          d3.select("#municipal-effort .subgraph-info .description")
            .html(function () {
              return "<strong>" + d.title + "</strong>란?<br><p>" + d.desc + "</p>";
            });
        });

    });

  map.selectAll("text")
    .data(municipalities)
    .enter().append("text")
      .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .attr("fill", "#949086")
      .text(function(d) { return d.properties.NAME_2 + d.properties.TYPE_2; });


  d3.csv('/data/effort_provinces.csv', function (result) {
    efforts.province = result.filter(function (el) {
      return (Number(el.code) === provinceId && el.cat === 'province');
    });

    efforts.municipality = result.filter(function (el) {
      return (Number(el.code) === provinceId && el.cat === 'municipality');
    });

    effortProvince.forEach(function (el) {
      el.value = Number(efforts.province[0][el.title]);
    });

    drawEffortGraph(fixedEffortGraph, effortProvince, graph.xEffort, graph.yEffort);
    fixedEffortGraph.selectAll(".bar")
      .on("mouseover", function (d) {
        d3.select("#effort .main-graph-fixed .main-description")
          .html(function () {
            return d.title + "는  <span class=''>" + d.value + "</span>입니다.<br><span style='font-size: 1rem;'>*" + d.title + "란?<br> " + d.desc + "</span>";
          })
      });
  });


  /**
  * Draw a fixed graph of main-municipality using data(본청 그래프)
  */
  d3.selectAll(".link-to-maingraph")
    .text(function () { return data[0].name + "의 채무는?"});

  d3.selectAll(".link-current")
    .html(function () { return " - " + data[0].name.slice(0, 2);});

  drawDebtGraph(fixedDebtGraph, municipalityMain, xMain);

  fixedDebtGraph.selectAll(".bar")
    .on("mouseover", function (d) {
      d3.select("#debt .main-graph-fixed .main-description")
        .html(function () {
          return d.year + "년 예산 대비 채무 비율은 <span class=''>" + d.ratio + "%</span>입니다. 예산은 <span>" + d.budget + "백만원</span>이며 채무는 <span>" + d.remain + "백만원</span>입니다.";
        });
    });
});

$(".link-to-maingraph").click(function (d) {
  $('html,body').animate({scrollTop: $('#main-municipality').position().top}, 500);
  return false;
});
