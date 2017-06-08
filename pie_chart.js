$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "acidentesTransito2015.csv",
        dataType: "text",
        
        success: function(data) {parseData(data);}
     });
});

var dataset;
var acidentes_auto = 0;
var acidentes_moto = 0;
var acidentes_ciclom = 0;
var acidentes_ciclista = 0;
var acidentes_pedestre = 0;
var acidentes_onibus = 0;
var acidentes_caminhao = 0;
var acidentes_viatura = 0;
var acidentes_outros = 0;
var total = 0;
var data;

function makePie(data){
	var width = 300,
		height = 300,
		radius = Math.min(width, height) / 2;

	var color = d3.scaleOrdinal()
		.range(["#98abc5", "#8a89a6", "#7b6888"]);

	var arc = d3.arc()
		.outerRadius(radius - 10)
		.innerRadius(0);

	var labelArc = d3.arc()
		.outerRadius(radius - 40)
		.innerRadius(radius - 40);

	var pie = d3.pie()
		.sort(null)
		.value(function(d) { return d.value; });

	var svg = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	var g = mainSVG.selectAll(".arc")
		.data(pie(data))
		.enter().append("g")
		.attr("class", "arc")
		.attr("transform", "translate(" + (770) + "," + height/2+ ")")

	g.append("path")
		.attr("d", arc)
		.style("fill", function(d) { return color(d.data.value); });

	g.append("text")
		.attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
		.attr("dy", ".35em")
		.text(function(d) { 
			var x = Math.round(d.data.value/total * 100);
			return " "+ x +"%"; });
	}

function processData(dataset){
	for (i=0;i<dataset.length;i++)
	{
		if (dataset[i][11]=="auto:1") {
			acidentes_auto +=1;
		}
		if (dataset[i][12]=="moto:1") {
			acidentes_moto +=1;
		}
		if(dataset[i][13]=="ciclom:1") {
			acidentes_ciclom +=1;
		}
		if(dataset[i][14]=="ciclista:1") {
			acidentes_ciclista +=1;
		}
		if(dataset[i][15]=="pedestre:1") {
			acidentes_pedestre +=1;
		}
		if(dataset[i][16]=="onibus:1") {
			acidentes_onibus +=1;
		}
		if(dataset[i][17]=="caminhao:1") {
			acidentes_caminhao +=1;
		}
		if(dataset[i][18]=="viatura:1") {
			acidentes_viatura +=1;
		}
		if(dataset[i][19]=="outros:1") {
			acidentes_outros +=1;
		}
	}
	data = [{"label":"Carros","value":acidentes_auto},
			{"label":"Motos","value":acidentes_moto},
			{"label":"Ciclomotores","value":acidentes_ciclom},
			{"label":"Bicicletas","value":acidentes_ciclista},
			{"label":"Pedestres","value":acidentes_pedestre},
			{"label":"Ônibus","value":acidentes_onibus},
			{"label":"Caminhões","value":acidentes_caminhao},
			{"label":"Viaturas","value":acidentes_viatura},
			{"label":"Outros","value":acidentes_outros}];

	total = acidentes_auto+acidentes_moto+acidentes_ciclom+acidentes_ciclista+acidentes_pedestre+acidentes_onibus+acidentes_caminhao+acidentes_viatura+acidentes_outros;
	makePie(data);
}

function parseData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(headers[j]+":"+data[j]);
            }
            lines.push(tarr);
        }
    }
    
    processData(lines);
}

