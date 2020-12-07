// console.log('sim sim salabim');
// 'use strict'

function getTopicObject(arr) {
    var obj = {};

    arr.forEach(i => {
        i.topic.forEach(t => {
            if (!obj.hasOwnProperty(t)) {
                obj[t] = 1
            } else {
                obj[t] += 1;
            }
        });
    });

    return obj;
}

$.getJSON("./data/cleanData.json", jsonData => {
    // console.log(typeof jsonData);
    // console.log(Array.isArray(jsonData) );
    // console.log(jsonData.length);

    var dataObj = getTopicObject(jsonData);
    console.log(dataObj)
    // console.log(Object.keys(dataObj).length)
    // console.log(Object.entries(dataObj))
    // console.log(Object.values(dataObj))


    // set the dimensions and margins of the graph
    var width = 1000,
        height = 650,
        margin = 40,
        legendRectSize = 20,
        legendSpacing = 4;

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin

    // append the svg object to the div called 'my_dataviz'
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 3 + "," + height / 2 + ")");

    // set the color scale
    // var color = d3.scaleSequential()
    //     .domain(dataObj)
    // .interpolator(d3.interpolateGreys);
    var color = d3.scaleOrdinal()
        .domain(dataObj)
        .range(d3.schemeCategory20c);
    // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])

    // Compute the position of each group on the pie:
    var pie = d3.pie()
        .value((d) => {
            return d.value;
        })
    var data_ready = pie(d3.entries(dataObj))
    console.log(data_ready)

    // The arc generator
    var arc = d3.arc()
        .innerRadius(radius * 0.5) // This is the size of the donut hole
        .outerRadius(radius * 0.9)

    // Another arc that won't be drawn. Just for labels positioning
    var outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9)

    // tool tip fo hover states
    var tooltip = d3.select('#my_dataviz') // NEW
        .append('div') // NEW
        .attr('class', 'tooltip'); // NEW

    tooltip.append('div') // NEW
        .attr('class', 'label'); // NEW

    tooltip.append('div') // NEW
        .attr('class', 'count'); // NEW


    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
        .selectAll('whatever')
        .data(data_ready)
        .enter()
        .append('path')
        // .attr('d', d3.arc()
        //     .innerRadius(100) // This is the size of the donut hole
        //     .outerRadius(radius)
        // )
        .attr('d', arc)
        .attr('fill', (d) => {
            return (color(d.data.key));
        })
        .attr("stroke", "none")
        .style("stroke-width", "2px")
        .style("opacity", 0.9)


    // mouse over
    var path = svg.selectAll('path')
        .data(pie(data_ready))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', (d, i) => {
            return color(d.data.key);
        });

    path.on('mouseover', (d) => { // NEW
        tooltip.select('.label').html(d.data.key); // NEW
        tooltip.select('.count').html(d.data.value); // NEW
        tooltip.style('display', 'block'); // NEW
    }); // NEW

    path.on('mouseout', () => { // NEW
        tooltip.style('display', 'none'); // NEW
    });

    // legend
    var legend = svg.selectAll('.legend')
        .data(color.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => {
            var height = legendRectSize + legendSpacing;
            var offset = height * color.domain().length / 12;
            var horz = 15 * legendRectSize;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        })
        .attr('font-family', 'arial');

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color);

    legend.append('text')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text((d) => {
            return d;
        });
});