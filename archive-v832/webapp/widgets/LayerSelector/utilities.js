define(['esri/layers/ArcGISDynamicMapServiceLayer', 'esri/layers/ArcGISImageServiceLayer', 'esri/layers/ArcGISTiledMapServiceLayer', 'esri/layers/FeatureLayer', 'esri/layers/KMLLayer', 'esri/layers/LabelLayer', 'esri/layers/RasterLayer', 'esri/layers/StreamLayer', 'esri/layers/TiledMapServiceLayer', 'esri/layers/VectorTileLayer', 'esri/layers/WCSLayer', 'esri/layers/WebTiledLayer', 'esri/layers/WFSLayer', 'esri/layers/WMSLayer', 'esri/layers/WMTSLayer'], function (ArcGISDynamicMapServiceLayer, ArcGISImageServiceLayer, ArcGISTiledMapServiceLayer, FeatureLayer, KMLLayer, LabelLayer, RasterLayer, StreamLayer, TiledMapServiceLayer, VectorTileLayer, WCSLayer, WebTiledLayer, WFSLayer, WMSLayer, WMTSLayer) {
  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function _typeof(obj) {
        return typeof obj;
      };
    } else {
      _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  var factoryLookup = {
    ArcGISDynamicMapServiceLayer: ArcGISDynamicMapServiceLayer,
    ArcGISImageServiceLayer: ArcGISImageServiceLayer,
    ArcGISTiledMapServiceLayer: ArcGISTiledMapServiceLayer,
    FeatureLayer: FeatureLayer,
    KMLLayer: KMLLayer,
    LabelLayer: LabelLayer,
    RasterLayer: RasterLayer,
    StreamLayer: StreamLayer,
    TiledMapServiceLayer: TiledMapServiceLayer,
    VectorTileLayer: VectorTileLayer,
    WCSLayer: WCSLayer,
    WebTiledLayer: WebTiledLayer,
    WFSLayer: WFSLayer,
    WMSLayer: WMSLayer,
    WMTSLayer: WMTSLayer
  };
  return {
    applyFactories: function applyFactories(config) {
      console.log('LayerSelector:utilities:applyFactories');

      var convert = function convert(layer) {
        if (_typeof(layer) === String) {
          return layer;
        }

        return Object.assign(layer, {
          Factory: factoryLookup[layer.Factory]
        });
      };

      var baseLayers = Array.from(config.baseLayers);
      config.baseLayers = baseLayers.map(convert);
      var overlays = Array.from(config.overlays);
      config.overlays = overlays.map(convert);
      return config;
    }
  };
});
//# sourceMappingURL=utilities.js.map
