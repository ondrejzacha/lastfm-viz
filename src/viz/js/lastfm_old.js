function show() {
    'use strict';

    var margin = { top: 40, bottom: 40, right: 40, left: 40 },
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + ","
                                        + margin.top + ")");

    // chart configuration
    var namesToShow = 10;
    var barWidth = 20;
    var barMargin = 5;

    // First we're going to load the data
    d3.csv('data/yob2015.txt', function (d) { return { name: d.name, sex: d.sex, amount: +d.amount }; }, function (data) {

        // Step 0. If you're interested that is. Use console.log to output the data
        console.log(data);

        // group the data and get the top n females, and the top males
        // we also, at the same moment, convert the amount to a number
        var grouped = _.groupBy(data, 'sex');
        var top10F = grouped['F'].slice(0, namesToShow);
        var top10M = grouped['M'].slice(0, namesToShow);

        var both = top10F.concat(top10M.reverse());

        console.log(both);

        // We've already created the SVG groups and positioned them
        // using the transform property.
        var bars = chart.selectAll("g").data(both)
            .enter().append('g')
            .attr('transform', function (d, i) {
                var yPos = ((barWidth + barMargin) * i);
                return 'translate( 0 ' + yPos +  ')';
            });

        // Step 1. Setup a d3.scaleLinear that handles the width of the bars.
        const maxAmount = d3.max(both, d => d.amount);

        var yScale = d3.scaleLinear()
                 .domain([0, maxAmount])
                 .range([0, width])
        
        // You can use the d3.max(both, function(d) { return d.amount}) to
        // determine the max value.
        // now when you call yScale(amount), you get back the correct width

        // var yScale = ...

        // Step 2. To each element of the bars selection append a 'rect' and set
        // the height to 'barWidth', and the width to yScale(d.amount). Finally
        // if 'sex === F' set class to 'female' else set it to 'male'

        var t = d3.transition()
            .duration(2000)
            .ease(d3.easePoly);

        bars.append('rect')
            .attr("height", barWidth)
            .transition(t)
            .attr("width", d => yScale(d.amount))
            .attr("class", function (d) { if (d.sex === 'F') {return 'female';} else {return 'male'}});

        // Step 3. Also add the popular name as a 'text' element. Set the class
        // to 'label' and the text to d.name

        bars.append("text")
            .attr("class", 'label')
            .attr("y", barWidth / 2)
            .attr("dy", ".35em")
            .text(d => d.name)
            .transition(t)
            .attr("x", function (d) { return yScale(d.amount) - 5 ; });

        // Step 4. without a legend it is difficult to see what the scores mean
        // so lets add that as well. We add a bottomAxis and a top axis.
        // Set the scale to yScale, set 20 ticks, and use 's' for ticksformat
        //
        // Should look something like this:
          var bottom = d3.axisBottom().scale(yScale).ticks(10, 's');
          var top = d3.axisTop().scale(yScale).ticks(20, "s");

        // Step 5. After creation, add them to the chart. Make sure to set the
        // correct translate value to position them correctly.
        // and add them to the chart

        chart.append("g")
            .attr('transform', 'translate( 0 ' + (barWidth + barMargin) * namesToShow * 2 +  ')')
            .call(bottom);
        
        console.log(height);
        console.log(barMargin);

        chart.append("g")
            .attr('transform', 'translate( 0 ' + -barMargin + ' )')
            .call(top);

        // Step 6. Optionally. when you append the rectangles we can
        //         use a transition, as well. Use a transition to
        //         slowly grow the width of the rectangle when adding
        // bars.transition().duration(2000)
        // .attr("width", 0)
        // .style("opacity", 0)
    });
}

