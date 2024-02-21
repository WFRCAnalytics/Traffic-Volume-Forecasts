//javascript for controlling WFRC Forecasts
//written by Bill Hereth May 2020

//ABOUT
var WIDGETPOOLID_ABOUT = 0;

//TAB VARIABLES///

var sCTabOff = "#bbbbbb";//"#005fa2";
var sCTabOn = "#90EE90";
var sCTextOn = "#005fa2";
var sCTextOff = "#ffffff";

var curTab = "VOL";

var sShowTrafficLayerText = "Traffic Layer Off";
var sHideTrafficLayerText = "Traffic Layer On";

var sToggleVol_SE = sHideTrafficLayerText;
var sToggleVol_UTP = sShowTrafficLayerText;

var bStartSE = false;
var bStartUTP = false;

var iLegendWidth_VOL = 200;
var iLegendWidth_SE_Total = 275;
var iLegendWidth_SE_Density = 370;
var iLegendWidth_UTP = 120;

//VOL VARIABLES////////////////////////////////////////////////////////////////////////////////////////////

var aCCSs;
var sites;
var iFirst=true;
var sSeries = "SG";
var storeObserved;
var storeForecasts;
var curYears = "All Years";
var curMonthGroups = "Year";
var lLegendOneVol;
var sSegmentsLayer = "AADT Forecasts";
var sCountiesLayer = "CountyBoundary";
var lyrSegments;
var lyrCounties;
var sATRs;
var g_sSegID = 0;
var g_iCounty = 0;
var iPixelSelectionTolerance = 10;
var segments = [];
var routes = [];

var minScaleForLabels = 87804;

//Typical Colors
var sCLightGrey     = "#EEEEEE";
var sCDefaultGrey   = "#CCCCCC";
var sCBlue1         = "#BED2FF";
var sCBlue2         = "#73B2FF";
var sCBlue3         = "#0070FF";
var sCBlue4         = "#005CE6";
var sCBlue5         = "#004DA8";
var sCRed1          = "#FFBEBE";
var sCRed2          = "#FF7F7F";
var sCRed3          = "#E60000";
var sCRed4          = "#730000";
var sCGreen1        = "#54ff00";
var sCGreen2        = "#4ce600";
var sCWhite         = "#ffffff";
var sSelectionColor = "#ffff00";//"#FF69B4"; //Hot Pink

/* Blue to Red Gradiant Ramp - 9 Steps (Bert) */
var sCBertGrad9 = "#Af2944"; //rgb(175,41,68)
var sCBertGrad8 = "#E5272d"; //rgb(229,39,45)
var sCBertGrad7 = "#Eb672d"; //rgb(235,103,45)
var sCBertGrad6 = "#E09d2e"; //rgb(224,157,46)
var sCBertGrad5 = "#8dc348"; //rgb(141,195,72)
var sCBertGrad4 = "#6cb74a"; //rgb(108,183,74)
var sCBertGrad3 = "#00a74e"; //rgb(0,167,78)
var sCBertGrad2 = "#1ba9e6"; //rgb(27,169,230)
var sCBertGrad1 = "#31398a"; //rgb(49,57,138)

//Color Ramps
var aCR_BertGrad9  = new Array(sCBertGrad1,sCBertGrad2,sCBertGrad3,sCBertGrad4,sCBertGrad5,sCBertGrad6,sCBertGrad7,sCBertGrad8,sCBertGrad9);
var aCR_Change7    = new Array(sCBlue3,sCBlue2,sCDefaultGrey,sCRed1,sCRed2,sCRed3,sCRed4);

//AADT Arrays for Forecast Years (FY)
var aFieldNamesFY = new Array("AADT2019","F2024","F2030","F2040","F2050");
var aTextFY = new Array("2019 Historic","2024 Forecast","2030 Forecast","2040 Forecast","2050 Forecast");
var aLabelClassFY = []; //built programatically
var aJsonLabelsFY = []; //built programatically
var aSegRndrFY    = [];
var aLegendNameFY = new Array("2019 AADT Historic","2024 AADT Forecast","2030 AADT Forecast", "2040 AADT Forecast","2050 AADT Forecast");

//Change Arrays (Ch)
var aFieldNamesCh = new Array("Ch19to50","Ch19to24","Ch24to30","Ch30to40","Ch40to50");
var aTextCh = new Array("2019 to 2050","2019 to 2024","2024 to 2030","2030 to 2040","2040 to 2050");
var aLabelClassCh = []; //built programatically
var aJsonLabelsCh = []; //built programatically
var aSegRndrCh    = [];
var aLegendNameCh = new Array("2019 to 2050 AADT Change","2019 to 2024 AADT Change","2024 to 2030 AADT Change","2030 to 2040 AADT Change","2040 to 2050 AADT Change");

//Line Widths
var dLineWidth0 = 0.1;
var dLineWidth1 = 0.7;  //narrowest
var dLineWidth2 = 1.7;
var dLineWidth3 = 2.7;
var dLineWidth4 = 3.7;
var dLineWidth5 = 4.7;
var dLineWidth6 = 5.7;
var dLineWidth7 = 6.7;
var dLineWidth8 = 7.7;
var dLineWidth9 = 8.7;  //widest

//Label Properties
var dHaloSize   = 1.5;

var WIDGETPOOLID_LEGEND = 5;

var curCountyVol = 35;
var curRoute = "";
var curSegment = "";

var cChartOneVol;

//SE VARIABLES/////////////////////////////////////////////////////////////////////////////////////////////

var forecastWidget;

var iFirstTAZ = true;
var iFirstCityArea = true;

var curYears = "All Years";
var curMonthGroups = "Year";
//var lLegendOneSE;

var aDisplayValueCode = new Array("T","D");
var aDisplayValueName = new Array("Total","Density");
var aDisplayValueLegendName = new Array(""," - Density");

var aDisplayValueLabelFormat = new Array("'#,###'","'#,##0.00'");

var aFieldNamesSEFYTotals = new Array("YEAR2015","YEAR2019","YEAR2024","YEAR2030","YEAR2040","YEAR2050");
var aFieldNamesSEFYDensity = new Array("YEAR2015D","YEAR2019D","YEAR2024D","YEAR2030D","YEAR2040D","YEAR2050D");
var aFieldNamesSEChTotals = new Array("CH15TO50","CH15TO19","CH19TO24","CH24TO30","CH30TO40","CH40TO50");
var aFieldNamesSEChDensity = new Array("CH15TO50D","CH15TO19D","CH19TO24D","CH24TO30D","CH30TO40D","CH40TO50D");

var aFieldNamesSEFY = new Array(aFieldNamesSEFYTotals,aFieldNamesSEFYDensity)
var aFieldNamesSECh = new Array(aFieldNamesSEChTotals,aFieldNamesSEChDensity)

var aTextSEFY = new Array("2015 Base Year","2019 Forecast","2024 Forecast","2030 Forecast","2040 Forecast","2050 Forecast");
var aTextSECh = new Array("2015 to 2050","2015 to 2019","2019 to 2024","2024 to 2030","2030 to 2040","2040 to 2050");

var aLabelClassSEFY = []; //built programatically
var aJsonLabelsSEFY = []; //built programatically
var aSegRndrSEFY    = []; //[SECat][DisplayValue][yearposition] built programatically

var aLabelClassSECh = []; //built programatically
var aJsonLabelsSECh = []; //built programatically
var aSegRndrSECh    = []; //[SECat][DisplayValue][yearposition] built programatically
var labelClassOff;

var aSECatLayerNames = new Array("Population Projections","Household Projections","Typical Employment Projections","Retail Employment Projections","Industrial Employment Projections","Office Employment Projections");
var aSECatDisplayName = new Array("Population","Households","Typical Employment","Retail Employment","Industrial Employment","Office Employment");
var aSECatDisplayNameShort = new Array("Population","Households","Typical Emp.","Retail Emp.","Industrial Emp.","Office Emp.");
var aSECatValues = new Array("HHPOP","TOTHH","TOTEMP","RETEMP","INDEMP","OTHEMP")
var aSECatLayers = []; //built programatically

var aSEComboOptions = [];

//Defaults
var curDisplayValuePos = 0; //default to 0-Total
var curYearPos = 5; //default to 5-2050
var curSECatPos = 0; //default to 0-Population
var curColumn = "FY"; //default to forecast year

var aClassBreaksFY = []; //[SECat][DisplayValue] programatically built to contain class breaks for Totals and density
var aClassBreaksCh = []; //[SECat][DisplayValue] programatically built to contain class breaks for Totals and density

var classbreaks_fy = [];
var classbreaks_ch = [];
var cityareas_se = [];
var counties_se = [];

var curCountySE = -1;
var curCityAreaSE = 'select';

var curSelectedTAZs = [];

var aSECatValuesTotal = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
var aSECatValuesTotalxDevAcres =  [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
var aSECatValuesDevAcres = [0,0,0,0,0,0];
var aSECatValuesDensity =  [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

var cChartOneSE;

var lyrTAZSelect;
var sTAZSelectLayer = "TAZs_UT";

var aSEChartSelectionMethods = new Array("filter","map")
var curSEChartSelectionMethod = "filter"; //Map or Filter

//UTP VARIABLES////////////////////////////////////////////////////////////////////////////////////////////

sUTPLayersGroup = "Unified Plan 2020 Service";


aUTPGroupsPhases = new Array("Phase 1 (2020-2030)","Phase 2 (2031-2040)","Phase 3 (2041-2050)","Unfunded");
aUTPGroupsPhasesShort = new Array("Phase 1","Phase 2","Phase 3","Unfunded");
aUTPGroupsMode = new Array("Highway","Transit");
aUTPGroupsType = new Array("Site","Linear")

var lyrUTP;

aUTPLayerIDs_AlwaysOn = new Array(1,4,7,8,11,14,15,18,21,22,25)
aUTPLayerIDs = new Array(2,3,5,6,9,10,12,13,16,17,19,20,23,24,26,27)
aUTP_Rds = new Array(1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0); //Roads
aUTP_Trn = new Array(0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1); //Transit
aUTP_P1 = new Array(1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0);
aUTP_P2 = new Array(0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0);
aUTP_P3 = new Array(0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0);
aUTP_P4 = new Array(0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1); //Phase 4 is unfunded
aPhaseCode = new Array('1','2','3','Unfunded');



define(['dojo/_base/declare',
    'jimu/BaseWidget',
    'jimu/LayerInfos/LayerInfos',
    'libraries/rainbowvis.js',
    'dijit/registry',
    'dojo/dom',
    'dojo/dom-style',
    'dojo/query',
    'dijit/dijit',
    'dojox/charting/Chart',
    'dojox/charting/themes/Claro',
    'dojox/charting/themes/Julie',
    'dojox/charting/SimpleTheme',
    'dojox/charting/plot2d/Scatter',
    'dojox/charting/plot2d/Lines',
    'dojox/charting/plot2d/Columns',
    'dojox/charting/widget/Legend',
    'dojox/charting/action2d/Tooltip',
    'dojox/layout/TableContainer',
    'dojox/layout/ScrollPane',
    'dijit/layout/ContentPane',
    'jimu/PanelManager',
    'dijit/form/TextBox',
    'jimu/LayerInfos/LayerInfos',
    'esri/tasks/query',
    'esri/tasks/QueryTask',
    'esri/layers/FeatureLayer',
    'esri/dijit/FeatureTable',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/symbols/TextSymbol',
    'esri/symbols/Font',
    'esri/layers/LabelClass',
    'esri/InfoTemplate',
    'esri/Color',
    'esri/map',
    'esri/renderers/ClassBreaksRenderer',
    'esri/geometry/Extent',
    'dojo/store/Memory',
    'dojox/charting/StoreSeries',
    'dijit/Dialog',
    'dijit/form/Button',
    'dijit/form/RadioButton',
    'dijit/form/MultiSelect',
    'dojox/form/CheckedMultiSelect',
    'dijit/form/Select',
    'dijit/form/ComboBox',
    'dijit/form/CheckBox',
    'dojo/store/Observable',
    'dojo/cookie',
    'esri/lang',
    'jimu/utils',
    'dojox/charting/axis2d/Default',
    'dojo/domReady!'],
function(declare, BaseWidget, LayerInfos, RainbowVis, registry, dom, domStyle, djQuery, dijit, Chart, Claro, Julie, SimpleTheme, Scatter, Lines, Columns, Legend, Tooltip, TableContainer, ScrollPane, ContentPane, PanelManager, TextBox, LayerInfos, Query, QueryTask, FeatureLayer, FeatureTable, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, TextSymbol, Font, LabelClass, InfoTemplate, Color, Map, ClassBreaksRenderer, Extent, Memory, StoreSeries, Dialog, Button, RadioButton, MutliSelect, CheckedMultiSelect, Select, ComboBox, CheckBox, Observable, cookie, esriLang, jimuUtils) {
  //To create a widget, you need to derive from BaseWidget.
  
  return declare([BaseWidget], {
    // DemoWidget code goes here

    //please note that this property is be set by the framework when widget is loaded.
    //templateString: template,

    baseClass: 'jimu-widget-demo',
    
    postCreate: function() {
      this.inherited(arguments);
      console.log('postCreate');
    },

    startup: function() {
      console.log('startup');
      
      this.inherited(arguments);
      //this.map.setInfoWindowOnClick(false); // turn off info window (popup) when clicking a feature

      //Widen the widget panel to provide more space for charts
      //var panel = this.getPanel();
      //var pos = panel.position;
      //pos.width = 500;
      //panel.setPosition(pos);
      //panel.panelManager.normalizePanel(panel);
      
      var parent = this;
      forecastWidget = this;
      
      this.map.on("zoom-end", function (){  
          parent._changeZoom();  
      });  
      
      
      //ABOUT WIDGET CONTROL - OPEN ON FIRST USE///////////////////////////////////////////////////////
              
      var isFirstKey = this._getCookieKey();
      var isfirst = cookie(isFirstKey);
      if (isfirst===undefined || isfirst.toString() !== 'false') {
        console.log('open about');
        var pm = PanelManager.getInstance();
        
        //Close Widget
        //for (var p=0; p < pm.panels.length; p++) {
        //  if (pm.panels[p].label == "About") {
        //    pm.closePanel(pm.panels[p]);
        //  }
        //}
        
        //Open Widget
        pm.showPanel(this.appConfig.widgetPool.widgets[WIDGETPOOLID_ABOUT]);
        
      }
      
      var cookieCountyVol = this._getCookieCountyVol();
      var ckCountyVol = cookie(cookieCountyVol);
      if (ckCountyVol !== undefined) {
        curCountyVol = ckCountyVol;
      }
      
      //TAB STARTUP///////////////////////////////////////////////////////////////////////////////////////////
      
      dom.byId("SE_TOGGLEVOL").innerHTML = sToggleVol_SE;
      dom.byId("UTP_TOGGLEVOL").innerHTML = sToggleVol_UTP;
      
      dom.byId("SE_TOGGLEVOL").style.display = 'none';
      dom.byId("UTP_TOGGLEVOL").style.display = 'none';
      
      //VOL STARTUP///////////////////////////////////////////////////////////////////////////////////////////

      //Initialize Layers
      var layerInfosObject = LayerInfos.getInstanceSync();
      for (var j=0, jl=layerInfosObject._layerInfos.length; j<jl; j++) {
        var currentLayerInfo = layerInfosObject._layerInfos[j];    
        if (currentLayerInfo.title == sSegmentsLayer) { //must mach layer title
          lyrSegments = layerInfosObject._layerInfos[j].layerObject;
        } else if (currentLayerInfo.title == sCountiesLayer) { //must mach layer title
          lyrCounties = layerInfosObject._layerInfos[j].layerObject;
        } else if (currentLayerInfo.title == sTAZSelectLayer) {
          lyrTAZSelect = layerInfosObject._layerInfos[j].layerObject;
        }
      }
      
      lyrSegments.hide();
      lyrSegments.legendEnabled = false;
      
      // create a text symbol to define the style of labels
      var volumeLabel = new TextSymbol();
      volumeLabel.font.setSize("8pt");
      volumeLabel.font.setFamily("arial");
      volumeLabel.font.setWeight(Font.WEIGHT_BOLD);
      volumeLabel.setHaloColor(sCWhite);
      volumeLabel.setHaloSize(dHaloSize);
      
      //Default line
      var defaultLine =  new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(sCDefaultGrey), dLineWidth0) 

      //Class Breaks
      var aBrk_BertGrad9 = new Array({minValue: 10,     maxValue: 5999,     symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_BertGrad9[0]), dLineWidth1), label: "Less than 6,000"},
                                     {minValue: 6000,   maxValue: 17999,    symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_BertGrad9[1]), dLineWidth2), label: "6,000 to 18,000"},
                                     {minValue: 18000,  maxValue: 35999,    symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_BertGrad9[2]), dLineWidth3), label: "18,000 to 36,000"},
                                     {minValue: 36000,  maxValue: 71999,    symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_BertGrad9[3]), dLineWidth4), label: "36,000 to 72,000"},
                                     {minValue: 72000,  maxValue: 119999,   symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_BertGrad9[4]), dLineWidth5), label: "72,000 to 120,000"},
                                     {minValue: 120000, maxValue: 159999,   symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_BertGrad9[5]), dLineWidth6), label: "120,000 to 160,000"},
                                     {minValue: 160000, maxValue: 199999,   symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_BertGrad9[6]), dLineWidth7), label: "160,000 to 200,000"},
                                     {minValue: 200000, maxValue: 239999,   symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_BertGrad9[7]), dLineWidth8), label: "200,000 to 240,000"},
                                     {minValue: 240000, maxValue: Infinity, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_BertGrad9[8]), dLineWidth9), label: "More than 240,000"});

      var aBrk_Change7 = new Array({minValue: -999999, maxValue: -5001,    symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change7[0]), dLineWidth5), label: "Less than -5,000"},
                                   {minValue: -5000,   maxValue: -1,       symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change7[1]), dLineWidth4), label: "-5,000 to -10"},
                                   {minValue: 0,       maxValue: 999,      symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change7[2]), dLineWidth2), label: "0 to 1,000"},
                                   {minValue: 1000,    maxValue: 4999,     symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change7[3]), dLineWidth4), label: "1,000 to 5,000"},
                                   {minValue: 5000,    maxValue: 9999,     symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change7[4]), dLineWidth5), label: "5,000 to 10,000"},
                                   {minValue: 10000,   maxValue: 19999,    symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change7[5]), dLineWidth6), label: "10,000 to 20,000"},
                                   {minValue: 20000,   maxValue: Infinity, symbol: new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(aCR_Change7[6]), dLineWidth7), label: "More than 20,000"});


      //Setup empy volume label class for when toggle is off
        labelClassOff = ({
          minScale: minScaleForLabels,
          labelExpressionInfo: {expression: ""}
        })
        labelClassOff.symbol = volumeLabel;

      //Setup for AADT Forecast Years
      
      for (var i=0;i<aTextFY.length;i++) {
      
        //Update ADDT FY Text  
        dom.byId("lbFY" + i).innerHTML=aTextFY[i];
        
        //Create a JSON object which contains the labeling properties. At the very least, specify which field to label using the labelExpressionInfo property. Other properties can also be specified such as whether to work with coded value domains, fieldinfos (if working with dates or number formatted fields, and even symbology if not specified as above)
        aJsonLabelsFY.push({
          minScale: minScaleForLabels,
          labelExpressionInfo: {expression: "Text($feature." + aFieldNamesFY[i] +  ", '#,###')"}
        });
      
        //create instance of LabelClass (note: multiple LabelClasses can also be passed in as an array)  
        aLabelClassFY.push(new LabelClass(aJsonLabelsFY[i]));
        aLabelClassFY[i].symbol = volumeLabel;
        
        //Set up layer rendering
        aSegRndrFY.push(new ClassBreaksRenderer(null, aFieldNamesFY[i]));
        for (var j=0;j<aBrk_BertGrad9.length;j++) {
          aSegRndrFY[i].addBreak(aBrk_BertGrad9[j]);
        }
        
        //Radio Buttons Change Event
        dom.byId("rbFY" + i).onchange = function(isChecked) {
          if(isChecked) {

            //get integer value of last character of rb value
            var j;
            j = parseInt(this.value.substr(-1));

            lyrSegments.setRenderer(aSegRndrFY[j]);

            if (dom.byId("chkVolLabels_Vol").checked == true) {
              lyrSegments.setLabelingInfo([ aLabelClassFY[j] ]);
            } else {
              lyrSegments.setLabelingInfo([ labelClassOff ]);
            }
            lyrSegments.setDefinitionExpression(aFieldNamesFY[j] + ">1"); 
            lyrSegments.refresh();
            parent.SetLegendBarFY(aCR_BertGrad9,aLegendNameFY[j]);
          }
        };        
        
      }
      
      //Setup for Change
      
      for (var i=0;i<aTextCh.length;i++) {
        
        //Update Change Text
        dom.byId("lbCh" + i).innerHTML=aTextCh[i];
        
        //Create a JSON object which contains the labeling properties. At the very least, specify which field to label using the labelExpressionInfo property. Other properties can also be specified such as whether to work with coded value domains, fieldinfos (if working with dates or number formatted fields, and even symbology if not specified as above)
        aJsonLabelsCh.push({
          minScale: minScaleForLabels,
          labelExpressionInfo: {expression: "Text($feature." + aFieldNamesCh[i] +  ", '#,###')"}
        });

        //create instance of LabelClass (note: multiple LabelClasses can also be passed in as an array)  
        aLabelClassCh.push(new LabelClass(aJsonLabelsCh[i]));
        aLabelClassCh[i].symbol = volumeLabel;
       
        aSegRndrCh.push(new ClassBreaksRenderer(null, aFieldNamesCh[i]));
        for (var j=0;j<aBrk_Change7.length;j++) {
          aSegRndrCh[i].addBreak(aBrk_Change7[j]);
        }
        
        //Radio Buttons Change Event
        dom.byId("rbCh" + i).onchange = function(isChecked) {
          if(isChecked) {

            //get integer value of last character of rb value
            var j;
            j = parseInt(this.value.substr(-1));
            
            lyrSegments.setRenderer(aSegRndrCh[j]);

            if (dom.byId("chkVolLabels_Vol").checked == true) {
              lyrSegments.setLabelingInfo([ aLabelClassCh[j] ]);
            } else {
              lyrSegments.setLabelingInfo([ labelClassOff ]);
            }
            
            lyrSegments.setDefinitionExpression(aFieldNamesCh[j] + ">-1000000");
            lyrSegments.refresh();
            parent.SetLegendBarCh(aCR_Change7,aLegendNameCh[j]);
          }
        };
      }

      //Set to default layer to 2017 that is selected in HTML
      
      lyrSegments.setRenderer(aSegRndrFY[4]);
      lyrSegments.setLabelingInfo([ aLabelClassFY[4] ]);
      lyrSegments.refresh();
      this.SetLegendBarFY(aCR_BertGrad9,aLegendNameFY[4]);

      lyrSegments.show();


      //Populate Segments Object
      dojo.xhrGet({
        url: "widgets/ForecastSidebar/data/segments.json",
        handleAs: "json",
        load: function(obj) {
          /* here, obj will already be a JS object deserialized from the JSON response */
          console.log('segments.json');
          segments = obj;
        },
        error: function(err) {
            /* this will execute if the response couldn't be converted to a JS object,
                or if the request was unsuccessful altogether. */
        }
      });
      
      //Populate Routes Object
      dojo.xhrGet({
        url: "widgets/ForecastSidebar/data/routes.json",
        handleAs: "json",
        load: function(obj) {
          /* here, obj will already be a JS object deserialized from the JSON response */
          console.log('routes.json');
          routes = obj;
        },
        error: function(err) {
            /* this will execute if the response couldn't be converted to a JS object,
                or if the request was unsuccessful altogether. */
        }
      });

      //Populate Observed Volumes Datastore
      dojo.xhrGet({
        url: "widgets/ForecastSidebar/data/observed.json",
        handleAs: "json",
        load: function(obj) {
          /* here, obj will already be a JS object deserialized from the JSON response */
          console.log('observed.json');
          observed = obj;
          
          storeObserved = Observable(new Memory({
            data: {
              identifier: "O",
              items: observed
            }
          }));
        },
        error: function(err) {
            /* this will execute if the response couldn't be converted to a JS object,
                or if the request was unsuccessful altogether. */
        }
      });      

      //Populate Forecasts datastore
      dojo.xhrGet({
        url: "widgets/ForecastSidebar/data/forecasts.json",
        handleAs: "json",
        load: function(obj) {
          /* here, obj will already be a JS object deserialized from the JSON response */
          console.log('forecasts.json');
          forecasts = obj;
          
          storeForecasts = Observable(new Memory({
            data: {
              identifier: "F",
              label: "Y",
              items: forecasts
            }
          }));
        },
        error: function(err) {
            /* this will execute if the response couldn't be converted to a JS object,
                or if the request was unsuccessful altogether. */
        }
      });

      
      //Get Counties
      dojo.xhrGet({
        url: "widgets/ForecastSidebar/data/counties.json",
        handleAs: "json",
        load: function(obj) {
          /* here, obj will already be a JS object deserialized from the JSON response */
          console.log('counties.json');
          counties = obj;
          cmbCounty = new Select({
            id: "selectCounty",
            name: "selectCountyName",
            options: counties,
            onChange: function() {
              curCountyVol = this.value;
              lyrTAZSelect.hide();
              parent._zoomToCounty();
              parent._updateRoutes();
              parent._updateSegments();
              parent._setCookieCountyVol();
            }
          }, "cmbCounty");
          cmbCounty.startup();
          cmbCounty.set("value",curCountyVol);
          parent._updateRoutes(curCountyVol);
        },
        error: function(err) {
            /* this will execute if the response couldn't be converted to a JS object,
                or if the request was unsuccessful altogether. */
        }
      });
      
      cmbRoute = new Select({
        id: "selectRoute",
        name: "selectRouteID",
        onChange: function() {
          curRoute = this.value;
          parent._updateSegments(curCountyVol, curRoute);
        }
      }, "cmbRoute");
      cmbRoute.startup();

      // Create the chart within it's "holding" node
      // Global so users can hit it from the console
      cChartOneVol = new Chart("chartOneVol", {
        title: "AADT, Historic and Forecast",
        titlePos: "top",
        titleFont: "normal normal bold 10pt Verdana",
        titleGap: 5,
        fill: sCDefaultGrey
      });
  
  
      var myTheme = new SimpleTheme({
        markers: {
          CIRCLE: "m-3,0 c0,-4 6,-4 6,0, m-6,0 c0,4 6,4 6,0",
          SQUARE: "m-3,-3 6,0 0,6 -6,0z"
        }
      });
      
      // Set the theme
      cChartOneVol.setTheme(myTheme);
  
      // Add the only/default plot 
      cChartOneVol.addPlot("default", {
        type: "Scatter",
        gap: 10
      });
      
      // Add axes
      cChartOneVol.addAxis("x", { minorTickStep: 10, majorTickStep: 10,
          font: "normal normal normal 8pt Verdana",
          labels: [
                    {value:2000, text:"2000"},
                    {value:2010, text:"2010"},
                    {value:2020, text:"2020"},
                    {value:2030, text:"2030"},
                    {value:2040, text:"2040"},
                    {value:2050, text:"2050"},
                  ],
          /*title: "Year",*/
          titleOrientation: "away",
          titleFont: "normal normal normal 10pt Verdana",
          titleGap: 10,
          max: 2052
        }
      );
      cChartOneVol.addAxis("y", { vertical: true, fixLower: "major", fixUpper: "major", min: 0/*, title : "AADT"*/});

      var anim_a = new Tooltip(cChartOneVol, "default");

      // Create the legend
      lLegendOneVol = new Legend({ chart: cChartOneVol, horizontal: false }, "legendOneVol");


      //SETUP MAP CLICK EVENT
      
      this.map.on('click', selectFeatures);  
      
      parent = this;
      
      function pointToExtent(map, point, toleranceInPixel) {  
        var pixelWidth = parent.map.extent.getWidth() / parent.map.width;  
        var toleranceInMapCoords = toleranceInPixel * pixelWidth;  
        return new Extent(point.x - toleranceInMapCoords,  
          point.y - toleranceInMapCoords,  
          point.x + toleranceInMapCoords,  
          point.y + toleranceInMapCoords,  
          parent.map.spatialReference);  
      }
      
      //Setup Function for Selecting Features
      
      function selectFeatures(evt) {
        console.log('selectFeatures');
        
        if (curTab=="VOL") { //Click events when VOL tab
        
          curSegment = "";
          lyrSegments.clearSelection();
          
          var query = new Query();  
          query.geometry = pointToExtent(parent.map, evt.mapPoint, iPixelSelectionTolerance);
          query.returnGeometry = false;
          query.outFields = ["*"];
          
          var tblqueryTaskSeg = new QueryTask(lyrSegments.url);
          tblqueryTaskSeg.execute(query,showSegResults);
          
          //Segment search results
          function showSegResults (results) {
            console.log('showSegmentResults');

            var resultCount = results.features.length;
            if (resultCount>0) {
              var featureAttributes = results.features[0].attributes;
              
              curCountyVol = featureAttributes["CO_FIPS"];
              curSegment = featureAttributes["SEGID"];
              curRoute = curSegment.replace(/\_.*/,'');
              
              cmbCounty.set('_onChangeActive', false)
              cmbCounty.set('value', curCountyVol)
              cmbCounty.set('_onChangeActive', true)
              
              parent._updateRoutes();
              parent._updateSegments();
              parent._zoomToSegment();
            }
          }
        } else if (curTab=="SE") { //Click events when SE tab
          
          if (curSEChartSelectionMethod=="map") { 

            //curSelectedTAZs = [];
            //aSECatLayers[curSECatPos].clearSelection();
            
            var query = new Query();  
            query.geometry = pointToExtent(parent.map, evt.mapPoint, iPixelSelectionTolerance);
            query.returnGeometry = false;
            query.outFields = ["*"];
            
            var tblqueryTaskTAZ = new QueryTask(aSECatLayers[curSECatPos].url);
            tblqueryTaskTAZ.execute(query,showTAZResults);
            
            //Segment search results
            function showTAZResults (results) {
              console.log('showTAZResults');
          
              var resultCount = results.features.length;
              if (resultCount>0) {
                var featureAttributes = results.features[0].attributes;
          
                parent._updateTAZs(featureAttributes["CO_TAZID"]);
          
                //parent._zoomToTAZ();
              }
            }
          }
        }
      }
      
      this._updateLayerDisplayVol();

    },
    
    _startupSE: function() {
      console.log('_startupSE');
      //SE STARTUP//////////////////////////////////////////////////////////////////////////////////////////
      
      lyrTAZSelect.hide();
      lyrTAZSelect.setDefinitionExpression("CO_TAZID=-1");  
      
      //dom.byId("selectMethodFilter").style.backgroundColor = sCTabOn;
      //dom.byId("selectMethodFilter").style.color = sCTextOn;
      
      //Initialize layers objects
      var layerInfosObject = LayerInfos.getInstanceSync();
      
      for (var k=0; k<aSECatLayerNames.length; k++) {
        for (var j=0; j<layerInfosObject._layerInfos.length; j++) {
          if (layerInfosObject._layerInfos[j].title == aSECatLayerNames[k]) { //must mach layer title
            if (aSECatLayers.length==k) { //make sure position in layer array is same as name array
              aSECatLayers.push(layerInfosObject._layerInfos[j].layerObject);  
            }
          }
        }
      }
      
      //Setup empy volume label class for when toggle is off
      labelClassSEBase = 0;////BH
      
      parent=this;
      
      // Populate classbreaks object - for forecast years
      dojo.xhrGet({
        url: "widgets/ForecastSidebar/data/classbreaks_forecastyear.json",
        handleAs: "json",
        load: function(obj) {
            /* here, obj will already be a JS object deserialized from the JSON response */
            console.log('classbreaks_forecastyear.json');
            classbreaks_fy = obj;
            parent._setupClassBreaks(classbreaks_fy, "FY");
        },
        error: function(err) {
            /* this will execute if the response couldn't be converted to a JS object,
                or if the request was unsuccessful altogether. */
        }
      });
      
      // Populate classbreaks object - for change
      dojo.xhrGet({
        url: "widgets/ForecastSidebar/data/classbreaks_change.json",
        handleAs: "json",
        load: function(obj) {
            /* here, obj will already be a JS object deserialized from the JSON response */
            console.log('classbreaks_change.json');
            classbreaks_ch = obj;
            parent._setupClassBreaks(classbreaks_ch, "Ch");
        },
        error: function(err) {
            /* this will execute if the response couldn't be converted to a JS object,
                or if the request was unsuccessful altogether. */
        }
      });
      // Populate counties_se object
      dojo.xhrGet({
        url: "widgets/ForecastSidebar/data/countiesdata.json",
        handleAs: "json",
        load: function(obj) {
            /* here, obj will already be a JS object deserialized from the JSON response */
            console.log('countiesdata.json');
            counties_se = obj;
                  
            cmbCountySE = new Select({
              id: "selectCountiesSE",
              name: "selectCountiesSEName",
              options: counties_se,
              onChange: function() {
                curCountySE = this.value;
                dom.byId("chartAreaSE").style.display = 'none';
                parent._updateCityAreas();
                parent._updateTAZs();
                parent._getTAZData();
              }
            }, "cmbCountySE");
            cmbCountySE.startup();
            cmbCountySE.set("value",curCountySE);
        },
        error: function(err) {
            /* this will execute if the response couldn't be converted to a JS object,
                or if the request was unsuccessful altogether. */
        }
      });
      // Populate cityareas_se object
      dojo.xhrGet({
        url: "widgets/ForecastSidebar/data/cityareasdata.json",
        handleAs: "json",
        load: function(obj) {
            /* here, obj will already be a JS object deserialized from the JSON response */
            console.log('cityareasdata.json');
            cityareas_se = obj;            
        },
        error: function(err) {
            /* this will execute if the response couldn't be converted to a JS object,
                or if the request was unsuccessful altogether. */
        }
      });
      // Populate tazdata object
      dojo.xhrGet({
        url: "widgets/ForecastSidebar/data/tazdata.json",
        handleAs: "json",
        load: function(obj) {
            /* here, obj will already be a JS object deserialized from the JSON response */
            console.log('tazdata.json');
            tazdata = obj;
            //parent._updateTAZs();
        },
        error: function(err) {
            /* this will execute if the response couldn't be converted to a JS object,
                or if the request was unsuccessful altogether. */
        }
      });
      //Radio Buttons Change Event
      for (var i=0;i<aDisplayValueCode.length;i++) {
        dom.byId("rb" + aDisplayValueName[i]).onchange = function(isChecked) {
          if(isChecked) {
            curDisplayValuePos = this.value; //current display value
            parent._setLegendBarSE();
            parent._updateLayerDisplaySE();
            parent._updateChartSE();
          }
        }; 
      }
      
      for (var c=0;c<aSECatValues.length;c++) {
        aSEComboOptions.push({"label": aSECatDisplayName[c], "value": aSECatValues[c]});
      }
      
      parent = this;
      
      var cmbSECat = new Select({
        id: "selectSECat",
        name: "selectSECatName",
        options: aSEComboOptions,
        onChange: function() {
          curSECatPos = aSECatValues.indexOf(this.value);
          parent._setLegendBarSE();
          parent._updateLayerDisplaySE(curSECatPos,curYearPos);
          dom.byId("SETotalLayersTitle").innerHTML = aSECatDisplayName[curSECatPos];
          dom.byId("SEChangeLayersTitle").innerHTML = aSECatDisplayNameShort[curSECatPos] + " Change";
          parent._updateChartSE();
        }
      }, "cmbSECat");
      cmbSECat.startup();
      
      cmbSECat.set("value",aSECatValues[curSECatPos]);
      //this._setLegendBarSE(aSECatDisplayName[curSECatPos] + " " + aTextSEFY[curYearPos]);
      //this._updateLayerDisplaySE(curSECatPos,curYearPos);
      
      this._updateCityAreas();
      
      // Create the chart within it's "holding" node
      // Global so users can hit it from the console
      cChartOneSE = new Chart("chartOneSE", {
        title: "Population",
        titlePos: "top",
        titleFont: "normal normal bold 10pt Verdana",
        titleGap: 5,
        fill: sCDefaultGrey
      });
      
      
      var myThemeSE = new SimpleTheme({
        markers: {
          CIRCLE: "m-3,0 c0,-4 6,-4 6,0, m-6,0 c0,4 6,4 6,0",
          SQUARE: "m-3,-3 6,0 0,6 -6,0z"
        }
      });
      
      // Set the theme
      cChartOneSE.setTheme(myThemeSE);
  
      // Add the only/default plot 
      cChartOneSE.addPlot("default", {
        gap: 10
      });
      
      // Add axes
      cChartOneSE.addAxis("x", { minorTickStep: 10, majorTickStep: 10,
          font: "normal normal normal 8pt Verdana",
          labels: [
                    {value:2015, text:"2015"},
                    {value:2020, text:"2020"},
                    {value:2025, text:"2025"},
                    {value:2030, text:"2030"},
                    {value:2035, text:"2035"},
                    {value:2040, text:"2040"},
                    {value:2045, text:"2045"},
                    {value:2050, text:"2050"},
                  ],
          /*title: "Year",*/
          titleOrientation: "away",
          titleFont: "normal normal normal 10pt Verdana",
          titleGap: 10,
          max: 2052
        }
      );
      cChartOneSE.addAxis("y", { vertical: true, fixLower: "major", fixUpper: "major", min: 0/*, title : "AADT"*/});
      
      var anim_b = new Tooltip(cChartOneSE, "default");

      // Create the legend
      //lLegendOneSE = new Legend({ chart: cChartOneSE, horizontal: false }, "legendOneSE");
      
      bStartSE = true;
      
      
      
    },
    
    _startupUTP: function() {
      console.log('_startupUTP');
      
      //UTP STARTUP///////////////////////////////////////////////////////////////////////////////////////////


      //Initialize layers objects
      var layerInfosObject = LayerInfos.getInstanceSync();

      for (var i=0; i<layerInfosObject._layerInfos.length; i++) {
        if (layerInfosObject._layerInfos[i].title == sUTPLayersGroup) { //must mach layer title
          lyrUTP = layerInfosObject._layerInfos[i].layerObject;
        }
      }
      
      this._updateLayerDisplayUTP();
      
      //Check box change events
      dom.byId("chkRoads").onchange = function(isChecked) {
        parent._updateLayerDisplayUTP();
      };
      //Check box change events
      dom.byId("chkTransit").onchange = function(isChecked) {
        parent._updateLayerDisplayUTP();
      };
      
      //Check box change events
      dom.byId("chkPhase1").onchange = function(isChecked) {
        parent._updateLayerDisplayUTP();
      };      
      //Check box change events
      dom.byId("chkPhase2").onchange = function(isChecked) {
        parent._updateLayerDisplayUTP();
      };
      //Check box change events
      dom.byId("chkPhase3").onchange = function(isChecked) {
        parent._updateLayerDisplayUTP();
      };
      //Check box change events
      dom.byId("chkPhase4").onchange = function(isChecked) {
        parent._updateLayerDisplayUTP();
      };

      bStartUTP = true;
    },

    _changeZoom: function(){
      dScale = forecastWidget.map.getScale();
      if(dScale < minScaleForLabels){
        //enable the checkbox
        
        dom.byId("VOL_LABELS_Vol").style.display = '';
        
        if (curTab == "SE" && dom.byId("SE_TOGGLEVOL").innerHTML==sHideTrafficLayerText) {
          dom.byId("VOL_LABELS_SE").style.display = '';
        }
        if (curTab == "UTP" && dom.byId("UTP_TOGGLEVOL").innerHTML==sHideTrafficLayerText) {
          dom.byId("VOL_LABELS_UTP").style.display = '';
        }
        
        
      }else{
        //diable the checkbox
        dom.byId("VOL_LABELS_Vol").style.display = 'none';
        dom.byId("VOL_LABELS_SE").style.display = 'none';
        dom.byId("VOL_LABELS_UTP").style.display = 'none';
      }
    },
    
    
    // USER DEFINED FUNCTIONS - SEGMENTS
    
    _updateLayerDisplayVol: function() {
      if (curTab=="VOL" || (curTab=="SE" && dom.byId("SE_TOGGLEVOL").innerHTML==sHideTrafficLayerText) || (curTab=="UTP") && dom.byId("UTP_TOGGLEVOL").innerHTML==sHideTrafficLayerText) {
        lyrSegments.show();
      } else {
        lyrSegments.hide();
      }
    },
    
    _updateRoutes: function() {
      console.log('_updateRoutes');
      
      //Build Options
      aRoutes = [];
      aRoutes.push({"label" : "select", "value" : "select"});
      
      
      dom.byId("SegmentsTitle").style.display = 'none';
      dom.byId("SegmentsData").style.display = 'none';
      
      for (var i=0;i<routes.length;i++) {
        if (routes[i].C==curCountyVol) {
          aRoutes.push({"label" : routes[i].label, "value" : routes[i].R});
        }
      }
      cmbRoute.set("options", aRoutes).reset();
      cmbRoute.set("value", curRoute);
    },

    _updateSegments: function() {
      console.log('_updateSegments'); 
      
      //Build Options
      aSegments = [];
      sSegments="IN(";
      for (var i=0;i<segments.length;i++) {
        if (segments[i].C==curCountyVol && segments[i].R==curRoute) {
          aSegments.push({"label" : segments[i].L, "value" : segments[i].S});
          sSegments += "'" + segments[i].S + "',"
        }
      }

      sSegments = sSegments.slice(0,-1) + ")";

      //Populate Site Multi Select List

      parent = this;

      if (iFirst) {
        cmbSegments = new CheckedMultiSelect({
          id: "selectSegments",
          name: "selectSegmentsName",
          options: aSegments,
          class: "wide",
          multiple: false,
          onChange: function() {
            curSegment = this.value;
            parent._updateChartVol();
          }
        }, "cmbSegments");
        cmbSegments.startup();
        cmbSegments.set("value", curSegment);
        iFirst = false;
      } else {
        cmbSegments.set("options", aSegments).reset();
        cmbSegments.set("value", curSegment);
        cmbSegments.startup();
      }
      if (g_sSegID.length > 0) {
        cmbSegments.set("value", g_sSegID);
      }
      
      if(curRoute=="select") {
        dom.byId("SegmentsTitle").style.display = 'none';
        dom.byId("SegmentsData").style.display = 'none';
        
      } else {
        dom.byId("SegmentsTitle").style.display = '';
        dom.byId("SegmentsData").style.display = '';
        dom.byId("chartAreaVol").style.display = '';
      }
      
      if (curSegment!="") {
        dom.byId("chartAreaVol").style.display = '';
      } else {
        dom.byId("chartAreaVol").style.display = 'none';
      }
      
    },

    _zoomToSegment: function() {
      console.log('_zoomToSegment');
            
      queryTask = new esri.tasks.QueryTask(lyrSegments.url);
      
      query = new esri.tasks.Query();
      query.returnGeometry = true;
      query.outFields = ["*"];
      query.where = "SEGID ='" + curSegment + "'";
      
      queryTask.execute(query, showResults);

      parent = this;
      
      function showResults(featureSet) {

        var feature, featureId;

        //QueryTask returns a featureSet.  Loop through features in the featureSet and add them to the map.
        
        if (dom.byId("chkAutoZoom").checked == true) {
          if (featureSet.features.length>0) {
              if (featureSet.features[0].geometry.type == "polyline") { 
                //clearing any graphics if present. 
                parent.map.graphics.clear(); 
                newExtent = new Extent(featureSet.features[0].geometry.getExtent()) 
                  for (i = 0; i < featureSet.features.length; i++) { 
                    var graphic = featureSet.features[i]; 
                    var thisExtent = graphic.geometry.getExtent(); 

                    // making a union of extent or previous feature and current feature. 
                    newExtent = newExtent.union(thisExtent); 
                    parent.map.graphics.add(graphic); 
                  } 
                parent.map.setExtent(newExtent.expand(2)); 
              }
          }
        }
        var selectSeg = lyrSegments.selectFeatures(query, FeatureLayer.SELECTION_NEW);
        parent.map.infoWindow.lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(sSelectionColor), 3);
        parent.map.infoWindow.setFeatures([selectSeg]);
      }
    },
    
    _getSegmentLabelBySegID: function(a_SegID) {
      return segments.filter(
        function(segments) {
          return segments.S == a_SegID
        }
      );
    },
    
    _updateChartVol: function() {
      console.log('_updateChartVol');
      
      var sValue = "";
      
      //Remove existing series
      while( cChartOneVol.series.length > 0 ) {
        cChartOneVol.removeSeries(cChartOneVol.series[0].name);
      }
      
      if (curSegment!="") {
        
        var tSSObs = new StoreSeries(storeObserved, { query: { S: curSegment} }, {x:"Y",y:"O"});
        var tSSFor = new StoreSeries(storeForecasts, { query: { S: curSegment} }, {x:"Y",y:"F"});
        
        cChartOneVol.addSeries(this._getSegmentLabelBySegID(curSegment)[0].L + " Historic", tSSObs);
        cChartOneVol.addSeries(this._getSegmentLabelBySegID(curSegment)[0].L + " Forecast", tSSFor);
        
        //Update Table

        dom.byId("vol2019value").innerHTML= "--";
        dom.byId("vol2024value").innerHTML= "--";
        dom.byId("vol2030value").innerHTML= "--";
        dom.byId("vol2040value").innerHTML= "--";
        dom.byId("vol2050value").innerHTML= "--";
        
        if (tSSObs.data.length>=18 && tSSObs.data[17].y !== undefined) {
          dom.byId("vol2017value").innerHTML= this._NumberWithCommas(tSSObs.data[17].y);
        } else {
          dom.byId("vol2017value").innerHTML= "--";
        }
        
        for (var i=0; i<tSSFor.data.length; i++) {
          dom.byId("vol" + tSSFor.data[i].x + "value").innerHTML= this._NumberWithCommas(tSSFor.data[i].y);
          
        }

        dom.byId("chartAreaVol").style.display = '';
        
        cChartOneVol.resize(330, 280);
        cChartOneVol.render();
        
        lLegendOneVol.refresh();

      } else {

        dom.byId("chartAreaVol").style.display = 'none';

      }

      this._zoomToSegment();
    },
    
    SetLegendBarFY: function(a_9Colors, a_sLegendName) {
     
      dom.byId("tableFY").style.display = '';
      dom.byId("tableCh").style.display = 'none';
      
      dom.byId("LegendNameFY").innerHTML = a_sLegendName;

      dom.byId("divColorFY1").style.backgroundColor = a_9Colors[0];
      dom.byId("divColorFY2").style.backgroundColor = a_9Colors[1];
      dom.byId("divColorFY3").style.backgroundColor = a_9Colors[2];
      dom.byId("divColorFY4").style.backgroundColor = a_9Colors[3];
      dom.byId("divColorFY5").style.backgroundColor = a_9Colors[4];
      dom.byId("divColorFY6").style.backgroundColor = a_9Colors[5];
      dom.byId("divColorFY7").style.backgroundColor = a_9Colors[6];
      dom.byId("divColorFY8").style.backgroundColor = a_9Colors[7];
      dom.byId("divColorFY9").style.backgroundColor = a_9Colors[8];
            
    },
    
    SetLegendBarCh: function(a_7Colors, a_sLegendName) {

      dom.byId("tableFY").style.display = 'none';
      dom.byId("tableCh").style.display = '';
      
      dom.byId("LegendNameCh").innerHTML = a_sLegendName;

      dom.byId("divColorCh1").style.backgroundColor = a_7Colors[0];
      dom.byId("divColorCh2").style.backgroundColor = a_7Colors[1];
      dom.byId("divColorCh3").style.backgroundColor = a_7Colors[2];
      dom.byId("divColorCh4").style.backgroundColor = a_7Colors[3];
      dom.byId("divColorCh5").style.backgroundColor = a_7Colors[4];
      dom.byId("divColorCh6").style.backgroundColor = a_7Colors[5];
      dom.byId("divColorCh7").style.backgroundColor = a_7Colors[6];
            
    },
    
    _showLegendFY: function() {

      var pm = PanelManager.getInstance();
      var bOpen = false;
      
      //Close Legend Widget if open
      for (var p=0; p < pm.panels.length; p++) {
        if (pm.panels[p].label == "Legend") {
          if (pm.panels[p].state != "closed") {
            bOpen=true;
            pm.closePanel(pm.panels[p]);
          }
        }
      }
    
      if (!bOpen) {
        pm.showPanel(this.appConfig.widgetOnScreen.widgets[WIDGETPOOLID_LEGEND]);
      }
    },
    
    _zoomToCounty: function() {
      
      if (dom.byId("chkAutoZoom").checked == true) {
        
        var refID = this.label;
        
        queryTask = new esri.tasks.QueryTask(lyrSegments.url);
        
        query = new esri.tasks.Query();
        query.returnGeometry = true;
        query.outFields = ["*"];
        query.where = "CO_FIPS = " + curCountyVol;
        
        queryTask.execute(query, showResults);
        
        parent = this;
        
        function showResults(featureSet) {
          
          var feature, featureId;
          
          //QueryTask returns a featureSet.  Loop through features in the featureSet and add them to the map.
          
          if (featureSet.features[0].geometry.type == "polyline" || featureSet.features[0].geometry.type == "polygon") { 
            //clearing any graphics if present. 
            parent.map.graphics.clear(); 
            newExtent = new Extent(featureSet.features[0].geometry.getExtent()) 
              for (i = 0; i < featureSet.features.length; i++) { 
                var graphic = featureSet.features[i]; 
                var thisExtent = graphic.geometry.getExtent(); 

                // making a union of extent or previous feature and current feature. 
                newExtent = newExtent.union(thisExtent); 
                //graphic.setSymbol(sfs); 
                //graphic.setInfoTemplate(popupTemplate); 
                parent.map.graphics.add(graphic); 
              } 
            parent.map.setExtent(newExtent.expand(1.1)); 
          }
        }
      }
    },
    
    _getTAZData: function() {
      console.log('_getTAZData');
            
      parent=this;
        
      aSECatValuesTotal = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
      aSECatValuesDevAcres = [0,0,0,0,0,0];
      aSECatValuesDensity =  [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
         
      var query = new Query();  
      query.returnGeometry = true;
      query.outFields = ["*"];
      if (curSelectedTAZs.length>0) {
        query.where = "CO_TAZID IN(" + curSelectedTAZs + ")";
      } else if (curCountySE>0 && curCityAreaSE=="select") {
        query.where = "CO_FIPS = " + curCountySE;
      } else {
        dom.byId("chartAreaSE").style.display = 'none';
        lyrTAZSelect.setDefinitionExpression(CO_TAZID=-1); 
        lyrTAZSelect.hide();
      }

      for (var i=0;i<aSECatLayers.length;i++) {
        
        lyrCurrentLayer = aSECatLayers[i];

        var tblqueryTaskTAZ = new QueryTask(lyrCurrentLayer.url);
        tblqueryTaskTAZ.execute(query,getTAZResults);
        
        //Segment search results
        function getTAZResults (results) {
          console.log('getTAZResults: ' + results.features[0].attributes["SECategory"]);
          
          var resultCount = results.features.length;
          if (resultCount) {
            l=aSECatValues.indexOf(results.features[0].attributes["SECategory"]);
          } else {
            parent._updateChartSE();
          }
          for (var j=0;j<resultCount;j++) {
            var featureAttributes = results.features[j].attributes;
            
            aSECatValuesDevAcres[l]+=featureAttributes["DEVACRES"];
            
            for (var k=2015;k<=2050;k++) {
              aSECatValuesTotal[l][k-2015]+=featureAttributes["YEAR" + k.toString()];
            }
          }
          for (var m=2015;m<=2050;m++) {
            aSECatValuesDensity[l][m-2015] = aSECatValuesTotal[l][m-2015] / aSECatValuesDevAcres[l];
          }
          
          if (l==curSECatPos) {
            parent._updateChartSE();
            //if (curSelectedTAZs=="" && curCityAreaSE=="select") { //meaning county is selected
              parent._zoomToTAZs();
            //}
          }

        }
      }

    },
    
    _updateChartSE: function() {
      console.log('_updateChartSE');

      //Remove existing series
      while( cChartOneSE.series.length > 0 ) {
        cChartOneSE.removeSeries(cChartOneSE.series[0].name);
      }

      aChartY = [];
      sChartTitle = "";
      
      if (curSelectedTAZs.length>0) {
        
        if (curDisplayValuePos==0) { //Total
          aChartY = aSECatValuesTotal[curSECatPos];
          if (curSelectedTAZs.length==aTAZs.length && curSEChartSelectionMethod=="filter") {
            sChartTitle = curCityAreaSE + " - " + aSECatDisplayName[curSECatPos];
          } else {
            sChartTitle = "Selected TAZs (" + curSelectedTAZs.length.toString() + ") - " + aSECatDisplayName[curSECatPos];
          }
        } else if (curDisplayValuePos==1) { //Density
          aChartY = aSECatValuesDensity[curSECatPos];
          if (curSelectedTAZs.length==aTAZs.length && curSEChartSelectionMethod=="filter") {
            sChartTitle = curCityAreaSE + " - " + aSECatDisplayNameShort[curSECatPos] + " Density";
          } else {
            sChartTitle = "Selected TAZs (" + curSelectedTAZs.length.toString() + ") - " + aSECatDisplayNameShort[curSECatPos] + " Density";
          }
        }
                
      } else if (curCountySE>0 && curCityAreaSE=="select" && curSEChartSelectionMethod=="filter") {
        
        if (curDisplayValuePos==0) { //Total
          aChartY = aSECatValuesTotal[curSECatPos];
          sChartTitle = this._getCountyNameByCOFIPS(curCountySE)[0].label + " County - " + aSECatDisplayName[curSECatPos];
        } else if (curDisplayValuePos==1) { //Density
          aChartY = aSECatValuesDensity[curSECatPos];
          sChartTitle = this._getCountyNameByCOFIPS(curCountySE)[0].label + " County - " + aSECatDisplayNameShort[curSECatPos] + " Density";
        }
      }

      if (aChartY.length>0) {
        
        aChartSeriesData =[];
          
        for (var k=2015;k<=2050;k++) {
          aChartSeriesData.push({x:k,y:aChartY[k-2015]});
        }

        cChartOneSE.addSeries("ChartData", aChartSeriesData, {stroke: {color: new Color([165, 165, 165, 0.9]), width: 4}});
        
        cChartOneSE.title=sChartTitle;

        dom.byId("chartAreaSE").style.display = '';

        cChartOneSE.resize(330, 280);
        cChartOneSE.render();
        
        if (aChartY[2050-2015]>=100000) {
          _sPrefix = "<small>";
          _sSuffix = "</small>";
        } else {
          _sPrefix = "";
          _sSuffix = "";
        }
              
        //update table
        
        if (curDisplayValuePos==0) { //TOTAL
          dom.byId("se2015value").innerHTML= _sPrefix + this._NumberWithCommas(aChartY[2015-2015]) + _sSuffix;
          dom.byId("se2019value").innerHTML= _sPrefix + this._NumberWithCommas(aChartY[2019-2015]) + _sSuffix;
          dom.byId("se2024value").innerHTML= _sPrefix + this._NumberWithCommas(aChartY[2024-2015]) + _sSuffix;
          dom.byId("se2030value").innerHTML= _sPrefix + this._NumberWithCommas(aChartY[2030-2015]) + _sSuffix;
          dom.byId("se2040value").innerHTML= _sPrefix + this._NumberWithCommas(aChartY[2040-2015]) + _sSuffix;
          dom.byId("se2050value").innerHTML= _sPrefix + this._NumberWithCommas(aChartY[2050-2015]) + _sSuffix;
        } else if (curDisplayValuePos==1) { //DENSITY
          dom.byId("se2015value").innerHTML= (aChartY[2015-2015]).toFixed(2);
          dom.byId("se2019value").innerHTML= (aChartY[2019-2015]).toFixed(2);
          dom.byId("se2024value").innerHTML= (aChartY[2024-2015]).toFixed(2);
          dom.byId("se2030value").innerHTML= (aChartY[2030-2015]).toFixed(2);
          dom.byId("se2040value").innerHTML= (aChartY[2040-2015]).toFixed(2);
          dom.byId("se2050value").innerHTML= (aChartY[2050-2015]).toFixed(2);
        }
        
        dom.byId("tableOneSE").style.display = '';
        
      } else {
        dom.byId("chartAreaSE").style.display = 'none';
        dom.byId("tableOneSE").style.display = 'none';
      }
      
    },
    
    _getCountyNameByCOFIPS: function(a_COFIPS) {
      return counties_se.filter(
        function(counties_se) {
          return counties_se.value == a_COFIPS;
        }
      );
    },
    
    
    _updateCityAreas: function() {
      console.log('_updateCityAreas');
      
      if (curCountySE<0) {
        dom.byId("CityAreaTitle").style.display = 'none';
        dom.byId("CityAreaCombo").style.display = 'none';
      } else {
        dom.byId("CityAreaTitle").style.display = '';
        dom.byId("CityAreaCombo").style.display = '';
      }
      
      //Build Options
      aCityAreas = [];
      
      aCityAreas.push({"label" : "COUNTY TOTAL", "value" : "select"});
      
      dom.byId("TAZsTitle").style.display = 'none';
      dom.byId("TAZsData").style.display = 'none';
      dom.byId("TAZsShowAll").style.display = 'none';
      
      for (var i=0;i<cityareas_se.length;i++) {
        if (cityareas_se[i].co_fips==curCountySE) {
          aCityAreas.push({"label" : cityareas_se[i].label, "value" : cityareas_se[i].value});
        }
      }
      
      //Populate Site Multi Select List

      parent = this;

      if (iFirstCityArea) {
        cmbCityAreaSE = new Select({
          id: "selectCityAreas",
          name: "selectCityAreasName",
          options: aCityAreas,
          onChange: function() {
            dom.byId("chartAreaSE").style.display = 'none';
            lyrTAZSelect.hide();
            curCityAreaSE = this.value;
            parent._updateTAZs();
          }
        }, "cmbCityAreaSE");
        cmbCityAreaSE.startup();
        
        iFirstCityArea = false;
      } else {
        cmbCityAreaSE.set("options", aCityAreas).reset();
        cmbCityAreaSE.startup();
      }
      //dom.byId("CityAreaTitle").style.display = '';
      cmbCityAreaSE.set("value", "select");

    },
    
    _updateTAZs: function(cotazid) {
      console.log('_updateTAZs');
      
      //Build Options
      if (cotazid===undefined) {
        dom.byId("taztoggle").innerHTML = "<small>Uncheck All</small>";
        aTAZs = [];
        curSelectedTAZs = [];
        
        for (var i=0;i<tazdata.length;i++) {
          if (tazdata[i].CO_FIPS==curCountySE && tazdata[i].CityArea==curCityAreaSE && curSEChartSelectionMethod=="filter") {
            aTAZs.push({"label" : tazdata[i].CO_TAZID, "value" : tazdata[i].CO_TAZID});
            curSelectedTAZs.push(tazdata[i].CO_TAZID);
          }
        }
        
      } else {
        dom.byId("taztoggle").innerHTML = "<small>Clear All</small>";
        dom.byId("taztoggle").style.display = '';
        if (!aTAZs.some(item => item.value === cotazid)) {
          aTAZs.push({"label" : cotazid, "value" : cotazid});
          if (curSelectedTAZs=="") {
            curSelectedTAZs = [];
          }
          curSelectedTAZs.push(cotazid);
        } else {
          aTAZs = aTAZs.filter(function(el){ return el.value != cotazid; });
          curSelectedTAZs.splice(curSelectedTAZs.indexOf(cotazid),1);
          //return;
        }
      }

      //Populate Site Multi Select List

      parent = this;

      //this._getTAZData();

      if (iFirstTAZ) {
        cmbTAZs = new CheckedMultiSelect({
          id: "selectTAZs",
          name: "selectTAZsName",
          options: aTAZs,
          class: "wide",
          multiple: true,
          onChange: function() {
            curSelectedTAZs = this.value;
            parent._getTAZData();
          }
        }, "cmbTAZs");
        cmbTAZs.startup();
        cmbTAZs.set("value", curSelectedTAZs);
        iFirstTAZ = false;
      } else {
        cmbTAZs.set("options", aTAZs).reset();
        cmbTAZs.set("value", curSelectedTAZs);
        cmbTAZs.startup();
      }
     
      this._updateTAZDisplay();

    },
    
    _updateTAZDisplay: function() {
      console.log('_updateTAZDisplay');
      
      if (aTAZs.length==0 || (curCityAreaSE=="select" && curCountySE==-1 && curSEChartSelectionMethod!="map")) {
        dom.byId("TAZsTitle").style.display = 'none';
        dom.byId("TAZsData").style.display = 'none';
        dom.byId("TAZsShowAll").style.display = 'none';
        
      } else {
        dom.byId("TAZsTitle").style.display = '';
        dom.byId("TAZsData").style.display = '';
        dom.byId("chartAreaSE").style.display = '';
        dom.byId("TAZsShowAll").style.display = '';
        forecastWidget._zoomToTAZs();
      }
      
    },
    
    _updateLayerDisplaySE: function() {
      console.log('_updateLayerDisplaySE');
      
      if (curColumn=="FY") {
        for (var i=0; i<aSECatLayers.length; i++) {
          if (i==curSECatPos && curTab=="SE") {
            aSECatLayers[i].setRenderer(aSegRndrSEFY[curSECatPos][curDisplayValuePos][curYearPos]);
            aSECatLayers[i].setLabelingInfo([ aLabelClassSEFY[curYearPos][curDisplayValuePos] ]);
            aSECatLayers[i].setOpacity(0.5);
            aSECatLayers[i].refresh();
            aSECatLayers[i].show();
          } else {
            aSECatLayers[i].hide();
          }
        }
      } else if (curColumn=="Ch") {
        for (var i=0; i<aSECatLayers.length; i++) {
          if (i==curSECatPos && curTab=="SE") {
            aSECatLayers[i].setRenderer(aSegRndrSECh[curSECatPos][curDisplayValuePos][curYearPos]);
            aSECatLayers[i].setLabelingInfo([ aLabelClassSECh[curYearPos][curDisplayValuePos] ]);
            aSECatLayers[i].setOpacity(0.5);
            aSECatLayers[i].refresh();
            aSECatLayers[i].show();
          } else {
            aSECatLayers[i].hide();
          } 
        }
      }
      
      if (curTab=="SE" && dom.byId("chartAreaSE").style.display!='none') {
        lyrTAZSelect.show();
      } else {
        lyrTAZSelect.hide();
      }

    },
        
    _setLegendBarSE: function() {
      console.log('_setLegendBarSE');
      
      if (curColumn=="FY") {
        s_LegendName = aSECatDisplayName[curSECatPos] + " " + aTextSEFY[curYearPos] + aDisplayValueLegendName[curDisplayValuePos]
        _aClassBreaks = aClassBreaksFY;
      } else if (curColumn=="Ch") {
        s_LegendName = aSECatDisplayNameShort[curSECatPos] + " Change " + aTextSECh[curYearPos] + aDisplayValueLegendName[curDisplayValuePos]
        _aClassBreaks = aClassBreaksCh;
      }
      
      if (_aClassBreaks.length>0) {
        
        _numClasses = _aClassBreaks[curSECatPos][curDisplayValuePos].length;
        
        var _sLegendHTML = "";

        for (var i=0; i<_numClasses;i++) {
          _sLegendHTML += "<td width=\"" + (1/_numClasses*100).toString() + "%\" style=\"background-color:" + _aClassBreaks[curSECatPos][curDisplayValuePos][i].symbol.color + "\">&nbsp;</td>";
        }
        
        _sLegendHTML = "<table id=\"tableSE\" width=\"330px;\">" +
                       "<tbody>" +
                       "     <tr>" +
                       "      <td colspan=" + _numClasses + " align=\"center\">" +
                       "        <div id=\"LegendNameSE\" class=\"thick thicker\">" + s_LegendName +"</div>" +
                       "      </td>" +
                       "    </tr>" +
                       "    <tr>" +
                       "      " + _sLegendHTML +
                       "    </tr>" +
                       "    <tr>" +
                       "      <td colspan=2><small>lowest</small></td>" +
                       "      <td colspan=" + (_numClasses-4).toString() + " align=\"center\"></td>" +
                       "      <td colspan=2 align=\"right\"><small>highest</small></td>" +
                       "    </tr>" +
                       "  </tbody>" +
                       "</table>"

        dom.byId("LegendSE").innerHTML = _sLegendHTML;
      } else {
        dom.byId("LegendSE").innerHTML = "";
      }
      
    }, 

    _setupClassBreaks:function(classbreaks, fych) {

      console.log('_setupClassBreaks: ' + fych);
      
      if (fych=="FY") {
        aClassBreaksFY = [];
      } else if (fych=="Ch") {
        aClassBreaksCh = [];
      }
      
      var defaultLineSE =  new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(sCLightGrey), dLineWidth2);
        
      for (var i=0;i<aSECatValues.length;i++) { //store values in order of aSECat Values
        
        for (var j=0; j<classbreaks.length; j++) {
          
          if (aSECatValues[i]==classbreaks[j].categoryCode) { //ensure classbreaks matches SECat position
          
            _aClassBreaks = [];
            
            for (var k=0; k<aDisplayValueCode.length;k++) { // Totals and density
              
              _dvn = aDisplayValueName[k]; //Totals and density
            
              _aBreaks = [];
              _iBreakMin = 0;
              _iBreakMax = 0;
              _sColor = "";
              _sClassField = "";
              _sLabel = "";
              
              var rainbow = new Rainbow(); 
              rainbow.setNumberRange(1, classbreaks[j][_dvn].numClasses);
              rainbow.setSpectrum(classbreaks[j][_dvn].beginColor, classbreaks[j][_dvn].endColor);
              
              console.log('_setupClassBreaks: ' + aSECatValues[i] + ' ' + _dvn);
              
              for (var l=0; l<classbreaks[j][_dvn].numClasses-1; l++) {
                _sClassFieldFrom = "classMin" + l.toString();
                _sClassFieldTo = "classMin" + (l+1).toString();
                _iBreakMin = classbreaks[j][_dvn][_sClassFieldFrom];
                _iBreakMax = classbreaks[j][_dvn][_sClassFieldTo];
                _sColor = "#" + rainbow.colourAt(l+1);
                if (l==0) {
                  _sLabel = "Less than " + _iBreakMax + classbreaks[j][_dvn].units;
                } else {
                  _sLabel = "From " + this._NumberWithCommas(_iBreakMin) + " to " + this._NumberWithCommas(_iBreakMax) + classbreaks[j][_dvn].units;
                }
                  
                _aBreaks.push({minValue: _iBreakMin, maxValue: _iBreakMax, symbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, defaultLineSE, Color.fromHex(_sColor)), label: _sLabel});
              }

              //Max is the min of the last class
              _sLabel = "More than " + this._NumberWithCommas(_iBreakMax) + classbreaks[j][_dvn].units;
              _sColor = "#" + rainbow.colourAt(l+1);
              
              //Last Class
              _aBreaks.push({minValue: _iBreakMax, maxValue: Infinity, symbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, defaultLineSE, Color.fromHex(_sColor)), label: _sLabel});

              _aClassBreaks.push(_aBreaks);
            }
            if (fych=="FY") {
              aClassBreaksFY.push(_aClassBreaks);
            } else if (fych=="Ch") {
              aClassBreaksCh.push(_aClassBreaks);
            }
          }
        }                   
      }

      if (fych=="FY") {
        this._setupYearsFY();
      } else if (fych=="Ch") {
        this._setupYearsCh();
      }      
      
    },
    
    _setupYearsFY:function() {
      console.log('_setupYearsFY');
      
      //Setup for AADT Forecast Years
      
      for (var i=0;i<aTextSEFY.length;i++) {
      
        //Update ADDT FY Text  
        dom.byId("lbSEFY" + i).innerHTML=aTextSEFY[i];

        _aLabelClassSEFY=[];
        
        for (var j=0; j<aDisplayValueCode.length;j++) {
          //Create a JSON object which contains the labeling properties. At the very least, specify which field to label using the labelExpressionInfo property. Other properties can also be specified such as whether to work with coded value domains, fieldinfos (if working with dates or number formatted fields, and even symbology if not specified as above)
          _jsonLabelsSEFY = {
            minScale: minScaleForLabels,
            labelExpressionInfo: {expression: "Text($feature." + aFieldNamesSEFY[j][i] +  ", " + aDisplayValueLabelFormat[j] + ")"}
          };
        
          // create a text symbol to define the style of labels
          var SECatLabel = new TextSymbol();
          SECatLabel.font.setSize("8pt");
          SECatLabel.font.setFamily("arial");
          SECatLabel.setColor(new Color([128,128,128]));
          SECatLabel.font.setWeight(Font.WEIGHT_BOLD);
          SECatLabel.setHaloColor(sCWhite);
          SECatLabel.setHaloSize(dHaloSize);

          //create instance of LabelClass (note: multiple LabelClasses can also be passed in as an array)  
          _aLabelClassSEFY.push(new LabelClass(_jsonLabelsSEFY));
          _aLabelClassSEFY[j].symbol = SECatLabel;
        
        }

        aLabelClassSEFY.push(_aLabelClassSEFY);
        
        parent = this;
        
        //Radio Buttons Change Event
        dom.byId("rbSEFY" + i).onchange = function(isChecked) {
          if(isChecked) {
            curYearPos = parseInt(this.value); //current year position
            curColumn = "FY";
            parent._setLegendBarSE();
            parent._updateLayerDisplaySE();
          }
        };           
      }
      
      this._setupLayerRenderingForAllFY();
      
    },
    
    _setupYearsCh:function() {
      console.log('_setupYearsCh');
      
      for (var i=0;i<aTextSECh.length;i++) {
      
        //Update ADDT Ch Text  
        dom.byId("lbSECh" + i).innerHTML=aTextSECh[i];

        _aLabelClassSECh=[];
                
        for (var j=0; j<aDisplayValueCode.length;j++) {
          
          //Create a JSON object which contains the labeling properties. At the very least, specify which field to label using the labelExpressionInfo property. Other properties can also be specified such as whether to work with coded value domains, fieldinfos (if working with dates or number formatted fields, and even symbology if not specified as above)
          _jsonLabelsSECh = {
            minScale: minScaleForLabels,
            labelExpressionInfo: {expression: "Text($feature." + aFieldNamesSECh[j][i] +  ", " + aDisplayValueLabelFormat[j] + ")"}
          };
        
          // create a text symbol to define the style of labels
          var SECatLabel = new TextSymbol();
          SECatLabel.font.setSize("8pt");
          SECatLabel.font.setFamily("arial");
          SECatLabel.setColor(new Color([128,128,128]));
          SECatLabel.font.setWeight(Font.WEIGHT_BOLD);
          SECatLabel.setHaloColor(sCWhite);
          SECatLabel.setHaloSize(dHaloSize);

          //create instance of LabelClass (note: multiple LabelClasses can also be passed in as an array)  
          _aLabelClassSECh.push(new LabelClass(_jsonLabelsSECh));
          _aLabelClassSECh[j].symbol = SECatLabel;
        
        }

        aLabelClassSECh.push(_aLabelClassSECh);
        
        parent = this;
        
        //Radio Buttons Change Event
        dom.byId("rbSECh" + i).onchange = function(isChecked) {
          if(isChecked) {
            curYearPos = parseInt(this.value); //current year position
            curColumn = "Ch";
            parent._setLegendBarSE();
            parent._updateLayerDisplaySE();
          }
        };
      }
      
      this._setupLayerRenderingForAllCh();

    },
    
    _setupLayerRenderingForAllFY: function() {
      console.log('_setupLayerRenderingForAllFY');
      
      //Set up layer rendering
      aSegRndrSEFY = [];
      for (var i=0;i<aSECatValues.length;i++) {
        var _aSegRndrSEFY_displayvalue = [];
        for (var j=0;j<aDisplayValueCode.length;j++) {
          var _aSegRndrSEFY_years = [];
          for (var k=0;k<aTextSEFY.length;k++) {
            //same breaks across all the years
            _aSegRndrSEFY_years.push(new ClassBreaksRenderer(null, aFieldNamesSEFY[j][k]));
            for (var l=0;l<aClassBreaksFY[i][j].length;l++) {
              _aSegRndrSEFY_years[k].addBreak(aClassBreaksFY[i][j][l]);
            }
          }
          _aSegRndrSEFY_displayvalue.push(_aSegRndrSEFY_years);
        }
        aSegRndrSEFY.push(_aSegRndrSEFY_displayvalue);
      }
      this._setLegendBarSE();
      this._updateLayerDisplaySE();
    },
     
    _setupLayerRenderingForAllCh: function() {
      console.log('_setupLayerRenderingForAllCh');
      
      //Set up layer rendering
      aSegRndrSECh = [];
      for (var i=0;i<aSECatValues.length;i++) {
        var _aSegRndrSECh_displayvalue = [];
        for (var j=0;j<aDisplayValueCode.length;j++) {
          var _aSegRndrSECh_years = [];
          for (var k=0;k<aTextSECh.length;k++) {
            //same breaks across all the years
            _aSegRndrSECh_years.push(new ClassBreaksRenderer(null, aFieldNamesSECh[j][k]));
            for (var l=0;l<aClassBreaksCh[i][j].length;l++) {
              _aSegRndrSECh_years[k].addBreak(aClassBreaksCh[i][j][l]);
            }
          }
          _aSegRndrSECh_displayvalue.push(_aSegRndrSECh_years);
        }
        aSegRndrSECh.push(_aSegRndrSECh_displayvalue);
      }
      this._setLegendBarSE();
      this._updateLayerDisplaySE();
    },
    
    _NumberWithCommas: function(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    _RGBToHex: function(color) {
      r = color.r.toString(16);
      g = color.g.toString(16);
      b = color.b.toString(16);

      if (r.length == 1)
        r = "0" + r;
      if (g.length == 1)
        g = "0" + g;
      if (b.length == 1)
        b = "0" + b;

      return "#" + r + g + b;
    },
    
    _showAll: function() {

      var btnShowHideAll = dom.byId("taztoggle");

      if (btnShowHideAll.innerHTML == "<small>Check All</small>") {
        curSelectedTAZs = [];
        for (var i=0;i<aTAZs.length;i++) {
          curSelectedTAZs.push(aTAZs[i]);
        }
        btnShowHideAll.innerHTML = "<small>Uncheck All</small>";
      } else if (btnShowHideAll.innerHTML == "<small>Uncheck All</small>") {
        curSelectedTAZs = [];
        btnShowHideAll.innerHTML = "<small>Check All</small>";
      } else if (btnShowHideAll.innerHTML == "<small>Clear All</small>") {
        lyrTAZSelect.setDefinitionExpression(CO_TAZID=-1); 
        lyrTAZSelect.hide();
        btnShowHideAll.innerHTML = "<small>Check All</small>";
        btnShowHideAll.style.display = '';
        this._updateTAZs();
      }
      cmbTAZs.set("value", curSelectedTAZs);
      cmbTAZs.startup();
      forecastWidget._updateChartSE();
      forecastWidget._zoomToTAZs();
    },

    _zoomToTAZs: function() {
      console.log('_zoomToTAZs');
      
      _curLayer = aSECatLayers[curSECatPos];
            
      queryTask = new esri.tasks.QueryTask(_curLayer.url);
      
      query = new esri.tasks.Query();
      query.returnGeometry = true;
      query.outFields = ["*"];
      if (curSelectedTAZs.length>0) {
        query.where = "CO_TAZID IN(" + curSelectedTAZs + ")";
      } else if (curSEChartSelectionMethod=="filter" && curCityAreaSE=="select") { 
        query.where = "CO_FIPS = " + curCountySE;
      } else if (curSEChartSelectionMethod=="map") {
        return;
      } else {
        query.where ="CO_TAZID=-1";
      }
        
      
      lyrTAZSelect.setDefinitionExpression(query.where);  
      lyrTAZSelect.show();
            
      queryTask.execute(query, showResults);
              
      var selectTAZs = [];
   
      
      function showResults(featureSet) {

        var feature, featureId;

        //QueryTask returns a featureSet.  Loop through features in the featureSet and add them to the map.
        
        if (dom.byId("chkAutoZoomSE").checked == true) {
          if (featureSet.features.length>0) {
            if (featureSet.features[0].geometry.type == "polygon") {
              
              //selectTAZs = aSECatLayers[curSECatPos].selectFeatures(query, FeatureLayer.SELECTION_ADD);
              //clearing any graphics if present.
              //forecastWidget.map.graphics.clear();
              newExtent = new Extent(featureSet.features[0].geometry.getExtent())
                for (var i=0; i<featureSet.features.length; i++) {
                  var graphic = featureSet.features[i];
                  var thisExtent = graphic.geometry.getExtent();
                  
                  // making a union of extent or previous feature and current feature.
                  newExtent = newExtent.union(thisExtent);
                  //segmentWidget.map.graphics.add(graphic);
                } 
              forecastWidget.map.setExtent(newExtent.expand(1.5));
            }
          }
          
          //forecastWidget.map.infoWindow.lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255,0,0]), 2)
          //forecastWidget.map.infoWindow.fillSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255,0,0]), 2), new Color([255,255,0,0.25]));
          //forecastWidget.map.infoWindow.setFeatures([selectTAZs]);   
        }
        
      }
      
    },

    _showLegendSE: function() {
      console.log('_showLegendSE');

      var pm = PanelManager.getInstance();
      //var wm = WidgetManager.getInstance();
      var bOpen = false;
      
      //wm.closeWidget(WIDGETPOOLID_LEGEND);
            
      //Close Legend Widget if open
      for (var p=0; p < pm.panels.length; p++) {
        if (pm.panels[p].label == "Legend") {
          if (pm.panels[p].state != "closed") {
            bOpen=true;
            pm.closePanel(pm.panelsW[p]);
          }
        }
      }
      
      if (!bOpen) {
        pm.showPanel(this.appConfig.widgetOnScreen.widgets[WIDGETPOOLID_LEGEND]);
      }
    },
    
    _updateExternalLayerDisplayUTP: function() {
      console.log('_updateExternalLayerDisplayUTP');
      
      if (dom.byId("chkSegLayerOnUTP").checked == true) {
        lyrSegments.show(); 
      } else {
        lyrSegments.hide(); 
      }
      if (dom.byId("chkSELayerOnUTP").checked == true) {
        aSECatLayers[curSECatPos].show();
      } else {
        aSECatLayers[curSECatPos].hide();
      }      
    },
    
    _updateLayerDisplayUTP: function() {
      console.log('_updateLayerDisplayUTP');
      
      var _bRds = dom.byId("chkRoads").checked;
      var _bTrn = dom.byId("chkTransit").checked;
      var _bP1 = dom.byId("chkPhase1").checked;
      var _bP2 = dom.byId("chkPhase2").checked;
      var _bP3 = dom.byId("chkPhase3").checked;
      var _bP4 = dom.byId("chkPhase4").checked;
      
      var aVisibleLayers = [];
      
      if (curTab=="UTP") {
        for (var i=0; i<aUTPLayerIDs.length;i++) {
          if (((_bRds && aUTP_Rds[i]) || (_bTrn && aUTP_Trn[i])) && ((_bP1 && aUTP_P1[i]) || (_bP2 && aUTP_P2[i]) || (_bP3 && aUTP_P3[i]) || (_bP4 && aUTP_P4[i]))) {
            aVisibleLayers.push(aUTPLayerIDs[i]);
          }
        }
        
        //lyrUTP.visibleLayers = (aVisibleLayers.concat(aUTPLayerIDs_AlwaysOn)).sort(function(a, b){return a - b});
        if (aVisibleLayers.length) {
          lyrUTP.visibleLayers = (aVisibleLayers.concat(aUTPLayerIDs_AlwaysOn)).sort(function(a, b){return a - b});
        } else {
          lyrUTP.visibleLayers = [];
        }
      } else {
        lyrUTP.visibleLayers = [];
      }
      
      lyrUTP.hide();
      lyrUTP.show();
    },
    
    _selectVol: function() {
      console.log('_selectVol');
      
      if (curTab=="VOL") return;
      
      curTab = "VOL";

      dom.byId("VOL_CONTROL").classList.remove('unselectedToggle');
      dom.byId("VOL_CONTROL").classList.add('selectedToggle');

      dom.byId("SE_CONTROL").classList.remove('selectedToggle');
      dom.byId("SE_CONTROL").classList.add('unselectedToggle');
      
      dom.byId("UTP_CONTROL").classList.remove('selectedToggle');
      dom.byId("UTP_CONTROL").classList.add('unselectedToggle');
      
      dom.byId("VOL_ICON").style.backgroundImage = "url('widgets/ForecastSidebar/images/icon_VOL_blue.png')";
      dom.byId("SE_ICON").style.backgroundImage = "url('widgets/ForecastSidebar/images/icon_SE_white.png')";
      dom.byId("UTP_ICON").style.backgroundImage = "url('widgets/ForecastSidebar/images/icon_UTP_white.png')";
      
      dom.byId("VOL_SECTION").style.display = '';
      dom.byId("SE_SECTION").style.display = 'none';
      dom.byId("UTP_SECTION").style.display = 'none';

      dom.byId("SE_TOGGLEVOL").style.display = 'none';
      dom.byId("UTP_TOGGLEVOL").style.display = 'none';
      
      this._updateLayerDisplaySE();
      this._updateLayerDisplayUTP();
      this._updateLayerDisplayVol();
      
      lyrTAZSelect.hide();
      this._changeZoom();
      
    },
    
    _selectSE: function() {
      console.log('_selectSE');
      
      if (curTab=="SE") return;
      
      curTab = "SE";
      
      dom.byId("VOL_CONTROL").classList.remove('selectedToggle');
      dom.byId("VOL_CONTROL").classList.add('unselectedToggle');

      dom.byId("SE_CONTROL").classList.remove('unselectedToggle');
      dom.byId("SE_CONTROL").classList.add('selectedToggle');
      
      dom.byId("UTP_CONTROL").classList.remove('selectedToggle');
      dom.byId("UTP_CONTROL").classList.add('unselectedToggle');
      
      dom.byId("VOL_ICON").style.backgroundImage = "url('widgets/ForecastSidebar/images/icon_VOL_white.png')";
      dom.byId("SE_ICON").style.backgroundImage = "url('widgets/ForecastSidebar/images/icon_SE_blue.png')";
      dom.byId("UTP_ICON").style.backgroundImage = "url('widgets/ForecastSidebar/images/icon_UTP_white.png')";
      
      dom.byId("VOL_SECTION").style.display = 'none';
      dom.byId("SE_SECTION").style.display = '';
      dom.byId("UTP_SECTION").style.display = 'none';
      
      this._updateLayerDisplaySE();
      this._updateLayerDisplayUTP();
      this._updateLayerDisplayVol();
      
      dom.byId("SE_TOGGLEVOL").style.display = '';
      dom.byId("UTP_TOGGLEVOL").style.display = 'none';
      
      this._updateVolToggles();
      this._changeZoom();
      
    },
    
    _selectUTP: function() {
      console.log('_selectUTP');
      
      if (curTab=="UTP") return;
      
      curTab = "UTP";
      
      dom.byId("VOL_CONTROL").classList.remove('selectedToggle');
      dom.byId("VOL_CONTROL").classList.add('unselectedToggle');

      dom.byId("SE_CONTROL").classList.remove('selectedToggle');
      dom.byId("SE_CONTROL").classList.add('unselectedToggle');
      
      dom.byId("UTP_CONTROL").classList.remove('unselectedToggle');
      dom.byId("UTP_CONTROL").classList.add('selectedToggle');
      
      dom.byId("VOL_ICON").style.backgroundImage = "url('widgets/ForecastSidebar/images/icon_VOL_white.png')";
      dom.byId("SE_ICON").style.backgroundImage = "url('widgets/ForecastSidebar/images/icon_SE_white.png')";
      dom.byId("UTP_ICON").style.backgroundImage = "url('widgets/ForecastSidebar/images/icon_UTP_blue.png')";
      
      dom.byId("VOL_SECTION").style.display = 'none';
      dom.byId("SE_SECTION").style.display = 'none';
      dom.byId("UTP_SECTION").style.display = '';
      
      this._updateLayerDisplaySE();
      this._updateLayerDisplayUTP();
      this._updateLayerDisplayVol();

      dom.byId("SE_TOGGLEVOL").style.display = 'none';
      dom.byId("UTP_TOGGLEVOL").style.display = '';
      
      this._updateVolToggles();
      this._changeZoom();
    },
    
    _turnOnAdvanced: function() {
      console.log('_turnOnAdvanced');

      dom.byId("TAB_CONTROL").style.display = '';

      if (!bStartSE) {
        this._startupSE();
      }
      
      if (!bStartUTP) {
        this._startupUTP();
      }
      
      this._selectVol();
      this._changeZoom();
    },
    
    _turnOnBasic: function() {
      console.log('_turnOnBasic');

      dom.byId("TAB_CONTROL").style.display = 'none';
      
      this._selectVol();
      this._checkVolLabel();
      this._changeZoom();
      
    },
    
    _checkSELabel: function() {
      
    },
    
    _checkVolLabel: function() {

      //get radio button value
      var rbValue;
      rbValue = djQuery('input[type=radio][name=lyrdisplay]:checked')[0].value;

      //get last character of radio button value
      var j;
      j = parseInt(rbValue.substr(-1))
      
      if (dom.byId("chkVolLabels_Vol").checked == true && rbValue.substring(0,2) == "Ch") {
        lyrSegments.setLabelingInfo([ aLabelClassCh[j] ]);
      } else if (dom.byId("chkVolLabels_Vol").checked == true && rbValue.substring(0,2) == "FY") {
        lyrSegments.setLabelingInfo([ aLabelClassFY[j] ]);
      } else {
        lyrSegments.setLabelingInfo([ labelClassOff ]);
      }
      
    },
    
    _checkVolLabel_Vol: function() {
      
      if (dom.byId("chkVolLabels_Vol").checked == true) {
        dom.byId("chkVolLabels_SE").checked = true;
        dom.byId("chkVolLabels_UTP").checked = true;
      } else {
        dom.byId("chkVolLabels_SE").checked = false;
        dom.byId("chkVolLabels_UTP").checked = false;
      }
      
      this._checkVolLabel();
    },
    
    _checkVolLabel_Vol: function() {
      
      if (dom.byId("chkVolLabels_Vol").checked == true) {
        dom.byId("chkVolLabels_SE").checked = true;
        dom.byId("chkVolLabels_UTP").checked = true;
      } else {
        dom.byId("chkVolLabels_SE").checked = false;
        dom.byId("chkVolLabels_UTP").checked = false;
      }
      
      this._checkVolLabel();
    },
    
    _checkVolLabel_SE: function() {
      
      if (dom.byId("chkVolLabels_SE").checked == true) {
        dom.byId("chkVolLabels_Vol").checked = true;
        dom.byId("chkVolLabels_UTP").checked = true;
      } else {
        dom.byId("chkVolLabels_Vol").checked = false;
        dom.byId("chkVolLabels_UTP").checked = false;
      }
      
      this._checkVolLabel();
    },
    
    _checkVolLabel_UTP: function() {
      
      if (dom.byId("chkVolLabels_UTP").checked == true) {
        dom.byId("chkVolLabels_Vol").checked = true;
        dom.byId("chkVolLabels_SE").checked = true;
      } else {
        dom.byId("chkVolLabels_Vol").checked = false;
        dom.byId("chkVolLabels_SE").checked = false;
      }
      
      this._checkVolLabel();
    },
    
    _toggleVol_SE: function() {
      console.log('_toggleVol_SE');
      
      if(dom.byId("SE_TOGGLEVOL").innerHTML==sShowTrafficLayerText) {
        dom.byId("SE_TOGGLEVOL").innerHTML = sHideTrafficLayerText;
        dom.byId("VOL_LABELS_Vol").style.display = '';
        dom.byId("VOL_LABELS_SE").style.display = '';
        dom.byId("VOL_LABELS_UTP").style.display = '';
      } else {
        dom.byId("SE_TOGGLEVOL").innerHTML = sShowTrafficLayerText;
        dom.byId("VOL_LABELS_Vol").style.display = 'none';
        dom.byId("VOL_LABELS_SE").style.display = 'none';
        dom.byId("VOL_LABELS_UTP").style.display = 'none';
      }
      this._updateVolToggles();
      this._updateLayerDisplayVol();
      this._changeZoom();
    },
    
    _toggleVol_UTP: function() {
      console.log('_toggleVol_UTP');
      
      if(dom.byId("UTP_TOGGLEVOL").innerHTML==sShowTrafficLayerText) {
        dom.byId("UTP_TOGGLEVOL").innerHTML = sHideTrafficLayerText;
        dom.byId("VOL_LABELS_Vol").style.display = '';
        dom.byId("VOL_LABELS_SE").style.display = '';
        dom.byId("VOL_LABELS_UTP").style.display = '';
      } else {
        dom.byId("UTP_TOGGLEVOL").innerHTML = sShowTrafficLayerText;
        dom.byId("VOL_LABELS_Vol").style.display = 'none';
        dom.byId("VOL_LABELS_SE").style.display = 'none';
        dom.byId("VOL_LABELS_UTP").style.display = 'none';
      }
      this._updateVolToggles();
      this._updateLayerDisplayVol();
      this._changeZoom();
    },
    
    _updateVolToggles: function() {
      console.log('_updateVolToggles');
      
      if(dom.byId("SE_TOGGLEVOL").innerHTML==sShowTrafficLayerText) {
        dom.byId("SE_TOGGLEVOL").classList.remove('toggleVolSelected');
        dom.byId("SE_TOGGLEVOL").classList.add('toggleVolUnselected');
        if (curTab == "SE") {
          dom.byId("VOL_LABELS_Vol").style.display = 'none';
          dom.byId("VOL_LABELS_SE").style.display = 'none';
          dom.byId("VOL_LABELS_UTP").style.display = 'none';
        }
      } else {
        dom.byId("SE_TOGGLEVOL").classList.remove('toggleVolUnselected');
        dom.byId("SE_TOGGLEVOL").classList.add('toggleVolSelected');
        if (curTab == "SE") {
          dom.byId("VOL_LABELS_Vol").style.display = '';
          dom.byId("VOL_LABELS_SE").style.display = '';
          dom.byId("VOL_LABELS_UTP").style.display = '';
        }
      }
      
      if(dom.byId("UTP_TOGGLEVOL").innerHTML==sShowTrafficLayerText) {
        dom.byId("UTP_TOGGLEVOL").classList.remove('toggleVolSelected');
        dom.byId("UTP_TOGGLEVOL").classList.add('toggleVolUnselected');
        if (curTab == "UTP") {
          dom.byId("VOL_LABELS_Vol").style.display = 'none';
          dom.byId("VOL_LABELS_SE").style.display = 'none';
          dom.byId("VOL_LABELS_UTP").style.display = 'none';
        }
      } else {
        dom.byId("UTP_TOGGLEVOL").classList.remove('toggleVolUnselected');
        dom.byId("UTP_TOGGLEVOL").classList.add('toggleVolSelected');
        if (curTab == "UTP") {
          dom.byId("VOL_LABELS_Vol").style.display = '';
          dom.byId("VOL_LABELS_SE").style.display = '';
          dom.byId("VOL_LABELS_UTP").style.display = '';
        }
      }

      
      
    },
    
    _selectTAZ: function() {
      console.log('_selectTAZ');
      
      this._toggleSEChartSelectionMethod();
            
    },
    
    _clickSEChartSelectionMethod_Map: function() {
      console.log('_toggleSEChartSelectionMethod');
      
      if (curSEChartSelectionMethod=="filter") { //change to map
        
        curSEChartSelectionMethod = "map";
        
        dom.byId("filtercol").style.display = 'none';
        
        dom.byId("selectMethodFilter").classList.remove('selectedToggle');
        dom.byId("selectMethodFilter").classList.add('unselectedToggle');
        
        dom.byId("selectMethodMap").classList.remove('unselectedToggle');
        dom.byId("selectMethodMap").classList.add('selectedToggle');
        
        this._updateTAZs();

        dom.byId("TAZsTitle").style.display = 'none';
        dom.byId("TAZsData").style.display = 'none';
        dom.byId("TAZsShowAll").style.display = 'none';
        dom.byId("taztoggle").style.display = 'none';
        
        if (cmbTAZs.id=="selectTAZs") {
          cmbTAZs.set("options", aTAZs).reset();
          cmbTAZs.set("value", curSelectedTAZs);
          cmbTAZs.startup();
        }
        
        lyrTAZSelect.setDefinitionExpression("CO_TAZID=-1");
        lyrTAZSelect.refresh();
        
        this._zoomToTAZs();
        
        this.map.setInfoWindowOnClick(false); // turn off info window (popup) when clicking a feature
        
        this._updateChartSE();

      }
    },
      
    _clickSEChartSelectionMethod_Filter: function() {
      
      if(curSEChartSelectionMethod=="map") { //change to city area filter
        
        curSEChartSelectionMethod = "filter";
        
        dom.byId("filtercol").style.display = '';
                
        if (curCountySE<0 && curCityAreaSE=="select") {
          dom.byId("CityAreaTitle").style.display = 'none';
          dom.byId("CityAreaCombo").style.display = 'none';
        } else {
          dom.byId("CityAreaTitle").style.display = '';
          dom.byId("CityAreaCombo").style.display = '';
        }
        
        dom.byId("TAZsTitle").style.display = 'none';
        dom.byId("TAZsData").style.display = 'none';
        dom.byId("TAZsShowAll").style.display = 'none';

        dom.byId("selectMethodFilter").classList.remove('unselectedToggle');
        dom.byId("selectMethodFilter").classList.add('selectedToggle');

        dom.byId("selectMethodMap").classList.remove('selectedToggle');
        dom.byId("selectMethodMap").classList.add('unselectedToggle');
        
        
        this._updateTAZs();        
        
        dom.byId("taztoggle").style.display = '';
        
        if (cmbTAZs.id=="selectTAZs") {
          cmbTAZs.set("options", aTAZs).reset();
          cmbTAZs.set("value", curSelectedTAZs);
          cmbTAZs.startup();
        }
        
        //cmbCountySE.set("value","select");
        //cmbCountySE.startup();
        //cmbCityAreaSE.set("value", "select");
        //cmbCityAreaSE.startup();
        
        //lyrTAZSelect.setDefinitionExpression("CO_TAZID=-1");
        //lyrTAZSelect.refresh();
        
        this._zoomToTAZs();
        
        this.map.setInfoWindowOnClick(true); // turn off info window (popup) when clicking a feature
        
        this._updateChartSE();
        
      }
            
    },

    //Run onOpen when receiving a message from OremLayerSymbology
    onReceiveData: function(name, widgetId, data, historyData) {
      console.log('onReceiveData');
      
      if (data.message=="TurnOnAdvanced") {
        this._turnOnAdvanced(); 
      } else if(data.message=="TurnOnBasic") {
        this._turnOnBasic();
      }
      
    },

    onOpen: function() {
      console.log('onOpen');
    },

    onClose: function() {
      console.log('onClose');
      
    },

    onMinimize: function() {
      console.log('onMinimize');
    },

    onMaximize: function() {
      console.log('onMaximize');
    },

    onSignIn: function(credential) {
      /* jshint unused:false*/
      console.log('onSignIn');
    },

    onSignOut: function() {
      console.log('onSignOut');
    },

    //added from Demo widget Setting.js
    setConfig: function(config) {
    var test = "";
    },

    getConfigFrom: function() {
      //WAB will get config object through this method
      return {
        //districtfrom: this.textNode.value
      };
    },
    
          
    _getCookieKey: function() {
      return 'isfirst_' + encodeURIComponent(jimuUtils.getAppIdFromUrl());
    },
    
    _getCookieCountyVol: function() {
      return 'countyvol_'+ encodeURIComponent(jimuUtils.getAppIdFromUrl());
    },
    
    _setCookieCountyVol: function() {
      //setup cookie so user comes back to same county
      var cookieCountyVol = this._getCookieCountyVol();

      cookie(cookieCountyVol, curCountyVol, {
        expires: 1000*60*60*24*30,
        path: '/'
      });
    }

    
  });
});