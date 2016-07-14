window.onload = function(){
  function color(d){
    return d.color;
  }
  function radius(d){
    return d.r + "px";
  }
  function cx(d){
    return d.cx + "px";
  }
  function changeColor(d){
    return "blue";
  }

  function zoomed(){
    svgMap.select('path')
          .attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')' );
  }

  // ADD THE attributesEnter HERE!
  var attributesEnter = [{color: 'red', r: 40, cx: 100},  //example line
                  {color: 'green', r: 10, cx:95},
                  {color: 'blue', r: 30, cx:90},
                  {color: 'yellow', r: 50, cx:80}];

  var zoom = d3.behavior.zoom()
                      .scaleExtent([1, 5])
                      .on("zoom", zoomed);

  var svgCircles = d3.select("svg.circles");
  var svgMap = d3.select("svg.map").call(zoom);

  var circles = svgCircles.selectAll('circle')
                          .data(attributesEnter)
                          .enter()
                          .append("circle")
                          .attr('fill', color)
                          .attr('r', radius)
                          .attr('cx', cx)
                          .attr('cy', '50px');

  // ADD THE attributesExit HERE! Remember to repeat at least one of the elements of attributesEnter
  var attributesExit = [{color: 'red', r: 40, cx: 100}];;

  svgCircles.selectAll('circle')
              .data(attributesExit)
              .exit()
              .attr("fill", changeColor);

              d3.json("usa.json", function(error, usa) {
                  if (error) return console.error(error);

                  var scale = 800;  // around 800 should be fine
                  var center = [37.0902, 95.7129];
                  var zoomOffset = 1600;  // the amount the zoom center should deviate from the map's center

                  zoom.center(center.map(function(el){return el + zoomOffset;}));

                  var usaObject = usa.objects.layer1;
                  var topoUsaFeatures = topojson.feature(usa, usaObject);

                  var projectionLittle = d3.geo.mercator()
                                              .scale(scale)
                                              .center(center);

                  var path = d3.geo.path()
                                    .projection(projectionLittle);
                                    svgMap.append("path")
                                    .datum(topoUsaFeatures)
                                    .attr("d", path);
                  });
};
