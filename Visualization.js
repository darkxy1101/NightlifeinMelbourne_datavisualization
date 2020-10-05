window.onload = function() {
    
    var width = 1300;
    var height = 2500;
    
    var svg = d3.select("svg")
                   .attr("width", width)
                   .attr("height", height)
                   .attr("class", "svgCanvas");
    
    var margin = {top:50, right:5, bottom:10, left:5}
    width = width - margin.left-margin.right;
    height = height - margin.top;
    //pocation of layout
    layout_one_width = width/2 + margin.right
    layout_one_height = height/10
    layout_two_width = width*4.7/10
    layout_two_height = height/10
    layout_three_width = width/2
    layout_three_height = height/10
    //size of chart
    chart_h = 200
    chart_w = 350
    
    var xScale = d3.scaleBand().range([0, chart_w]).padding(0.1),
        yScale = d3.scaleLinear().range([chart_h, 0]);
    
    svg.append('line').attr('x1', 0).attr('y1', height*0.1-120).attr('x2', width + margin.left).attr('y2', height*0.1-120)
        .attr('stroke', 'white')
        .attr("stroke-width", 6);
    //Layout One: the Bar chart
    var barchartOne = svg.append("g").attr("transform", "translate(" + layout_one_width + "," + layout_one_height*2.7 + ")");
    d3.csv("layoutbarchart.csv", function(data){        
        xScale.domain(data.map(function(d) {return d.CensusYear}));
        yScale.domain([0, d3.max(data, function(d) {return parseInt(d.NumberOfPlaces);})]);
        //Add x axis  
        barchartOne.append("g").attr("class", "axisWhite").attr("transform", "translate(0," + chart_h + ")").call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "translate(-10, 6)rotate(-45)")
            .style("text-anchor", "end")
            .style("font-size", 10)
            .style("fill", "white")
            .attr("font-family", "cursive");
        
        
        barchartOne.append("text").attr("text-anchor", "start")
            .attr("y", -25)
            .attr("x", -chart_w*1.3)
            .text("--> Try to light the node of Melbourne(CBD), which changing trend line you will see... ")
            .style("font-size", 15)
            .style("fill", "white")
            .attr("font-family", "cursive");
        
        barchartOne.selectAll("bar").data(data).enter().append("rect").attr("class", "bar")
                    .attr("x", function(d) {return xScale(d.CensusYear);})
                    .attr("y", function(d) {return yScale(d.NumberOfPlaces);})
                    .attr("width", xScale.bandwidth())
                    .attr("height", function(d) {return chart_h - yScale(d.NumberOfPlaces);})
                    .attr("fill", "#870000")
                    .attr("opacity", 0.7)
    
    })
    
    //Layout One: the line in the Bar chart
    var yScaleLine = d3.scaleLinear().range([chart_h, 0]);
    line_w = layout_one_width+chart_w
    var linechartOne = svg.append("g").attr("transform", "translate(" + line_w + "," + layout_one_height*2.7 + ")"); 
    d3.csv("layoutlinechart.csv", function(data) {
        linedata = d3.nest().key(function(d) {return d.CLUESmallArea}).entries(data);
        var keys = ['Carlton', 'Docklands', 'East Melbourne', 'Kensington', 'Melbourne (CBD)', 'Melbourne (Remainder)', 'North Melbourne', 'Parkville', 'South Yarra', 'Southbank', 'West Melbourne (Residential)']
        var color = d3.scaleOrdinal().domain(keys)
                      .range(["#fff7ec","#fee9cb","#fdd8a9","#fdc28c","#fca16d","#f67b52","#e65339","#ce2619","#ab0604","#7f0000"])
        var line = d3.line().x(function(d) {return xScale(d.CensusYear);}).y(function(d) {return yScaleLine(d.NumberOfPlaces);})
                     .curve(d3.curveMonotoneX)
        
        yScaleLine.domain([0,  1.5*d3.max(data, function(d) {return +d.NumberOfPlaces;})]);
        linechartOne.append("g").attr("class", "axisWhite")
            .call(d3.axisRight(yScaleLine).tickFormat(function(d){return d;}).ticks(5))
            .selectAll("text")
            .style("font-size", 10)
            .style("fill", "white")
            .attr("font-family", "cursive");

        var allLables = linechartOne.append("g").attr("transform", "translate(" + (-chart_w*2)  + "," + (-chart_h/4) + ")");
        allLables.selectAll("alllables")
                .data(keys)
                .enter()
                .append("text")
                .text(function(d) { return d;})
                .attr("x", 100)
                .attr("y", function(d,i){ return 100 + i*15})
                .style("fill", "white")
                .text(function(d){ return d})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .style("font-size", 12)
                .attr("font-family", "cursive")
        
        var alldot = linechartOne.append("g").attr("transform", "translate(" + (-chart_w*2) + "," + (-chart_h/4) + ")");
        allDOTs = alldot.selectAll("mydots")
                        .data(keys)
                        .enter()
                        .append("circle")
                        .attr("cx", 90)
                        .attr("cy", function(d,i){ return 100 + i*15}) 
                        .attr("r", 5)
                        .style("fill", "white")
                        .style("opacity", "0.1")
        
        var alllines = barchartOne.selectAll("lines")
                    .data(linedata).enter()
                    .append("path")
                     .attr("d", function(d) {
                        return d3.line()
                                .x(function(d) {return xScale(d.CensusYear);})
                                .y(function(d) {return yScaleLine(+d.NumberOfPlaces);})
                                (d.values)
                    })
                     .attr("fill", "none")
                     .attr("stroke", "white")
                     .attr("stroke-width", 2)
                     .style("opacity", "0")
        
        allDOTs.on("mouseover", function(d) {
            allDOTs.style("opacity", "0.1")
            dot = d3.select(this)
            dot.style("opacity", "1")
            alllines.style("opacity", function(l) { return d3.select(this).datum().key === dot.datum() ? '1' : '0';}) 

        })
        .on('mouseout', function (d) {
            allDOTs.style("opacity", "0.1")
            alllines.style("opacity", "0")
        })
    })
    
    //Layout One: The choropleth map
    var mapcolorScale = d3.scaleThreshold().range(d3.schemeReds[4]);
    var mapOne = svg.append("g").attr("transform", "translate(" + layout_one_width + "," + layout_one_height + ")");
    d3.csv("layoutmap.csv", function(mapdata) {
        standard = [1, 10, 100];
        mapcolorScale.domain(standard);
        mapOne.selectAll("row").data(standard).enter()
            .append("circle").attr("cx", -200)
            .attr("cy", function(d,i){return 0 + i*60}).attr("r", 12)
            .style("opacity", "0.8")
            .attr("fill", function(d){return mapcolorScale(d)})
        
        mapOne.selectAll("allLegend").data(standard).enter().append("text")
                .text(function(d) { return  d;})
                .attr("x", -200)
                .attr("y", function(d,i){return (-20) + i*60})
                .style("fill", "white")
                .attr("text-anchor", "middle")
                .style("alignment-baseline", "middle")
                .style("font-size", 12)
                .attr("font-family", "cursive")
            
        
        d3.json("CLUE.geojson", function(json) {
                for(var i = 0; i < mapdata.length; i++){
                    var dataSmallArea = mapdata[i].CLUESmallArea;
                    var dataValue = parseFloat(mapdata[i].numberofplaces);
                    for(var n = 0; n < json.features.length; n++){
                        var jsonSmallArea = json.features[n].properties.featurenam;
                        if(dataSmallArea == jsonSmallArea){
                            json.features[n].properties.value = dataValue;
                            break;
                        }    
                    }
                }
            
                var projection = d3.geoMercator().scale(200000).center([144.88, -37.77])
                                    .translate([-200,-10]);

                var choroplethmap = mapOne.selectAll("path").data(json.features).enter()
                  .append("path").attr("d", d3.geoPath().projection(projection))
                  .style("fill", function(d){
                        var value = d.properties.value;
                        if(value){
                            if (value >= 100 ) {return mapcolorScale(100);}
                            if (value >= 10 && value < 100) {return mapcolorScale(10);}
                            if (value >= 1 && value < 10) {return mapcolorScale(1);}
                        } else {
                            return "#ccc"
                        }

                    })
                .style("opacity", "0.8")
                .style("stroke", "#575c6e")
                .style("stroke-width", "2px");
                        
                var allareaname = mapOne.append("g").selectAll("text").data(json.features).enter()
                    .append("text").text(function(d) { return d.properties.featurenam;})
                    .attr("x", -10)
                    .attr("y", 320)
                    .attr("text-anchor", "left")
                    .style("alignment-baseline", "middle")
                    .style("font-size", 12)
                    .attr("font-family", "cursive")
                    .style("fill", "white")
                    .style("opacity", "0");
                
                choroplethmap.on("mouseover", function(d) {
                    d3.selectAll("areas").transition().duration(200).style("opacity", 0.5)
                    var thisarea = d3.select(this)
                    thisarea.transition().duration(200).style("opacity", 1).style("stroke", "white")
                    allareaname.transition().duration(200).style("opacity", function(l) { 
                        return d3.select(this).datum().properties.featurenam === thisarea.datum().properties.featurenam ? '1' : '0';})
                    
                    
                } )
                            .on("mouseleave", function(d) {
                    d3.selectAll("areas").transition().duration(200).style("opacity", 0.8)
                    d3.select(this).transition().duration(200).style("opacity", 0.8).style("stroke", "#575c6e")
                    allareaname.transition().duration(200).style("opacity",0)
                } )
            
                mapOne.append("text").attr("text-anchor", "end").attr("transform", "rotate(0)")
                            .attr("y", -35)
                            .attr("x", 500)
                            .text("Do you think which is the most popular cluster of nightlife place? ")
                            .style("font-size", 15)
                            .style("fill", "white")
                            .attr("font-family", "cursive");
                mapOne.append("text").attr("text-anchor", "end").attr("transform", "rotate(0)")
                            .attr("y", -10)
                            .attr("x", 500)
                            .text("Try to move mouse on the Map to see that ...")
                            .style("font-size", 15)
                            .style("fill", "white")
                            .attr("font-family", "cursive");
                
            })
        
    })
    
    //Layout Two: The Stacked Bar chart
    var stackbarchartTwo = svg.append('g').attr("transform", "translate(" + layout_two_width + "," + layout_two_height*6.2 + ")")
    d3.csv("layoutTwobarchart.csv", function(data) {        
        var subgroups = data.columns.slice(1)
        var groups = data.map(function(d) {return d.CensusYear});
        var dataset = d3.stack().keys(subgroups)(data)
        //x axis for stacked bar chart
        var x = d3.scaleBand().domain(groups).range([0, chart_w]).padding(0.2)
        stackbarchartTwo.append("g").attr("transform", "translate(0," + chart_h + ")").attr("class", "axisWhite")
            .call(d3.axisBottom(x).tickFormat(function(d){return d;}).ticks(5))
            .selectAll("text")
            .attr("transform", "translate(-10, 6)rotate(-45)")
            .style("text-anchor", "end")
            .style("font-size", 10)
            .style("fill", "white")
            .attr("font-family", "cursive");
        //y axis for stacked bar chart
        var y = d3.scaleLinear().domain([0, 150]).range([chart_h, 0])
        stackbarchartTwo.append("g").attr("class", "axisWhite").call(d3.axisLeft(y).tickFormat(function(d){return d;}).ticks(3))
            .selectAll("text")
            .style("text-anchor", "end")
            .style("font-size", 10)
            .style("fill", "white")
            .attr("font-family", "cursive");;
        //color for stacked bar chart
        var color = d3.scaleOrdinal().domain(subgroups).range(["#7f3b08","#b35806","#e08214","#fdb863","#fee0b6"])
        
        
        var legend = stackbarchartTwo.append('g').attr('class', 'legend')
                    .attr("transform", "translate(" + -50 + "," + -chart_h*2 + ")");
        legend.selectAll('rect').data(subgroups).enter().append('rect').attr('x', function(d, i){return 120 + i * 50;})
                .attr('y', 300)
                .attr('width', 8)
                .attr('height', 8)
                .attr('fill', function(d, i){return color(i);});            
        legend.selectAll('text').data(subgroups).enter().append('text').text(function(d){return d;})
                .attr('x', function(d, i){return 135 + i * 50;})
                .attr('y', 310)
                .attr('text-anchor', 'start')
                .style("fill", "white")
                .attr("font-family", "cursive")
                .style("font-size", 10);  
        stackbarchartTwo.append("text").attr("text-anchor", "start")
            .attr("y", chart_h/2)
            .attr("x", -430)
            .text("Take a glimpse of the changing trend of different types..")
            .style("font-size", 13)
            .style("fill", "white")
            .attr("font-family", "cursive");
        stackbarchartTwo.append("text").attr("text-anchor", "start")
            .attr("y", chart_h/2 +30)
            .attr("x", -430)
            .text("Not Clear? Try to move mouse around bar...")
            .style("font-size", 13)
            .style("fill", "white")
            .attr("font-family", "cursive");                          
 
        var bars = stackbarchartTwo.append("g").selectAll("g").data(dataset).enter()
                        .append("g").attr("fill", function(d) {return color(d.key)})
                                    .attr("class", function(d){ return "myRect " + d.key })
                                    .selectAll("rect")
                                    .data(function(d) {return d;})
                                    .enter().append("rect")
                                        .attr("x", function(d) {return x(d.data.CensusYear); })
                                        .attr("y", function(d) {return y(parseInt(d[1])); })
                                        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                                        .attr("width",x.bandwidth())
        
        
        bars.on("mouseover", function(d) {
                               var subgroupName = d3.select(this.parentNode).datum().key; // This was the tricky part
                                var subgroupValue = d.data[subgroupName];
                            d3.selectAll(".myRect").style("opacity", 0.2)
                            d3.selectAll("."+subgroupName).style("opacity", 1)    
        })
            .on("mouseleave", function(d) {d3.selectAll(".myRect").style("opacity",1)})              
        
        
        
        
    })
    
    //Layout Two: The pie chart
    var piechartTwo = svg.append('g').attr("transform", "translate(" + (layout_two_width-120) + "," + layout_two_height*5 + ")")
    d3.csv("layoutTwoPiechart.csv", function(data) {
        allGroup = data.map(function(d) {return d.CLUESmallArea});
        
        var allAreas = piechartTwo.append("g").attr("transform", "translate(" + -400  + "," + -180 + ")");
        allAreas.selectAll("allAreas").data(allGroup).enter().append("text").text(function(d) { return d;})
                .attr("x", 610)
                .attr("y", function(d,i){ return 150 + i*15})
                .style("fill", "white")
                .text(function(d){ return d})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .style("font-size", 12)
                .attr("font-family", "cursive")
        
        var alld = piechartTwo.append("g").attr("transform", "translate(" + -400 + "," + -180 + ")");
        allDs = alld.selectAll("alldots").data(allGroup).enter().append("circle")
            .attr("cx", 600)
            .attr("cy", function(d,i){ return 150 + i*15}) 
            .attr("r", 5)
            .style("fill", "white")
            .style("opacity", "0.1")
        
        var getAreaname = "ALL Melbourne"
        predata = data.filter(function(d) { return d.CLUESmallArea == getAreaname})
            piedata  = (({BAR, CLUB, HOTEL, PUB, RESTAURANT}) => ({BAR, CLUB, HOTEL, PUB, RESTAURANT}))(predata[0])
            var color = d3.scaleOrdinal().domain(piedata).range(["#7f3b08","#b35806","#e08214","#fdb863","#fee0b6"])
            var pie = d3.pie().value(function(d) {return d.value; })
            var data_ready = pie(d3.entries(piedata))
 
            piechartTwo.selectAll("pieTwo").data(data_ready).enter()
                   .append("path")
                   .attr("d", d3.arc()
                        .innerRadius(0)
                        .outerRadius(150))
                   .attr("fill",  function(d){ return(color(d.data.key)) })
                   .attr("stroke", "#575c6e")
                   .style("stroke-width", "3px")
        
        allDs.on("mouseover", function(d) {
            allDs.style("opacity", "0.1")
            d3.select(this).style("opacity", "1")
            getAreaname = d3.select(this).datum()
            predata = data.filter(function(d) { return d.CLUESmallArea == getAreaname})
            piedata  = (({BAR, CLUB, HOTEL, PUB, RESTAURANT}) => ({BAR, CLUB, HOTEL, PUB, RESTAURANT}))(predata[0])
            var color = d3.scaleOrdinal().domain(piedata).range(["#7f3b08","#b35806","#e08214","#fdb863","#fee0b6"])
            var pie = d3.pie().value(function(d) {return d.value; })
            var data_ready = pie(d3.entries(piedata))
 
            piechartTwo.selectAll("pieTwo")
                   .data(data_ready)
                   .enter()
                   .append("path")
                   .attr("d", d3.arc()
                        .innerRadius(0)
                        .outerRadius(150))
                   .attr("fill",  function(d){ return(color(d.data.key)) })
                   .attr("stroke", "#575c6e")
                   .style("stroke-width", "3px")
        })
        .on('mouseout', function (d) {
            allDs.style("opacity", "0.1")
        })
        
        piechartTwo.append("text").attr("text-anchor", "end")
                            .attr("y", -140)
                            .attr("x", 700)
                            .text("Do you know the type diversity of nightlife business in Melbourne(CBD)?")
                            .style("font-size", 15)
                            .style("fill", "white")
                            .attr("font-family", "cursive");
        piechartTwo.append("text").attr("text-anchor", "end")
                            .attr("y", -110)
                            .attr("x", 650)
                            .text("--> Try to light the node of Melbourne (CBD) to see that...")
                            .style("font-size", 15)
                            .style("fill", "white")
                            .attr("font-family", "cursive");
    })
    
    //Layout Three: The line chart    
    var linechartThree = svg.append("g").attr("transform", "translate(" + (layout_three_width-400) + "," + layout_three_height*9 + ")"); 
    d3.csv("layoutThreelinechart.csv", function(data) {
        console.log(data);
        // Pre-process data
        linedata = d3.nest().key(function(d) {return d.Range}).entries(data);
        console.log(linedata);
        // Add x axis to the Line chart in the third layout
        var xScaleThree = d3.scaleBand().domain(data.map(function(d) {return d.CensusYear})).range([0, chart_w]).padding(0.1)
        linechartThree.append("g").attr("class", "axisWhite").attr("transform", "translate(0," + chart_h + ")")
            .call(d3.axisBottom(xScaleThree))
            .selectAll("text")
            .attr("transform", "translate(-10, 6)rotate(-45)")
            .style("text-anchor", "end")
            .style("font-size", 10)
            .style("fill", "white")
            .attr("font-family", "cursive");;
        // Add y axis to the Line chart in the third layout
        yData =  d3.max(data, function(d) {return +d.NumberofPlaces;})
        var yScaleThree =  d3.scaleLinear().domain([0,yData]).range([chart_h, 0])
        linechartThree.append("g").call(d3.axisLeft(yScaleThree).tickFormat(function(d){return d;}).ticks(5))
            .attr("class", "axisWhite");
        // Add color groups to the Line chart in the third layout
        var groups = data.map(function(d) {return d.Range}).keys()
        std = ["200", "400", "600", "800", "1000", "1200", "1400", "1600", "1800", "2000++"];
        console.log(groups.datum);
        var color = d3.scaleOrdinal()
                      .domain(groups)
                      .range(["#ffffe5","#f5fbc0","#dff2a8","#bbe395","#8fd082","#60ba6c","#389d55","#1b7f41","#046335","#004529"])
        var xStep = 864e5,yStep = 100;
        
        
        var rects = linechartThree.selectAll("row").data(std).enter()
            .append("rect").attr("x", function(d,i){return (440) + i*40})
            .attr("y", chart_h)
            .style("opacity", "0.8")
            .attr("width", 50)
            .attr("height",  15)
            .attr("fill", function(d){return color(d)})
            .attr("stroke", "#575c6e")
            .attr("stroke-width", 1.5)
        
        
        linechartThree.selectAll("allLegend").data(std).enter().append("text")
                .text(function(d) { return  d;})
                .attr("x", function(d,i){return (460) + i*40})
                .attr("y", chart_h+30)
                .style("fill", "white")
                .attr("text-anchor", "middle")
                .style("alignment-baseline", "middle")
                .style("font-size", 8)
                .attr("font-family", "cursive")
        
        // Draw the Line chart 
        var lls = linechartThree.selectAll("alllines")
                   .data(linedata)
                   .enter()
                   .append("path")
                     .attr("d", function(d) {
                        return d3.line()
                                .x(function(d) {return xScaleThree(d.CensusYear);})
                                .y(function(d) {return yScaleThree(+d.NumberofPlaces);})
                                (d.values)
                    })
                     .attr("fill", "none")
                     .attr("stroke", function(d) {return color(d.key)})
                     .attr("stroke-width", 1.5)
        
        rects.on("mouseover", function(d) {
            d3.select(this).style("stroke", "white").style("opacity", "1")
            no = d3.select(this)
            lls.style("opacity", function(d){
                console.log(d3.select(this).datum());
                console.log(no);
                if (std[(d3.select(this).datum().key-1)] == no.datum()) {return 1;}
                else {return 0;}
            })
        })
        .on("mouseleave", function(d) {
            lls.style("opacity",1)
            rects.style("stroke", "#575c6e").style("opacity", "0.8")})
        
        linechartThree.append("text").attr("text-anchor", "start")
            .attr("y", chart_h/2)
            .attr("x", 400)
            .text("As you see, nightlife places with 200 patrons size witnessed a distinct growth...")
            .style("font-size", 15)
            .style("fill", "white")
            .attr("font-family", "cursive");
        linechartThree.append("text").attr("text-anchor", "start")
            .attr("y", chart_h/2 +20)
            .attr("x", 400)
            .text("Not clear? Try to move mouse on the sequential color scale..")
            .style("font-size", 15)
            .style("fill", "white")
            .attr("font-family", "cursive");
        
    })
    
    var histchartThree = svg.append("g").attr("transform", "translate(" + (layout_three_width-400) + "," + layout_three_height*7.7 + ")"); 
    d3.csv("layoutThreehistchart.csv", function(data) {
        console.log(data);
        
        var x = d3.scaleLinear().domain([0, 5100]).range([0, chart_w]);
        histchartThree.append("g").attr("transform", "translate(0," + chart_h + ")")
            .attr("class", "axisWhite")
            .call(d3.axisBottom(x).tickFormat(function(d){return d;}).ticks(16));

        var histogram = d3.histogram().value(function(d) { return d.Numberofpatrons; }).domain(x.domain()).thresholds(x.ticks(20)); 
        var bins = histogram(data);

        var y = d3.scaleLinear().range([chart_h, 0]);
        y.domain([0, d3.max(bins, function(d) { return d.length; })]);  
        histchartThree.append("g").attr("class", "axisWhite").call(d3.axisLeft(y).tickFormat(function(d){return d;}).ticks(5))
        
        histchartThree.selectAll("rect").data(bins).enter()
            .append("rect")
                .attr("x", 1)
                .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
                .attr("height", function(d) { return chart_h - y(d.length); })
                .style("fill", "#389d55")
                .style("opacity", "0.8")
        
        var keys = ['Carlton', 'Docklands', 'East Melbourne', 'Kensington', 'Melbourne (CBD)', 'Melbourne (Remainder)', 'North Melbourne', 'Parkville', 'South Yarra', 'Southbank', 'West Melbourne (Residential)']
        
        var allL = histchartThree.append("g").attr("transform", "translate(" + chart_w/4  + "," + -chart_h*0.4 + ")");
        allll = allL.selectAll("alllables")
                .data(keys)
                .enter()
                .append("text")
                .text(function(d) { return d;})
                .attr("x", 100)
                .attr("y", function(d,i){ return 100 + i*15})
                .style("fill", "white")
                .text(function(d){ return d})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .style("font-size", 12)
                .attr("font-family", "cursive")
        
        var alldd = histchartThree.append("g").attr("transform", "translate(" + chart_w/4 + "," + -chart_h*0.4 + ")");
        allDD = alldd.selectAll("mydots")
                        .data(keys)
                        .enter()
                        .append("circle")
                        .attr("cx", 90)
                        .attr("cy", function(d,i){ return 100 + i*15}) 
                        .attr("r", 5)
                        .style("fill", "white")
                        .style("opacity", "0.1")
        
        var getAreaname = "ALL Melbourne"
        allDD.on("mouseover", function(d) {
            allDD.style("opacity", "0")
            dot = d3.select(this)
            dot.style("opacity", "1")
            allll.style("opacity", function(l) { return d3.select(this).datum() === dot.datum() ? '1' : '0';})
            getAreaname = d3.select(this).datum()
            predata = data.filter(function(d) { return d.CLUESmallArea === getAreaname})
            var bins2 = histogram(predata);
            histchartThree.selectAll("rect").remove();
            
            histchartThree.selectAll("rect").data(bins2).enter()
                .append("rect")
                .attr("x", 1)
                .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
                .attr("height", function(d) { return chart_h - y(d.length); })
                .style("fill", "#389d55")
                .style("opacity", "0.8")
        })
        .on('mouseout', function (d) {
            allDD.style("opacity", "0.1")
            allll.style("opacity", "1")
            histchartThree.selectAll("rect").remove();
            
            histchartThree.selectAll("rect").data(bins).enter()
                .append("rect")
                .attr("x", 1)
                .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
                .attr("height", function(d) { return chart_h - y(d.length); })
                .style("fill", "#389d55")
                .style("opacity", "0.8")
        })
        
        histchartThree.append("text").attr("text-anchor", "end").attr("transform", "rotate(0)")
                            .attr("y", chart_h/2)
                            .attr("x", 950)
                            .text("Do you know how many nightlife places with the size below 200 in Melbourne(CBD)?")
                            .style("font-size", 15)
                            .style("fill", "white")
                            .attr("font-family", "cursive");
        
        histchartThree.append("text").attr("text-anchor", "end").attr("transform", "rotate(0)")
                            .attr("y", chart_h/2 + 30)
                            .attr("x", 890)
                            .text("--> Try to light the node of Melbourne(CBD), your will see that...")
                            .style("font-size", 15)
                            .style("fill", "white")
                            .attr("font-family", "cursive");
        
        
    
    
    })
        
        
    
    
}