const width = 1366;
const height= 660;

const svg = d3.select('svg');
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

//mpg, weight, horsepower, acceleration, year, origin, name, cylinders, displacement

const render = data => {
    const title = "Cars: Weight vs Horsepower";
    const xValue = d => d.weight;
    const xAxisLabel = "Weight";
    const yValue = d => d.horsepower;
    const yAxisLabel = "Horsepower";
    const circleRadius = 15;
    const margin = {
        top: 80,
        bottom: 80,
        left: 150,
        right: 150
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .attr("class", "d3tooltip")
    .text("a simple tooltip");

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice();

    const yScale = d3.scaleLinear()
    .domain(d3.extent(data, yValue))
        .range([0, innerHeight])
        .nice();

    const g = svg.append('g')
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
    
    const xAxis = d3.axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickPadding(15);
    
    const yAxis = d3.axisLeft(yScale) 
        .tickSize(-innerWidth)
        .tickPadding(15);

    const yAxisG = g.append('g').call(yAxis);
    yAxisG.selectAll('domain').remove();
    

    yAxisG.append('text')
        .text(yAxisLabel)
        .attr('fill', 'black')
        .attr('x', -innerHeight / 2)
        .attr('y', -60)
        .attr('text-anchor', 'middle')
        .attr('class', 'xy-title')
        .attr("transform", "rotate(-90)");
    
    const xAxisG = g.append('g').call(xAxis)
        .attr("transform", "translate(" + 0 + ", " + innerHeight + ")");

    xAxisG.append('text')
        .text(xAxisLabel)
        .attr('fill', 'black')
        .attr('x', innerWidth / 2)
        .attr('y', 60)
        .attr('class', 'xy-title');

    g.selectAll('.domain').remove();

    g.append('text')
        .text(title)
        .attr('class', 'title-bar')
        .attr('y', -20)
        .attr('x', 300);

    g.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cy', d => yScale(yValue(d)))
        .attr('cx', d => xScale(xValue(d)))
        .attr('r', circleRadius)
        .on("mouseover", function(d){tooltip.html(d.name + "<br/>" + d.origin + ", " + d.year); return tooltip.style("visibility", "visible");})
        .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
};

d3.csv('auto-mpg.csv').then(data => {
    data.forEach(d => {
        d.mpg = +d.mpg;
        d.cylinders = +d.cylinders;
        d.displacement = +d.displacement;
        d.weight = +d.weight;
        d.horsepower = +d.horsepower;
        d.acceleration = +d.acceleration;
        d.year = +d.year;
    });
    render(data);
});