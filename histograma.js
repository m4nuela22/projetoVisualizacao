function histogram (array) {

	// Setando dimensoes e margens do SVG
	var margin = {top: 3, right: 2, bottom: 5, left: 330};
	var width = 160 - margin.left - margin.right;
	var height = 180 - margin.top - margin.bottom;		

	// Criando SVG
	var myUpdate = d3.select("body")
		.selectAll("svg")	

	var mySVG = d3.select("body").append("svg")
			.attr("width", width + margin.left + margin.right + 40)
			.attr("height", height + margin.top + margin.bottom + 30)
			.style("overflow", "visible")
			.style("position", "absolute")
			.style("top", 0)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
	console.log(comVitima);
	console.log(semVitima);

	// Criando escalas
	var xScale = d3.scaleLinear().domain([0,100]).range([0,130]);
	var yScale = d3.scaleLinear().domain([0,semVitima + comVitima]).range([height,0]);
	var histogramScale = d3.scaleLinear().domain([semVitima + comVitima,0]).range([height,0]);

	// Filtrando apenas dados necessários
	var vitimas = [{nome: "Sem Vítima", vitimas: semVitima}, {nome: "Com Vítima", vitimas: comVitima}];

	// Criando eixos
	var xAxisGroup = mySVG.append("g")
			.attr("class","xAxis")
			.attr("transform","translate(30,"+(height-margin.top+21)+")");
	var xAxis = d3.axisBottom(xScale)
			.ticks(0);
	xAxisGroup.call(xAxis);
	var yAxisGroup = mySVG.append("g")
			.attr("class","yAxis")
			.attr("transform","translate(30,18)")
			.attr("stroke","black");
	var yAxis = d3.axisLeft(yScale);
	yAxisGroup.call(yAxis);

	// Criando histograma
	mySVG
		.selectAll("rect")
	    .data(vitimas)
	    .enter().append("rect")
	    .attr("transform","translate(30," + (height-margin.top+21)+ ") scale(1,-1)")
	    .attr("x", function(d){
	    	if (d.nome=="Sem Vítima") {
        		return 10;
      		} else {
        		return 69;
      		}
	    })
	    .attr("y", 0)
	    .attr("width", 50)
	    .attr("height", function(d) {return histogramScale(d.vitimas);})
	    .attr("fill", function(d) {
      		if (d.nome=="Sem Vítima") {
        		return "blue";
      		} else {
        		return "red";
      		}
    	});

	// Colocando textos 
	var text = mySVG.selectAll("circle")
		.data(vitimas)
		.enter()
		.append("text");

	var labelTexts = text
		.attr("transform","translate(30,0)")
		.attr("x", function(d) {
			if (d.nome=="Sem Vítima") {
        		return 10;
      		} else {
        		return 69;
      		}
	    })
	    .attr("y", function(d) {return height + margin.top + margin.bottom + 20;})
	    .text( function (d) { return d.nome; })
	    .attr("font-family", "sans-serif")
		.style("font-size", "9px")
	    .style("fill", "black");
}