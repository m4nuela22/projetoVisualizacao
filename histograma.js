var mainSVG = d3.selectAll("#mainSVG");

var semVitima = 0;
var comVitima = 0;
var vitimasArray = [{id: "SemVítima", nome: "Sem Vítima", value: "SEM VÍTIMA", vitimas: semVitima, selected: false}, {id: "ComVítima", nome: "Com Vítima", value: "COM VÍTIMA", vitimas: comVitima, selected: false}];
var csv;
var numberOfSelections = 0;
var myDispath = d3.dispatch("selectionChanged");

function histogram (array) {

	// Setando dimensoes e margens do SVG
	var margin = {top: 3, right: 2, bottom: 5, left: 330};
	var width = 160 - margin.left - margin.right;
	var height = 180 - margin.top - margin.bottom;

	// Zerando dados
	clearEverythingHist();
	csv = array;
	semVitima = 0;
	comVitima = 0;
	vitimasArray = [{id: "SemVítima", nome: "Sem Vítima", value: "SEM VÍTIMA", vitimas: semVitima, selected: false}, {id: "ComVítima", nome: "Com Vítima", value: "COM VÍTIMA", vitimas: comVitima, selected: false}];
	numberOfSelections = 0;


	// Contando número c/s vítimas
	for (var i=0; i < array.length ; ++i) {
		tipo = array[i].tipo;
	  	if (tipo=="COM VÍTIMA") {
	    	comVitima = comVitima + 1;
	  	} else {
	    	semVitima = semVitima + 1;
	  	}
	}
	console.log("Total de Vítimas :" + (comVitima+semVitima));
	mainSVG.append('text')
	.attr("x", 440)
	.attr("y", 433)
	.attr('class','textHist')
	.text("Total de Vítimas : " + (comVitima+semVitima));

	// Criando escalas
	var xScale = d3.scaleLinear().domain([0,100]).range([0,130]);
	var yScale = d3.scaleLinear().domain([0,semVitima + comVitima]).range([height,0]);
	var histogramScale = d3.scaleLinear().domain([semVitima + comVitima,0]).range([height,0]);

	var padding = 90;
	var margemEsquerdaMin = 749;
	var margemEsquerdaMax = 728;

	// Atualizando array
	vitimasArray[0].vitimas = semVitima;
	vitimasArray[1].vitimas = comVitima;

	// Criando eixos
	var xAxisGroup = mainSVG.append("g")
			.attr("class","axis")
			.attr("transform","translate("+ (margemEsquerdaMin + padding) +","+(height-margin.top+28)+")");
	var xAxis = d3.axisBottom(xScale)
			.ticks(0);
	xAxisGroup.call(xAxis);
	var yAxisGroup = mainSVG.append("g")
			.attr("class","axis")
			.attr("transform","translate("+ (margemEsquerdaMin + padding) +",25)")
			.attr("stroke","black");
	var yAxis = d3.axisLeft(yScale);
	yAxisGroup.call(yAxis);

	// Criando histograma
	if (array.length > 0) {
		mainSVG
			.selectAll()
	    	.data(vitimasArray)
	    	.enter().append("rect")
			.attr("class","rectHist")
			.attr("id", function (d) { return d.id; })
	    	.attr("transform","translate(" + padding + "," + (height-margin.top+21)+ ") scale(1,-1)")
	    	.attr("x", function(d){
	    		if (d.nome=="Sem Vítima") {
        			return 759;
      			} else {
        			return 818;
      			}
	    	})
	    	.attr("y", -7)
	    	.attr("width", 50)
	    	.attr("height", function(d) {return histogramScale(d.vitimas);})
	    	.attr("fill", function(d) {
      			if (d.nome=="Sem Vítima") {
        			return "blue";
      			} else {
        			return "red";
      			}
    		})
    		.on("click",histogramSelected);

		// Colocando porcentagem
		var percentage = mainSVG.selectAll()
			.data(vitimasArray)
			.enter()
			.append("text")
			.attr("class","percHist");

		var labelPercentage = percentage
			.attr("transform","translate(103,0)")
			.attr("x", function(d) {
				if (d.nome=="Sem Vítima") {
        			return 759;
      			} else {
        			return 818;
      			}
	    	})
	    	.attr("y", function(d) {return height + margin.top + margin.bottom + 7;})
	    	.text( function (d) { return Math.round((d.vitimas*100)/(comVitima + semVitima)) + "%"; })
	    	.attr("font-family", "sans-serif")
			.style("font-size", "12px")
	    	.style("fill", "white")
	    	.on("click",histogramSelected);
    }

	// Colocando textos
	var text = mainSVG.selectAll()
		.data(vitimasArray)
		.enter()
		.append("text")
		.attr("class","textHist");

	var labelTexts = text
		.attr("transform","translate(90,0)")
		.attr("x", function(d) {
			if (d.nome=="Sem Vítima") {
        		return 759;
      		} else {
        		return 818;
      		}
	    })
	    .attr("y", function(d) {return height + margin.top + margin.bottom + 27;})
	    .text( function (d) { return d.nome; })
	    .attr("font-family", "sans-serif")
		.style("font-size", "9px")
	    .style("fill", "black");
}

function clearEverythingHist(){
	mainSVG.selectAll(".rectHist").remove();
	mainSVG.selectAll(".axis").remove();
	var teste = (mainSVG.selectAll(".percHist"));
	teste.remove();
	mainSVG.selectAll(".textHist").remove();
}

function histogramSelected(d) {

	// Mudando cor dos selecionados
	if(d.selected == true){
    	d.selected = false;
    	d3.select("#" + d.id)
    	.attr("fill", function(d) {
      		if (d.nome=="Sem Vítima") {
        		return "blue";
      		} else {
        		return "red";
      		}
      	});
    	numberOfSelections -= 1;
  	}else{
    	d.selected = true;
    	d3.select("#" + d.id)
    	.attr("fill","#A9A9A9");
    	numberOfSelections += 1;
  	}

  	// Filtrando database de acordo com seleção
  	var result = searchOnArray();

  	// Avisando aos demais componentes as mudanças
  	myDispath.call("selectionChanged",{who:"histogram",selectedList:result});
}

function searchOnArray(d) {

	// Verificando quem está selecionado
	var vitimaFiltered = vitimasArray.filter(function(d){return d.selected == true;}).map(function(d){return d.value;});

	// Filtrando
	var results  = [];
	if (numberOfSelections == 0 || numberOfSelections == 2){
    	results = csv;
    	myDispath.call("selectionChanged",{who:"map",selectedList:results});
  	} else {
       results = results.concat(findRowsByVitima(csv,vitimaFiltered));
 	}
	return results;
}

function findRowsByVitima(database,vitimaFiltered){

	// Percorrendo database na coluna Tipo
  	var relevantArray = []
  	for (var i = 0 ; i<database.length; i++){
      	var row = database[i];
      	var tipo = row.tipo;

    	if (tipo != null && tipo != undefined) {
    		// Verificando se essa linha é relevante
        	if (tipo == vitimaFiltered[0]) {
        		relevantArray.push(row);
        	}
        }
 	}
  	return relevantArray;
}
