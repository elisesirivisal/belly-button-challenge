let data;

function init() {
    const samples = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

    // Get reference: dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json(samples).then(jsonData => {
        data = jsonData; // Assign the data to the global variable

        let sampleNames = data.names;

        sampleNames.forEach(sample => {
            dropdownMenu
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        let initialSample = sampleNames[0];
        updateCharts(initialSample);
    });
}

// Call updateCharts() when a change takes place to the DOM, updates charts
d3.selectAll("#selDataset").on("change", function () {
    // Use the value of the selected option
    var selectedSample = d3.select(this).property("value");
    updateCharts(selectedSample);
});

var barChartDiv = d3.select("#bar");
var bubbleChartDiv = d3.select("#bubble");

// Function to create the bar chart based on the selected sample
function updateCharts(selectedSample) {
    // Find sample
    var sampleData = data.samples.find(sample => sample.id === selectedSample);

    // (1) Create Bar Chart
    // Grab top 10 OTU for selected sample
    var top10OTU = sampleData.sample_values.slice(0, 10).reverse();
    var top10OTUid = sampleData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    var top10OTUlabels = sampleData.otu_labels.slice(0, 10);

    var barTrace = {
        x: top10OTU,
        y: top10OTUid,
        text: top10OTUlabels,
        type: "bar",
        orientation: "h"
    };

    var barData = [barTrace];

    var barLayout = {
        title: `Top 10 OTUs for Sample ${selectedSample}`
    };

    // Use Plotly to create the bar chart
    Plotly.newPlot(barChartDiv.node(), barData, barLayout);

    // (2) Create Bubble Chart
    var xVals = sampleData.otu_ids;

    // Use sample_values for y values and marker size
    var yVals = sampleData.sample_values;
    var size = sampleData.sample_values;

    // Use otu_ids for marker colors
    var color = sampleData.otu_ids;

    // Use otu_labels for text values
    var textVals = sampleData.otu_labels;

    // Create the trace for the bubble chart
    var dotTrace = {
        x: xVals,
        y: yVals,
        text: textVals,
        mode: 'markers',
        marker: {
            size: size,
            color: color,
        }
    };

    // Create the data array
    var dotData = [dotTrace];

    // Layout for the bubble chart
    var dotLayout = {
        title: `Bubble Chart for Sample ${selectedSample}`,
        xaxis: { title: "OTU IDs" },
        yaxis: { title: "Sample Values" }
    };

    // Use Plotly to create the bubble chart
    Plotly.newPlot(bubbleChartDiv.node(), dotData, dotLayout);
}

// Initialize Page
init();