function show() {
    'use strict';

    let margin = { top: 40, bottom: 40, right: 40, left: 40 },
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    let chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)


    // chart configuration
    const namesToShow = 10;
    const barWidth = 20;
    const barMargin = 5;
    const maxRadius = 100;

    // First we're going to load the data
    d3.json(
//    '../../data/sample_counts.csv',
    '../../notebooks/json2.json',
//    function (d) { return { tag: d.tag, ts: d.ts, tag_count: +d.tag_count }; },
    function (data) {

        // Step 0. If you're interested that is. Use console.log to output the data
        console.log(data);



        chart.on('click', onclick);
        var currentMonth = '2011-03-31'

        function onclick(d){
            console.log('before', currentMonth)
            console.log('clicked')
            currentMonth = '2011-06-30'
            console.log(currentMonth)
            showBubbles(currentMonth)
        }


        showBubbles(currentMonth)

        function showBubbles(month) {
            let data_month = data[month];
            console.log(data_month);

            // We've already created the SVG groups and positioned them
        // using the transform property.
        let bubbles = chart.selectAll('g').data(data_month)
          .enter().append('g')
            .attr("transform", (d, i) => "translate(" +
                (margin.left + i / 11 * width) + "," +
                (margin.top + i / 11 * height) + ")"
            );

        // Step 1. Setup a d3.scaleLinear that handles the width of the bars.
        const maxCount = d3.max(data_month, d => Math.sqrt(d.tag_count));

        let bubbleRadius = d3.scaleLinear()
          .domain([0, maxCount])
          .range([0, maxRadius]);

        bubbles
          .append('circle')
            .attr('r', 10)
            .transition().duration(1000)
            .attr("r", d => bubbleRadius(Math.sqrt(d.tag_count)))
            .attr("class", 'bubble');

        bubbles
          .append('text')
            .text(d => d.tag)
            .attr('class', 'label');

        chart.selectAll('g').transition().duration(5000).remove()
        }





    });
}

