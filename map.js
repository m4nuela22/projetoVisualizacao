var mymap;

var greenIcon = L.icon({
    iconUrl: 'green.jpg',
    shadowUrl: 'green.jpg',

    iconSize:     [6, 6], // size of the icon
    shadowSize:   [6, 6], // size of the shadow
    iconAnchor:   [6, 6], // point of the icon which will correspond to marker's location
    shadowAnchor: [6, 6],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});


var redIcon = L.icon({
    iconUrl: 'red.jpg',
    shadowUrl: 'red.jpg',

		iconSize:     [6, 6], // size of the icon
    shadowSize:   [6, 6], // size of the shadow
    iconAnchor:   [6, 6], // point of the icon which will correspond to marker's location
    shadowAnchor: [6, 6],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

function createMap(){
	mymap = L.map('mapDiv').setView([-8.056223, -34.913620], 12);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(mymap);
/*var district_boundary = new L.geoJson();
district_boundary.addTo(mymap);

$.ajax({
dataType: "json",
url: "bairros.geojson",
success: function(data) {
    $(data.features).each(function(key, data) {
        district_boundary.addData(data);
    });
}
}).error(function() {});
*/
}

function addMarkersToMap(array){
	var lat;
	var long;
	var tipo;

	for (var i = 0 ; i< array.length; i++){
		lat = array[i].latitude;
		long = array[i].longitude;
		tipo = array[i].tipo;
		if (tipo === "COM VÍTIMA"){
			L.marker([lat,long],{icon: redIcon}).addTo(mymap).bindPopup("I am a red leaf.");
		}else if (tipo === "SEM VÍTIMA"){
			L.marker([lat,long],{icon: greenIcon}).addTo(mymap).bindPopup("I am a green leaf.");
		}else{
			console.log("error");
		}
	}
}
