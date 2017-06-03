var width = 500;
var mainSVG = d3.selectAll("#mainSVG");
var anoArray = [{id:"a_2015",value:2015,selected:false},{id:"a_2016",value:2016,selected:false}];
var mesArray = [{id:"m_1",value:"Jan",selected:false},
                {id:"m_2",value:"Fev",selected:false},
                {id:"m_3",value:"Mar",selected:false},
                {id:"m_4",value:"Abr",selected:false},
                {id:"m_5",value:"Maio",selected:false},
                {id:"m_6",value:"Junho",selected:false},
                {id:"m_7",value:"Julho",selected:false},
                {id:"m_8",value:"Ago",selected:false},
                {id:"m_9",value:"Set",selected:false},
                {id:"m_10",value:"Out",selected:false},
                {id:"m_11",value:"Nov",selected:false},
                {id:"m_12",value:"Dez",selected:false}];
var diaSemanaArray = [{id:"ds_1",value:"Seg",selected:false},
                      {id:"ds_2",value:"Ter",selected:false},
                      {id:"ds_3",value:"Qua",selected:false},
                      {id:"ds_4",value:"Qui",selected:false},
                      {id:"ds_5",value:"Sex",selected:false},
                      {id:"ds_6",value:"Sab",selected:false},
                      {id:"ds_0",value:"Dom",selected:false}];
var diaArray = [{id:"d_1",value:1,selected:false},
                {id:"d_2",value:2,selected:false},
                {id:"d_3",value:3,selected:false},
                {id:"d_4",value:4,selected:false},
                {id:"d_5",value:5,selected:false},
                {id:"d_6",value:6,selected:false},
                {id:"d_7",value:7,selected:false},
                {id:"d_8",value:8,selected:false},
                {id:"d_9",value:9,selected:false},
                {id:"d_10",value:10,selected:false},
                {id:"d_11",value:11,selected:false},
                {id:"d_12",value:12,selected:false},
                {id:"d_13",value:13,selected:false},
                {id:"d_14",value:14,selected:false},
                {id:"d_15",value:15,selected:false},
                {id:"d_16",value:16,selected:false},
                {id:"d_17",value:17,selected:false},
                {id:"d_18",value:18,selected:false},
                {id:"d_19",value:19,selected:false},
                {id:"d_20",value:20,selected:false},
                {id:"d_21",value:21,selected:false},
                {id:"d_22",value:22,selected:false},
                {id:"d_23",value:23,selected:false},
                {id:"d_24",value:24,selected:false},
                {id:"d_25",value:25,selected:false},
                {id:"d_26",value:26,selected:false},
                {id:"d_27",value:27,selected:false},
                {id:"d_28",value:28,selected:false},
                {id:"d_29",value:29,selected:false},
                {id:"d_30",value:30,selected:false},
                {id:"d_31",value:31,selected:false}];

var horaArray = [{id:"h_0",value:0,selected:false},
                {id:"h_1",value:1,selected:false},
                {id:"h_2",value:2,selected:false},
                {id:"h_3",value:3,selected:false},
                {id:"h_4",value:4,selected:false},
                {id:"h_5",value:5,selected:false},
                {id:"h_6",value:6,selected:false},
                {id:"h_7",value:7,selected:false},
                {id:"h_8",value:8,selected:false},
                {id:"h_9",value:9,selected:false},
                {id:"h_10",value:10,selected:false},
                {id:"h_11",value:11,selected:false},
                {id:"h_12",value:12,selected:false},
                {id:"h_13",value:13,selected:false},
                {id:"h_14",value:14,selected:false},
                {id:"h_15",value:15,selected:false},
                {id:"h_16",value:16,selected:false},
                {id:"h_17",value:17,selected:false},
                {id:"h_18",value:18,selected:false},
                {id:"h_19",value:19,selected:false},
                {id:"h_20",value:20,selected:false},
                {id:"h_21",value:21,selected:false},
                {id:"h_22",value:22,selected:false},
                {id:"h_23",value:23,selected:false}];
var csv2015;
var csv2016;

function createRecurrentTimeSelectionWidget(dataCSV2015,dataCSV2016){
    csv2015 = dataCSV2015;
    csv2016 = dataCSV2016;
    createRetanglesLine(10,410,anoArray, 15);
    createRetanglesLine(10,420,mesArray, 7);
    createRetanglesLine(10,430,diaSemanaArray,7);
    createRetanglesLine(10,440,diaArray,5);
    createRetanglesLine(10,450,horaArray,6);
}

function createRetanglesLine(x,y,array,centerTextValue){
  var totalWidth = 500;
  var retangleSize = totalWidth/array.length;
  var height  = 10;
  mainSVG.selectAll()
  .data(array)
  .enter()
  .append("rect")
  .attr("id",function(d){return d.id;})
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

function dateSelected(d){
  console.log(d);
  //#A9A9A9
  if(d.selected == true){
    d.selected = false;
    d3.select("#" + d.id)
    .attr("fill","white");
  }else{
    d.selected = true;
    d3.select("#" + d.id)
    .attr("fill","#A9A9A9");
  }
  searchOnDatabase();
}

function searchOnDatabase(){
  var anoFiltered = anoArray.filter(function(d){return d.selected == true;}).map(function(d){return d.value;});
  var mesFiltered = mesArray.filter(function(d){return d.selected == true;}).map(function(d){return d.value;});
  var diaSemanaFiltered = diaSemanaArray.filter(function(d){return d.selected == true;}).map(function(d){return d.value;});
  var diaFiltered = diaArray.filter(function(d){return d.selected == true;}).map(function(d){return d.value;});

  var result  = [];

  if (anoFiltered.indexOf(2015) != -1){
    results.concat(findRowsByDateTime(csv2015,mesFiltered,diaSemanaFiltered,diaFiltered));
  }

  if(anoFiltered.indexOf(2016)!= -1){
    results.concat(findRowsByDateTime(csv2016,mesFiltered,diaSemanaFiltered,diaFiltered));
  }

}

function findRowsByDateTime(database,mesFiltered,diaSemanaFiltered,diaFiltered){
  for (var i = 0 ; i<database.length; i++){
      var row = database[i];
      var date = row.data;
      var time = row.hora;

      if (date != null && date != undefined){

      }
  }

}
