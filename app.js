// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g") //g es el objeto que lleva el gràfico, mas adelante pondremos los ejes en el objeto g
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data.csv")
    .then(function(censusData) {

        // Step 1: Parse Data/Cast as numbers
        // ==============================
        censusData.forEach(function(data) {
            data.healthcare = +data.healthcare; //con el + se hacen nùmeros
            data.poverty = +data.poverty;
        });

        // Step 2: Create scale functions, es una regla de 3 para que al mover la ventana se ajuste la grafica
        // ==============================
        var xLinearScale = d3.scaleLinear()
            .domain([0, d3.max(censusData, d => d.healthcare)])
            .range([0, width]);

        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(censusData, d => d.poverty)])
            .range([height, 0]);

        // Step 3: Create axis functions  //la regla de 3 se implementa en los ejes:
        // ==============================
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Step 4: Append Axes to the chart // los ejes los añades a la grafica g:
        // ==============================
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis); //fija el eje en el fondo, si no lo hace al reves, de arriba a abajo

        chartGroup.append("g")
            .call(leftAxis);

        // Step 5: Create Circles crea los circulos de la gráfica 
        // ==============================
        var circlesGroup = chartGroup.selectAll("circle")
            .data(censusData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty)) //añade en x la longitud de pobreza
            .attr("cy", d => yLinearScale(d.healthcare)) //añade a la y el numero de healtcare
            .attr("r", "10")
            .attr("fill", "lightBlue")
            .attr("opacity", ".5");
        //----------------------------------------
        var textcircle = chartGroup.selectAll("text")
            .data(censusData)
            .enter()
            .append("text")
            .attr("x", d => xLinearScale(d.poverty))
            .attr("y", d => yLinearScale(d.healthcare))
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .style("fill", "white")
            .style("font-size", "12px")
            .text(function(d) {
                return d.abbr;
            });
        //----------------------------------------

        // Step 6: Initialize tool tip
        // ==============================
        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function(d) {
                return (`${d.abbr}<br>poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
            });

        // Step 7: Create tooltip in the chart
        // ==============================
        chartGroup.call(toolTip);

        // Step 8: Create event listeners to display and hide the tooltip
        // ==============================

        circlesGroup.on("click", function(data) {
                toolTip.show(data, this);
            })
            // onmouseout event
            .on("mouseout", function(data, index) { //cuando el mouse esta fuera, esconde todo
                toolTip.hide(data);
            });

        // Create axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Lacks Healthcare (%)");

        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("In Poverty (%)");
    });