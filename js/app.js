'use strict';


var chart = $('#chart1');
chart.height($(window).height() - 100);

mapboxgl.accessToken = 'pk.eyJ1IjoidGJhdWVyNTE2IiwiYSI6ImNpdWMxZG90YzAwNnozM21wNW5tNm9tcnMifQ.vQdMiqihNXuWVh1-AfH1bA';

var map = new mapboxgl.Map({
	container: 'chart1',
	style: 'mapbox://styles/tbauer516/ciuc51z1o002q2ho8tsj61yrv',
	center: [-122.319588, 47.606558],
	zoom: 9.5
});

// map.dragPan.disable();
// map.scrollZoom.disable();
// map.dragRotate.disable();

var minZoom = 9.5;
var maxZoom = 13.5;
map.setMinZoom(minZoom);
map.setMaxZoom(maxZoom);

map.setMaxBounds(
[
[-123.450218, 47.148122],
[-121.268809, 48.080690]
]
);

var rawData = {};


if (true) {
$.ajax({
    // url: 'https://data.seattle.gov/resource/y7pv-r3kh.json', //police reports
    // url: 'https://data.seattle.gov/resource/pu5n-trf4.json', // 911 calls
    url: 'https://data.seattle.gov/resource/grwu-wqtk.json', // real time firedep calls
    type: 'GET',
    data: {
      '$limit' : 500,
      '$$app_token' : 'dAJlwethWVOUY6uwgpnHM1ujJ'
    }
}).then(function(data) {
	// console.log(data);
	rawData = data;
	drawMap(data);
});
}

var drawMap = function(data) {

	for (var i = data.length - 1; i >= 0; i--) {
		if (data[i].longitude == undefined || data[i].latitude == undefined) {
			// console.log(i);
			data.splice(i, 1);
		}
		// console.log(data[i].longitude);
	}

	var variableName = 'datetime';

	var earliest = d3.min(data, function(d) {
		return new Date(d[variableName]).getTime();
	});
	var latest = d3.max(data, function(d) {
		return new Date(d[variableName]).getTime();
	});

	var timeScale = d3.scaleLinear()
		.domain([earliest, latest])
		.range([0, 1]);
		//.range([210, 0]);
		// .range([190, 359]);

	var zoomScale = d3.scaleLinear()
		.domain([minZoom, maxZoom])
		.range([3, 9]);

	var pitchScale = d3.scaleLinear()
		.domain([0, 60])
		.range([1, 0.34]);

	// for (var i = 0; i < data.length; i++) {
	// 	console.log(timeScale(new Date(data[i][variableName]).getTime()));
	// }
	

	var chart = d3.select('#chart1');
	var chartx = parseFloat(chart.style('width'));
	// chart.style('height', Math.min(chartx, parseInt($(window).height()) - 100) + 'px');
	var charty = parseFloat(chart.style('height'));

	var container = map.getCanvasContainer();

	var svg = d3.select(container).append('svg')
    	// .attr('class', 'leaflet-zoom-animated')
		.attr('id', '#svg1');
		// .style('width', parseInt(chartx) + 'px')
		// .style('height', parseInt(charty) + 'px');

	map.addControl(new mapboxgl.NavigationControl());

	var project = function(d) {
		return map.project(getLL(d));
	}
	var getLL = function(d) {
		return new mapboxgl.LngLat(parseFloat(d.longitude), parseFloat(d.latitude));
	}

	var g = svg.append('g');

	// var xscale = d3.scaleLinear()
	// 	.domain([-122.460195, -122.210256])//.domain([-180, 180])
	// 	.range([0, chartx]);

	// var yscale = d3.scaleLinear()
	// 	.domain([47.497060, 47.735434])//.domain([-90, 90])
	// 	.range([charty, 0]);

	var getColor = function(d) {
		var time = timeScale(new Date(d[variableName]).getTime());
		return d3.interpolateYlOrRd(time);
		// return d3.interpolateWarm(time);
		// return 'hsl(' + time + ', 100%, 50%)';
	}

	// Update…
	var shape = 'ellipse';
	var circles = g.selectAll(shape)
		.data(data);

	// Enter…
	circles.enter()
		.append(shape)
		.style('fill', function(d) {
			return getColor(d);
		})
		.style('fill-opacity', 0.3)
		.style('stroke', function(d) {
			return getColor(d);
		})
		.style('stroke-opacity', 1);

	// Exit…
	circles.exit()
		.remove();

	var render = function() {
		var circles = g.selectAll(shape);
		circles.attr('cx', function(d) {
			var x = project(d).x;
			return x;
		})
		.attr('cy', function(d) {
			var y = project(d).y;
			return y;
		})
		.attr('rx', function(d) {
			var rxScale = zoomScale(map.getZoom());
			return rxScale;
		})
		.attr('ry', function(d) {
			var rxScale = zoomScale(map.getZoom());
			var ryScale = rxScale * pitchScale(map.getPitch());
			return ryScale;
		});
	}

	var clear = function() {
		var circles = g.selectAll(shape);
		circles.attr('cx', 0)
		.attr('cy', 0)
		.attr('rx', 0)
		.attr('ry', 0);
	}

	// map.on('viewreset', function() {
	// 	render();
	// });
	if (data.length > 3000) {
		map.on('movestart', function() {
			clear();
		});
		map.on('moveend', function() {
			render();
		});
	} else {
		map.on('move', function() {
			render();
		});
	}


	render();
}

var testData = [
	{'latitude': 47.6062,
	'longitude': -122.3321},
	{'latitude': 47.6062,
	'longitude': -122.3321}
];

// drawMap(testData);

// EXAMPLE BELOW

// //Setup mapbox-gl map
//     var map = new mapboxgl.Map({
//       container: 'map', // container id
//       style: 'mapbox://styles/enjalot/cihmvv7kg004v91kn22zjptsc',
//       center: [-0.1,51.5119112],
//       zoom: 13.5,
//     })
//     map.dragPan.disable();
//     map.scrollZoom.disable();
    
//     // Setup our svg layer that we can manipulate with d3
//     var container = map.getCanvasContainer()
//     var svg = d3.select(container).append("svg")

//     var active = true;
//     var circleControl = new circleSelector(svg)
//       .projection(project)
//       .inverseProjection(function(a) {
//         return map.unproject({x: a[0], y: a[1]});
//       })
//       .activate(active);
    
//     d3.select("#circle").on("click", function() {
//       active = !active;
//       circleControl.activate(active)
//       if(active) {
//         map.dragPan.disable();
//       } else {
//         map.dragPan.enable();
//       }
//       d3.select(this).classed("active", active)
//     })
    
//     // Add zoom and rotation controls to the map.
//     map.addControl(new mapboxgl.Navigation());
    
//     function project(d) {
//       return map.project(getLL(d));
//     }
//     function getLL(d) {
//       return new mapboxgl.LngLat(+d.lng, +d.lat)
//     }
  
//     d3.csv("dots.csv", function(err, data) {
//       //console.log(data[0], getLL(data[0]), project(data[0]))
//       var dots = svg.selectAll("circle.dot")
//         .data(data)
      
//       dots.enter().append("circle").classed("dot", true)
//       .attr("r", 1)
//       .style({
//         fill: "#0082a3",
//         "fill-opacity": 0.6,
//         stroke: "#004d60",
//         "stroke-width": 1
//       })
//       .transition().duration(1000)
//       .attr("r", 6)

//       circleControl.on("update", function() {
//         svg.selectAll("circle.dot").style({
//           fill: function(d) {
//             var thisDist = circleControl.distance(d);
//             var circleDist = circleControl.distance()
//             if(thisDist < circleDist) {
//               return "#ff8eec";
//             } else {
//               return "#0082a3"
//             }
//           }
//         })
//       })
//       circleControl.on("clear", function() {
//         svg.selectAll("circle.dot").style("fill", "#0082a3")
//       })
      
//       function render() {
//         dots.attr({
//           cx: function(d) { 
//             var x = project(d).x;
//             return x
//           },
//           cy: function(d) { 
//             var y = project(d).y;
//             return y
//           },
//         })
        
//         circleControl.update(svg)
//       }

//       // re-render our visualization whenever the view changes
//       map.on("viewreset", function() {
//         render()
//       })
//       map.on("move", function() {
//         render()
//       })

//       // render our initial visualization
//       render()
//     })