var semVitima = 0;
var comVitima = 0;

d3.csv('acidentesTransito2016.csv')
  .row(row => {
    if (row.tipo == "SEM VÍTIMA") {
      semVitima = semVitima+1;
    } else {
      comVitima = comVitima+1;
    }
    return row;
})
  .get((err, data) => {
    const histogram = d3.histogram()
                        .thresholds(10)
                        .value(d => d.tipo),
          histogramData = histogram(data),
          width = 600,
          height = 300;
  
    const svg = d3.select('svg'),
          xScale = d3.scaleLinear()
                     .range([0, width])
                     .domain([0, d3.max(histogramData, d => d.x1)]),
          yScale = d3.scaleLinear()
                     .range([0, height])
                     .domain([0, d3.max(histogramData, d => d.length)]);
  
    svg.selectAll('rect')
       .data(histogramData)
       .enter()
       .append('rect')
       .attr('width', d => xScale(d.x1-d.x0)-2)
       .attr('height', d => yScale(d.length))
       .attr('x', d => xScale(d.x0)+2)
       .attr('y', d => height - yScale(d.length));
});