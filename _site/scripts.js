let defaultForecastArea = "WFRC";
let legend;
let inputIds = ['adj2019Value','adj2023Value','adj2028Value','adj2032Value','adj2042Value','adj2050Value','adjHistValue','notes','notes_furrev','notes_seg'];
let years = ["2019", "2023", "2028", "2032", "2042", "2050"];
let prefixes = ["adj", "f", "mf", "m", "diff", "dyvol", "lanes", "ft", "at"];
let initialValues = [0,0,0,0,0,0,""];
let editKeys  = [["Cache" ,"%5fRvKPfUkUb7Yat"],
                 ["Dixie" ,"tptt%r-N-sXjUvP5"],
                 ["Dixie" ,"KLTH^q1Z|H22DhFz"],
                 ["Iron"  ,"ZsC2h@sj4bH=Mzdu"],
                 ["Iron"  ,"KLTH^q1Z|H22DhFz"],
                 ["Iron"  ,"m4uMhLPEX_!g$Psq"],
                 ["Iron"  ,"4Fj$AQjbIZ&B^_Jq"],
                 ["MAG"   ,"4ED&EfumaY2wNTBn"],
                 ["MAG"   ,"u@@X7fiPYjwDYNzo"],
                 ["MAG"   ,"m4uMhLPEX_!g$Psq"],
                 ["Summit","p6b6O^z1KcUS^2gq"],
                 ["Summit","4ED&EfumaY2wNTBn"],
                 ["Summit","u@@X7fiPYjwDYNzo"],
                 ["WFRC"  ,"&%$ZqAJy^549^|Em"],
                 ["WFRC"  ,"6R$xH#e^9i#8*fwR"],
                 ["WFRC"  ,"3FHDmW-$w2D4UlJO"],
                 ["UDOT"  ,"m4uMhLPEX_!g$Psq"],
                 ["UDOT"  ,"1O#Sq#xt=RtXiQ%X"]];
let tableLog;
let tableLogUrl;
let flagsSegList = [];
let flagsMap = [];
let layerSegments;
let layerFlags;
let layerSegmentsUrl;

let layerProjectsLinesUrl;
let layerProjectsPointsUrl;

let layerProjectsLines;
let layerProjectsPoints;

let layerRoadwayProjectsLines;
let layerRoadwayProjectsPoints;

let layerTransitProjectsLines;
let layerTransitProjectsPoints;

let filterRoadwayProjectsLinesFilter;
let filterRoadwayProjectsPointsFilter;
let filterTransitProjectsLinesFilter;
let filterTransitProjectsPointsFilter;

let layerSeHhUrl;
let layerSePopUrl;
let layerSeTypempUrl;
let layerSeHh;
let layerSePop;
let layerSeTypemp;

let rendererSegmentsVolume;
let rendererSegmentsVolumeCompare;
let rendererSegmentsVolumeAdjust;
let rendererRoadwayPoints;
let rendererRoadwayLines;
let rendererTransitPoints;
let rendererTransitLines;
let rendererSegmentsFlags;
let rendererSeChange;
let rendererSeHh;
let rendererSePop;
let rendererSeTypemp;

let curDisplayForecast = 'final-forecast';
let defaultSource = 'AADTHistory.xlsx';
let myChart; // Keep track of the current chart
let view;
let adjustments;
let colors;    
let hidden;
let borderDash;
let borderWidth;
let rtpLayers;

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
         "esri/renderers/UniqueValueRenderer",
         "esri/renderers/SimpleRenderer",
         "esri/widgets/Legend",
         "esri/PopupTemplate",
         "esri/symbols/TextSymbol",
         "esri/rest/support/Query",
         "esri/WebMap"
        ],
function(esriConfig, Map, MapView, Basemap, BasemapToggle, GeoJSONLayer, Home, Search, TileLayer, Graphic, Point, Polygon, Polyline, FeatureLayer, LayerList, ClassBreaksRenderer, UniqueValueRenderer, SimpleRenderer, Legend, PopupTemplate, TextSymbol, Query, WebMap) {

  esriConfig.apiKey = "AAPK5f27bfeca6bb49728b7e12a3bfb8f423zlKckukFK95EWyRa-ie_X31rRIrqzGNoqBH3t3Chvz2aUbTKiDvCPyhvMJumf7Wk";

  function matchModelAADT() {

    function removeCommas(str) {
      return str.replace(/,/g, '');
    }
    
    function calculateValue(idPrefix) {
        var mValue = document.getElementById("m" + idPrefix + "Value").innerHTML;
        var mfValue = document.getElementById("mf" + idPrefix + "Value").innerHTML;
    
        // Remove commas from the innerHTML strings
        mValue = removeCommas(mValue);
        mfValue = removeCommas(mfValue);
    
        // Convert the cleaned strings to numbers and perform the calculation
        var result = parseFloat(mValue) - parseFloat(mfValue);
    
        // Fallback to 0 if the result is NaN
        result = isNaN(result) ? 0 : result;
    
        // Update the value
        document.getElementById("adj" + idPrefix + "Value").value = result;
        
        const buttonApply = document.getElementById('button-apply');
        if (buttonApply.classList.contains('btn-clean')) {
          buttonApply.classList.remove('btn-clean');
          buttonApply.classList.add('btn-dirty');
        }
    }
    
    // Apply the function to each set of elements
    calculateValue("2023");
    calculateValue("2028");
    calculateValue("2032");
    calculateValue("2042");
    calculateValue("2050");
    
    
  }

  // updateMap
  function updateMap() {
    console.log('updateMap');

    layerFlags.visible = false;

    // Define the label class outside your updateMap function, using a placeholder for the expression
    var labelClass = {
      symbol: {
        type: "text",
        color: "black",
        haloColor: "white",
        haloSize: "1px",
        font: { size: 10, family: "sans-serif" }
      },
      labelExpressionInfo: {
        expression: "" // Placeholder; will be updated in the function
      }
    };

    
    // Define the label class outside your updateMap function, using a placeholder for the expression
    var labelClassSe = {
      symbol: {
        type: "text",
        color: "black",
        haloColor: "white",
        haloSize: "1px",
        font: { size: 8, family: "sans-serif" }
      },
      labelExpressionInfo: {
        expression: "" // Placeholder; will be updated in the function
      }
    };

    // Define the label class outside your updateMap function, using a placeholder for the expression
    var labelClassOff = {
      symbol: {
        type: "text",
        color: "black",
        haloColor: "white",
        haloSize: "1px",
        font: { size: 11, family: "sans-serif" }
      },
      labelExpressionInfo: {
        expression: "" // Placeholder; will be updated in the function
      }
    };

    var _expression = "";
    var _prevDisplayYear = "";
    var _phase = "";

    if      (selectYear.value=="2050") {
      _prevDisplayYear = 2042;
      _phase           = "3";
    }
    else if (selectYear.value=="2042") {
      _prevDisplayYear = 2032;
      _phase           = "2";
    }
    else if (selectYear.value=="2032") {
      _prevDisplayYear = 2028;
      _phase           = "1";
    }
    else if (selectYear.value=="2028") {
      _prevDisplayYear = 2023;
      _phase           = "";
    }
    else if (selectYear.value=="2023") {
      _prevDisplayYear = 2019;
    }
    
    const selectSe = document.getElementById('selectSe').value;

    if (selectSe=='hh') {
      layerSeHh.visible = true;
      layerSePop.visible = false;
      layerSeTypemp.visible = false;
    } else if (selectSe=='pop') {
      layerSeHh.visible = false;
      layerSePop.visible = true;
      layerSeTypemp.visible = false;
    } else if (selectSe=='typemp') {
      layerSeHh.visible = false;
      layerSePop.visible = false;
      layerSeTypemp.visible = true;
    } else {
      layerSeHh.visible = false;
      layerSePop.visible = false;
      layerSeTypemp.visible = false;
    }

    function buildDefinitionExpression(baseExpression, flagsExpression) {
      if (baseExpression && flagsExpression) {
        return `${baseExpression} AND (${flagsExpression})`;
      } else if (baseExpression) {
        return baseExpression;
      } else if (flagsExpression) {
        return flagsExpression;
      }
      return "";
    }
    
    // Determine the base definitionExpression based on selected options
    if (document.getElementById('selectForecastArea').value !== 'Entire State') {
      // A single plan area and a single county
      if (document.getElementById('selectCoName').value !== 'All Counties') {
        layerSegments.definitionExpression = "CO_NAME = '" + document.getElementById('selectCoName').value + "' AND F_AREA = '" + document.getElementById('selectForecastArea').value + "'";
      }
      // A single plan area but all counties
      else {
        layerSegments.definitionExpression = "F_AREA = '" + document.getElementById('selectForecastArea').value + "'";
      }
    } else {
      // the entire state but a single county
      if (document.getElementById('selectCoName').value !== 'All Counties') {
        layerSegments.definitionExpression = "CO_NAME = '" + document.getElementById('selectCoName').value + "'";
      }
      // the entire state and all counties
      else {
        layerSegments.definitionExpression = "";
      }
    }

    
    // flagsMap
    let _flagsMapExpression = "";
    if (flagsMap.length) {
      let _expressions = [];
    
      flagsMap.forEach(flagName => {
        // Condition for FL_ flag
        const flCondition = `${flagName} = 1`;
    
        // Additional condition for OV_ flag
        const ovFlagName = flagName.replace("FL_", "OV_");
        const ovCondition = `${ovFlagName} = 0`;
    
        // Combine the two conditions with AND and group them with parentheses
        const combinedCondition = `(${flCondition} AND ${ovCondition})`;
    
        _expressions.push(combinedCondition);
      });
    
      // Join the combined conditions using OR
      _flagsMapExpression = _expressions.join(" OR ");
    } 

        
    // flagsSegList
    let _flagsSegListExpression = "";
    if (flagsSegList.length) {
      let _expressions = [];
    
      flagsSegList.forEach(flag => {
        // Condition for FL_ flag
        const flCondition = `${flag.flagName} = 1`;
    
        // Additional condition for OV_ flag
        const ovFlagName = flag.flagName.replace("FL_", "OV_");
        const ovCondition = `${ovFlagName} = 0`;
    
        // Combine the two conditions with AND and group them with parentheses
        const combinedCondition = `(${flCondition} AND ${ovCondition})`;
    
        _expressions.push(combinedCondition);
      });
    
      // Join the combined conditions using OR
      _flagsSegListExpression = _expressions.join(" OR ");
    
    }

    layerSegments.definitionExpression = buildDefinitionExpression(layerSegments.definitionExpression, _flagsSegListExpression);
    layerFlags.definitionExpression = buildDefinitionExpression(layerSegments.definitionExpression, _flagsMapExpression);

    if (_flagsMapExpression!='') { 
      layerFlags.visible = true;
    } else {
      layerFlags.visible = false;
    }

    switch (curDisplayForecast) {
      case 'final-forecast':
        _expression = "$feature.MF" + selectYear.value + " + $feature.ADJ" + selectYear.value + " + $feature.ADJHIST";
        rendererSegmentsVolume.valueExpression = _expression;
        rendererSegmentsVolume.valueExpressionTitle = /*selectYear.value + ' */'Final Forecast';
        layerSegments.renderer = rendererSegmentsVolume;
        labelClass.labelExpressionInfo.expression = "Text(" + _expression + ", '#,###')";
        layerSeHh    .renderer.valueExpression = "$feature.N_" + selectYear.value;
        layerSePop   .renderer.valueExpression = "$feature.N_" + selectYear.value;
        layerSeTypemp.renderer.valueExpression = "$feature.N_" + selectYear.value;
        labelClassSe.labelExpressionInfo.expression = "Text($feature.N_" + selectYear.value + ", '#,###')";
        layerSeHh    .renderer = rendererSeHh;
        layerSePop   .renderer = rendererSePop;
        layerSeTypemp.renderer = rendererSeTypemp;
        break;
      case 'final-forecast-change-2019':
        _expression = "$feature.MF" + selectYear.value + " + $feature.ADJ" + selectYear.value + " - ($feature.M2019 + $feature.aadtAdjFactor)"; // don't include ADJHIST since it just cancels out
        rendererSegmentsVolumeCompare.valueExpression = _expression;
        rendererSegmentsVolumeCompare.valueExpressionTitle = /*selectYear.value + ' */'Final Forecast Change from 2019';
        layerSegments.renderer = rendererSegmentsVolumeCompare;
        labelClass.labelExpressionInfo.expression = "Text(" + _expression + ", '#,###')";
        layerSeHh    .renderer.valueExpression = "$feature.N_" + selectYear.value + " - $feature.N_2019";
        layerSePop   .renderer.valueExpression = "$feature.N_" + selectYear.value + " - $feature.N_2019";
        layerSeTypemp.renderer.valueExpression = "$feature.N_" + selectYear.value + " - $feature.N_2019";
        labelClassSe.labelExpressionInfo.expression = "Text($feature.N_" + selectYear.value + " - $feature.N_2019, '#,###')";
        layerSeHh    .renderer = rendererSeChange;
        layerSePop   .renderer = rendererSeChange;
        layerSeTypemp.renderer = rendererSeChange;
        break;
      case 'final-forecast-change-prev':
        _expression = "$feature.MF" + selectYear.value + " + $feature.ADJ" + selectYear.value + " - $feature.MF" + _prevDisplayYear + " - $feature.ADJ" + _prevDisplayYear; // don't include ADJHIST since it just cancels out
        rendererSegmentsVolumeCompare.valueExpression = _expression;
        rendererSegmentsVolumeCompare.valueExpressionTitle = /*selectYear.value + ' */'Final Forecast Change from Previous Year' /* + _prevDisplayYear*/;
        layerSegments.renderer = rendererSegmentsVolumeCompare;
        labelClass.labelExpressionInfo.expression = "Text(" + _expression + ", '#,###')";
        layerSeHh    .renderer.valueExpression = "$feature.N_" + selectYear.value + " - $feature.N_" + _prevDisplayYear;
        layerSePop   .renderer.valueExpression = "$feature.N_" + selectYear.value + " - $feature.N_" + _prevDisplayYear;
        layerSeTypemp.renderer.valueExpression = "$feature.N_" + selectYear.value + " - $feature.N_" + _prevDisplayYear;
        labelClassSe.labelExpressionInfo.expression = "Text($feature.N_" + selectYear.value + " - $feature.N_" + _prevDisplayYear + ", '#,###')";
        layerSeHh    .renderer = rendererSeChange;
        layerSePop   .renderer = rendererSeChange;
        layerSeTypemp.renderer = rendererSeChange;
        break;
      case 'manual-adjustments':
        _expression = "$feature.ADJ" + selectYear.value;
        rendererSegmentsVolumeAdjust.valueExpression = _expression;
        rendererSegmentsVolumeAdjust.valueExpressionTitle = /*selectYear.value + ' */'Manual Adjustments';
        layerSegments.renderer = rendererSegmentsVolumeAdjust;
        labelClass.labelExpressionInfo.expression = "IIF(" + _expression + " == 0, '', Text(" + _expression + ", '#,###'))";
        layerSeHh    .renderer.valueExpression = "";
        layerSePop   .renderer.valueExpression = "";
        layerSeTypemp.renderer.valueExpression = "";
        labelClassSe.labelExpressionInfo.expression = "IIF(" + _expression + " == 0, '', Text(" + _expression + ", '#,###'))";
        layerSeHh    .renderer = rendererSeHh;
        layerSePop   .renderer = rendererSePop;
        layerSeTypemp.renderer = rendererSeTypemp;
        break;
      case 'historic-adjustments':
        _expression = "$feature.ADJHIST";
        rendererSegmentsVolumeAdjust.valueExpression = _expression;
        rendererSegmentsVolumeAdjust.valueExpressionTitle = /*selectYear.value + ' */'Historic Adjustments';
        layerSegments.renderer = rendererSegmentsVolumeAdjust;
        labelClass.labelExpressionInfo.expression = "IIF(" + _expression + " == 0, '', Text(" + _expression + ", '#,###'))";
        labelClassSe.labelExpressionInfo.expression = "";
        layerSeHh    .renderer = rendererSeHh;
        layerSePop   .renderer = rendererSePop;
        layerSeTypemp.renderer = rendererSeTypemp;
        break;
      case 'model-forecast':
        _expression = "$feature.MF" + selectYear.value + " + $feature.ADJHIST";
        rendererSegmentsVolume.valueExpression = _expression;
        rendererSegmentsVolume.valueExpressionTitle = /*selectYear.value + ' */'Model Forecast';
        layerSegments.renderer = rendererSegmentsVolume;
        labelClass.labelExpressionInfo.expression = "Text(" + _expression + ", '#,###')";
        layerSeHh    .renderer.valueExpression = "$feature.N_" + selectYear.value;
        layerSePop   .renderer.valueExpression = "$feature.N_" + selectYear.value;
        layerSeTypemp.renderer.valueExpression = "$feature.N_" + selectYear.value;
        labelClassSe.labelExpressionInfo.expression = "IIF($feature.N_" + selectYear.value + ", '#,###'))";
        layerSeHh    .renderer = rendererSeHh;
        layerSePop   .renderer = rendererSePop;
        layerSeTypemp.renderer = rendererSeTypemp;
        break;
      case 'model-nobaseyearadj':
        _expression = "$feature.M" + selectYear.value;
        rendererSegmentsVolume.valueExpression = _expression;
        rendererSegmentsVolume.valueExpressionTitle = /*selectYear.value + ' */'Model No Base Year Adj';
        layerSegments.renderer = rendererSegmentsVolume;
        labelClass.labelExpressionInfo.expression = "Text(" + _expression + ", '#,###')";
        layerSeHh    .renderer.valueExpression = "$feature.N_" + selectYear.value;
        layerSePop   .renderer.valueExpression = "$feature.N_" + selectYear.value;
        layerSeTypemp.renderer.valueExpression = "$feature.N_" + selectYear.value;
        labelClassSe.labelExpressionInfo.expression = "IIF($feature.N_" + selectYear.value + ", '#,###'))";
        layerSeHh    .renderer = rendererSeHh;
        layerSePop   .renderer = rendererSePop;
        layerSeTypemp.renderer = rendererSeTypemp;
        break;
    }

    // labels
    if (document.getElementById('checkboxLabels').checked==true) {
      layerSegments.labelingInfo = [labelClass];
      layerSeHh    .labelingInfo = [labelClassSe];
      layerSePop   .labelingInfo = [labelClassSe];
      layerSeTypemp.labelingInfo = [labelClassSe];

    } else {
      layerSegments.labelingInfo = [labelClassOff];
      layerSeHh    .labelingInfo = [labelClassOff];
      layerSePop   .labelingInfo = [labelClassOff];
      layerSeTypemp.labelingInfo = [labelClassOff];
    }

    //if (document.getElementById('checkboxNoNotes').checked==true) {
    //  layerSegments.definitionExpression += " AND NOTES = ''";
    //} else {
    //  layerSegments.definitionExpression += "";
    //}

    // forecasts
    if (document.getElementById('checkboxForecasts').checked==true) {
      layerSegments.visible = true;
    } else {
      layerSegments.visible = false;
    }
    

    // roadway projects
    if (document.getElementById('checkboxRoadwayProjects').checked==true) {
      layerRoadwayProjectsLines .visible = true;
      layerRoadwayProjectsPoints.visible = true;
    } else {
      layerRoadwayProjectsLines .visible = false;
      layerRoadwayProjectsPoints.visible = false;
    }

    // transit projects
    if (document.getElementById('checkboxTransitProjects').checked==true) {
      layerTransitProjectsLines .visible = true;
      layerTransitProjectsPoints.visible = true;
    } else {
      layerTransitProjectsLines .visible = false;
      layerTransitProjectsPoints.visible = false;
    }

    // transit projects
    if (document.getElementById('checkboxProjectDetails').checked==true) {
      layerProjectsLines .visible = true;
      layerProjectsPoints.visible = true;
    } else {
      layerProjectsLines .visible = false;
      layerProjectsPoints.visible = false;
    }
    

    if (_phase!="") {
      layerRoadwayProjectsLines            .definitionExpression = filterRoadwayProjectsLinesFilter             + " AND Phase = '" + _phase + "'";
      layerRoadwayProjectsPoints           .definitionExpression = filterRoadwayProjectsPointsFilter            + " AND Phase = '" + _phase + "'";
      layerTransitProjectsLines            .definitionExpression = filterTransitProjectsLinesFilter             + " AND Phase = '" + _phase + "'";
      layerTransitProjectsPoints           .definitionExpression = filterTransitProjectsPointsFilter            + " AND Phase = '" + _phase + "'";
    } else {
      layerRoadwayProjectsLines            .visible = false;
      layerRoadwayProjectsPoints           .visible = false;
      layerTransitProjectsLines            .visible = false;
      layerTransitProjectsPoints           .visible = false;
    }
    
    layerSegments                        .refresh();
    layerRoadwayProjectsLines            .refresh();
    layerRoadwayProjectsPoints           .refresh();
    layerTransitProjectsLines            .refresh();
    layerTransitProjectsPoints           .refresh();
    layerFlags                           .refresh();

  };

  function populateSidebar() {
    console.log('populateSidebar');

    // Once the layerSegments is loaded, populate the radio buttons with the fields
    layerSegments.load().then(function () {

      const radioButtons = document.querySelectorAll('calcite-radio-button');

      radioButtons.forEach(item => {
        if (item.name=='rbgForecasts') {
          item.addEventListener('calciteRadioButtonChange', (event) => {
            if (event.target.checked) {
              console.log('Selected option:', event.target.value);
              curDisplayForecast = event.target.value;
              updateMap();
            }
          });  
        }
      });

      function addUpdateListener(elementId) {
        document.getElementById(elementId).addEventListener('calciteCheckboxChange', updateMap);
      }
      
      addUpdateListener('checkboxForecasts');
      addUpdateListener('checkboxRoadwayProjects');
      addUpdateListener('checkboxTransitProjects');
      addUpdateListener('checkboxLabels');
      addUpdateListener('checkboxProjectDetails');
      //addUpdateListener('checkboxNoNotes');

      updateMap();

    });
  }

  function createMapView() {
    console.log('createMapView');
    
    const map = new Map({
      basemap: "gray-vector" // Basemap layerSegments service
    });
  
    view = new MapView({
      map: map,
      center: [-111.8910, 40.7608], // Longitude, latitude
      zoom: 11, // Zoom level
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

    // Create a FeatureLayer using the layerSegments URL, the renderer, and the label class
    layerFlags = new FeatureLayer({
      url: layerSegmentsUrl,
      renderer: rendererSegmentsFlags,
      //popupTemplate: segmentPopupTemplate
    });

    layerRoadwayProjectsLines = new FeatureLayer({
      url: layerProjectsLinesUrl,
      renderer: rendererRoadwayLines,
      visible: false,
      definitionExpression: filterRoadwayProjectsLinesFilter
    });

    layerRoadwayProjectsPoints = new FeatureLayer({
      url: layerProjectsPointsUrl,
      renderer: rendererRoadwayPoints,
      visible: false,
      definitionExpression: filterRoadwayProjectsPointsFilter
    });

    layerTransitProjectsLines = new FeatureLayer({
      url: layerProjectsLinesUrl,
      renderer: rendererTransitLines,
      visible: false,
      definitionExpression: filterTransitProjectsLinesFilter
    });

    layerTransitProjectsPoints = new FeatureLayer({
      url: layerProjectsPointsUrl,
      renderer: rendererTransitPoints,
      visible: false,
      definitionExpression: filterTransitProjectsPointsFilter
    });

    // for full project details

    // Renderer for the polyline layer
    const polylineRenderer = new UniqueValueRenderer({
      //defaultSymbol: {type: "simple-line", color: "#cccccc", width: "1px" }, // Default symbol
      //defaultLabel: "Other",
      field: "Phase",
      uniqueValueInfos: [
          { value: "1"       , symbol: {type: "simple-line", color: "#d73027", width: "3px" }},
          { value: "2"       , symbol: {type: "simple-line", color: "#0093bf", width: "3px" }},
          { value: "3"       , symbol: {type: "simple-line", color: "#4d33a7", width: "3px" }},
          { value: "Unfunded", symbol: {type: "simple-line", color: "#ffa484", width: "3px" }}
      ]
    });
    
    const projectPopupTemplate = new PopupTemplate({
      title: "{Project_Name}", // Use a field value for the title
      content: [{
        type: "fields",
        fieldInfos: [
          {
            fieldName: "Plan_ID",
            label: "Plan ID"
          },
          {
            fieldName: "Phase",
            label: "Phase"
          },
          {
            fieldName: "Phase_Needed",
            label: "Phase Needed"
          },
          {
            fieldName: "improvement_type",
            label: "Improvement Type"
          },
          {
            fieldName: "Jurisdiction",
            label: "Jurisdiction"
          },
          {
            fieldName: "UniqueID",
            label: "Unique ID"
          }
        ]
      }]
    });


    // Renderer for the point layer
    const pointRenderer = new UniqueValueRenderer({
      //defaultSymbol: { type: "simple-marker", color: "#cccccc", outline: { color: "#cccccc", width: 2}}, // Default symbol
      //defaultLabel: "Other",
      field: "Phase",
      uniqueValueInfos: [
          { value: "1"       , symbol:  { type: "simple-marker", color: "#d73027", outline: { color: "#d73027", width: 1}}},
          { value: "2"       , symbol:  { type: "simple-marker", color: "#0093bf", outline: { color: "#0093bf", width: 1}}},
          { value: "3"       , symbol:  { type: "simple-marker", color: "#4d33a7", outline: { color: "#4d33a7", width: 1}}},
          { value: "Unfunded", symbol:  { type: "simple-marker", color: "#ffa484", outline: { color: "#ffa484", width: 1}}}
      ]
    });

    
    layerProjectsLines = new FeatureLayer({
      url: layerProjectsLinesUrl,
      renderer: polylineRenderer,
      popupTemplate: projectPopupTemplate,
      visible: false
    });

    layerProjectsPoints = new FeatureLayer({
      url: layerProjectsPointsUrl,
      renderer: pointRenderer,
      popupTemplate: projectPopupTemplate,
      visible: false
    });

    

    map.add(layerProjectsLines);
    map.add(layerProjectsPoints);
    map.add(layerTransitProjectsLines);
    map.add(layerTransitProjectsPoints);
    map.add(layerRoadwayProjectsLines);
    map.add(layerRoadwayProjectsPoints);


    // SOCIOECONOMICS LAYERS

    layerSeHh = new FeatureLayer({
      url: layerSeHhUrl,
      title: "Households"
    });
    
    rendererSeHh = new ClassBreaksRenderer({
      valueExpression: "$feature.N_2050",
      classBreakInfos: [
        { minValue:     0, maxValue:       50, symbol: { type: "simple-fill", color: [255, 255, 255, 0.50], outline: { color: [255, 255, 255], width: 0.5 } }, label: "0 to 49 households"        },
        { minValue:    50, maxValue:      500, symbol: { type: "simple-fill", color: [191, 191, 226, 0.50], outline: { color: [255, 255, 255], width: 1.1 } }, label: "50 to 499 households"      },
        { minValue:   500, maxValue:     1000, symbol: { type: "simple-fill", color: [127, 127, 197, 0.50], outline: { color: [255, 255, 255], width: 1.7 } }, label: "500 to 999 households"     },
        { minValue:  1000, maxValue:     2000, symbol: { type: "simple-fill", color: [ 63,  63, 168, 0.50], outline: { color: [255, 255, 255], width: 2.3 } }, label: "1,000 to 1,999 households" },
        { minValue:  2000, maxValue: Infinity, symbol: { type: "simple-fill", color: [  0,   0, 139, 0.50], outline: { color: [255, 255, 255], width: 3.9 } }, label: "More than 2,000 households"}
      ]
    });
  
    layerSePop = new FeatureLayer({
      url: layerSePopUrl,
      title: "Population"
    });

    rendererSePop = new ClassBreaksRenderer({
      valueExpression: "$feature.N_2050",
      classBreakInfos: [
        { minValue:     0, maxValue:      100, symbol: { type: "simple-fill", color: [255, 255, 255, 0.50], outline: { color: [255, 255, 255], width: 0.5 } }, label: "0 to 99 people"            },
        { minValue:   100, maxValue:     1000, symbol: { type: "simple-fill", color: [223, 191, 223, 0.50], outline: { color: [255, 255, 255], width: 1.1 } }, label: "100 to 999 people"         },
        { minValue:  1000, maxValue:     2000, symbol: { type: "simple-fill", color: [191, 127, 191, 0.50], outline: { color: [255, 255, 255], width: 1.7 } }, label: "1,000 to 1,999 people"     },
        { minValue:  2000, maxValue:     4000, symbol: { type: "simple-fill", color: [159,  63, 159, 0.50], outline: { color: [255, 255, 255], width: 2.3 } }, label: "2,000 to 3,999 people"     },
        { minValue:  4000, maxValue: Infinity, symbol: { type: "simple-fill", color: [128,   0, 128, 0.50], outline: { color: [255, 255, 255], width: 3.9 } }, label: "More than 4,000 households"}
      ]
    });

    layerSeTypemp = new FeatureLayer({
      url: layerSeTypempUrl,
      title: "Typical Employment"
    });
    
    rendererSeTypemp = new ClassBreaksRenderer({
      valueExpression: "$feature.N_2050",
      classBreakInfos: [
        { minValue:    0, maxValue:      100, symbol: { type: "simple-fill", color: [255, 255, 255, 0.50], outline: { color: [255, 255, 255], width: 0.5 } }, label: "0 to 99 jobs"        },
        { minValue:  100, maxValue:     1000, symbol: { type: "simple-fill", color: [242, 212, 191, 0.50], outline: { color: [255, 255, 255], width: 1.1 } }, label: "100 to 999 jobs"     },
        { minValue: 1000, maxValue:     3000, symbol: { type: "simple-fill", color: [229, 170, 127, 0.50], outline: { color: [255, 255, 255], width: 1.7 } }, label: "1,000 to 2,999 jobs" },
        { minValue: 3000, maxValue:     6000, symbol: { type: "simple-fill", color: [216, 127,  63, 0.50], outline: { color: [255, 255, 255], width: 2.3 } }, label: "2,000 to 5,999 jobs" },
        { minValue: 6000, maxValue: Infinity, symbol: { type: "simple-fill", color: [204,  85,   0, 0.50], outline: { color: [255, 255, 255], width: 3.9 } }, label: "More than 6,000 jobs"}
      ]
    });

    rendererSeChange = new ClassBreaksRenderer({
      valueExpression: "$feature.N_2050 - $feature.N_2042",
      classBreakInfos: [
        { minValue: -100000, maxValue:  0.00001, symbol: { type: "simple-fill", color: [173, 216, 230, 0.65], outline: { color: [255, 255, 255], width: 0.5 } }, label: "Decrease"      },
        { minValue: 0.00001, maxValue:      100, symbol: { type: "simple-fill", color: [255, 153, 153, 0.65], outline: { color: [255, 255, 255], width: 1.1 } }, label: "+1 to +99"     },
        { minValue:     100, maxValue:      300, symbol: { type: "simple-fill", color: [255, 102, 102, 0.65], outline: { color: [255, 255, 255], width: 1.7 } }, label: "+100 to +299"  },
        { minValue:     300, maxValue:      900, symbol: { type: "simple-fill", color: [204,   0,   0, 0.65], outline: { color: [255, 255, 255], width: 2.3 } }, label: "+300 to +899"  },
        { minValue:     900, maxValue: Infinity, symbol: { type: "simple-fill", color: [139,   0,   0, 0.65], outline: { color: [255, 255, 255], width: 3.9 } }, label: "More than +900"}
      ]
    });

    map.add(layerSeHh);
    map.add(layerSePop);
    map.add(layerSeTypemp);

    map.add(layerFlags);
    map.add(layerSegments);

    // add log table
    tableLog = new FeatureLayer({
      url: tableLogUrl,
      outFields: ["*"] 
    });

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
    
    // Create a legend widget
    legend = new Legend({
      view: view,
      layerInfos: [
                    { layer: layerSegments            , title: 'Segments'               },
                    { layer: layerRoadwayProjectsLines, title: ''                       },
                    { layer: layerTransitProjectsLines, title: ''                       },
                    { layer: layerProjectsPoints      , title: 'Point Projects Detailed'},
                    { layer: layerProjectsLines       , title: 'Line Projects Detailed' },
                    { layer: layerFlags               , title: 'Flagged Segments'       },
                    { layer: layerSeHh                , title: 'Households'             },
                    { layer: layerSePop               , title: 'Population'             },
                    { layer: layerSeTypemp            , title: 'Typical Employment'     }
                  ] // Replace YOUR_LAYER with the layerSegments you want to include in the legend
    });
    view.ui.add(legend, "top-right");
    
    document.getElementById('checkboxLegend').addEventListener('calciteCheckboxChange', function(event) {
      if (event.target.checked) {
        // Show the legend
        view.ui.add(legend, "top-right");
      } else {
        // Hide the legend
        view.ui.remove(legend);
      }
    });

    // add search widget
    var searchWidget = new Search({
      view: view
    });
    view.ui.add(searchWidget, {
      position: "bottom-right"
    });

    populateSidebar();

  } //createMapView()

  // Fetch the JSON file
  fetch('config.json')
    .then(response => response.json())
    .then(config => {
      
      // Use or log the layerSegments value
      console.log('config.json');

      // Extract the layerSegments value
      layerSegmentsUrl                             = config["layerSegmentsUrl"                            ];
      tableLogUrl                                  = config["tableLogUrl"                                 ];
      layerProjectsLinesUrl                        = config["layerProjectsLinesUrl"                       ];
      layerProjectsPointsUrl                       = config["layerProjectsPointsUrl"                      ];
      filterRoadwayProjectsLinesFilter             = config["filterRoadwayProjectsLinesFilter"            ];
      filterTransitProjectsLinesFilter             = config["filterTransitProjectsLinesFilter"            ];
      filterRoadwayProjectsPointsFilter            = config["filterRoadwayProjectsPointsFilter"           ];
      filterTransitProjectsPointsFilter            = config["filterTransitProjectsPointsFilter"           ];
      layerSeHhUrl                                 = config["layerSeHhUrl"                                ];
      layerSePopUrl                                = config["layerSePopUrl"                               ];
      layerSeTypempUrl                             = config["layerSeTypempUrl"                            ];

      // Create a new ClassBreaksRenderer using the fetched configuration     
      rendererSegmentsVolume        = new ClassBreaksRenderer(config["rendererSegmentsVolume"       ]);
      rendererSegmentsVolumeCompare = new ClassBreaksRenderer(config["rendererSegmentsVolumeCompare"]);
      rendererSegmentsVolumeAdjust  = new ClassBreaksRenderer(config["rendererSegmentsVolumeAdjust" ]);
      rendererRoadwayPoints         = new SimpleRenderer     (config["rendererRoadwayPoints"        ]);
      rendererRoadwayLines          = new SimpleRenderer     (config["rendererRoadwayLines"         ]);
      rendererTransitPoints         = new SimpleRenderer     (config["rendererTransitPoints"        ]);
      rendererTransitLines          = new SimpleRenderer     (config["rendererTransitLines"         ]);
      rendererSegmentsFlags         = new SimpleRenderer     (config["rendererSegmentsFlags"        ]);

      // create map
      createMapView();

    })
    .catch(error => {
      console.error('Error fetching the file:', error);
  });


  // Store the current highlight graphic outside of your selection function
  let currentHighlightGraphic = null;

  function onSelectFeature(feature) {
    console.log('onSelectFeature');

    // Create a graphic using the highlight symbol and the feature's geometry
    const highlightGraphic = new Graphic({
      geometry: feature.geometry,
      symbol: {
        type: "simple-line", // autocasts as new SimpleLineSymbol()
        color: [255, 255, 0], // red color
        width: 5
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

    
    if (document.getElementById('checkboxAutoZoom').checked==true) {
      // Get current zoom level
      var currentZoom = view.zoom;

      console.log('zoom to segment ' + feature.attributes['SEGID']);

      view.goTo({
        target: feature.geometry,
        zoom: currentZoom // Use the current zoom level
      }, {
        duration: 2000,
        easing: "in-out-cubic"
      }).catch(function(error) {
        if (error.name != "AbortError") {
            console.error(error);
        };
      });
    }

  }

  async function loadAppData() {
    console.log('loadAppData');
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
    const selectForecastArea = document.getElementById('selectForecastArea');
    const selectCoName = document.getElementById('selectCoName');
    const selectSegId = document.getElementById('selectSegId');

    // PLAN AREA

    // Extract the unique F_AREA values
    const uniqueForecastAreas = [...new Set(dataSegments.map(item => item.F_AREA))].sort();


    // Remove all existing child elements
    if (selectForecastArea.firstChild) {
      while (selectForecastArea.firstChild) {
        selectForecastArea.removeChild(selectForecastArea.firstChild);
      }
    }

    // Add entire state option first
    const newItem = document.createElement('calcite-segmented-control-item');
    newItem.textContent = 'Entire State';
    newItem.value = 'Entire State';
    selectForecastArea.appendChild(newItem);

    // Append the items for the unique F_AREA values
    uniqueForecastAreas.forEach(forecastArea => {
      const item = document.createElement('calcite-segmented-control-item');
      item.value = forecastArea;
      if (forecastArea==" " || forecastArea=="") {
        item.textContent = "{Blank}";
      } else {
        item.textContent = forecastArea;
      }
      selectForecastArea.appendChild(item);
    });

    // Storing a string in local storage
    function storeStringInLocalStorage(key, value) {
      try {
          localStorage.setItem(key, value);
      } catch (e) {
          console.error('Failed to store the string:', e);
      }
    }

    // Retrieving a string from local storage
    function retrieveStringFromLocalStorage(key) {
      try {
          const value = localStorage.getItem(key);
          if (value !== null) {
              console.log('Retrieved string:', value);
              return value;
          } else {
              console.log('No string found with the given key.');
              return null;
          }
      } catch (e) {
          console.error('Failed to retrieve the string:', e);
          return null;
      }
    }

    const _prevSelectedForecastArea = retrieveStringFromLocalStorage('selectedForecastArea');

    if (_prevSelectedForecastArea) {
      selectForecastArea.value = _prevSelectedForecastArea;
    } else {
      selectForecastArea.value = defaultForecastArea;
    }

    // COUNTY

    // Populate the county selector from the data

    function updateCoNames() {
      console.log ('updateCoNames');

      var selectForecastArea = document.getElementById('selectForecastArea');

      storeStringInLocalStorage('selectedForecastArea', selectForecastArea.value);

      // Filter dataSegments by F_AREA and then extract the CO_NAME values
      var coNames;

      if (document.getElementById('selectForecastArea').value === 'Entire State') {
        coNames = dataSegments.map(item => item.CO_NAME);
      } else {
        coNames = dataSegments.filter(item => item.F_AREA === document.getElementById('selectForecastArea').value).map(item => item.CO_NAME);
      }
      
      // Create a Set from the coNames array to remove duplicates
      const uniqueCoNames = [...new Set(coNames)].sort();;

      // Remove all existing child elements
      if (selectCoName.firstChild) {
        while (selectCoName.firstChild) {
          selectCoName.removeChild(selectCoName.firstChild);
        }
      }
      
      // Add all counties option
      const newItem = document.createElement('calcite-option');
      newItem.textContent = 'All Counties';
      newItem.value = 'All Counties';
      selectCoName.appendChild(newItem);
      selectCoName.value = 'All Counties';

      uniqueCoNames.forEach((id,index) => {
        const option = document.createElement('calcite-option');
        option.value = id;
        if (id==" " || id=="") {
          option.textContent = "{Blank}";
        } else {
          option.textContent = id;
        }
        selectCoName.appendChild(option);

      });
      
      if (selectSegId) {
        updateSegments();
      }
    }
    // run first time
    updateCoNames();

    // FLAGS

    document.addEventListener('calciteComboboxChange', handleFlagsSegListSelection);
    
    function createCalciteCheckboxWithLabel(flagName,flagDescription) {
      // Create elements
      const checkbox = document.createElement('calcite-checkbox');
      checkbox.value = flagName;
      const labelText = document.createTextNode(flagDescription);
      const label = document.createElement('label');

      label.classList.add('custom-checkbox-label');

      // Add an event listener to the checkbox
      checkbox.addEventListener('calciteCheckboxChange', function(event) {
        if (event.target.checked) {
          flagsMap.push(event.target.value);
        } else {
          const index = flagsMap.indexOf(event.target.value);
          if (index > -1) {
            flagsMap.splice(index, 1);
          }
        }
        updateMap();
      });

      // Configure and append elements
      label.appendChild(checkbox);
      label.appendChild(labelText);
    
      return label;
    }

    function populateComboboxFlags() {
      const combobox = document.getElementById('comboboxFlags');
      const flagChecksDiv = document.getElementById('flagChecks');
    
      dataFlags.forEach(flag => {
        // Create and append combobox items
        const comboboxItem = document.createElement('calcite-combobox-item');
        comboboxItem.text = flag.flagName;
        comboboxItem.textLabel = flag.flagDescription;
        combobox.appendChild(comboboxItem);
    
        // Create and append check boxes
        const checkboxLabel = createCalciteCheckboxWithLabel(flag.flagName, flag.flagDescription);
        flagChecksDiv.appendChild(checkboxLabel);    
      });
    }
    
    function handleFlagsSegListSelection(event) {
      flagsSegList.length = 0; // Clear the previous selection
      event.target.selectedItems.forEach(item => {
        flagsSegList.push({
          flagName: item.text,
          flagDescription: item.textLabel
        });
      });

      updateMap();
      updateSegments();

      console.log(flagsSegList); // Logs the selected flags
    }
    
    populateComboboxFlags();

    // To disable the combobox
    //document.getElementById('comboboxFlags').disabled = true;


    // SEGMENTS

    // Populate the SEGID selector from the data
    function updateSegments() {
      console.log('updateSegments');
      
      const query = new Query();
      query.returnGeometry = false;
      query.outFields = ["*"];
      query.orderByFields = ['SEGID ASC']
      
      // Building where condition based on user inputs
      let whereCondition = [];
    
      if (document.getElementById('selectForecastArea').value !== 'Entire State') {
        whereCondition.push(`F_AREA = '${document.getElementById('selectForecastArea').value}'`);
    
        if (document.getElementById('selectCoName').value !== 'All Counties') {
          whereCondition.push(`CO_NAME = '${document.getElementById('selectCoName').value}'`);
        }
      } else if (document.getElementById('selectCoName').value !== 'All Counties') {
        whereCondition.push(`CO_NAME = '${document.getElementById('selectCoName').value}'`);
      }

      if (flagsSegList.length) {
        flagsSegList.forEach(flag => {
          // Condition for FL_ flag
          const flCondition = `${flag.flagName} = 1`;
      
          // Additional condition for OV_ flag
          const ovFlagName = flag.flagName.replace("FL_", "OV_");
          const ovCondition = `${ovFlagName} = 0`;
      
          // Combine the two conditions with AND and group them with parentheses
          const combinedCondition = `(${flCondition} AND ${ovCondition})`;
      
          whereCondition.push(combinedCondition);
        });
      }
      
      query.where = whereCondition.join(' AND ');
      
      // Remove all existing child elements
      if (selectSegId.firstChild) {
        while (selectSegId.firstChild) {
          selectSegId.removeChild(selectSegId.firstChild);
        }
      }

      document.getElementById('segdetail').style.display = 'none';

      // Execute the query
      layerSegments.queryFeatures(query).then(function(result){
        console.log('layerSegments.queryFeatures');
        // Here, result.features contains your _filteredSegments
        const _filteredSegments = result.features;
        
        // check to see if segments exist
        if (_filteredSegments.length) {
    
          _filteredSegments.forEach((feature, index) => {
            const option = document.createElement('calcite-option');
            const segmentId = feature.attributes.SEGID;
            option.value = segmentId;
            option.textContent = segmentId;
            selectSegId.appendChild(option);
            if (index === 0) {
              selectSegId.value = segmentId;
              selectSegId.selectedOption = option;
            }
          });
          document.getElementById('segdetail').style.display = 'block';
          updatePanelInfo();
          updateMap();
        }
      });

    }

    // run first time
    //updateSegments();

    // Create a new Calcite button
    const button = document.createElement('calcite-button');
    button.innerHTML = '>'; // Set the button text

    // Add an event listener to the button for the 'click' event
    button.addEventListener('click', function() {
      // Get the select element with ID 'selectSegId'
      const select = document.getElementById('selectSegId');
  
      if (select && select.children && select.selectedOption.nextElementSibling) {
        // Increment the selectedIndex to select the next option
        selectSegId.selectedOption = select.selectedOption.nextElementSibling;
        updatePanelInfo();
      } else {
        //alert('No more items to select.'); // Alert if there's no next option or if select is not found
      }
    });
    document.getElementById('selectNextButton').appendChild(button);
  
    // Create a new Calcite button
    const buttonPrev = document.createElement('calcite-button');
    buttonPrev.innerHTML = '<'; // Set the buttonPrev text

    // Add an event listener to the buttonPrev for the 'click' event
    buttonPrev.addEventListener('click', function() {
      // Get the select element with ID 'selectSegId'
      const select = document.getElementById('selectSegId');
  
      if (select && select.children && select.selectedOption.previousElementSibling) {
        // Increment the selectedIndex to select the next option
        selectSegId.selectedOption = select.selectedOption.previousElementSibling;
        updatePanelInfo();
      } else {
        //alert('No more items to select.'); // Alert if there's no next option or if select is not found
      }
    });
    document.getElementById('selectPrevButton').appendChild(buttonPrev);

    
    // year buttons

    // Create a new Calcite button
    const buttonNextYear = document.createElement('calcite-button');
    buttonNextYear.innerHTML = '>'; // Set the buttonNextYear text

    // Add an event listener to the button for the 'click' event
    buttonNextYear.addEventListener('click', function() {
      // Get the select element with ID 'selectYear'
      const select = document.getElementById('selectYear');
  
      if (select && select.children && select.selectedOption.nextElementSibling) {
        // Increment the selectedIndex to select the next option
        selectYear.selectedOption = select.selectedOption.nextElementSibling;
        updateMap();
      } else {
        //alert('No more items to select.'); // Alert if there's no next option or if select is not found
      }
    });
    document.getElementById('selectNextYearButton').appendChild(buttonNextYear);
  
    // Create a new Calcite button
    const buttonPrevYear = document.createElement('calcite-button');
    buttonPrevYear.innerHTML = '<'; // Set the buttonPrev text

    // Add an event listener to the buttonPrev for the 'click' event
    buttonPrevYear.addEventListener('click', function() {
      // Get the select element with ID 'selectYear'
      const select = document.getElementById('selectYear');
  
      if (select && select.children && select.selectedOption.previousElementSibling) {
        // Increment the selectedIndex to select the next option
        selectYear.selectedOption = select.selectedOption.previousElementSibling;
        updateMap();
      } else {
        //alert('No more items to select.'); // Alert if there's no next option or if select is not found
      }
    });
    document.getElementById('selectPrevYearButton').appendChild(buttonPrevYear);

    // Function to update the adjustments
    function applyEdits() {
      console.log('applyEdits');

      const inputBoxValue = document.getElementById('edit-key').value;

      function getKeysByFilter(filterValue) {
        return editKeys
          .filter(row => row[0] === filterValue)  // filter by first column
          .map(row => row[1]);                   // extract second column
      }
      
      if (!getKeysByFilter(document.getElementById('selectForecastArea').value).includes(inputBoxValue)) {
          // If the input value doesn't match 'editKeys', execute the code here
          console.error("Incorrect editKey!");
          alert('Incorrect edit key.');
          return;
      }

      // Query to get the specific feature with SEGID=_curSegId
      var query = new Query();
      query.where = "SEGID='" + selectSegId.value + "'"; // Assuming SEGID is numeric
      query.returnGeometry = false;
      query.outFields = ['*']; // Get all fields
    
      layerSegments.queryFeatures(query).then(function(results) {
        console.log('queryFeatures');

        if (results.features.length > 0) {
          var featureToUpdate = results.features[0]; // Get the first feature that matches the query

          // Define the custom rounding function
          function customRounding(value) {
            if (0 <= value && value < 100) {
              return Math.round(value / 10) * 10;
            } else if (100 <= value && value < 1000) {
              return Math.round(value / 50) * 50;
            } else if (1000 <= value && value < 10000) {
              return Math.round(value / 100) * 100;
            } else if (10000 <= value && value < 100000) {
              return Math.round(value / 500) * 500;
            } else if (value >= 100000) {
              return Math.round(value / 1000) * 1000;
            } else {
              return value;
            }
          }

          // Function to get rounded adjustment and update the input value
          function getRoundedAdjustment(year) {
            const adjValueElement = document.getElementById('adj' + year + 'Value');
            const adjHistValue = parseInt(document.getElementById('adjHistValue').value || 0);
            const currentValue = featureToUpdate.attributes['MF' + year];
            const adjustmentValue = parseInt(adjValueElement.value);
            const roundedValue = customRounding(currentValue + adjustmentValue + adjHistValue);
            const newAdj = roundedValue - currentValue - adjHistValue;
            adjValueElement.value = newAdj;
            return newAdj;
          }

          // Example usage for different years
          featureToUpdate.attributes.ADJ2023 = getRoundedAdjustment('2023') || 0;
          featureToUpdate.attributes.ADJ2028 = getRoundedAdjustment('2028') || 0;
          featureToUpdate.attributes.ADJ2032 = getRoundedAdjustment('2032') || 0;
          featureToUpdate.attributes.ADJ2042 = getRoundedAdjustment('2042') || 0;
          featureToUpdate.attributes.ADJ2050 = getRoundedAdjustment('2050') || 0;
          featureToUpdate.attributes.ADJHIST = parseInt(document.getElementById('adjHistValue').value);
          featureToUpdate.attributes.NOTES = document.getElementById('notes').value.trim();
          featureToUpdate.attributes.NOTES_FURREV = document.getElementById('notes_furrev').value.trim();
          featureToUpdate.attributes.NOTES_SEG = document.getElementById('notes_seg').value.trim();

          dataFlags.forEach(flag => {
            // Replace the field names with their values in the segment
            let evalString = flag.flagCriteria
              .replace(/\[([^\]]+)\]/g, function(_, fieldName) {
                return `featureToUpdate.attributes.${fieldName}`;
              })
              .replace(/&/g, '&&')  // replace bitwise AND with logical AND
              .replace(/\|/g, '||');  // replace bitwise OR with logical OR
            
            // previous value
            const _prvValue = featureToUpdate.attributes[flag.flagName]
            const _newValue = eval(evalString) ? 1 : 0;
            
            // if the new value equal 0 and the previous value equaled 1 then set override to zero
            if (_prvValue===1 && _newValue===0) {
              featureToUpdate.attributes[flag.flagName.replace('FL_', 'OV_')] = 0;
            }

            // Evaluate the modified criteria
            featureToUpdate.attributes[flag.flagName] = _newValue;

          });

          inputIds.forEach(id => {
            const inputElement = document.getElementById(id);
            initialValues[id] = inputElement.value.trim();
          });

          // Apply the edits
          layerSegments.applyEdits({
            updateFeatures: [featureToUpdate]
          }).then(function(results) {
            if (results.updateFeatureResults.length > 0) {
              console.log('Updated Successfully');
              const buttonApply = document.getElementById('button-apply');
              if (buttonApply.classList.contains('btn-dirty')) {
                buttonApply.classList.remove('btn-dirty');
                buttonApply.classList.add('btn-clean');
              }
              
              updatePanelInfo();
            }
          }).catch(function(error) {
            console.error('Error updating feature: ', error);
            alert('UPDATE FEATURE ERROR.');
          });
        } else {
          console.log('No features found with SEGID=' + _curSegId);
        }
      }).catch(function(error) {
        console.error('Error querying features: ', error);
      });

      // LOG FILE

      // Create an empty Graphic to represent the new feature
      var newFeature = {
        attributes: {
            SEGID: selectSegId.value
        }
      };

      const mountainTime = new Date();
      console.log(mountainTime);

      // Populate the attributes
      newFeature.attributes.SEGID        = selectSegId.value;
      newFeature.attributes.EDITKEY      = document.getElementById('edit-key').value;
      newFeature.attributes.ADJ2023      = document.getElementById('adj2023Value').value || 0;
      newFeature.attributes.ADJ2028      = document.getElementById('adj2028Value').value || 0;
      newFeature.attributes.ADJ2032      = document.getElementById('adj2032Value').value || 0;
      newFeature.attributes.ADJ2042      = document.getElementById('adj2042Value').value || 0;
      newFeature.attributes.ADJ2050      = document.getElementById('adj2050Value').value || 0;
      newFeature.attributes.ADJHIST      = document.getElementById('adjHistValue').value || 0;
      newFeature.attributes.NOTES        = document.getElementById('notes').value.trim();
      newFeature.attributes.NOTES_FURREV = document.getElementById('notes_furrev').value.trim();
      newFeature.attributes.NOTES_SEG    = document.getElementById('notes_seg').value.trim();
      newFeature.attributes.TIMESTAMP = mountainTime;  // Directly assign mountainTime

      // Apply the edits to add the new feature
      tableLog.applyEdits({
        addFeatures: [newFeature]
      }).then(function(results) {
        if (results.addFeatureResults.length > 0) {
            console.log('Added Successfully');
        }
      }).catch(function(error) {
        console.error('Error adding feature: ', error);
        alert('LOG FILE ERROR.');
      });
    };

    // Create a new Calcite button
    const buttonApply = document.createElement('button');
    buttonApply.id = 'button-apply';
    buttonApply.innerHTML = 'Save Changes'; // Set the buttonApply text
    buttonApply.classList.add('btn-clean'); // Start with the red color

    // Add an event listener to the buttonApply for the 'click' event
    buttonApply.addEventListener('click', function() {
      // Get the select element with ID 'selectSegId'
      const select = document.getElementById('selectSegId');
  
      if (select && select.children) {
        if (this.classList.contains('btn-dirty')) {
          applyEdits();
        }
      } else {
        //alert('No more items to select.'); // Alert if there's no next option or if select is not found
      }
    });
    document.getElementById('apply-edits').appendChild(buttonApply);

    // create chart first time... no data, update will populate datasets
    async function createChart() {
      console.log('createChart');
      const ctx = document.getElementById('chartType').getContext('2d');
      myChart = new Chart(ctx, {
        type: 'scatter',
        options: {
          aspectRatio: 2,
          scales: {
            x: {
              min: 1980,
              max: 2050,
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
                display: false,
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
    async function updatePanelInfo() {
      console.log('updatePanelInfo');

      // If there's an existing chart, destroy it
      if (!myChart) {
        createChart();
      }

      const buttonApply = document.getElementById('button-apply');

      if (buttonApply) {
        if (buttonApply.classList.contains('btn-dirty')) {
          buttonApply.classList.remove('btn-dirty');
          buttonApply.classList.add('btn-clean');
        }
      }

      // Function to clear values based on the provided prefixes and years
      function clearValues() {
        for (const prefix of prefixes) {
          for (const year of years) {
            const elementId = `${prefix}${year}Value`;
            const element = document.getElementById(elementId);

            if (element) {
              if (element.tagName === 'INPUT') {
                element.value = '';
              } else {
                element.innerHTML = '';
              }
            }
          }
        }
      }

      // Call the function to clear values
      clearValues();

      const selectSegId = document.getElementById('selectSegId');
      const _curSegId = selectSegId.value;

      // Filter the data based on SEGID and SOURCE
      const filteredAadt = dataAadt.filter(item => item.SEGID === _curSegId && item.SOURCE === defaultSource);
      const aadt2019Entry = filteredAadt.find(item => item.YEAR === 2019);

      let aadt2019Value;

      if (aadt2019Entry) {
        aadt2019Value = aadt2019Entry.AADT;
      } else {
        aadt2019Value = 0;
        console.log("No AADT value found for the year 2019.");
      }
      
      const filteredModForecasts = dataModVolAdj.filter(item => item.SEGID === _curSegId);
      const filteredLinForecasts = dataLinForecasts.filter(item =>
        item.SEGID === _curSegId &&
        item.SOURCE === defaultSource
      );
      
      const responseProjectionGroups = await fetch('data/projection-groups.json');
      const dataProjectionGroups = await responseProjectionGroups.json();
      
      colors      = dataProjectionGroups.map(item => item.pgColor                 );
      hidden      = dataProjectionGroups.map(item => item.pgHidden                );
      borderDash  = dataProjectionGroups.map(item => JSON.parse(item.pgBorderDash));
      borderWidth = dataProjectionGroups.map(item => item.pgBorderWidth           );

      
      // Query the feature layer to find the feature with the matching SEGID
      const query = layerSegments.createQuery();
      query.where = "SEGID = '" + _curSegId + "'"; // Replace with your field name and SEGID value
      query.outFields = '*';
      const result = await layerSegments.queryFeatures(query);

      // If a matching feature was found, zoom in to it
      if (result.features.length > 0) {
        const feature = result.features[0];
      
        // Extract the values of the fields and put them into a single list
        adjustments = [
          {"year": 2019, "adj": feature.attributes.ADJ2019},
          {"year": 2023, "adj": feature.attributes.ADJ2023},
          {"year": 2028, "adj": feature.attributes.ADJ2028},
          {"year": 2032, "adj": feature.attributes.ADJ2032},
          {"year": 2042, "adj": feature.attributes.ADJ2042},
          {"year": 2050, "adj": feature.attributes.ADJ2050}
        ];

        // Add the historic adjustments to each value in the list
        adjustments_historic = feature.attributes.ADJHIST;
        // If adjustments_historic is null or undefined, set it to 0
        adjustments_historic = adjustments_historic || 0;
        
        // Extract the X and Y values
        const chartDataAadt         = filteredAadt        .map(item => ({ x: item.YEAR, y: item.AADT                              })).sort((a, b) => a.x - b.x);
        const chartDataAadtAdj      = filteredAadt        .map(item => ({ x: item.YEAR, y: item.AADT        + adjustments_historic})).sort((a, b) => a.x - b.x);
        const chartDataModForecasts = filteredModForecasts.map(item => ({ x: item.YEAR, y: item.modForecast + adjustments_historic})).sort((a, b) => a.x - b.x);
        const chartDataModAadt      = filteredModForecasts.map(item => ({ x: item.YEAR, y: item.modAadt     + adjustments_historic})).sort((a, b) => a.x - b.x);
        const chartDataModDyvol     = filteredModForecasts.map(item => ({ x: item.YEAR, y: item.DY_VOL                            })).sort((a, b) => a.x - b.x);
        const chartDataModLanes     = filteredModForecasts.map(item => ({ x: item.YEAR, y: item.LANES                             })).sort((a, b) => a.x - b.x);
        const chartDataModFt        = filteredModForecasts.map(item => ({ x: item.YEAR, y: item.FT                                })).sort((a, b) => a.x - b.x);
        const chartDataModAt        = filteredModForecasts.map(item => ({ x: item.YEAR, y: item.ATYPENAME                         })).sort((a, b) => a.x - b.x);

        // Create a map of adjustments for faster lookup
        const adjustmentMap = new Map(adjustments.map((adj) => [adj.year, adj.adj]));

        // Your existing code
        const chartDataForecasts = chartDataModForecasts.map((dataPoint) => ({ ...dataPoint }));

        // Years to be added
        const yearsToAdd = [2023, 2028, 2032, 2042, 2050];

        // Add missing years with dataPoint.y = 0
        yearsToAdd.forEach(yearToAdd => {
          if (!chartDataForecasts.some(dataPoint => dataPoint.x === yearToAdd)) {
            chartDataForecasts.push({ x: yearToAdd, y: 0 });
          }
        });

        // Apply adjustments to chartDataForecasts if the year is in adjustments
        chartDataForecasts.forEach((dataPoint) => {
          const year = dataPoint.x;
          const foundAdjustment = adjustments.find((adjustment) => adjustment.year === year);

          if (foundAdjustment) {
            // Apply adjustment
            const adj = foundAdjustment.adj;
            dataPoint.y += adj;
          } else {
            // Year not found in adjustments
            // Assuming 'adj' is a known value or should be set to a default like 0
            const adj = 0; // Set to an appropriate default if needed
            dataPoint.y = adj;
          }
        });
                
        const _yearsOfData = chartDataModAt.map(item => item.x);

        // Group the filteredLinForecasts by PROJGRP
        const groupedLinForecasts = filteredLinForecasts.reduce((groups, item) => {
          (groups[item.PROJGRP] = groups[item.PROJGRP] || []).push(item);
          return groups;
        }, {});

    
        // Create datasets for each PROJGRP
        const linForecastDatasets = Object.entries(groupedLinForecasts).map(([key, group], index) => ({
          label: key, //'Linear Forecasts - ' + key,
          data: group.map(item => ({ x: item.YEAR, y: item.linForecast + adjustments_historic})),
          borderColor: colors[index % colors.length], // You can define an array of colors or use a function to generate them
          backgroundColor: colors[index % colors.length],
          pointRadius: 0,
          showLine: true,
          hidden: hidden[index % hidden.length],
          borderDash: borderDash[index % borderDash.length],
          borderWidth: borderWidth[index % borderWidth.length]
        }));

        // If adjustments_historic is not zero, then include the adjusted dataset
        const adjustedDataset = adjustments_historic !== 0 ? [{
          label: 'UDOT Estimated AADT Adjusted',
          data: chartDataAadtAdj,
          borderColor: 'gray',
          backgroundColor: 'gray',
          pointRadius: 4
        }] : [];

        // Create the chart
        myChart.data.datasets = [
          ...adjustedDataset,
          {
            label: 'UDOT Estimated AADT',
            data: chartDataAadt,
            borderColor: 'lightgray',
            backgroundColor: 'lightgray',
            pointRadius: 4
          },
          {
            label: 'Final Forecasts',
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
          ...linForecastDatasets // Spread linForecastDatasets here
        ];

        // Refresh the chart
        myChart.update();


        onSelectFeature(feature);

        // update values in manual adjustment boxes
        //document.getElementById("adj2019Value").value = feature.attributes.ADJ2023;
        document.getElementById("adj2023Value").value = feature.attributes.ADJ2023 || 0;
        document.getElementById("adj2028Value").value = feature.attributes.ADJ2028 || 0;
        document.getElementById("adj2032Value").value = feature.attributes.ADJ2032 || 0;
        document.getElementById("adj2042Value").value = feature.attributes.ADJ2042 || 0;
        document.getElementById("adj2050Value").value = feature.attributes.ADJ2050 || 0;
        document.getElementById("adjHistValue").value = feature.attributes.ADJHIST || 0;
        document.getElementById("notes"       ).value = feature.attributes.NOTES.trim();
        document.getElementById("notes_furrev").value = feature.attributes.NOTES_FURREV.trim();
        document.getElementById("notes_seg"   ).value = feature.attributes.NOTES_SEG.trim();

        // Define all data arrays in a localized dictionary
        const dataArrays = {
          chartDataForecasts,
          chartDataModForecasts,
          chartDataModAadt,
          chartDataModDyvol,
          chartDataModLanes,
          chartDataModFt,
          chartDataModAt,
          // ... Add other data arrays as needed
        };

        // Define mapping for each data array to its DOM prefix
        const mappings = [
          { prefix: "f"    , data: "chartDataForecasts"   , special: "toLocaleString" },
          { prefix: "mf"   , data: "chartDataModForecasts", special: "toLocaleString" },
          { prefix: "m"    , data: "chartDataModAadt"     , special: "toLocaleString" },
          { prefix: "dyvol", data: "chartDataModDyvol"    , special: "Math.round" },
          { prefix: "lanes", data: "chartDataModLanes"    , special: "toLocaleString" },
          { prefix: "ft"   , data: "chartDataModFt"       , special: "toLocaleString" },
          { prefix: "at"   , data: "chartDataModAt"       , special: "direct" }
        ];

        mappings.forEach(map => {
          _yearsOfData.forEach((year, index) => {
            const elementId = `${map.prefix}${year}Value`;
            const element = document.getElementById(elementId);
            let value;

            const dataArray = dataArrays[map.data];
            if (dataArray && dataArray[index]) {
              if (map.special === "toLocaleString") {
                value = dataArray[index].y.toLocaleString('en-US');
              } else if (map.special === "Math.round") {
                value = Math.round(dataArray[index].y).toLocaleString('en-US');
              } else if (map.special === "direct") {
                value = dataArray[index].y;
              }
            } else {
              value = "";
            }

            //if (map.data=="chartDataForecasts" && year==2019) {
            //  value = aadt2019Value.toLocaleString('en-US');
            //}

            if (element) {
              if (element.tagName === 'INPUT') {
                element.value = value;
              } else {
                element.innerHTML = value;
              }
            }
          });
        });

        // Handle special case for diff values
        _yearsOfData.forEach((year, index) => {
          const elementId = `diff${year}Value`;
          const element = document.getElementById(elementId);
          
          if (element) {
            if (index === 0) {
              element.innerHTML = "";
            } else {
              // Ensure both the current and previous elements in the array are defined
              if (chartDataForecasts[index] && chartDataForecasts[index - 1]) {
                const difference = chartDataForecasts[index].y - chartDataForecasts[index - 1].y;
                element.innerHTML = difference.toLocaleString('en-US');
              } else {
                element.innerHTML = "";  // Default to an empty string if data isn't available
              }
            }
          }
        });

        // Special case for notes
        const notesElement = document.getElementById("notes");
        if (notesElement) {
          notesElement.value = feature.attributes.NOTES.trim();
        }

        // Special case for notes
        const notesFurRevElement = document.getElementById("notes_furrev");
        if (notesFurRevElement) {
          notesFurRevElement.value = feature.attributes.NOTES_FURREV.trim();
        }
       

        // Special case for notes
        const notesSegElement = document.getElementById("notes_seg");
        if (notesSegElement) {
          notesSegElement.value = feature.attributes.NOTES_SEG.trim();
        }

        inputIds.forEach(id => {
            const inputElement = document.getElementById(id);
            initialValues[id] = inputElement.value;
            
            inputElement.addEventListener('input', function() {
              const buttonApply = document.getElementById('button-apply');
              if (inputElement.value !== initialValues[id]) {
                console.log('Input is dirty.');
                if (buttonApply.classList.contains('btn-clean')) {
                  buttonApply.classList.remove('btn-clean');
                  buttonApply.classList.add('btn-dirty');
                }
              } else {
                console.log('Input is clean.');
              }
            });
        });
        
        //build flag table
        
        // Function to evaluate criteria
        function evaluateFlag(feature, flag) {
          return feature.attributes[flag.flagName] === 1;
        }

        function updateFeature(featureID, flagName, newValue) {
          console.log('override toggle updateFeature')
        
          const inputBoxValue = document.getElementById('edit-key').value;
        
          function getKeysByFilter(filterValue) {
            return editKeys
              .filter(row => row[0] === filterValue)  // filter by first column
              .map(row => row[1]);                   // extract second column
          }
          
          if (!getKeysByFilter(document.getElementById('selectForecastArea').value).includes(inputBoxValue)) {
              // If the input value doesn't match 'editKeys', execute the code here
              console.error("Incorrect editKey!");
              alert('Incorrect edit key.');
              return Promise.resolve(false);
          }

          // Step 1: Query the layer for the specific feature by SEGID
          let query = layerSegments.createQuery();
          query.where = `SEGID = '${featureID}'`;
        
          return layerSegments.queryFeatures(query).then(results => {
            if (results.features.length > 0) {
              let featureToUpdate = results.features[0];
              featureToUpdate.attributes[flagName] = newValue;
        
              return layerSegments.applyEdits({
                updateFeatures: [featureToUpdate]
              });
            } else {
              console.error('No features found with SEGID=' + featureID);
              throw new Error('No features found');
            }
          }).then(applyEditsResult => {
            if (applyEditsResult.updateFeatureResults.length > 0) {
              console.log('Feature updated successfully');
              return true;
            } else {
              console.error('Failed to update feature');
              return false;
            }
          }).catch(err => {
            console.error('Error:', err);
            return false;
          });
        }
        
        function generateTable() {
        
          const renderedFlags = []; // Keep track of rendered flags
          tableHtml = '';

          dataFlags.forEach(flag => {
            if (evaluateFlag(feature, flag)) {
              const ovFlagName = flag.flagName.replace('FL_', 'OV_');
              const toggleValue = feature.attributes[ovFlagName];
              const switchId = `switch_${ovFlagName}`;
        
              tableHtml += `<tr>
                <td>
                  <calcite-switch
                    id="${switchId}"
                    scale="s"
                    ${toggleValue === 1 ? 'checked' : ''}>
                  </calcite-switch>
                </td>
                <td class="tableText">${flag.flagDescription}</td>
              </tr>`;
        
              renderedFlags.push(ovFlagName);
            }
          });
        
          if (renderedFlags.length) {
            tableHtml = '<table border="0" width="300px"><thead><tr><th colspan="2" align="left">Flag Overrides</th></tr></thead><tbody>' + tableHtml + '</tbody></table>';
          }
          document.getElementById("flags").innerHTML = tableHtml;
        
          renderedFlags.forEach(ovFlagName => {
            const switchId = `switch_${ovFlagName}`;
            document.getElementById(switchId).addEventListener('calciteSwitchChange', (event) => {
              const newValue = event.target.checked ? 1 : 0;
        
              updateFeature(feature.attributes.SEGID, ovFlagName, newValue).then(_updateSuccess => {
                if (!_updateSuccess) {
                  event.target.checked = !newValue;
                }
              });
            });
          });
        }       

        generateTable();

      }
    } //updatePanelInfo()
  
    //populateComboboxFlagsProjGroups().then(() => {
    //  console.log('Calling updatePanelInfo');
    //  updatePanelInfo();
    //});

    //updatePanelInfo();

    // Update the chart when the selectors are changed
    selectForecastArea.addEventListener('calciteSegmentedControlChange', updateCoNames);
    selectSegId.addEventListener('calciteSelectChange', updatePanelInfo);
    selectCoName.addEventListener('calciteSelectChange', updateSegments);
    selectYear.addEventListener('calciteSelectChange', updateMap);
    selectSe.addEventListener('calciteSelectChange', updateMap);
    
    document.getElementById('matchModelButton').addEventListener('click', matchModelAADT);

    function querySEGIDByOBJECTID(OBJECTID) {
      console.log('querySEGIDByOBJECTID');

      return new Promise(function(resolve, reject) {
        var query = layerSegments.createQuery();
        query.where = "OBJECTID = " + OBJECTID;
        query.outFields = ["SEGID"];
    
        layerSegments.queryFeatures(query).then(function(results) {
          var SEGID = results.features[0].attributes.SEGID;
          resolve(SEGID);
        }).catch(reject);
      });
    }

    view.on("click", function(event) {
      console.log('view click');
      view.hitTest(event).then(function(response) {
        var result = response.results.find(function(result) {
          return result.graphic.layer === layerSegments;
        });
    
        if (result) {
          var featureOBJECTID = result.graphic.attributes.OBJECTID;
    
          querySEGIDByOBJECTID(featureOBJECTID).then(function(SEGID) {
            if (isValueInCalciteSelect(SEGID, selectSegId)) {
              selectSegId.value = SEGID;
              updatePanelInfo();
            } else {
              // Handle the case where the value doesn't exist in the dropdown
              alert(`${SEGID} not found in the dropdown. There are too many segments to display all in dropdown. Please filter segments further.`);
              }
          });
            
          function isValueInCalciteSelect(value, calciteSelectElement) {
            const options = calciteSelectElement.querySelectorAll('calcite-option');
            for (let option of options) {
              if (option.value === value.toString()) {
                return true;
              }
            }
            return false;
          }
        }
      });
    });

    //selectSource.addEventListener('calciteSelectChange', updatePanelInfo);
  }

  // Load the data when the page is ready
  loadAppData();

});