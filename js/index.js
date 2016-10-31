var dataURL = "https://raw.githubusercontent.com/Aeternia-ua/WebGenresForceDirectedGraph/gh-pages/graph.json";

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

//TO-DO make svg responsive
d3.select("div#chartId")
    .append("div")
    .classed("svg-container", true) //container class to make  responsive svg
    .append("svg")
    //responsive SVG needs these 2 attributes and no width and height attr
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 600 400")
    //class to make it responsive
    .classed("svg-content-responsive", true);


var color = d3.scaleOrdinal(d3.schemeCategory20c);
var nodeRadius = 20;

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) {
        return d.id;
    }).distance(80))
    .force("charge", d3.forceManyBody().strength(-50))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide().radius(function(d) {
        return nodeRadius + 0.5; }).iterations(4))


d3.json(dataURL, function(error, graph) {
    if (error) throw error;

    simulation.nodes(graph.nodes);
    simulation.force("link").links(graph.links);

    var link = svg.append("g")
        .attr("class", "link")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line");

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")

    //Setting node radius by group value. If 'group' key doesn't exist, set radius to 9
    .attr("r", function(d) {
            if (d.hasOwnProperty('group')) {
                return d.group * 2;
            } else {
                return 9;
            }
        })
        //Colors by 'group' value
        .style("fill", function(d) {
            return color(d.group);
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node.append("svg:title")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(function(d) {
            return d.id
        });

    var labels = svg.append("g")
        .attr("class", "label")
        .selectAll("text")
        .data(graph.nodes)
        .enter().append("text")
        .attr("dx", 6)
        .attr("dy", ".35em")
        .style("font-size", 10)
        .text(function(d) {
            return d.id
        });
  

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);
  
  function ticked() {

    link.attr("x1", function(d) {
            return d.source.x;
        })
        .attr("y1", function(d) {
            return d.source.y;
        })
        .attr("x2", function(d) {
            return d.target.x;
        })
        .attr("y2", function(d) {
            return d.target.y;
        });

    node
        .attr("cx", function(d) {
            return d.x;
        })
        .attr("cy", function(d) {
            return d.y;
        });
    labels
        .attr("x", function(d) {
            return d.x;
        })
        .attr("y", function(d) {
            return d.y;
        }); 
}
 
});

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
