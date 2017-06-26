var mainSVG = d3.selectAll("#mainSVG");
var selectedSlices = 0;

var color = d3.scaleOrdinal()
			.range(["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6"]);

var involved = [{"label":"Carros","value":0,"selected":false},
			{"label":"Motos","value":0,"selected":false},
			{"label":"Ciclomotores","value":0,"selected":false},
			{"label":"Bicicletas","value":0,"selected":false},
			{"label":"Pedestres","value":0,"selected":false},
			{"label":"Ônibus","value":0,"selected":false},
			{"label":"Caminhões","value":0,"selected":false},
			{"label":"Viaturas","value":0,"selected":false},
			{"label":"Outros","value":0,"selected":false}];

var rawData;

// var myDispath = d3.dispatch("selectionChanged");

function makeFilling(data,total){
	var width = 300,
	height = 300,
	radius = Math.min(width, height) / 2;
		
	if (total == 0){
		var dataset = [[10,"Nenhum acidente reportado nesse período"]];

		var circle = mainSVG.selectAll("circle")
			.data(dataset)
			.enter()
			.append("circle")
			.attr("class","circle-empty")
			.attr("transform", "translate(" + (750) + "," + (380) + ")")
			.attr("r", 140)
			.attr("cx", 50)
			.attr("cy", 20);

		var label = mainSVG.selectAll(".circle-empty-text")
			.data(dataset)
			.enter()
			.append("text")
			.attr("class","circle-empty-text")
			.attr("transform", "translate(" + (685) + "," + (400) + ")")
			.text(function(d) {return d[1];});

	}else{
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
			.attr("transform", "translate(" + (800) + "," + (height+500)/2+ ")")
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
			})
			.on("click",pieSelected);

		g.append("path")
	    	.attr("class","path")
	    	.attr("id",function(d) {return d.data.label})
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
			})
			.on("click",pieSelected);
	}
}

function bakePie(dataset){
	clearEverything(mainSVG);

	rawData = dataset;
	
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

	for (i=0;i<Object.keys(dataset).length;i++)
	{

		if (dataset[i].auto!="") {
			acidentes_auto += convertToNumber(dataset[i].auto);
		}
		if (dataset[i].moto!="") {
			acidentes_moto += convertToNumber(dataset[i].moto);
		}
		if(dataset[i].ciclom!="") {
			acidentes_ciclom += convertToNumber(dataset[i].ciclom);
		}
		if(dataset[i].ciclista!="") {
			acidentes_ciclista += convertToNumber(dataset[i].ciclista);
		}
		if(dataset[i].pedestre!="") {
			acidentes_pedestre += convertToNumber(dataset[i].pedestre);
		}
		if(dataset[i].onibus!="") {
			acidentes_onibus += convertToNumber(dataset[i].onibus);
		}
		if(dataset[i].caminhao!="") {
			acidentes_caminhao += convertToNumber(dataset[i].caminhao);
		}
		if(dataset[i].viatura!="") {
			acidentes_viatura += convertToNumber(dataset[i].viatura);
		}
		if(dataset[i].outros!="") {
			acidentes_outros += convertToNumber(dataset[i].outros);
		}
	}

	for (i=0;i<Object.keys(involved).length;i++){
		if (involved[i].label == "Carros" ){
			involved[i].value = acidentes_auto;
		}
		if (involved[i].label == "Motos"){
			involved[i].value = acidentes_moto;
		}
		if (involved[i].label == "Ciclomotores"){
			involved[i].value = acidentes_ciclom;
		}
		if (involved[i].label == "Bicicletas"){
			involved[i].value = acidentes_ciclista;
		}
		if (involved[i].label == "Pedestres"){
			involved[i].value = acidentes_pedestre;
		}
		if (involved[i].label == "Ônibus"){
			involved[i].value = acidentes_onibus;
		}
		if (involved[i].label == "Caminhões"){
			involved[i].value = acidentes_caminhao;
		}
		if (involved[i].label == "Viaturas"){
			involved[i].value = acidentes_viatura;
		}
		if (involved[i].label == "Outros"){
			involved[i].value = acidentes_outros;
		}
	}

	total = acidentes_auto+acidentes_moto+acidentes_ciclom+acidentes_ciclista+acidentes_pedestre+acidentes_onibus+acidentes_caminhao+acidentes_viatura+acidentes_outros;
	
	makeFilling(involved,total);
}

function convertToNumber(value){
  result = 0;
  var convertedValue = Number(value);
  if (!isNaN(convertedValue)){
    result = convertedValue;
  }
  return result;
}

function clearEverything(){
	mainSVG.selectAll(".arc").remove();
	mainSVG.selectAll(".path").remove();
	mainSVG.selectAll(".text").remove();
	mainSVG.selectAll("circle").remove();
	mainSVG.selectAll(".circle-empty-text").remove();
}

function pieSelected(d){
	//Atualização de cores
	if(d.data.selected == true){
		d.data.selected = false;
		d3.select("#" + d.data.label)
			.style("fill", function(d) { return color(d.data.label)});
		selectedSlices -= 1;
	}else{
		d.data.selected = true;
		d3.select("#"+d.data.label)
			.style("fill","#C7C7C7");
		selectedSlices += 1;
	}
	
	var result = filterBySelection();

	myDispath.call("selectionChanged",{who:"pie",selectedList:result});
}

function filterBySelection(d) {
	var typeFiltered = [];
	typeFiltered = involved
	.filter(function(d){return d.selected == true;})
	.map(function(d){return d.label;});

	// Filtrando
	var results = [];
	if (selectedSlices == 0){
		results = rawData;
		myDispath.call("selectionChanged",{who:"map",selectedList:results});
	 	myDispath.call("selectionChanged",{who:"histograma",selectedList:results});
	}else{
		results = getRowsByVehicle(rawData,typeFiltered);
	}
	return results;
}

function getRowsByVehicle(database,typeFiltered){

	// Percorrendo database na coluna Tipo
	var relevantArray = []
	for (var i = 0 ; i<database.length; i++){
		var row = database[i];
		// var tipo = row.tipo;

		// if (tipo != null && tipo != undefined) {
		// 	// Verificando se essa linha é relevante
		// 	if (tipo == vitimaFiltered[0]) {
		// 		relevantArray.push(row);
		// 	}
		// }
	
		if (typeFiltered.indexOf("Carros") > -1 && row.auto != ""){
			relevantArray.push(row);
		}		
		if (typeFiltered.indexOf("Motos") > -1 && row.moto != ""){
			relevantArray.push(row);
		}
		if (typeFiltered.indexOf("Ciclomotores") > -1 && row.ciclom != ""){
			relevantArray.push(row);
		}
		if (typeFiltered.indexOf("Bicicletas") > -1 && row.ciclista != ""){
			relevantArray.push(row);
		}
		if (typeFiltered.indexOf("Pedestres") > -1 && row.pedestre != ""){
			relevantArray.push(row);
		}
		if (typeFiltered.indexOf("Ônibus") > -1 && row.onibus != ""){
			relevantArray.push(row);
		}
		if (typeFiltered.indexOf("Caminhões") > -1 && row.caminhao != ""){
			relevantArray.push(row);
		}
		if (typeFiltered.indexOf("Viaturas") > -1 && row.viatura != ""){
			relevantArray.push(row);
		}
		if (typeFiltered.indexOf("Outros") > -1 && row.outros != ""){
			relevantArray.push(row);
		}
	}
	
	return relevantArray;
}
