require(["esri/config", "esri/Map", "esri/views/MapView"], function(esriConfig, Map, MapView) {

    esriConfig.apiKey = "AAPK5f27bfeca6bb49728b7e12a3bfb8f423zlKckukFK95EWyRa-ie_X31rRIrqzGNoqBH3t3Chvz2aUbTKiDvCPyhvMJumf7Wk";

    const map = new Map({
      basemap: "arcgis-topographic" // Basemap layer service
    });

    const view = new MapView({
      map: map,
      center: [-111.8910, 40.7608], // Longitude, latitude
      zoom: 13, // Zoom level
      container: "viewDiv" // Div element
    });
    
    const segIds = ["SegId1", "SegId2", "SegId3", "SegId4", "SegId5"]; // your list of SegIDs

    const dropdown = document.querySelector("#segIdSelect");

    segIds.forEach(segId => {
      const option = document.createElement("calcite-option");
      option.value = segId;
      option.textContent = segId;
      dropdown.appendChild(option);
    });
});