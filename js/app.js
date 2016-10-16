'use strict';

L.mapbox.accessToken = 'pk.eyJ1IjoidGJhdWVyNTE2IiwiYSI6ImNpdWMxZG90YzAwNnozM21wNW5tNm9tcnMifQ.vQdMiqihNXuWVh1-AfH1bA';

var rawData = {};

if (false) {
$.ajax({
    url: 'https://data.seattle.gov/resource/y7pv-r3kh.json',
    type: 'GET',
    data: {
      '$limit' : 5000,
      '$$app_token' : 'dAJlwethWVOUY6uwgpnHM1ujJ'
    }
}).then(function(data) {
	console.log(data);
	rawData = data;
	drawMap(data);
});
}

var drawMap = function(data) {
	var chart = d3.select('#chart1');
	var chartx = parseFloat(chart.style('width'));
	chart.style('height', Math.min(chartx, parseInt($(window).height()) - 100) + 'px');
	var charty = parseFloat(chart.style('height'));

	var svg = d3.select(map.getPanes().overlayPane).append('svg')
    	.attr('class', 'leaflet-zoom-animated')
		.attr('id', '#svg1')
		.style('width', parseInt(chartx) + 'px')
		.style('height', parseInt(charty) + 'px');

	var g = svg.append("g").attr("class", "leaflet-zoom-hide");

	var xscale = d3.scaleLinear()
		.domain([-122.460195, -122.210256])//.domain([-180, 180])
		.range([0, chartx]);

	var yscale = d3.scaleLinear()
		.domain([47.497060, 47.735434])//.domain([-90, 90])
		.range([charty, 0]);

	// Update…
	var circle = g
		.selectAll('circle')
		.data(data)
		.attr('cx', function(d) {
			return xscale(d.longitude);
		})
		.attr('cy', function(d) {
			return yscale(d.latitude);
		});

	// Enter…
	circle.enter()
		.append('circle')
		.attr('cx', function(d) {
			return xscale(d.longitude);
		})
		.attr('cy', function(d) {
			return yscale(d.latitude);
		})
		.attr('r', 5)
		.style('fill', 'black');

	// Exit…
	circle.exit()
		.remove();
}

var testData = [
	{'latitude': 47.6062,
	'longitude': -122.3321}
];

console.log(testData);

var map = L.mapbox.map('chart1', 'mapbox.streets')
	.setView([47.606558, -122.319588], 10);

drawMap(testData);

// EXAMPLE BELOW

// // Map details
// L.mapbox.accessToken = 'pk.eyJ1Ijoic3RlbmluamEiLCJhIjoiSjg5eTMtcyJ9.g_O2emQF6X9RV69ibEsaIw';
// var map = L.mapbox.map('map', 'mapbox.streets').setView([53.4072, -2.9821], 14);

// // Sample Data
// var data = [
//     {"coords": [53.3942, -2.9785]}, 
//     {"coords": [53.4082, -2.9837]}
// ];

// // Loop through data and create d.LatLng 
// data.forEach(function(d) {
//     d.LatLng = new L.LatLng(d.coords[0], d.coords[1]);
//     map.addLayer(L.circle([d.coords[0], d.coords[1]], 500));
// });

// // Append <svg> to #map
// var svg = d3.select(map.getPanes().overlayPane).append("svg")
//     .attr("class", "leaflet-zoom-animated")
//     .attr("width", window.innerWidth)
//     .attr("height", window.innerHeight);

// // Append <g> to <svg>
// var g = svg.append("g").attr("class", "leaflet-zoom-hide");

// // Append <circle> to <g>
// var circles = g.selectAll("circle")
//     .data(data)
//     .enter()
//   .append("circle")
//     .style("fill", "rgba(255, 255, 255, .5)");

// circles.on("mouseenter", function() { return d3.select(this).style("opacity", "0"); });
// circles.on("mouseleave", function() { return d3.select(this).style("opacity", "1"); });

// function update() {
//     translateSVG()
//     circles.attr("cx", function(d) { return map.latLngToLayerPoint(d.LatLng).x; })
//     circles.attr("cy", function(d) { return map.latLngToLayerPoint(d.LatLng).y; })
//     circles.attr("r", function(d) { return 0.005 * Math.pow(2, map.getZoom()); })
// }

// // Adjust the circles when the map is moved
// function translateSVG() {
//     var viewBoxLeft = document.querySelector("svg.leaflet-zoom-animated").viewBox.animVal.x;
//     var viewBoxTop = document.querySelector("svg.leaflet-zoom-animated").viewBox.animVal.y;
//     // Reszing width and height incase of window resize
//     svg.attr("width", window.innerWidth)
//     svg.attr("height", window.innerHeight)
//       // Adding the ViewBox attribute to our SVG to contain it
//     svg.attr("viewBox", function() {
//       return "" + viewBoxLeft + " " + viewBoxTop + " " + window.innerWidth + " " + window.innerHeight;
//     });
//     // Adding the style attribute to our SVG to transkate it
//     svg.attr("style", function() {
//       return "transform: translate3d(" + viewBoxLeft + "px, " + viewBoxTop + "px, 0px);";
//     });
// }

// // Re-draw on reset, this keeps the markers where they should be on reset/zoom
// map.on("moveend", update);
// update();