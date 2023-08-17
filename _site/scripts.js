let layerSegments; // Global variable
let layerProjectsLines;
let layerProjectsPoints;
let layerSegmentsUrl;
let layerProjectsLinesUrl;
let layerProjectsPointsUrl;
let rendererSegmentsVolume;
let rendererSegmentsVolumeCompare;
let curBase;
let curCompare = 'None';
let defBase = 'MF2050';
let defaultPlanArea = 'WFRC';
let defaultSource = 'AADTHistory.xlsx';
let myChart; // Keep track of the current chart
let view;
let adjustments;
let colors;    
let hidden;
let borderDash;
let borderWidth;

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
         "esri/symbols/TextSymbol",
         "esri/rest/support/Query"
        ],
function(esriConfig, Map, MapView, Basemap, BasemapToggle, GeoJSONLayer, Home, Search, TileLayer, Graphic, Point, Polygon, Polyline, FeatureLayer, LayerList, ClassBreaksRenderer, Legend, PopupTemplate, TextSymbol, Query) {

  esriConfig.apiKey = "AAPK5f27bfeca6bb49728b7e12a3bfb8f423zlKckukFK95EWyRa-ie_X31rRIrqzGNoqBH3t3Chvz2aUbTKiDvCPyhvMJumf7Wk";

  // Function to update the adjustments
  updateFeature = function() {

    // Query to get the specific feature with SEGID=_curSegId
    var query = new Query();
    query.where = "SEGID='" + selectSegId.value + "'"; // Assuming SEGID is numeric
    query.returnGeometry = false;
    query.outFields = ['*']; // Get all fields
  
    layerSegments.queryFeatures(query).then(function(results) {
      if (results.features.length > 0) {
        var featureToUpdate = results.features[0]; // Get the first feature that matches the query
  
        // Update the attributes
        featureToUpdate.attributes.ADJ2023 = document.getElementById('adj2023Value').value;
        featureToUpdate.attributes.ADJ2028 = document.getElementById('adj2028Value').value;
        featureToUpdate.attributes.ADJ2032 = document.getElementById('adj2032Value').value;
        featureToUpdate.attributes.ADJ2042 = document.getElementById('adj2042Value').value;
        featureToUpdate.attributes.ADJ2050 = document.getElementById('adj2050Value').value;
        featureToUpdate.attributes.Notes   = document.getElementById('notes').value;

        // Apply the edits
        layerSegments.applyEdits({
          updateFeatures: [featureToUpdate]
        }).then(function(results) {
          if (results.updateFeatureResults.length > 0) {
            console.log('Updated Successfully');
            updateChart();
          }
        }).catch(function(error) {
          console.error('Error updating feature: ', error);
        });
      } else {
        console.log('No features found with SEGID=' + _curSegId);
      }
    }).catch(function(error) {
      console.error('Error querying features: ', error);
    });
  };

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
      labelClass.labelExpressionInfo.expression = "Text($feature." + curBase + ", '#,###')"; // Update the label expression
    } else {
      rendererSegmentsVolumeCompare.valueExpression = '$feature.' + curBase + ' - $feature.' + curCompare;
      rendererSegmentsVolumeCompare.valueExpressionTitle =  curBase + ' minus ' + curCompare;
      layerSegments.renderer = rendererSegmentsVolumeCompare;
      labelClass.labelExpressionInfo.expression = "Text($feature." + curBase + " - $feature." + curCompare + ", '#,###')";
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
      //popupTemplate: segmentPopupTemplate
    });

    layerProjectsLines = new FeatureLayer({
      url: layerProjectsLinesUrl
    });

    layerProjectsPoints = new FeatureLayer({
      url: layerProjectsPointsUrl
    });

    map.add(layerSegments);
    map.add(layerProjectsLines);
    map.add(layerProjectsPoints);
    //map.add(geojsonCities);
    //map.add(geojsonCitiesWhite);
    
      
    // Get the checkbox
    var checkboxSegments = document.getElementById("layerToggleSegments");

    // Listen for changes to the checkbox
    checkboxSegments.addEventListener("change", function() {
      // Set the layer visibility based on the checkbox
      layerSegments.visible = checkboxSegments.checked;
    });

    layerSegments.visible = checkboxSegments.checked;
      
    // Get the checkbox
    var checkboxProjectsLines = document.getElementById("layerToggleProjectsLines");

    // Listen for changes to the checkbox
    checkboxProjectsLines.addEventListener("change", function() {
      // Set the layer visibility based on the checkbox
      layerProjectsLines.visible = checkboxProjectsLines.checked;
    });

    layerProjectsLines.visible = checkboxProjectsLines.checked;

    // Get the checkbox
    var checkboxProjectsPoints = document.getElementById("layerToggleProjectsPoints");

    // Listen for changes to the checkbox
    checkboxProjectsPoints.addEventListener("change", function() {
      // Set the layer visibility based on the checkbox
      layerProjectsPoints.visible = checkboxProjectsPoints.checked;
    });
    
    layerProjectsPoints.visible = checkboxProjectsPoints.checked;

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


  } //createMapView()

  // Fetch the JSON file
  fetch('config.json')
    .then(response => response.json())
    .then(config => {

      // Extract the layerSegments value
      layerSegmentsUrl = config[0].layerSegmentsUrl;
      layerProjectsLinesUrl  = config[0].layerProjectsLinesUrl;
      layerProjectsPointsUrl = config[0].layerProjectsPointsUrl;

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

    // Fetching the fifth JSON file
    const responseFlags = await fetch('data/flags.json');
    const dataFlags = await responseFlags.json();

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
      if (planArea==" " || planArea=="") {
        item.textContent = "{Blank}";
      } else {
        item.textContent = planArea;
      }
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
        if (id==" " || id=="") {
          option.textContent = "{Blank}";
        } else {
          option.textContent = id;
        }
        selectCoName.appendChild(option);
        if (index==0) {
          selectCoName.value = id;
        }
      });
      
      if (selectSegId) {
        updateSegments();  
      }
    }
    // run first time
    updateCoNames();

    // FLAGS

    document.addEventListener('calciteComboboxChange', handleSelection);

    const flags = [
      {"flagName":"<Previous","flagDescription":"Less than previous forecast year"},
      {"flagName":">2xPrevious","flagDescription":"More than twice previous forecast year"},
      {"flagName":"Zero","flagDescription":"No forecast"}
    ];
    
    const selectedFlags = [];
    
    function populateComboboxFlags() {
      const combobox = document.getElementById('comboboxFlags');
      flags.forEach(flag => {
        const item = document.createElement('calcite-combobox-item');
        item.text = flag.flagName;
        item.textLabel = flag.flagDescription; // Store the entire flag object as a string
        combobox.appendChild(item);
      });
    }
    
    function handleSelection(event) {
      selectedFlags.length = 0; // Clear the previous selection
      event.target.selectedItems.forEach(item => {
        selectedFlags.push({
          flagName: item.text,
          flagDescription: item.textLabel
        });
      });


      // Code for filtering segments by flags


      console.log(selectedFlags); // Logs the selected flags
    }
    
    populateComboboxFlags();    

    // To disable the combobox
    document.getElementById('comboboxFlags').disabled = true;


    // SEGMENTS

    // Populate the SEGID selector from the data

    function updateSegments() {
      const filteredSegments = dataSegments.filter(item => item.CO_NAME === document.getElementById('selectCoName').value && item.PLANAREA === document.getElementById('selectPlanArea').value);
      const segIds = [...new Set(filteredSegments.map(item => item.SEGID))].sort();

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
          selectSegId.value = id;
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
      const filteredModForecasts = dataModVolAdj.filter(item => item.SEGID === _curSegId);
      const filteredLinForecasts = dataLinForecasts.filter(item =>
        item.SEGID === _curSegId &&
        item.SOURCE === defaultSource
      );
      
      const responseProjectionGroups = await fetch('data/projection-groups.json');
      const dataProjectionGroups = await responseProjectionGroups.json();
      
      colors      = dataProjectionGroups.map(item => item.pgColor                 );
    //hidden      = dataProjectionGroups.map(item => item.pgHidden                );
      borderDash  = dataProjectionGroups.map(item => JSON.parse(item.pgBorderDash));
      borderWidth = dataProjectionGroups.map(item => item.pgBorderWidth           );

      
      // Query the feature layer to find the feature with the matching SEGID
      const query = layerSegments.createQuery();
      query.where = "SEGID = '" + _curSegId + "'"; // Replace with your field name and SEGID value
      query.outFields = ["SEGID", "ADJ2023", "ADJ2028", "ADJ2032", "ADJ2042", "ADJ2050", "Notes"];
      const result = await layerSegments.queryFeatures(query);

      // If a matching feature was found, zoom in to it
      if (result.features.length > 0) {
        const feature = result.features[0];
      
        // Extract the values of the fields and put them into a single list
        adjustments = [
          feature.attributes.ADJ2023,
          feature.attributes.ADJ2028,
          feature.attributes.ADJ2032,
          feature.attributes.ADJ2042,
          feature.attributes.ADJ2050
        ];

        // Extract the X and Y values
        const chartDataAadt = filteredAadt.map(item => ({ x: item.YEAR, y: item.AADT }));
        const chartDataModForecasts = filteredModForecasts.map(item => ({ x: item.YEAR, y: item.modForecast }));

        const chartDataForecasts = filteredModForecasts.map((item, index) => {
          // Add the corresponding adjustment value
          return { x: item.YEAR, y: item.modForecast + (adjustments[index] || 0) };
        });

        // Group the filteredLinForecasts by PROJGRP
        const groupedLinForecasts = filteredLinForecasts.reduce((groups, item) => {
          (groups[item.PROJGRP] = groups[item.PROJGRP] || []).push(item);
          return groups;
        }, {});

    
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
            label: 'Final Forecasts (Mod+Adj)',
            data: chartDataForecasts,
            borderColor: 'orange',
            backgroundColor: 'orange',
            pointRadius: 5
          },
          {
            label: 'Model Forecast AADT',
            data: chartDataModForecasts,
            borderColor: 'purple',
            backgroundColor: 'purple',
            pointRadius: 8
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

        view.goTo({
          target: feature.geometry,
          zoom: 12 // Adjust the zoom level as needed
        });
        onSelectFeature(feature);

        // update values in manual adjustment boxes
        document.getElementById("adj2023Value").value = feature.attributes.ADJ2023;
        document.getElementById("adj2028Value").value = feature.attributes.ADJ2028;
        document.getElementById("adj2032Value").value = feature.attributes.ADJ2032;
        document.getElementById("adj2042Value").value = feature.attributes.ADJ2042;
        document.getElementById("adj2050Value").value = feature.attributes.ADJ2050;
        document.getElementById("notes"       ).value = feature.attributes.Notes  ;

        // update values in final forecast
        document.getElementById("f2023Value").innerHTML = chartDataForecasts[0].y.toLocaleString('en-US');
        document.getElementById("f2028Value").innerHTML = chartDataForecasts[1].y.toLocaleString('en-US');
        document.getElementById("f2032Value").innerHTML = chartDataForecasts[2].y.toLocaleString('en-US');
        document.getElementById("f2042Value").innerHTML = chartDataForecasts[3].y.toLocaleString('en-US');
        document.getElementById("f2050Value").innerHTML = chartDataForecasts[4].y.toLocaleString('en-US');

        // update values in model forecast
        document.getElementById("mf2023Value").innerHTML = chartDataModForecasts[0].y.toLocaleString('en-US');
        document.getElementById("mf2028Value").innerHTML = chartDataModForecasts[1].y.toLocaleString('en-US');
        document.getElementById("mf2032Value").innerHTML = chartDataModForecasts[2].y.toLocaleString('en-US');
        document.getElementById("mf2042Value").innerHTML = chartDataModForecasts[3].y.toLocaleString('en-US');
        document.getElementById("mf2050Value").innerHTML = chartDataModForecasts[4].y.toLocaleString('en-US');

        // update values in model forecast
        document.getElementById("diff2023Value").innerHTML = '';
        document.getElementById("diff2028Value").innerHTML = (chartDataForecasts[1].y - chartDataForecasts[0].y).toLocaleString('en-US');
        document.getElementById("diff2032Value").innerHTML = (chartDataForecasts[2].y - chartDataForecasts[1].y).toLocaleString('en-US');
        document.getElementById("diff2042Value").innerHTML = (chartDataForecasts[3].y - chartDataForecasts[2].y).toLocaleString('en-US');
        document.getElementById("diff2050Value").innerHTML = (chartDataForecasts[4].y - chartDataForecasts[3].y).toLocaleString('en-US');

      }
    } //updateChart()
  
    //populateComboboxFlagsProjGroups().then(() => {
    //  console.log('Calling updateChart');
    //  updateChart();
    //});

    updateChart();

    // Update the chart when the selectors are changed
    selectPlanArea.addEventListener('calciteSegmentedControlChange', updateCoNames);
    selectSegId.addEventListener('calciteSelectChange', updateChart);
    selectCoName.addEventListener('calciteSelectChange', updateSegments);

    
    function querySEGIDByFID(FID) {
      return new Promise(function(resolve, reject) {
        var query = layerSegments.createQuery();
        query.where = "FID = " + FID;
        query.outFields = ["SEGID"];
    
        layerSegments.queryFeatures(query).then(function(results) {
          var SEGID = results.features[0].attributes.SEGID;
          resolve(SEGID);
        }).catch(reject);
      });
    }

    view.on("click", function(event) {
      view.hitTest(event).then(function(response) {
        var result = response.results.find(function(result) {
          return result.graphic.layer === layerSegments;
        });
    
        if (result) {
          var featureFID = result.graphic.attributes.FID;
    
          querySEGIDByFID(featureFID).then(function(SEGID) {
            selectSegId.value = SEGID;
            updateChart();
          });
        }
      });
    });

    //selectSource.addEventListener('calciteSelectChange', updateChart);
  }

  // Load the data when the page is ready
  loadAppData();

});