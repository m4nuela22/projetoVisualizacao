
d3.tsv('https://d17r0bacc8bd7n.cloudfront.net/moviedaily.dat.txt')
  .row(row => {
    row.DAILY_PER_THEATER = Number(row.DAILY_PER_THEATER);
    return row;
})
  .get((err, data) => {
    const histogram = d3.histogram()
                        .thresholds(10)
                        .value(d => d.DAILY_PER_THEATER),
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