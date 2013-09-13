var mettle = mettle || {};
mettle.characterDesigner = function() { 
};

mettle.characterDesigner.prototype.draw = function(data, selector) {
	

	var width = 600,
		height =width,
		linkDistance = width * 0.05,
		charge = -width * 0.9,
		owningDiv = d3.select(selector)
		;


    var sankey = d3.sankey();
	data = this.translateData(data, 'name', 'source', 'destination');

    console.log("data", data, "selector", selector);
	var force = d3.layout.force()
		.nodes(data.skills)
		.links(data.links)
		.size([width,height])
		.charge(charge)
		.linkDistance(linkDistance)
		.start();

	var svg = owningDiv
		.append("svg")
			.attr("width", width)
			.attr("height", height);


	var links = svg
		.selectAll('line.link')
		.data(data.links)
		.enter()
		.insert("line")
      		.classed('link', true);

	var nodes = svg
		.selectAll('g.node')
		.data(data.skills)
		.enter()
		.append('g')
			.classed('node', true);

	var nodeBoxes = nodes
		.append('rect')
			 .attr('width', 120)
			 .attr('height', 20)
			;

	var nodeText = nodes
			.append('text')
				.text(function(d) { return d.name; })
				.attr('y', 10);


	force.on("tick", function(){
		nodes
			.attr("transform", function(d) { 

				return "translate(" + d.x + " " + d.y + ")"; 
			});

		links
		 .attr("x1", function(d) { return d.source.x; })
      			.attr("y1", function(d) { return d.source.y; })
      			.attr("x2", function(d) { return d.target.x; })
      			.attr("y2", function(d) { return d.target.y; })
      			.attr("stroke-width", function(d) { return d.strength; });
	})
};

mettle.characterDesigner.prototype.translateData = function(data, idPropertyName, sourcePropertyName, targetPropertyName) {
	var nodeDictionary = {},
		result = {
			skills: data.skills,
			links: []
		},
		linkIndex,
		nodeIndex,
		id,
		skill;

	for(nodeIndex = 0; nodeIndex < data.skills.length; nodeIndex++) {
		skill = data.skills[nodeIndex];
		id = skill[idPropertyName];
		nodeDictionary[id] = skill;
	}

	if (data.links) {
		for(linkIndex = 0; linkIndex < data.links.length; linkIndex++) {
			(function(){
				var original = data.links[linkIndex];
				var sourceId = original[sourcePropertyName];
				var targetId = original[targetPropertyName];
				var sourceNode = nodeDictionary[sourceId];
				var targetNode = nodeDictionary[targetId];
				if (!sourceNode) { 
					throw "missing source node with id " + sourceId;
				}

				if (!targetNode) {
					throw "missing target node with id " + targetId;
				}
				link = { source: sourceNode, target: targetNode, strength: original.strength};
				result.links.push(link);
			})();
		}
	}

	return result;
};