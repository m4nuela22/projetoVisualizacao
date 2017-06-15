var mymap;
var mapSVG;
var transform;
var path;
var featureElement;
var points;
var currentZoom = 12;
var cScale = d3.scaleOrdinal().domain(["COM VÍTIMA","SEM VÍTIMA"]).range(["red","blue"]);


function createMap(){
	mymap = L.map('mapDiv').setView([-8.056223, -34.913620], currentZoom);
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(mymap);

  L.svg().addTo(mymap);
  mapSVG = d3.select("#mapDiv").select("svg");


  d3.json("bairros.geojson",function(error, geojson) {
    if (error){
      throw error;
    }
    transform = d3.geoTransform({point: projectPoint});
  	path = d3.geoPath().projection(transform);

    L.geoJson(geojson, { weight: 1 }).addTo(mymap);

    mymap.on("zoom", update);
		update();

    function update() {
    	currentZoom = mymap.getZoom();
      //featureElement.attr("d", path);
      if (points){
        points.attr("transform",
        function(d) {
            var point = getPoint(d.latitude,d.longitude);
            return "translate("+
            point.x +","+
            point.y +")";
  			});
      }
    }

  });
}

function addMarkersToMap(array){
	var lat;
	var long;

	points = mapSVG.selectAll("circle").remove();

  points = mapSVG.selectAll("circle")
  .data(array)
  .enter()
  .append("circle")
  .attr("r",2)
  .attr("transform", function(d) {
    var point = getPoint(d.latitude,d.longitude);
    return "translate("+
    point.x +","+
    point.y +")";})
  .attr("fill",function(d){return cScale(d.tipo);});
}

function getPoint(x,y){
  var latLong = new L.LatLng(x, y);
  var point = mymap.latLngToLayerPoint(latLong);
  return point;
}

function projectPoint(x, y) {
       var point = mymap.latLngToLayerPoint(new L.LatLng(y, x));
       this.stream.point(point.x, point.y);
}
