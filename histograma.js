function histogram (array) {

	// Setando dimensoes e margens do SVG
	var margin = {top: 3, right: 2, bottom: 5, left: 330};
	var width = 160 - margin.left - margin.right;
	var height = 180 - margin.top - margin.bottom;	

	// Criando escalas
	var xScale = d3.scaleLinear().domain([0,100]).range([0,width]);
	var yScale = d3.scaleLinear().domain([0,100]).range([height,0]);
	var zScale = d3.scaleLinear().domain([1000,0]).range([height,0]);
	var cScale = d3.scaleLinear().domain([1000,0]).range([0,width]);	

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

	//Contando número c/s vítimas
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

	// Filtrando apenas dados necessários
	var vitimas = [{nome: "Sem Vítima", vitimas: semVitima}, {nome: "Com Vítima", vitimas: comVitima}];

	// Criando eixos
	var xAxisGroup = mySVG.append("g")
			.attr("class","xAxis")
			.attr("transform","translate(31,"+(height-margin.top+21)+") scale(-1,1)");
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
	var histogram = d3.histogram()
	    .domain(xScale.domain())
	    .thresholds(xAxis.ticks(20));

	mySVG
		.selectAll("rect")
	    .data(vitimas)
	    .enter().append("rect")
	    .attr("transform","translate(30," + (height-margin.top+21)+ ") scale(1,-1)")
	    .attr("x", function(d){return zScale(d.vitimas/10);})
	    .attr("y", 0)
	    .attr("width", 50)
	    .attr("height", function(d) {return zScale(d.vitimas/10);})
	    .attr("fill", function(d) {
      		if (d.nome=="Sem Vítima") {
        		return "blue";
      		} else {
        		return "red";
      		}
    	});

	// Colocando compainhas 
	var text = mySVG.selectAll("circle")
		.data(vitimas)
		.enter()
		.append("text");

	var labelTexts = text
		.attr("x", function(d) {return zScale((d.vitimas+1400)/10); })
	    .attr("y", function(d) {return height + margin.top + margin.bottom + 20;})
	    .text( function (d) { return d.nome; })
	    .attr("font-family", "sans-serif")
		.attr("font-size", "10px")
	    .style("fill", "black");
}
