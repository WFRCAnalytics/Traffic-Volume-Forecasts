let layerSegments; // Global variable
let layerSegmentsUrl;
let rendererSegmentsVolume;
let rendererSegmentsVolumeCompare;
let curBase;
let curCompare = 'None';
let defBase = 'MF2050';
let defaultPlanArea = 'WFRC';
let defaultSource = 'AADTHistory.xlsx';
let myChart; // Keep track of the current chart
let view;

require(["esri/config",
         "esri/Map",
         "esri/views/MapView",
         "esri/Basemap",
         "esri/widgets/BasemapToggle",
         "esri/layers/GeoJSONLayer",
         "esri/widgets/Home",
         "esri/widgets/Search",
         "esri/layers/TileLayer",
         "esri/Graphic",
         "esri/geometry/Point",
         "esri/geometry/Polygon",
         "esri/geometry/Polyline",
         "esri/layers/FeatureLayer",
         "esri/widgets/LayerList",
         "esri/renderers/ClassBreaksRenderer",
         "esri/widgets/Legend",
         "esri/PopupTemplate",
         "esri/symbols/TextSymbol"
        ],
function(esriConfig, Map, MapView, Basemap, BasemapToggle, GeoJSONLayer, Home, Search, TileLayer, Graphic, Point, Polygon, Polyline, FeatureLayer, LayerList, ClassBreaksRenderer, Legend, PopupTemplate, TextSymbol) {

  esriConfig.apiKey = "AAPK5f27bfeca6bb49728b7e12a3bfb8f423zlKckukFK95EWyRa-ie_X31rRIrqzGNoqBH3t3Chvz2aUbTKiDvCPyhvMJumf7Wk";



  function updateMap() {
    console.log('updateMap');

    // Define the label class outside your updateMap function, using a placeholder for the expression
    var labelClass = {
      symbol: {
        type: "text",
        color: "black",
        haloColor: "white",
        haloSize: "1px",
        font: { size: 12, family: "sans-serif" }
      },
      labelExpressionInfo: {
        expression: "" // Placeholder; will be updated in the function
      }
    };


    if (curCompare=='None') {
      rendererSegmentsVolume.field = curBase; // Set the new field
      layerSegments.renderer = rendererSegmentsVolume;
      labelClass.labelExpressionInfo.expression = "$feature." + curBase; // Update the label expression
    } else {
      rendererSegmentsVolumeCompare.valueExpression = '$feature.' + curBase + ' - $feature.' + curCompare;
      rendererSegmentsVolumeCompare.valueExpressionTitle =  curBase + ' minus ' + curCompare;
      layerSegments.renderer = rendererSegmentsVolumeCompare;
      labelClass.labelExpressionInfo.expression = '$feature.' + curBase + ' - $feature.' + curCompare;
    }

    layerSegments.labelingInfo = [labelClass];

    layerSegments.refresh();
  };

  function populateSidebar() {

    // Once the layerSegments is loaded, populate the radio buttons with the fields
    layerSegments.load().then(function () {
      var excludedFields = ['FID','Id','segid', 'Shape__Length', 'GlobalID'];

      var displayVolumeSelectionBase = document.getElementById("displayVolumeSelectionBase");
      var displayVolumeSelectionCompare = document.getElementById("displayVolumeSelectionCompare");

      displayVolumeSelectionBase.appendChild(document.createTextNode("Display"));
      displayVolumeSelectionCompare.appendChild(document.createTextNode("Compare To"));
      
      // ADD NONE TO COMPARE
      // create radio buttons for compare
      var radioButtonGroup = document.createElement("label");
      var radioButton = document.createElement("calcite-radio-button");
      radioButton.name = "compare";
      radioButton.value = curCompare;

      // Optionally, select the first radio button by default
      radioButton.checked = true;

      // Listen for changes to the radio buttons
      radioButton.addEventListener("change", function (e) {
        // to make sure the radio button is the is the actual element
        const radioButton = e.currentTarget; // or e.target.closest('input[type="radio"]')
        // keep track of curCompare
        curCompare = radioButton.value
        updateMap();
      });    

      radioButtonGroup.appendChild(radioButton);
      radioButtonGroup.appendChild(document.createTextNode("None" || "None"));
      displayVolumeSelectionCompare.appendChild(radioButtonGroup);


      layerSegments.fields.forEach(function (field, index) {
        // Skip the field if it's in the excluded list
        if (excludedFields.includes(field.name)) return;

        // ABSOLUTE
        // create radio buttons for absolute
        var radioButtonGroup = document.createElement("label");
        var radioButton = document.createElement("calcite-radio-button");
        radioButton.name = "absolute";
        radioButton.value = field.name;

        // Optionally, select the first radio button by default
        if (defBase === field.name) {
          radioButton.checked = true;
          curBase = defBase;
        }

        // Listen for changes to the radio buttons
        radioButton.addEventListener("change", function (e) {
          // to make sure the radio button is the is the actual element
          const radioButton = e.currentTarget; // or e.target.closest('input[type="radio"]')
          // update renderer with value of radio button
          curBase = radioButton.value;
          updateMap();
        });    

        radioButtonGroup.appendChild(radioButton);
        radioButtonGroup.appendChild(document.createTextNode(field.alias || field.name));
        displayVolumeSelectionBase.appendChild(radioButtonGroup);

        
        // COMPARE
        // create radio buttons for compare
        var radioButtonGroup = document.createElement("label");
        var radioButton = document.createElement("calcite-radio-button");
        radioButton.name = "compare";
        radioButton.value = field.name;

        // Listen for changes to the radio buttons
        radioButton.addEventListener("change", function (e) {
          // to make sure the radio button is the is the actual element
          const radioButton = e.currentTarget; // or e.target.closest('input[type="radio"]')
          // update renderer with value of radio button
          curCompare = radioButton.value;
          updateMap();
        });    

        radioButtonGroup.appendChild(radioButton);
        radioButtonGroup.appendChild(document.createTextNode(field.alias || field.name));
        displayVolumeSelectionCompare.appendChild(radioButtonGroup);

      });

      updateMap();

    });
  };

  function createMapView() {

    const map = new Map({
      basemap: "gray-vector" // Basemap layerSegments service
    });
  
    view = new MapView({
      map: map,
      center: [-111.8910, 40.7608], // Longitude, latitude
      zoom: 10, // Zoom level
      container: "mapView" // Div element
    });
  
    const geojsonCities = new GeoJSONLayer({
      url: "data/city.geojson",
      renderer: {
        type: "simple",  // autocasts as new SimpleRenderer()
        symbol: {
          type: "simple-fill",  // autocasts as new SimpleFillSymbol()
          color: [0, 0, 0, 0],  // transparent fill
          outline: {  // autocasts as new SimpleLineSymbol()
            width: 4,
            color: [255, 255, 255, 0.5]
          }
        }
      }
    });
  
    const geojsonCitiesWhite = new GeoJSONLayer({
      url: "data/city.geojson",
      renderer: {
        type: "simple",  // autocasts as new SimpleRenderer()
        symbol: {
          type: "simple-fill",  // autocasts as new SimpleFillSymbol()
          color: [0, 0, 0, 0],  // transparent fill
          outline: {  // autocasts as new SimpleLineSymbol()
            width: 1,
            color: [100, 100, 100, 0.5]
          }
        }
      }
    }); 
    
    var segmentPopupTemplate = new PopupTemplate({
      title: "{segid}", // Use the value of the 'name' field for the popup's title
      content: [
        {
          type: "fields",
          fieldInfos: [
            {fieldName: "MF2019",label: "2019 Model Forecast"},
            {fieldName: "MF2023",label: "2023 Model Forecast"},
            {fieldName: "MF2028",label: "2028 Model Forecast"},
            {fieldName: "MF2032",label: "2032 Model Forecast"},
            {fieldName: "MF2042",label: "2042 Model Forecast"},
            {fieldName: "MF2050",label: "2050 Model Forecast"},
            // ... other fields ...
          ]
        }
      ]
    });

    // Create a FeatureLayer using the layerSegments URL, the renderer, and the label class
    layerSegments = new FeatureLayer({
      url: layerSegmentsUrl,
      renderer: rendererSegmentsVolume,
      popupTemplate: segmentPopupTemplate
    });
    
    map.add(layerSegments);
    //map.add(geojsonCities);
    //map.add(geojsonCitiesWhite);
    
    // add homebutton
    var homeButton = new Home({
      view: view
    });
      view.ui.add(homeButton, {
      position: "top-left"
    });

    // add basemap toggle
    const basemapToggle = new BasemapToggle({
      view: view,
      nextBasemap: "arcgis-imagery"
    });
    view.ui.add(basemapToggle,"bottom-left");
  
    // add search widget
    var searchWidget = new Search({
      view: view
    });
    view.ui.add(searchWidget, {
      position: "top-right"
    });
    
    // Create a legend widget
    var legend = new Legend({
      view: view,
      layerInfos: [{ layerSegments: layerSegments, title: 'Segments' }] // Replace YOUR_LAYER with the layerSegments you want to include in the legend
    });
    view.ui.add(legend, "top-right");
    
    populateSidebar(layerSegments);

  } // createMapView

  // Fetch the JSON file
  fetch('config.json')
    .then(response => response.json())
    .then(config => {

      // Extract the layerSegments value
      layerSegmentsUrl = config[0].layerSegmentsUrl;

      // Create a new ClassBreaksRenderer using the fetched configuration     
      rendererSegmentsVolume        = new ClassBreaksRenderer(config[0].rendererSegmentsVolume       );
      rendererSegmentsVolumeCompare = new ClassBreaksRenderer(config[0].rendererSegmentsVolumeCompare);

      // create map
      createMapView();

      // Use or log the layerSegments value
      console.log('layerSegments:', layerSegmentsUrl);
      
    })
    .catch(error => {
      console.error('Error fetching the file:', error);
  });


  // Store the current highlight graphic outside of your selection function
  let currentHighlightGraphic = null;

  function onSelectFeature(feature) {
    // Create a graphic using the highlight symbol and the feature's geometry
    const highlightGraphic = new Graphic({
      geometry: feature.geometry,
      symbol: {
        type: "simple-line", // autocasts as new SimpleLineSymbol()
        color: [255, 255, 0], // red color
        width: 2
      }
    });

    // If there is a current highlight graphic, remove it
    if (currentHighlightGraphic) {
      view.graphics.remove(currentHighlightGraphic);
    }

    // Add the new highlight graphic to the view's graphics layer
    view.graphics.add(highlightGraphic);

    // Update the current highlight graphic reference
    currentHighlightGraphic = highlightGraphic;
  }

  async function loadAppData() {
    const responseAadt = await fetch('data/aadt.json');
    const dataAadt = await responseAadt.json();
    
    // Fetching the second JSON file
    const responseModVolAdj = await fetch('data/model-forecasts.json');
    const dataModVolAdj = await responseModVolAdj.json();
    
    // Fetching the third JSON file
    const responseLinForecasts = await fetch('data/linear-forecasts.json');
    const dataLinForecasts = await responseLinForecasts.json();
      
    // Fetching the forth JSON file
    const responseSegments = await fetch('data/segments.json');
    const dataSegments = await responseSegments.json();

    // Get the calcite-segmented-control element
    const selectPlanArea = document.getElementById('selectPlanArea');
    const selectCoName = document.getElementById('selectCoName');
    const selectSegId = document.getElementById('selectSegId');

    // PLAN AREA

    // Extract the unique PLANAREA values
    const uniquePlanAreas = [...new Set(dataSegments.map(item => item.PLANAREA))].sort();


    // Remove all existing child elements
    if (selectPlanArea.firstChild) {
      while (selectPlanArea.firstChild) {
        selectPlanArea.removeChild(selectPlanArea.firstChild);
      }
    }

    // Append the items for the unique PLANAREA values
    uniquePlanAreas.forEach(planArea => {
      const item = document.createElement('calcite-segmented-control-item');
      item.value = planArea;
      item.textContent = planArea;
      selectPlanArea.appendChild(item);
    });

    selectPlanArea.value = defaultPlanArea;


    // COUNTY

    // Populate the county selector from the data

    function updateCoNames() {
      // Filter dataSegments by PLANAREA and then extract the CO_NAME values
      const coNames = dataSegments.filter(item => item.PLANAREA === document.getElementById('selectPlanArea').value).map(item => item.CO_NAME);
      // Create a Set from the coNames array to remove duplicates
      const uniqueCoNames = [...new Set(coNames)].sort();;

      // Remove all existing child elements
      if (selectCoName.firstChild) {
        while (selectCoName.firstChild) {
          selectCoName.removeChild(selectCoName.firstChild);
        }
      }

      uniqueCoNames.forEach((id,index) => {
        const option = document.createElement('calcite-option');
        option.value = id;
        option.textContent = id;
        selectCoName.appendChild(option);
        if (index === 0) {
          selectCoName.value = option.textContent;
        }
      });
      
      if (selectSegId) {
        updateSegments();  
      }
    }
    // run first time
    updateCoNames();

    // SEGMENTS

    // Populate the SEGID selector from the data

    function updateSegments() {
      const filteredSegments = dataSegments.filter(item => item.CO_NAME === document.getElementById('selectCoName').value && item.PLANAREA === document.getElementById('selectPlanArea').value);
      const segIds = [...new Set(filteredSegments.map(item => item.SEGID))];

      // Remove all existing child elements
      if (selectSegId.firstChild) {
        while (selectSegId.firstChild) {
          selectSegId.removeChild(selectSegId.firstChild);
        }
      }

      segIds.forEach((id,index) => {
        const option = document.createElement('calcite-option');
        option.value = id;
        option.textContent = id;
        selectSegId.appendChild(option);
        if (index === 0) {
          selectSegId.value = option.textContent;
        }
      });
      updateChart();
    }
    // run first time
    updateSegments();

    // create chart first time... no data, update will populate datasets
    async function createChart() {
      const ctx = document.getElementById('chartType').getContext('2d');
      myChart = new Chart(ctx, {
        type: 'scatter',
        options: {
          aspectRatio: 1.5,
          scales: {
            x: {
              ticks: {
                // Define a callback function to format the tick labels
                callback: function(value, index, values) {
                  // If the value is a number, format it without commas
                  if (typeof value === 'number') {
                    return value.toString().replace(/,/g, '');
                  }
                  // Otherwise, return the value as-is
                  return value;
                }
              },
              title: {
                display: true,
                text: 'YEAR'
              }
            },
            y: {
              min: 0, // Set minimum value for Y-axis
              title: {
                display: true,
                text: 'Volume (AADT)'
              }
            }
          }
        }
        // ... other chart initialization code ...
      });
    } // createChart()

    // Function to update the chart with segment data
    async function updateChart() {
      // If there's an existing chart, destroy it
      if (!myChart) {
        createChart();
      }
    
      const selectSegId = document.getElementById('selectSegId');
      const _curSegId = selectSegId.value;

      // Filter the data based on SEGID and SOURCE
      const filteredAadt = dataAadt.filter(item => item.SEGID === _curSegId && item.SOURCE === defaultSource);
      const filteredModVolAdj = dataModVolAdj.filter(item => item.SEGID === _curSegId);
      const filteredLinForecasts = dataLinForecasts.filter(item =>
        item.SEGID === _curSegId &&
        item.SOURCE === defaultSource
      );

      // Extract the X and Y values
      const chartDataAadt = filteredAadt.map(item => ({ x: item.YEAR, y: item.AADT }));
      const chartDataModVolAdj = filteredModVolAdj.map(item => ({ x: item.YEAR, y: item.modForecast }));

      // Group the filteredLinForecasts by PROJGRP
      const groupedLinForecasts = filteredLinForecasts.reduce((groups, item) => {
        (groups[item.PROJGRP] = groups[item.PROJGRP] || []).push(item);
        return groups;
      }, {});

      const responseProjectionGroups = await fetch('data/projection-groups.json');
      const dataProjectionGroups = await responseProjectionGroups.json();
      
      const colors      = dataProjectionGroups.map(item => item.pgColor                 );
      //const hidden      = dataProjectionGroups.map(item => item.pgHidden                );
      const borderDash  = dataProjectionGroups.map(item => JSON.parse(item.pgBorderDash));
      const borderWidth = dataProjectionGroups.map(item => item.pgBorderWidth           );
  
      // Create datasets for each PROJGRP
      const linForecastDatasets = Object.entries(groupedLinForecasts).map(([key, group], index) => ({
        label: key, //'Linear Forecasts - ' + key,
        data: group.map(item => ({ x: item.YEAR, y: item.linForecast })),
        borderColor: colors[index % colors.length], // You can define an array of colors or use a function to generate them
        backgroundColor: colors[index % colors.length],
        pointRadius: 0,
        showLine: true,
        //hidden: hiddenStates[index % hiddenStates.length],
        borderDash: borderDash[index % borderDash.length],
        borderWidth: borderWidth[index % borderWidth.length]
      }));

      // Create the chart
      myChart.data.datasets = [
        {
          label: 'Model Forecast AADT',
          data: chartDataModVolAdj,
          borderColor: 'orange',
          backgroundColor: 'orange',
          pointRadius: 5
        },
        {
          label: 'Observed AADT',
          data: chartDataAadt,
          borderColor: 'lightgray',
          backgroundColor: 'lightgray',
          pointRadius: 4
        },
        ...linForecastDatasets // Spread linForecastDatasets here
      ];

      // Refresh the chart
      myChart.update();


      // Query the feature layer to find the feature with the matching SEGID
      const query = layerSegments.createQuery();
      query.where = "SEGID = '" + _curSegId + "'"; // Replace with your field name and SEGID value
      const result = await layerSegments.queryFeatures(query);

      // If a matching feature was found, zoom in to it
      if (result.features.length > 0) {
        const feature = result.features[0];
        view.goTo({
          target: feature.geometry,
          zoom: 12 // Adjust the zoom level as needed
        });
        onSelectFeature(feature);
      }
    } //updateChart()
  
    //populateComboBoxProjGroups().then(() => {
    //  console.log('Calling updateChart');
    //  updateChart();
    //});

    updateChart();

    // Update the chart when the selectors are changed
    selectPlanArea.addEventListener('calciteSegmentedControlChange', updateCoNames);
    selectSegId.addEventListener('calciteSelectChange', updateChart);
    selectCoName.addEventListener('calciteSelectChange', updateSegments);

    //selectSource.addEventListener('calciteSelectChange', updateChart);
  }

  // Load the data when the page is ready
  loadAppData();

});