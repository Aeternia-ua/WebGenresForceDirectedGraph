var dataURL = "https://raw.githubusercontent.com/Aeternia-ua/temp1/c50fa778c12c6d355fe08b54cb3f1ce24acfa4e9/graphtest.json";

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

///Setting color scheme
var color = d3.scaleOrdinal(d3.schemeCategory20c);

var simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(-150))
    .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(90))
    .force("x", d3.forceX(width / 2))
    .force("y", d3.forceY(height / 2))
    .on("tick", ticked);

var link = svg.selectAll(".link"),
    node = svg.selectAll(".node");

var tooltip = d3.select("#tooltip").style("opacity", 0);


d3.json(dataURL, function(error, graph) {
  if (error) throw error;

  simulation.nodes(graph.nodes);
  simulation.force("link").links(graph.links);

  link = link
    .data(graph.links)
    .enter().append("line")
      .attr("class", "link");

  //Visualizing nodes
   node = node
    .data(graph.nodes)
    .enter().append("circle")
    .attr("class", "node")

 //Setting node radius by group value. If 'group' key doesn't exist, set radius to 8
	 .attr("r", function(d){
        if(d.hasOwnProperty('group')){
          return d.group * 2;
    } else {
          return 8;
    }
   })

  //Colors by 'group' value
      .attr("fill", function(d) { return color(d.group); })
  
 
  ////SHOWS TOOLTIP ON MOUSE HOVER
//  .on('mouseover', function(d) {
//      tooltip.transition()
//        .duration(100)
//        .style("opacity", 0.8);
//      var tooltipHtml = "<span>" + d.id + "</span>";
//      tooltip.html(tooltipHtml)
//        .style("left", (d3.event.pageX + 5) + "px")
//        .style("top", (d3.event.pageY - 50) + "px");
//    })
//    .on('mouseout', function() {
//      tooltip.transition()
 //       .duration(200)
 //       .style("opacity", 0);
 //   })
  
.call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));
 
  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);
  
});

 ///Placing labels at the nodes
		var nodeName = svg.selectAll(".mytext")
						.data(dataset.nodes)
						.enter()
						.append("text")
					    .text(function (d) { return d.id; })
					    .style("text-anchor", "middle")
					    .style("fill", "#555")
					    .style("font-family", "Arial")
					    .style("font-size", 12); 


function ticked() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
 
  
    }
function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}