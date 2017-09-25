/* -----------
Google Maps demo.
Visualizing 45,716 Meteorite Landings. 
Data from NASA's Open Data Portal.(https://data.nasa.gov/Space-Science/Meteorite-Landings/gh4g-9sfh)
----------- */

// API Key for Google Maps. Get one here:
// https://developers.google.com/maps/web/
var key = 'AIzaSyAlNSV6v8tZmSg5Eu6G9D38PEE-_8J8w0A'

// Style for Google Maps. This is optional. More information here:
// https://mapstyle.withgoogle.com/
// Your Google Maps API Key

// Options for map
var options = {
  lat: 0,
  lng: 0,
  zoom: 2,
  width: 640,
  height: 640,
  scale: 1,
  format: 'PNG',
  language: 'en',
  maptype: 'satellite' //https://developers.google.com/maps/documentation/javascript/maptypes
}

var colors = ["#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#045a8d", "#023858"];

var countryHashMissMap = {"United States":"United States of America", "Tanzania":"United Republic of Tanzania", "Palestinian Territory, Occupied": "West Bank"}

var mappa = new Mappa('Google', key);
var myMap = mappa.staticMap(options);

var data;
var table;
var arr = [];
var polygons;
var multiPolygons;
var countryHashMap = {};

function preload(){
  img = loadImage(myMap.imgUrl);
  // A geoJSON file with world coordinates for all countries.
  data = loadJSON('data/world.geojson');
	table = loadTable("data/suicide_attacks.csv", "csv", "header");
}

function setup(){
	canvas = createCanvas(640, 640);
	// Load all polygons and multipolygons in a geoJSON file in two arrays.
	polygons = myMap.geoJSON(data, 'Polygon');
	multiPolygons = myMap.geoJSON(data, 'MultiPolygon');
	data["features"][0]["properties"]["color"] = 0;
	console.log(data["features"]);
	background(0);

	initializeAndDrawCountries(data["features"]);

	//  redrawCountries(['Afghanistan']);
	//console.log(table.getColumnCount());
	//console.log(table);
	for(var i = 0; i < table.getRowCount(); i ++) {
		//console.log(table.getString(i, 8));
		country = table.getRow(i).get(8);
			var tempCountry = country;
			if(Object.keys(countryHashMissMap).includes(country)) {
				tempCountry = countryHashMissMap[country];
			}
			arr.push(tempCountry);
	}
	console.log(arr);
	redrawCountries(arr);
}


function draw() {
	for(date in dates) {
		listOfCountries = getListOfCountries(date);
		colorShapes(listOfCountries);
	}
}

function initializeAndDrawCountries(countries) {
	for (var i = 0; i < countries.length; i ++) {
		countries[i]["properties"]["color"] = 0x000000;
		var name = countries[i]["properties"]["name"];
		countryHashMap[name] = countries[i];
		draw(data['features'][i]['properties']['name']);
	}
}

function redrawCountries(countries) {
	for (var i = 0; i < data['features'].length; i ++) {
		if(countries.includes(data['features'][i]['properties']['name'])) {
			data['features'][i]['properties']['color'] += 0xff;
			draw(data['features'][i]['properties']['name']);
		}
	}
}

function draw(countryName) {
	for(var i = 0; i < data['features'].length; i ++) {
		country = data['features'][i];
		if(country['properties']['name'] === countryName) {
			if(country['geometry']['type'] === 'Polygon') {
				polygon = country['geometry']['coordinates'];
				beginShape();
				fill(country['properties']['color'], 0, 0);
				for (var j = 0; j < polygon[0].length; j ++){
					var pos = myMap.latLngToPixel(polygon[0][j][1], polygon[0][j][0]);
					vertex(pos.x, pos.y);
					}
				endShape();
			} else { //multi-polygon
				multiPolygon = country['geometry']['coordinates'];
				for(var k = 0; k < multiPolygon.length; k++){
					beginShape();
					fill(country['properties']['color'], 0, 0);
					for (var j = 0; j < multiPolygon[k][0].length; j ++){
						var pos = myMap.latLngToPixel(multiPolygon[k][0][j][1], multiPolygon[k][0][j][0]);
						vertex(pos.x, pos.y);
					}
					endShape();
				}
			}
		}
	}
}

/*function numberToRed(num, max) {

}*/
