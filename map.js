var mymap;
var mapSVG;
var transform;
var path;
var featureElement;

// var greenIcon = L.icon({
//     iconUrl: 'green.jpg',
//     shadowUrl: 'green.jpg',
//
//     iconSize:     [6, 6], // size of the icon
//     shadowSize:   [6, 6], // size of the shadow
//     iconAnchor:   [6, 6], // point of the icon which will correspond to marker's location
//     shadowAnchor: [6, 6],  // the same for the shadow
//     popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
// });
//
//
// var redIcon = L.icon({
//     iconUrl: 'red.jpg',
//     shadowUrl: 'red.jpg',
//
// 		iconSize:     [6, 6], // size of the icon
//     shadowSize:   [6, 6], // size of the shadow
//     iconAnchor:   [6, 6], // point of the icon which will correspond to marker's location
//     shadowAnchor: [6, 6],  // the same for the shadow
//     popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
// });

function createMap(){
	mymap = L.map('mapDiv').setView([-8.056223, -34.913620], 12);
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(mymap);
  L.svg().addTo(mymap);
  mapSVG = d3.select("#mapDiv").select("svg");
  // var district_boundary = new L.geoJson();
  // district_boundary.addTo(mymap);
  //
  // $.ajax({
  // dataType: "json",
  // url: "bairros.geojson",
  // success: function(data) {
  //     $(data.features).each(function(key, data) {
  //         district_boundary.addData(data);
  //     });
  // }
  // });
  d3.json("bairros.geojson",function(error, geojson) {
    if (error){
      throw error;
    }
    transform = d3.geoTransform({point: projectPoint});
  	path = d3.geoPath().projection(transform);

    featureElement = mapSVG.selectAll("path")
              .data(geojson.features)
              .enter()
              .append("path")
              .attr("stroke", "blue")
              .attr("fill", "white")
              .attr("fill-opacity", 0)

    mymap.on("zoom", update);
		update();

    function update() {
    	currentZoom = mymap.getZoom();
      featureElement.attr("d", path);
    }

  });


function addMarkersToMap(array){
	var lat;
	var long;
	var tipo;

  mapSVG.selectAll("circle")
  .data(array)
  .enter()
  .append("circle")
  .attr("x",projectPoint())
  .attr("y",)
  .attr("r",)
  .attr("fill",)

	// for (var i = 0 ; i< array.length; i++){
	// 	lat = array[i].latitude;
	// 	long = array[i].longitude;
	// 	tipo = array[i].tipo;
	// 	if (tipo === "COM VÍTIMA"){
	// 		L.marker([lat,long],{icon: redIcon}).addTo(mymap).bindPopup("I am a red leaf.");
	// 	}else if (tipo === "SEM VÍTIMA"){
	// 		L.marker([lat,long],{icon: greenIcon}).addTo(mymap).bindPopup("I am a green leaf.");
	// 	}else{
	// 		console.log("error");
	// 	}
	// }
}

function projectPoint(x, y) {
       var point = mymap.latLngToLayerPoint(new L.LatLng(y, x));
       this.stream.point(point.x, point.y);
}

// function update() {
// 			currentZoom = mymap.getZoom();
//       featureElement.attr("d", path);
			// reposotion dots
			// feature.attr("transform",
			// 	function(d) {
			// 		return "translate("+
			// 			mymap.latLngToLayerPoint(d.LatLng).x +","+
			// 			mymap.latLngToLayerPoint(d.LatLng).y +")";
			// })



			// if(currentColoring == 1){
			// 	feature.style('fill', function(d){ return getCapColor(d); })
			// 	feature.style('stroke', function(d){  return getCapColor(d); })
			// } else {
			// 	feature.style('fill', function(d){ return getColor(d, ids); })
			// 	feature.style('stroke', function(d){  return getColor(d, ids); })
			// }

			// ToDo: show fewer dots when zoomed out
			// // update syle of dots, according to zoom level
			// if(currentZoom < 12){
			// 			feature.style('opacity', function(d){ if(d['CAP_COLOR'] > 5){return 1;}
			// 													else{ return .3}} )
			// 			feature.attr('r', function(d){ if(d['CAP_COLOR'] > 5){return 2;}
			// 													else{ return 1}} )
			// } else {
			// 	feature.style('opacity', .6);
			// }

		}
