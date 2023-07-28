require(["esri/config",
         "esri/Map",
         "esri/views/MapView",
         "esri/Basemap",
         "esri/widgets/BasemapToggle",
         "esri/layers/GeoJSONLayer",
         "esri/widgets/Home",
         "esri/widgets/Search",
         "esri/layers/TileLayer"],
function(esriConfig, Map, MapView, Basemap, BasemapToggle, GeoJSONLayer, Home, Search, TileLayer) {

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

    map.add(geojsonCities);
    map.add(geojsonCitiesWhite);

    const segIds = ["SegId1", "SegId2", "SegId3", "SegId4", "SegId5"]; // your list of SegIDs

    const dropdown = document.querySelector("#segIdSelect");

    segIds.forEach(segId => {
      const option = document.createElement("calcite-option");
      option.value = segId;
      option.textContent = segId;
      dropdown.appendChild(option);
    });
    
});