

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
         "esri/widgets/LayerList"],
function(esriConfig, Map, MapView, Basemap, BasemapToggle, GeoJSONLayer, Home, Search, TileLayer, Graphic, Point, Polygon, Polyline, FeatureLayer, LayerList) {

    esriConfig.apiKey = "AAPK5f27bfeca6bb49728b7e12a3bfb8f423zlKckukFK95EWyRa-ie_X31rRIrqzGNoqBH3t3Chvz2aUbTKiDvCPyhvMJumf7Wk";

    const map = new Map({
      basemap: "gray-vector" // Basemap layer service
    });

    const view = new MapView({
      map: map,
      center: [-111.8910, 40.7608], // Longitude, latitude
      zoom: 10, // Zoom level
      container: "mainContent" // Div element
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
            color: [255, 255, 255]
          }
        }
      }
    });
    map.add(geojsonCities);

    const geojsonCitiesWhite = new GeoJSONLayer({
      url: "data/city.geojson",
      renderer: {
        type: "simple",  // autocasts as new SimpleRenderer()
        symbol: {
          type: "simple-fill",  // autocasts as new SimpleFillSymbol()
          color: [0, 0, 0, 0],  // transparent fill
          outline: {  // autocasts as new SimpleLineSymbol()
            width: 1,
            color: [100, 100, 100]
          }
        }
      }
    });  
    map.add(geojsonCitiesWhite);

    const geojsonSegments = new GeoJSONLayer({
      url: "data/segments.geojson",
      renderer: {
        type: "simple",  // autocasts as new SimpleRenderer()
        symbol: {
          type: 'simple-line',
          color: [0, 0, 255],
          width: 2
        }
      }
    });  
    map.add(geojsonSegments);

    // Define the layer selection widget
    const layerList = new LayerList({
      view: view,
      // Optional: Specify the title for the widget
      container: document.createElement('div'),
      // Optional: Expand the widget by default
      listItemCreatedFunction: function(event) {
        const item = event.item;
        item.panel = {
          content: 'legend',
          open: true
        };
      }
    });

    // Add the widget to the top-right corner of the view
    view.ui.add(layerList, {
      position: 'bottom-left'
    });

    // add basemap toggle
    const basemapToggle = new BasemapToggle({
      view: view,
      nextBasemap: "arcgis-imagery"
    });
    
    view.ui.add(basemapToggle,"bottom-right");

    var homeButton = new Home({
      view: view
    });
  
    // Add the home button to the top left corner of the MapView
    view.ui.add(homeButton, {
      position: "top-left"
    });

    var searchWidget = new Search({
      view: view
    });
  
    // Add the search widget to the top right corner of the MapView
    view.ui.add(searchWidget, {
      position: "top-right"
    });

    const segIds = ["SegId1", "SegId2", "SegId3", "SegId4", "SegId5"]; // your list of SegIDs

    const dropdown = document.querySelector("#selectSegId");

    segIds.forEach(segId => {
      const option = document.createElement("calcite-option");
      option.value = segId;
      option.textContent = segId;
      dropdown.appendChild(option);
    });

    //let geojsonObject = {
    //  "type": "FeatureCollection",
    //  "features": [
    //    {
    //      "type": "Feature",
    //      "geometry": {
    //        "type": "Point",
    //        "coordinates": [-118.15, 34.15]
    //      },
    //      "properties": {
    //        "prop0": "value0"
    //      }
    //    },
    //    // Additional features can be included here...
    //  ]
    //};
    //
    //let graphics = geojsonObject.features.map(feature => {
    //  let geometry;
    //  switch (feature.geometry.type) {
    //    case "Point":
    //      geometry = new Point({
    //        x: feature.geometry.coordinates[0],
    //        y: feature.geometry.coordinates[1]
    //      });
    //      break;
    //    // Handle other geometry types here...
    //  }
    //  
    //  return new Graphic({
    //    geometry: geometry,
    //    attributes: feature.properties
    //  });
    //});
    //
    //let featureLayer = new FeatureLayer({
    //  source: graphics,
    //  // Additional FeatureLayer properties here...
    //});
    //
    //map.add(featureLayer);






    document.getElementById('chartType').addEventListener('change', updateChart);

    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart;

    // Initial chart configuration
    var chartConfig = {
        type: 'line',
        data: {
            labels: ['2019', '2023', '2032', '2042', '2050'],
            datasets: [{
                label: 'Forecast',
                data: [19000,19500,20000,20500,20500],
    //            backgroundColor: [
    //                'rgba(255, 99, 132, 0.2)',
    //                'rgba(54, 162, 235, 0.2)',
    //                'rgba(255, 206, 86, 0.2)',
    //                'rgba(75, 192, 192, 0.2)',
    //                'rgba(153, 102, 255, 0.2)',
    //                'rgba(255, 159, 64, 0.2)'
    //            ],
    //            borderColor: [
    //                'rgba(255, 99, 132, 1)',
    //                'rgba(54, 162, 235, 1)',
    //                'rgba(255, 206, 86, 1)',
    //                'rgba(75, 192, 192, 1)',
    //                'rgba(153, 102, 255, 1)',
    //                'rgba(255, 159, 64, 1)'
    //            ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    // Initial chart creation
    myChart = new Chart(ctx, chartConfig);

    // Function to update the chart based on the selected dropdown item
    function updateChart() {
        var chartType = document.getElementById('chartType').value;

        // Clear existing chart
        myChart.destroy();

        // Update chart configuration with the new chart type
        chartConfig.type = chartType;

        // Create new chart
        myChart = new Chart(ctx, chartConfig);
    }

  // Sample GeoJSON object representing polylines
  const polylineGeoJSON = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [-122.4194, 37.7749],
            [-122.4174, 37.7759],
            [-122.4154, 37.7769]
          ]
        },
        properties: {
          name: 'Sample Polyline 1'
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [-122.4194, 37.7749],
            [-122.4194, 37.7759],
            [-122.4194, 37.7769]
          ]
        },
        properties: {
          name: 'Sample Polyline 2'
        }
      }
      // Add more polylines here if needed
    ]
  };

  // Create the GeoJSONLayer from the GeoJSON object
  const polylineLayer = new esri.layers.GeoJSONLayer({
    source: polylineGeoJSON,
    // Define renderer to style the polylines (optional)
    renderer: {
      type: 'simple',
      symbol: {
        type: 'simple-line',
        color: [0, 0, 255],
        width: 2
      }
    }
  });

  // Add the GeoJSONLayer to the map
  view.map.add(polylineLayer);







  







});