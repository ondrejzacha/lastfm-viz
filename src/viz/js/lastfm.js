function show() {
    'use strict';

    var margin = { top: 40, bottom: 40, right: 40, left: 40 },
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)


    // chart configuration
    var namesToShow = 10;
    var barWidth = 20;
    var barMargin = 5;
    const maxRadius = 100;

    // First we're going to load the data
    d3.csv(
    '../../data/sample_counts.csv',
    function (d) { return { tag: d.tag, ts: d.ts, tag_count: +d.tag_count }; },
    function (data) {

        // Step 0. If you're interested that is. Use console.log to output the data
        console.log(data);
        console.log(data[0]);

//        chart.on('click', onclick);
//
//        function onclick(d):

        // We've already created the SVG groups and positioned them
        // using the transform property.
        var bubbles = chart.selectAll('g').data(data)
          .enter().append('g')
            .attr("transform", d => "translate(" +
                Math.random() * width + "," +
                Math.random() * height + ")"
            );

        // Step 1. Setup a d3.scaleLinear that handles the width of the bars.
        const maxCount = d3.max(data, d => Math.sqrt(d.tag_count));

        let bubbleRadius = d3.scaleLinear()
          .domain([0, maxCount])
          .range([0, maxRadius]);

        bubbles
          .append('circle')
            .attr('r', 0)
            .transition().duration(1000)
            .attr("r", d => bubbleRadius(Math.sqrt(d.tag_count)))
            .attr("class", 'bubble');

        bubbles
          .append('text')
            .text(d => d.tag)
            .attr('class', 'label');

    });
}

