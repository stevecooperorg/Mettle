//transmission.js
"use strict";
(function(transmission){


// need a lib for shortest path;
//   https://github.com/nanodeath/CrowLib#readme
//   https://github.com/fkling/JSNetworkX
	transmission.Calculator = function() {

	};
	transmission.Calculator.prototype.transmit = function(skills) {
		var i,len, skill;

		for(i = 0, len=skills.length; i < len; i++){
			skils[i].pointsSpilled = 0;
		}

		// how mcuh is an edge?
		var cost = function(edge) {
			return 11 - edge.distance;
		};

		// how many points are spilled over?
		var contribute = function(distance, points) {
			return 1 / (distance * distance) * points;
		};

		for(i = 0, len=skills.length; i < len; i++){
			skill = skils[i];
		}
	};

	/**

	// clear all existing;
			skills.ForEach(s => s.PointsSpilled = 0);

			var g = skills.ToQuickGraph();

			// how mcuh is an edge?
			Func<SkillEdge, double> cost = edge=>(11-edge.Distance);

			// how many points are spilled over?
			Func<double, int, double> contribute = (dist, pts) => 1 / (dist * dist) * pts;

			foreach(var skill in skills)
			{
				var tryGetPaths= g.ShortestPathsDijkstra(cost, skill);
				foreach(var target in skills)
				{
					IEnumerable<SkillEdge> path;
					if (tryGetPaths(target, out path))
					{
						var transmissionFraction = path.Select(p=>p.Distance).Aggregate(1.0d, (d1,d2) => d1*d2/10.0d);
						var contribution = transmissionFraction * skill.PointsSpent;
						Debug.WriteLine(skill.Name + " at " + skill.PointsSpent + " to " + target.Name + " spills " + contribution );
						target.PointsSpilled += contribution;
					}
				}
			}

	**/

})(typeof exports === 'undefined'? this['transmission']={}: transmission);
