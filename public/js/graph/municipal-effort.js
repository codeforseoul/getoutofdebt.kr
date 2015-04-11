$(document).ready(function () {
  
  var data = [
    {code: 23, name: "지방세체납액 축소", value: 1},
    {code: 29, name: "세외수입체납액 축소", value: 1},
    {code: 32, name: "인건비 절감", value: 1},
    {code: 33, name: "지방의회경비 절감", value: 1.2323},
    {code: 34, name: "업무추진비 절감", value: -2.123},
    {code: 37, name: "행사축제경비 절감", value: 2.123},
    {code: 38, name: "민간이전경비 절감", value: -1.23}].sort(function (a, b) {
    return b.value - a.value;
  });

  var avgData = data.reduce(function (a, b) {
    return a + b.value;
  }, 0)/data.length;


  var margin = {top: 100, right: 110, bottom: 30, left: 50},
    width = 410,
    height = 280;

  var x = d3.scale.linear()
      .range([0, width - margin.left*1.5])

  var y = d3.scale.ordinal()
      .rangeRoundBands([0, height], .2);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("top");

  var svgGraph = d3.select("#municipal-effort").append("svg")
      .attr("width", width)
      .attr("height", height+(margin.top))
      .style("background-color", "white")
    .append("g")
      .attr("transform", "translate(" + margin.left/1.5 + "," + margin.top + ")");

  
  svgGraph.append("text")
    .attr("x", margin.left*3)
    .attr("y", 0 - (margin.top / 1.5))
    .attr("text-anchor", "middle")  
    .style("font-size", "20px") 
    .style("font-weight", "bold")
    .style("text-decoration", "underline")  
    .text("채무를 줄이기 위해 얼만큼 노력을 할까?");

  svgGraph.append("text")
    .attr("x", margin.left/2)
    .attr("y", 0 - (margin.top/2.5))
    .attr("text-anchor", "middle")
    .attr("fill", "#B3B3B3")
    .style("font-size", "13px")
    .text("(2013년)");

  x.domain(d3.extent(data, function(d) { return d.value; })).nice();
  y.domain(data.map(function(d) { return d.name; }));
  x.domain([-(data[0].value + 0.5), data[0].value + 0.5]);

  var count = data.length;

  svgGraph.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", function (d) { return (d.value < 0 ? "bar bar-positive" : "bar bar-negative")})
      .attr("x", function(d) { return x(0); })
      .attr("y", function(d) { return y(d.name); })
      .attr("width", function(d) { return 0; })
      .attr("height", 15)
      .transition().duration(3000)
        // .attr("x", function (d) { return w - })
        .attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
        .attr("x", function (d) { return (d.value < 0) ? x(d.value) : x(0)})
        
      
      // .each("end", function () {
      //   count--;

      //   if (count == 0) {
      //     svgGraph.selectAll(".bar-additional")
      //     .data(data)
      //     .enter().append("rect")
      //       .attr("class", "bar-additional")
      //       .attr("x", function(d) { return d.value < avgData ? 0 : x(avgData); })
      //       .attr("y", function(d) { return y(d.name); })
      //       .attr("width", function(d) { return 0; })
      //       .attr("height", 15)
      //     .transition().duration(1000)
      //       .attr("width", function(d) { return x(d.value - avgData); })
      //   }
      // })


  svgGraph.selectAll("bar")
    .data(data)
    .enter().append("rect")
      .attr("x", function(d) { return -90; })
      .attr("y", function (d) { return y(d.name)-5; })
      .attr("class", function (d) { return "bar-highlight " + d.code; })
      .attr("width", function(d) { return 380; })
      .attr("height", 30)
      .style("opacity", 0.3)
      .style("visibility", "hidden")

  svgGraph.selectAll("bar")
    .data(data)
    .enter().append("text")
      .attr("x", function(d) { return (d.value >= 0) ? x(-1.7) : x(0.3); })
      .attr("y", function (d) { return y(d.name) + 15; })
      .style("font-size", "11px")
      .style("font-weight", "bold")
      .text(function(d) { return d.name; })

  svgGraph.selectAll("bar")
    .data(data)
    .enter().append("text")
      .attr("x", function(d) { return (d.value >= 0) ? x(d.value + 0.1) : x(d.value - 0.6); })
      .attr("y", function (d) { return y(d.name) + 10; })
      .text(function(d) { return d.value; })



  svgGraph.append("g")
      .attr("class", "x axis")
      .call(xAxis);

  var yAxis = svgGraph.append("g")
    .attr("class", "y axis")
    

  yAxis
  .append("line")
    .attr("x1", x(0))
    .attr("x2", x(0))
    .attr("y2", height)
    .style("stroke", "#C4C4C4")




  function type(d) {
    d.value = +d.value;
    return d;
  }
})