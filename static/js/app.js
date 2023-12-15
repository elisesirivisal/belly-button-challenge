// Initialize page with data/info from first sample
function init() {
    // (1) Use the D3 library to read in samples.json from the sollowing URL
    let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

    // Get reference: dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json(url).then(jsonData => {
        data = jsonData; // Assign the data to the global variable

        let sampleNames = data.names;

        sampleNames.forEach(sample => {
            dropdownMenu
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        // Use the first sample from the list to build the initial plots
        updateCharts(sampleNames[0]);
        updateMetaData(sampleNames[0]);
    });
}

// Call updateCharts() when a change takes place to the DOM, updates charts
d3.selectAll("#selDataset").on("change", function () {
    // Use the value of the selected option
    var selectedSample = d3.select(this).property("value");
    updateCharts(selectedSample);
    updateMetaData(selectedSample);
});

// Select Bar Graph, Bubble Graph, and Demographic Info Box
let barDiv = d3.select("#bar");
let bubbleDiv = d3.select("#bubble");
var metadataDiv = d3.select("#sample-metadata");

// Function to create the bar chart based on the selected sample
function updateCharts(selectedSample) {
    // Find sample
    var sampleData = data.samples.find(sample => sample.id === selectedSample);

    // (2) Create Bar Chart
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

    Plotly.newPlot(barDiv.node(), barData, {});

    // (3) Create Bubble Chart
    // Use otu_ids for the x values & sample_values for the y values
    var xVals = sampleData.otu_ids;
    var yVals = sampleData.sample_values;

    // Use sample_values for the marker size
    var size = sampleData.sample_values;

    // Use otu_ids for the marker colors
    var color = sampleData.otu_ids;

    // Use otu_labels for the text values
    var textVals = sampleData.otu_labels;

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

    var dotData = [dotTrace];

    var dotLayout = {
        xaxis: { title: "OTU ID" }
    };

    Plotly.newPlot(bubbleDiv.node(), dotData, dotLayout);
}

// (4) Updates sample metadata (individual's demographic info)
function updateMetaData(selectedSample){
    // convert number as string to number format, grab metadata
    var metadata = data.metadata.find(meta => meta.id === parseInt(selectedSample));

    // Initialize as empty
    metadataDiv.html("");

    // Getting info
    Object.entries(metadata).forEach(([x, info]) => {
        metadataDiv.append("p").text(`${x}: ${info}`);
    });
}

// Initialize Page
init();