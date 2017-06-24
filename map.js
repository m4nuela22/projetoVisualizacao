var mainSVG = d3.selectAll("#mainSVG");
var mymap;
var mapSVG;
var transform;
var path;
var featureElement;
var points;
var currentZoom = 12;
var cScale = d3.scaleOrdinal().domain(["COM VÍTIMA","SEM VÍTIMA"]).range(["red","blue"]);
var acidentsPerNeighborhood;
var cScaleChoropleth;
var geojsonArray;
var geojsonLeafLet;
var maxAcidentes;
var myTileLayer;
var infoChoropleth;
var infoMarkers;
var colorArray = ['#fcbba1','#fc9272','#fb6a4a','#ef3b2c','#cb181d','#67000d'];
var choroplethLegend;

function createMap(){

	mymap = L.map('mapDiv').setView([-8.056223, -34.913620], currentZoom);
  myTileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.streets',
		opacity: 1
	})
	myTileLayer.addTo(mymap);

  L.svg().addTo(mymap);
  mapSVG = d3.select("#mapDiv").select("svg");

  d3.json("bairros.geojson",function(error, geojson) {
    if (error){
      throw error;
    }
		geojsonArray = geojson;
    transform = d3.geoTransform({point: projectPoint});
  	path = d3.geoPath().projection(transform);

		geojsonLeafLet = L.geoJson(geojson, { weight: 1, onEachFeature: onEachFeature, style:{fillColor: 'white'}})
	  geojsonLeafLet.addTo(mymap);

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

function generatechoropleth(array){
	if (array.length != 0){
		  myTileLayer.setOpacity(0.2);
			mymap.setZoom(11);
			mapSVG.selectAll("circle").remove();
			createInfoChoropleth();
			addInfoChoropleth();
			maxAcidentes = 0;
  		acidentsPerNeighborhood = {};
  		var codigoBairro;
		  for (var i=0;i<array.length;i++){
		      codigoBairro = array[i].codigoBairro;
		      if (codigoBairro in acidentsPerNeighborhood){
		        acidentsPerNeighborhood[codigoBairro] = acidentsPerNeighborhood[codigoBairro] + 1;
		      }else{
		        acidentsPerNeighborhood[codigoBairro] = 1;
		      }
		  }
		  var keys = Object.keys(acidentsPerNeighborhood);
		  var valuesAc = keys.map(function(v) { return acidentsPerNeighborhood[v]; });
		  var minAcidentes;
		  maxAcidentes =  Math.max.apply(null, valuesAc);

		  if (geojsonArray.features.length != Object.keys(acidentsPerNeighborhood).length){
		    minAcidentes = 0;
		  }else{
		     Math.min.apply(null, valuesAc);
		  }
		  //cScaleChoropleth = d3.scaleLinear().domain([minAcidentes,maxAcidentes]).range(['#fee5d9','#fcbba1','#fc9272','#fb6a4a','#de2d26','#a50f15']);
		  //geojsonLeafLet.setStyle(style(geojsonArray.features));
			//displayLegend(maxAcidentes);
			geojsonLeafLet.setStyle(styleChoropleth);
			addLegendToMap();
	}else{
			geojsonLeafLet.setStyle(styleMarkers);
			removeLegendFromMap();
	}
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: showChoroplethInfo,
		mouseout: hideChoroplethInfo
	});
}

function showChoroplethInfo(d){
	var layer = d.target;
	if (infoChoropleth!= undefined){
		infoChoropleth.update(layer.feature.properties);
	}
}

function hideChoroplethInfo(){
	if (infoChoropleth!= undefined){
		infoChoropleth.update();
	}
}

function getColor(d,max) {
	var value = max/6;
  return d >= 5*value  ? colorArray[5] :
         d > 4*value  ? colorArray[4] :
         d > 3*value  ? colorArray[3] :
         d > 2*value  ? colorArray[2] :
         d > value    ? colorArray[1] :
          							colorArray[0];
}

function getGrades(max){
	var value = max/6;
	var grades = [];
	for (var i = 0 ; i<=5; i++){
		grades.push(parseFloat(parseFloat(value*i).toFixed(2)));
	}
	return grades;
}

function styleChoropleth(features){
  return {
    fillColor: getColor(returnNumberOfAcidentsOrZero(acidentsPerNeighborhood[features.properties.bairro_codigo]),maxAcidentes),
		fillOpacity:1,
		weight: 1,
  }
}

function styleMarkers(features){
  return {
    fillColor: 'white',
		fillOpacity:0,
    weight: 1
  };
}

function returnNumberOfAcidentsOrZero(value){
  var result = value;
  if(result == undefined){
    result = 0;
  }
  return result;
}

function createInfoChoropleth(){
	if(infoChoropleth == undefined){
		infoChoropleth = L.control();

		infoChoropleth.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'infoChoropleth');
			this.update();
			return this._div;
		};

		infoChoropleth.update = function (props) {
			this._div.innerHTML = '<h4>Acidentes de Trânsito</h4>' +  (props ?
				'<b>' + props.bairro_nome_ca + '</b><br />' + returnNumberOfAcidentsOrZero(acidentsPerNeighborhood[props.bairro_codigo]) + ' acidente(s)'
				: 'Passe o mouse pelos bairros');
		};
	}
}

function addInfoChoropleth(){
	if(infoChoropleth!=undefined){
		infoChoropleth.addTo(mymap);
	}
}

function removeInfoChoropleth(){
	if(infoChoropleth!= undefined){
		infoChoropleth.remove(mymap);
	}
}

function removeLegendFromMap(){
	if(choroplethLegend != undefined){
		choroplethLegend.remove(mymap);
		choroplethLegend = undefined;
	}
}

function addMarkersToMap(array){
	var lat;
	var long;
	myTileLayer.setOpacity(1);
	mymap.setZoom(12);
	removeInfoChoropleth();
	removeLegendFromMap();
  geojsonLeafLet.setStyle(styleMarkers);

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

function addLegendToMap(){
	removeLegendFromMap();
	choroplethLegend= L.control({position: 'bottomright'});

	choroplethLegend.onAdd = function (mymap) {

	    var div = L.DomUtil.create('div', 'info legend'),
	        grades = getGrades(maxAcidentes),
	        labels = [];

	    // loop through our density intervals and generate a label with a colored square for each interval
	    for (var i = 0; i < grades.length; i++) {
	        div.innerHTML +=
	            '<i style="background-color:' + getColor(grades[i]+0.1,maxAcidentes) + '"></i> ' +
	            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
	    }

	    return div;
	};

	choroplethLegend.addTo(mymap);
}
