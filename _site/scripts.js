let layerSegments; // Global variable
let layerSegmentsUrl;
let rendererSegmentsVolume;
let rendererSegmentsVolumeCompare;
let curBase;
let curCompare = 'None';
let defBase = 'MF2050';
let curSegId = '0015_283.3';
let curSource = 'AADTHistory.xlsx';
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
         "esri/PopupTemplate"
        ],
function(esriConfig, Map, MapView, Basemap, BasemapToggle, GeoJSONLayer, Home, Search, TileLayer, Graphic, Point, Polygon, Polyline, FeatureLayer, LayerList, ClassBreaksRenderer, Legend, PopupTemplate) {

  esriConfig.apiKey = "AAPK5f27bfeca6bb49728b7e12a3bfb8f423zlKckukFK95EWyRa-ie_X31rRIrqzGNoqBH3t3Chvz2aUbTKiDvCPyhvMJumf7Wk";
  
  function updateDisplay() {
    console.log('updateDisplay');
    if (curCompare=='None') {
      rendererSegmentsVolume.field = curBase; // Set the new field
      layerSegments.renderer = rendererSegmentsVolume;
    } else {
      rendererSegmentsVolumeCompare.valueExpression = '$feature.' + curBase + ' - $feature.' + curCompare;
      rendererSegmentsVolumeCompare.valueExpressionTitle =  curBase + ' minus ' + curCompare;
      layerSegments.renderer = rendererSegmentsVolumeCompare;
    }
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
        updateDisplay();
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
          updateDisplay();
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
          updateDisplay();
        });    

        radioButtonGroup.appendChild(radioButton);
        radioButtonGroup.appendChild(document.createTextNode(field.alias || field.name));
        displayVolumeSelectionCompare.appendChild(radioButtonGroup);

      });
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
      container: "mainContentMap" // Div element
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

    // Create a FeatureLayer using the layerSegments URL and the renderer
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

  async function loadData() {
    const responseAadt = await fetch('data/aadt.json');
    const dataAadt = await responseAadt.json();
    
    // Fetching the second JSON file
    const responseModVolAdj = await fetch('data/model-forecasts.json');
    const dataModVolAdj = await responseModVolAdj.json();
    
    // Fetching the third JSON file
    const responseLinForecasts = await fetch('data/linear-forecasts.json');
    const dataLinForecasts = await responseLinForecasts.json();
  
    // Populate the SEGID and SOURCE selectors from the data
    const segIdSelect = document.getElementById('segIdSelect');
    const sourceSelect = document.getElementById('sourceSelect');
  
    const segIds = [...new Set(dataAadt.map(item => item.SEGID))];
    const sources = [...new Set(dataAadt.map(item => item.SOURCE))];

    segIds.forEach(id => {
      const option = document.createElement('calcite-option');
      option.value = id;
      option.textContent = id;
      segIdSelect.appendChild(option);
    });

    segIdSelect.value = curSegId;
    
    sources.forEach(source => {
      const option = document.createElement('calcite-option');
      option.value = source;
      option.textContent = source;
      sourceSelect.appendChild(option);
    });

    sourceSelect.value = curSource;
  
    // Function to update the chart
    async function updateChart() {
      // If there's an existing chart, destroy it
      if (myChart) {
        myChart.destroy();
      }
    
      const segIdSelect = document.getElementById('segIdSelect');
      const sourceSelect = document.getElementById('sourceSelect');
      curSegId = segIdSelect.value;
      curSource = sourceSelect.value;
    
      // Filter the data based on SEGID and SOURCE
      const filteredAadt = dataAadt.filter(item => item.SEGID === curSegId && item.SOURCE === curSource);
      const filteredModVolAdj = dataModVolAdj.filter(item => item.SEGID === curSegId);
      const filteredLinForecasts = dataLinForecasts.filter(item => item.SEGID === curSegId && item.SOURCE === curSource);
          
      // Extract the X and Y values
      const chartDataAadt = filteredAadt.map(item => ({ x: item.YEAR, y: item.AADT }));
      const chartDataModVolAdj = filteredModVolAdj.map(item => ({ x: item.YEAR, y: item.modForecast }));
      const chartDataLinForecasts = filteredLinForecasts.map(item => ({ x: item.YEAR, y: item.linForecast }));

      // Create the chart
      const ctx = document.getElementById('chartType').getContext('2d');
      myChart = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: 'Model Forecast',
              data: chartDataModVolAdj, // Use the correct variable name
              borderColor: 'orange',
              backgroundColor: 'orange',
              pointRadius: 5,
              //showLine: true
            },
            {
              label: 'Linear Forecasts',
              data: chartDataLinForecasts, // Use the correct variable name
              borderColor: 'green',
              backgroundColor: 'green',
              pointRadius: 4,
              //showLine: true
            },
            {
              label: 'AADT',
              data: chartDataAadt, // Use the correct variable name
              borderColor: 'lightgray',
              backgroundColor: 'lightgray',
              pointRadius: 4
              //showLine: true
            }
          ],
          options: {
            scales: {
              x: {
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
        }
      });

      // Query the feature layer to find the feature with the matching SEGID
      const query = layerSegments.createQuery();
      query.where = "SEGID = '" + curSegId + "'"; // Replace with your field name and SEGID value
      const result = await layerSegments.queryFeatures(query);

      // If a matching feature was found, zoom in to it
      if (result.features.length > 0) {
        const feature = result.features[0];
        view.goTo({
          target: feature.geometry,
          zoom: 12 // Adjust the zoom level as needed
        });

        // Create a symbol for highlighting
        const highlightSymbol = {
          type: "simple-fill", // Depending on geometry type
          color: [255, 255, 0, 0.5], // Yellow color with some transparency
          outline: {
            color: [255, 255, 0, 1], // Yellow outline
            width: 3
          }
        };

        // Create a graphic using the highlight symbol and the feature's geometry
        const highlightGraphic = new Graphic({
          geometry: feature.geometry,
          symbol: highlightSymbol
        });

        // Add the highlight graphic to the view's graphics layer
        view.graphics.add(highlightGraphic);
      }
    } // updateChart
  
    // Initially update the chart
    updateChart();
  
    // Update the chart when the selectors are changed
    segIdSelect.addEventListener('calciteSelectChange', updateChart);
    sourceSelect.addEventListener('calciteSelectChange', updateChart);
  }

  // Load the data when the page is ready
  loadData();

});