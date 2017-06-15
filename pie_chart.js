function makePie(data){
	clearEverything(mainSVG);
}

function returnTotal(data){

}

function makeFilling(data,total){
	var width = 300,
		height = 300,
		radius = Math.min(width, height) / 2;

	var color = d3.scaleOrdinal()
		.range(["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6"]);

	var arc = d3.arc()
		.outerRadius(radius - 10)
		.innerRadius(0);

	var labelArc = d3.arc()
		.outerRadius(radius - 40)
		.innerRadius(radius - 40);

	var pie = d3.pie()
		.sort(null)
		.value(function(d) { return d.value; });

	var g = mainSVG.selectAll(".arc")
		.data(pie(data))
		.enter().append("g")
		.attr("class", "arc")
		.attr("transform", "translate(" + (770) + "," + (height+800)/2+ ")")
		.on("mouseover", function (d) {
			d3.select("#tooltip")
			.style("left", d3.event.pageX + "px")
			.style("top", d3.event.pageY + "px")
			.style("opacity", 1)
			.select("#label")
			.text(d.data.label);

		d3.select("#tooltip")
			.style("left", d3.event.pageX + "px")
			.style("top", d3.event.pageY + "px")
			.style("opacity", 1)
			.select("#value")
			.text(d.value);

		d3.select("#tooltip")
			.style("left", d3.event.pageX + "px")
			.style("top", d3.event.pageY + "px")
			.style("opacity", 1)
			.select("#percentage")
			.text(Math.round(d.value/total*100));

		})
		.on("mouseout", function () {
			// Hide the tooltip
			d3.select("#tooltip")
			.style("opacity", 0);
		});

	g.append("path")
    	.attr("class","path")
		.attr("d", arc)
		.style("fill", function(d) { return color(d.data.label); });

	g.append("text")
		.attr("class","text pointer")
		
		.attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
		.attr("dy", ".35em")
		.text(function(d) {
			var x = Math.round((d.data.value)/total * 100);
			var retorno;

			if (x > 2){
				retorno = " "+ x +"%";
			}

			return retorno;
		});

}

function bakePie(dataset){
	clearEverything(mainSVG);

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

	for (i=0;i<Object.keys(dataset).length-1;i++)
	{	
		if (dataset[i].auto!="") {
			acidentes_auto += Number(dataset[i].auto);
		}
		if (dataset[i].moto!="") {
			acidentes_moto += Number(dataset[i].moto);
		}
		if(dataset[i].ciclom!="") {
			acidentes_ciclom += Number(dataset[i].ciclom);
		}
		if(dataset[i].ciclista!="") {
			acidentes_ciclista += Number(dataset[i].ciclista);
		}
		if(dataset[i].pedestre!="") {
			acidentes_pedestre += Number(dataset[i].pedestre);
		}
		if(dataset[i].onibus!="") {
			acidentes_onibus += Number(dataset[i].onibus);
		}
		if(dataset[i].caminhao!="") {
			acidentes_caminhao += Number(dataset[i].caminhao);
		}
		if(dataset[i].viatura!="") {
			acidentes_viatura += Number(dataset[i].viatura);
		}
		if(dataset[i].outros!="") {
			acidentes_outros += Number(dataset[i].outros);
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

	makeFilling(data,total);

}

function clearEverything(mainSVG){
	mainSVG.selectAll(".arc").remove();
	mainSVG.selectAll(".path").remove();
	mainSVG.selectAll(".text").remove();
	mainSVG.selectAll(".remove").remove();
}