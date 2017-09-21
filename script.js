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

var mappa = new Mappa('Google', key);
var myMap = mappa.staticMap(options);

var data;
var polygons;
var multiPolygons;

function preload(){
  img = loadImage(myMap.imgUrl);
  // A geoJSON file with world coordinates for all countries.
  data = loadJSON('world.geojson');
}

function setup(){
  canvas = createCanvas(640, 640);
  // Load all polygons and multipolygons in a geoJSON file in two arrays.
  polygons = myMap.geoJSON(data, 'Polygon');
  multiPolygons = myMap.geoJSON(data, 'MultiPolygon');
  // Display the static map image.
  image(img, 0, 0);

  // For all polygons loop through the array and create a new Shape.
  for(var i = 0; i < polygons.length; i++){
    beginShape();
    fill(random(colors));
    for (var j = 0; j < polygons[i][0].length; j ++){
      var pos = myMap.latLngToPixel(polygons[i][0][j][1], polygons[i][0][j][0]);
      vertex(pos.x, pos.y);
    }
    endShape();
  }

// For all multiPolygons loop through the array and create a new Shape.
  for(var i = 0; i < multiPolygons.length; i++){
    for(var k = 0; k < multiPolygons[i].length; k++){
      beginShape();
      fill(random(colors));
      for (var j = 0; j < multiPolygons[i][k][0].length; j ++){
        var pos = myMap.latLngToPixel(multiPolygons[i][k][0][j][1], multiPolygons[i][k][0][j][0]);
        vertex(pos.x, pos.y);
      }
      endShape();
    }
  }

}
