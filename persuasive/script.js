/* -----------
Google Maps demo.
Visualizing 45,716 Meteorite Landings. 
Data from NASA's Open Data Portal.(https://data.nasa.gov/Space-Science/Meteorite-Landings/gh4g-9sfh)
----------- */

// API Key for Google Maps. Get one here:
// https://developers.google.com/maps/web/
var key = 'AIzaSyAlNSV6v8tZmSg5Eu6G9D38PEE-_8J8w0A'


var HEIGHT = 800;
var WIDTH = 800;
// Style for Google Maps. This is optional. More information here:
// https://mapstyle.withgoogle.com/
// Your Google Maps API Key

// Options for map
var options = {
  lat: 0,
  lng: 0,
  zoom: 1.5,
  width: WIDTH,
  height: HEIGHT,
  scale: 1,
  format: 'PNG',
  language: 'en',
  maptype: 'satellite' //https://developers.google.com/maps/documentation/javascript/maptypes
}


var countryHashMissMap = {"United States":"United States of America", "Tanzania":"United Republic of Tanzania", "Palestinian Territory, Occupied": "West Bank"}

var mappa = new Mappa('Google', key);
var myMap = mappa.staticMap(options);

var cnv;

var data;
var dataMapped = {};
var table;
var arr = [];
var polygons;
var multiPolygons;
var countryHashMap = {};
var dateToEventMap = {};
var startDate = new Date(1982, 0, 1);
var currDate = new Date();
var endDate = new Date(2015, 8, 28);
var largestDeaths = 20000;


function preload(){
  img = loadImage(myMap.imgUrl);
  // A geoJSON file with world coordinates for all countries.
  data = loadJSON('data/world.geojson');
  table = loadTable("data/suicide_attacks.csv", "csv", "header");
  explosion = loadSound("data/explosion.mp3");
}

function setup(){
	cnv = createCanvas(HEIGHT, WIDTH);
	background(0);

	var countriesAttacked = [];

	for(var i = 0; i < table.getRowCount(); i ++ ) {
		var year = table.getRow(i).get("year");
		var month = table.getRow(i).get("month") - 1;
		var day = table.getRow(i).get("day");
		var date = new Date(year, month, day);
		
		var fixedCountry = table.getRow(i).get("country");
		if(Object.keys(countryHashMissMap).includes(fixedCountry)) {
			fixedCountry = countryHashMissMap[fixedCountry];
		}

		if(!countriesAttacked.includes(fixedCountry)) {
			countriesAttacked.push(fixedCountry);
		}

		var deaths = table.getRow(i).get("# killed");

		if(Object.keys(dateToEventMap).includes(date.toString())) {
			dateToEventMap[date].push([fixedCountry, deaths]);
		} else {
			dateToEventMap[date] = [[fixedCountry, deaths]];
		}
	}

	initializeCountries(data["features"], countriesAttacked);

	for(var d = new Date(2000, 0, 1); d.toString() !== endDate.toString(); d.setDate(d.getDate() + 1)) {
		if(!Object.keys(dateToEventMap).includes(d.toString())) {
			dateToEventMap[d] = [];
		}
	}

	//console.log(dateToEventMap);

	currDate = new Date(2000, 0, 1);

	//code to download json file of import objects
	/*
	var objToBeSaved = {"countryHashMap": countryHashMap,
	"dateToEventMap": dateToEventMap};
	var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(objToBeSaved));
	var dlAnchorElem = document.getElementById('downloadAnchorElem');
	dlAnchorElem.setAttribute("href", dataStr);
	dlAnchorElem.setAttribute("download", "scene.json");
	dlAnchorElem.click();	
	*/
}


function draw() {
	background(0);
	currDate.setDate(currDate.getDate() + 1);
	attackCountries(dateToEventMap[currDate.toString()]);
	stroke(111, 111, 111);
	redrawCountries();
	fill(255);
	textSize(25);
	textAlign(RIGHT);
	text(currDate.toISOString().substring(0,10), width*.95, height*.9);
	//console.log(currDate);

}

function initializeCountries(countries, countriesAttacked) {
	for (var i = 0; i < countries.length; i ++) {
		var name = fixCountryName(countries[i]["properties"]["name"]);
		if(countriesAttacked.includes(name)) {
			countryHashMap[name] = countries[i];
			countryHashMap[name]['properties']['targetcolor'] = 0;
			countryHashMap[name]['properties']['currentcolor'] = 0;
		}
	}
}

function attackCountries(countries) {
	var countryNames = countries.map(function(value) { return value[0]; });
	if(countryNames.includes("Iraq")) {
		explosion.play();
	}

	for(var i = 0; i < countries.length; i ++) {
		var countryName = countries[i][0];
		var numberKilled = countries[i][1];
		countryHashMap[countryName]['properties']['targetcolor'] += scaleRed(numberKilled);
		countryHashMap[countryName]['properties']['currentcolor'] = 255;
	}
}

function redrawCountries() {
	//stroke(111, 111, 111);
	for(var i = 0; i < Object.keys(countryHashMap).length; i ++) {
		countryName = Object.keys(countryHashMap)[i];
		drawCountry(countryName);

		//recalculate color
		currentColor = countryHashMap[countryName]['properties']['currentcolor'];
		targetColor = countryHashMap[countryName]['properties']['targetcolor'];
		if(currentColor > targetColor) {
			countryHashMap[countryName]['properties']['currentcolor'] = countryHashMap[countryName]['properties']['currentcolor'] - 5;
		} else { //currentColor <= targetColor
			countryHashMap[countryName]['properties']['currentcolor'] = targetColor;
		}
	}
}

function drawCountry(countryName) {
	var country = countryHashMap[countryName];
	var currColor = country['properties']['currentcolor'];
	var fillColor = country['properties']['name'] === "Iraq" ? 
		color(currColor, 0, 0):
		color(currColor, currColor, 0);

	if(country['geometry']['type'] === 'Polygon') {
		polygon = country['geometry']['coordinates'];
		beginShape();
		fill(fillColor);
		for (var j = 0; j < polygon[0].length; j ++){
			var pos = myMap.latLngToPixel(polygon[0][j][1], polygon[0][j][0]);
			vertex(pos.x, pos.y);
			}
		endShape();
	} else { //multi-polygon
		multiPolygon = country['geometry']['coordinates'];
		for(var k = 0; k < multiPolygon.length; k++){
			beginShape();
			fill(fillColor);
			for (var j = 0; j < multiPolygon[k][0].length; j ++){
				var pos = myMap.latLngToPixel(multiPolygon[k][0][j][1], multiPolygon[k][0][j][0]);
				vertex(pos.x, pos.y);
			}
			endShape();
		}
	}
}

function scaleRed(deaths) {
	return 255 * deaths / largestDeaths;
}

function fixCountryName(name) {
	var fixedCountry = name;
	if(Object.keys(countryHashMissMap).includes(fixedCountry)) {
		fixedCountry = countryHashMissMap[name];
	}
	return fixedCountry;
	
}

