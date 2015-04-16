d3.csv('/data/effort.csv', function (efforts) {
  var data = efforts.filter(function (el) {
    return (Number(el.code) === provinceId);
  });

  var effort = [
    { 'title': '지방세 징수율 제고 노력도', 'desc': '지방세 징수율의 연도간(또는 중.장기 추세) 변화 정도를 파악할 수 있는 지표로 비율이 높을수록 징수노력이 높은 것을 의미' },
    { 'title': '지방세 체납액 축소 노력도', 'desc': '지방세 체납액의 연도별 변화 정도를 파악할 수 있는 지표로 체납액이 감소할수록 체납 지방세 관리 및 축소 노력이 높은 것을 의미' },
    { 'title': '경상세외 수입 확충 노력도', 'desc': '경상세외수입 확충의 성과를 파악할 수 있는 지표로, 지표값이 높을수록 경상세외수입 확충을 위한 자구노력 수준이 높은 것을 의미'},
    { 'title': '세외수입 체납액 확충 노력도', 'desc': '세외수입 체납액의 연도별 변화 정도를 파악할 수 있는 지표로 체납액이 감소할수록 체납 세외수입 관리 및 축소 노력이 높은 것을 의미'},
    { 'title': '탄력세율 적용 노력도', 'desc': '자치단체가 탄력세율을 활용하여 지방세를 추가로 확보할수록 자치단체의 세입확충 노력이 높은 것을 의미하고, 반대로 탄력세율을 활용하여 지방세가 감소한 경우 자치단체의 세입확충 노력이 낮은 것을 의미' },
    { 'title': '인건비 절감 노력도', 'desc': '자치단체의 예산절감 노력을 판단할 수 있는 지표로 총액인건비 기준액보다 실제 결산상 지출된 인건비가 적을수록 예산절감 노력이 높은 것으로 분석' },
    { 'title': '지방의회 경비 절감 노력도', 'desc': '자치단체가 지방의회를 운영하는데 소요되는 경비를 얼마나 절감하였는지를 판단 하는 지표로 지표값이 클수록 의회경비 절감노력이 높은 것을 의미' },
    { 'title': '업무 추진비 절감 노력도', 'desc': '총 예산 중 행사축제경비의 비중이 감소할수록 자치단체의 재정운영 절감노력이 높은 것으로 판단' },
    { 'title': '행사 축제 경비 절감 노력도', 'desc': '총 예산 중 민간이전경비의 비중이 감소할수록 자치단체의 재정운영 절감노력이 높은 것으로 판단' }
  ];

  effort.forEach(function (el) {
    el.value = Number(data[0][el.title]);
  });

  effort.sort(function (a, b) {
    return b.value - a.value;
  });

  var avgData = effort.reduce(function (a, b) {
    return a + b.value;
  }, 0)/effort.length;

  var margin = {top: 100, right: 110, bottom: 30, left: 50},
    width = graph.width*2,
    height = 300;

  var x = d3.scale.linear()
      .range([0, width - margin.left*1.5])

  var y = d3.scale.ordinal()
      .rangeRoundBands([0, height], .2);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("top");

  var fixedEffortGraph = d3.select('#effort .main-graph-fixed').append('svg')
      .attr('width', width)
      .attr('height', height+(margin.top))
      .style('background-color', '#6593B8')
    .append('g')
      .attr('transform', "translate(" + margin.left/1.5 + "," + margin.top/2 + ")");

  x.domain(d3.extent(effort, function(d) { return d.value; })).nice();
  y.domain(effort.map(function(d) { return d.title; }));
  x.domain([-(effort[0].value + 0.5), effort[0].value + 0.5]);

  var count = effort.length;

  fixedEffortGraph.selectAll('.bar')
    .data(effort)
    .enter().append('rect')
      .attr('class', function (d) {
        return (d.value >= 0 ? 'bar bar-positive' : 'bar bar-negative')})
      .attr('x', function(d) { return x(0); })
      .attr('y', function(d) { return y(d.title); })
      .attr('width', function(d) { return 0; })
      .attr('height', 20)
      .transition().duration(1000)
        // .attr("x", function (d) { return w - })
        .attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
        .attr("x", function (d) { return (d.value < 0) ? x(d.value) : x(0)})


  fixedEffortGraph.selectAll('bar')
    .data(effort)
    .enter().append('rect')
      .attr('x', function(d) { return -90; })
      .attr('y', function (d) { return y(d.title)-5; })
      // .attr("class", function (d) { return "bar-highlight " + d.code; })
      .attr('width', function(d) { return 380; })
      .attr('height', 30)
      .style('opacity', 0.3)
      .style('visibility', 'hidden')

  fixedEffortGraph.selectAll('bar')
    .data(effort)
    .enter().append('text')
      .attr('x', function(d) { return (d.value >= 0) ? x(-0.7) : x(0.1); })
      .attr('y', function (d) { return y(d.title) + 15; })
      .attr('class', 'effort-title')
      .text(function(d) { return d.title; });

  fixedEffortGraph.selectAll('bar')
    .data(effort)
    .enter().append('text')
      .attr('x', function(d) { return (d.value >= 0) ? x(d.value + 0.1) : x(d.value - 0.3); })
      .attr('y', function (d) { return y(d.title) + 20; })
      .text(function(d) { return d.value; });



  fixedEffortGraph.append('g')
      .attr('class', 'x axis')
      .call(xAxis);

  var yAxis = fixedEffortGraph.append('g')
    .attr('class', 'y axis');

  yAxis
  .append('line')
    .attr('x1', x(0))
    .attr('x2', x(0))
    .attr('y2', height)
    .style('stroke', '#C4C4C4');

  fixedEffortGraph.selectAll(".bar")
    .on("mouseover", function (d) {
      d3.select("#effort .main-graph-fixed .main-description")
        .html(function () {
          return d.title + "는  <span class=''>" + d.value + "</span>입니다.<br><span style='font-size: 1rem;'>*" + d.title + "란?<br> " + d.desc + "</span>";
        })
    });
});
