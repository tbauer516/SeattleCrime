'use strict';

var rawData = {};

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
});

console.log('js ran');