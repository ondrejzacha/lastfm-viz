function show() {
    'use strict';

    let margin = { top: 140, bottom: 40, right: 40, left: 140 },
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    let chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    // chart configuration
    const maxRadius = 200;

    d3.json('../../notebooks/json8.json', function (data) {

        chart.on('click', onclick);
        var currentMonth = '2011-03-31';
        let months = [
            '2011-03-31', '2011-06-30', '2011-09-30', '2011-12-31', '2012-03-31', '2012-06-30', '2012-09-30',
            '2012-12-31', '2013-03-31', '2013-06-30', '2013-09-30', '2013-12-31', '2014-03-31', '2014-06-30',
            '2014-09-30', '2014-12-31', '2015-03-31', '2015-06-30', '2015-09-30', '2015-12-31', '2016-03-31',
            '2016-06-30', '2016-09-30', '2016-12-31', '2017-03-31', '2017-06-30', '2017-09-30', '2017-12-31',
            '2018-03-31', '2018-06-30', '2018-09-30', '2018-12-31', '2019-03-31', '2019-06-30', '2019-09-30',
            '2019-12-31'
        ]

        function onclick(){
            console.log('before', currentMonth)
            currentMonth = months.shift();
            chart.selectAll('circle')
                .transition().duration(1000)
                .attr("r", d => Math.sqrt(+d['data'][currentMonth]) * 3)
        }

        initializeBubbles(currentMonth)

        function initializeBubbles(month) {
            console.log('running initializeBubbles')

//            const maxCount = 10; //d3.max(data_month, d => Math.sqrt(d.tag_count));
//
//            let bubbleRadius = d3.scaleLinear()
//              .domain([0, maxCount])
//              .range([0, maxRadius]);

            // Initialize all bubble groups
            let bubbles = chart.selectAll('g').data(data)
              .enter().append('g')
                .attr("transform", (d, i) => "translate(" +
                    (margin.left + i / 11 * width) + "," +
                    (margin.top + i / 11 * height) + ")"
                );

            bubbles
              .append('circle')
                .attr('r', 0)
                .transition().duration(1000)
                .attr("r", d => Math.sqrt(+d['data'][month]) * 3)
                .attr("class", 'bubble');

            bubbles
              .append('text')
                .text(d => d.tag)
                .attr('class', 'label');

        }

    });
}

