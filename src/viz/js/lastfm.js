function show() {
    'use strict';

    // Config ---------------
    const margin = { top: 40, bottom: 40, right: 40, left: 40 },
        width = window.innerWidth - margin.left - margin.right,
        height = window.innerHeight - margin.top - margin.bottom;

    const maxRadius = 200;

    // Initialization ---------------
    let chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    let monthLabel = chart.append('text')
        .attr('class', 'month')
        .attr('x', width / 2)
        .attr('y', height + margin.top);
    // End initialization ---------------


    d3.json('../../notebooks/json8.json', function (data) {

        // Initialize all bubble groups
        let bubbles = chart.selectAll('g').data(data)
          .enter().append('g')
            .attr("transform", (d, i) => "translate(" +
                (margin.left + Math.random() * width) + "," +
                (margin.top + Math.random() * height) + ")"
            );

        let circles = bubbles
          .append('circle')
            .attr('r', 0)
            .attr("class", 'bubble');

        let circleLabels = bubbles
          .append('text')
            .text(d => d.tag)
            .attr('class', 'label')
            .style('font-size', '0px');

        let months = [
            '2011-03-31', '2011-06-30', '2011-09-30', '2011-12-31', '2012-03-31', '2012-06-30', '2012-09-30',
            '2012-12-31', '2013-03-31', '2013-06-30', '2013-09-30', '2013-12-31', '2014-03-31', '2014-06-30',
            '2014-09-30', '2014-12-31', '2015-03-31', '2015-06-30', '2015-09-30', '2015-12-31', '2016-03-31',
            '2016-06-30', '2016-09-30', '2016-12-31', '2017-03-31', '2017-06-30', '2017-09-30', '2017-12-31',
            '2018-03-31', '2018-06-30', '2018-09-30', '2018-12-31', '2019-03-31', '2019-06-30', '2019-09-30',
            '2019-12-31'
        ];
        let currentMonth;
        let radCount = 0;

        function radiusScale(x) {
          return Math.sqrt(x) * 6 || 0;
        }

        function currentRadiusFun(d) {
            let res = radiusScale(d['data'][currentMonth]) || 0.001;

            if (d['tag'] == 'indie') {
                console.trace()
                console.log('-------------------------------------------------------------------------')
                console.log('month, count, d', currentMonth, d);
                console.log(d['data'][currentMonth]);
                console.log('result', res);
            }
            return res;
        };

        let forceCollide = d3.forceCollide().radius(currentRadiusFun).iterations(5).strength(0.7)
        let forceAttraction = d3.forceManyBody().strength(80) // attraction

        let simulation = d3.forceSimulation()
            .force("collide", forceCollide)
            .force("charge", forceAttraction)
            .force("center", d3.forceCenter(width / 2, height / 2));

        simulation.nodes(data).on('tick', ticked)

        function ticked() {
          bubbles
            .transition().duration(500)
            .attr("transform", (d, i) => "translate(" +
                d.x + "," +
                d.y + ")"
            );
        }

        chart.on('click', onclick);

        function onclick(){

            currentMonth = months.shift() || 'end!';

            forceCollide.initialize(simulation.nodes());
            forceAttraction.initialize(simulation.nodes());
            simulation.restart();

            monthLabel.text(currentMonth);

            circles
                .transition().duration(1000)
                .attr("r", currentRadiusFun)

            circleLabels
                .transition().duration(1000)
                .style("font-size", d => (Math.floor(Math.sqrt(+d['data'][currentMonth]))) + 'px')
        }

    });
}


//            const maxCount = 10; //d3.max(data_month, d => Math.sqrt(d.tag_count));
//
//            let bubbleRadius = d3.scaleLinear()
//              .domain([0, maxCount])
//              .range([0, maxRadius]);
