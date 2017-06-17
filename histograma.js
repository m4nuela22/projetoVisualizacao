var mainSVG = d3.selectAll("#mainSVG");

function histogram (array) {

	// Setando dimensoes e margens do SVG
	var margin = {top: 3, right: 2, bottom: 5, left: 330};
	var width = 160 - margin.left - margin.right;
	var height = 180 - margin.top - margin.bottom;

	clearEverythingHist();

	// Contando número c/s vítimas
	var semVitima = 0;
	var comVitima = 0;
	for (var i=0; i < array.length ; ++i) {
		tipo = array[i].tipo;
	  	if (tipo=="COM VÍTIMA") {
	    	comVitima = comVitima + 1;
	  	} else {
	    	semVitima = semVitima + 1;
	  	}
	}

	// Criando escalas
	var xScale = d3.scaleLinear().domain([0,100]).range([0,130]);
	var yScale = d3.scaleLinear().domain([0,semVitima + comVitima]).range([height,0]);
	var histogramScale = d3.scaleLinear().domain([semVitima + comVitima,0]).range([height,0]);

	// Filtrando apenas dados necessários
	var vitimas = [{nome: "SemVítima", vitimas: semVitima, selected: false}, {nome: "ComVítima", vitimas: comVitima, selected: false}];

	var padding = 90;
	var margemEsquerdaMin = 659;
	var margemEsquerdaMax = 728;

	// Criando eixos
	var xAxisGroup = mainSVG.append("g")
			.attr("class","axis")
			.attr("transform","translate("+ (margemEsquerdaMin + padding) +","+(height-margin.top+21)+")");
	var xAxis = d3.axisBottom(xScale)
			.ticks(0);
	xAxisGroup.call(xAxis);
	var yAxisGroup = mainSVG.append("g")
			.attr("class","axis")
			.attr("transform","translate("+ (margemEsquerdaMin + padding) +",18)")
			.attr("stroke","black");
	var yAxis = d3.axisLeft(yScale);
	yAxisGroup.call(yAxis);

	// Criando histograma
	mainSVG
		.selectAll()
	    .data(vitimas)
	    .enter().append("rect")
		.attr("class","rectHist")
		.attr("class","pointer")
		.attr("id", function (d) { return d.nome; })
	    .attr("transform","translate(" + padding + "," + (height-margin.top+21)+ ") scale(1,-1)")
	    .attr("x", function(d){
	    	if (d.nome=="SemVítima") {
        		return 669;
      		} else {
        		return 728;
      		}
	    })
	    .attr("y", 0)
	    .attr("width", 50)
	    .attr("height", function(d) {return histogramScale(d.vitimas);})
	    .attr("fill", function(d) {
      		if (d.nome=="SemVítima") {
        		return "blue";
      		} else {
        		return "red";
      		}
    	})
    	.on("click",histogramSelected);

	// Colocando textos
	var text = mainSVG.selectAll()
		.data(vitimas)
		.enter()
		.append("text")
		.attr("class","textHist");

	var labelTexts = text
		.attr("transform","translate(0,0)")
		.attr("x", function(d) {
			if (d.nome=="SemVítima") {
        		return 669+93;
      		} else {
        		return 728+93;
      		}
	    })
	    .attr("y", function(d) {return height + margin.top + margin.bottom + 20;})
	    .text( function (d) { return d.nome; })
	    .attr("font-family", "sans-serif")
		.style("font-size", "9px")
	    .style("fill", "black");

	// Colocando porcentagem
	var percentage = mainSVG.selectAll()
		.data(vitimas)
		.enter()
		.append("text")
		.attr("class","percHist");

	var labelPercentage = percentage
		.attr("transform","translate(103,0)")
		.attr("x", function(d) {
			if (d.nome=="SemVítima") {
        		return 669;
      		} else {
        		return 728;
      		}
	    })
	    .attr("y", function(d) {return height + margin.top + margin.bottom + 0;})
	    .text( function (d) { return Math.round((d.vitimas*100)/(comVitima + semVitima)) + "%"; })
	    .attr("font-family", "sans-serif")
		.style("font-size", "12px")
	    .style("fill", "white");
}

function clearEverythingHist(){
	mainSVG.selectAll(".rectHist").remove();
	mainSVG.selectAll(".axis").remove();
	mainSVG.selectAll(".textHist").remove();
	//mainSvg.selectAll(".percHist").remove();
}

function histogramSelected(d) {
	if(d.selected == true){
    	d.selected = false;
    	d3.select("#" + d.nome)
    	.attr("fill", function(d) {
      		if (d.nome=="SemVítima") {
        		return "blue";
      		} else {
        		return "red";
      		}
      	});
    	numberOfSelections -= 1;
  	}else{
    	d.selected = true;
    	d3.select("#" + d.nome)
    	.attr("fill","#A9A9A9");
    	numberOfSelections += 1;
  	}
}
