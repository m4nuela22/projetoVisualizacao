var width = 500;
var mainSVG = d3.selectAll("#mainSVG");
var anoArray = [{value:2015,selected:false},{value:2016,selected:false}];
var mesArray = [{value:"Jan",selected:false},
                {value:"Fev",selected:false},
                {value:"Mar",selected:false},
                {value:"Abr",selected:false},
                {value:"Maio",selected:false},
                {value:"Junho",selected:false},
                {value:"Julho",selected:false},
                {value:"Ago",selected:false},
                {value:"Set",selected:false},
                {value:"Out",selected:false},
                {value:"Nov",selected:false},
                {value:"Dez",selected:false}];
var diaSemanaArray = [{value:"Seg",selected:false},
                      {value:"Ter",selected:false},
                      {value:"Qua",selected:false},
                      {value:"Qui",selected:false},
                      {value:"Sex",selected:false},
                      {value:"Sab",selected:false},
                      {value:"Dom",selected:false}];
var diaArray = [{value:1,selected:false},
                {value:2,selected:false},
                {value:3,selected:false},
                {value:4,selected:false},
                {value:5,selected:false},
                {value:6,selected:false},
                {value:7,selected:false},
                {value:8,selected:false},
                {value:9,selected:false},
                {value:10,selected:false},
                {value:11,selected:false},
                {value:12,selected:false},
                {value:13,selected:false},
                {value:14,selected:false},
                {value:15,selected:false},
                {value:16,selected:false},
                {value:17,selected:false},
                {value:18,selected:false},
                {value:19,selected:false},
                {value:20,selected:false},
                {value:21,selected:false},
                {value:21,selected:false},
                {value:22,selected:false},
                {value:23,selected:false},
                {value:24,selected:false},
                {value:25,selected:false},
                {value:26,selected:false},
                {value:27,selected:false},
                {value:28,selected:false},
                {value:29,selected:false},
                {value:30,selected:false},
                {value:31,selected:false}];
var csv2015;
var csv2016;

function createRecurrentTimeSelectionWidget(dataCSV2015,dataCSV2016){
    csv2015 = dataCSV2015;
    csv2016 = dataCSV2016;
    createRetanglesLine(10,410,anoArray, 15);
    createRetanglesLine(10,420,mesArray, 7);
    createRetanglesLine(10,430,diaSemanaArray,7);
    createRetanglesLine(10,440,diaArray,5);
}

function createRetanglesLine(x,y,array,centerTextValue){
  var totalWidth = 500;
  var retangleSize = totalWidth/array.length;
  var height  = 10;
  mainSVG.selectAll()
  .data(array)
  .enter()
  .append("rect")
  .attr("id",function(d){return "v_" + d.value;})
  .attr("x",function(d,i){return x + i*(retangleSize);})
  .attr("y",y)
  .attr("width",retangleSize)
  .attr("height",height)
  .attr("fill","white")
  .attr("border",2)
  .style("stroke","black")
  .on("click",dateSelected);

  mainSVG.selectAll()
  .data(array)
  .enter()
  .append('text').text(function(d){return d.value;})
      .attr('x', function(d,i){return x + i*(retangleSize) + retangleSize/2 - centerTextValue;})
      .attr('y', y+9)
      .attr('fill', 'black')
      .attr("font-size","10px")
      .on("click",dateSelected);
}

function dateSelected(d,i,array){
  console.log(d + "," + i);
  //#A9A9A9
  if(array[i].selected == true){
    array[i].selected = false;
    d3.select("#v_"+d.value)
    .attr("fill","white");
  }else{
    array[i].selected = true;
    d3.select("#v_"+d.value)
    .attr("fill","#A9A9A9");
  }
}
