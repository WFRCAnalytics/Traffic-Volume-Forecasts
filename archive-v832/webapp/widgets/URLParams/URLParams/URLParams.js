define(['dijit/_WidgetBase', 'dojo/_base/declare', 'dojo/hash', 'dojo/io-query', 'esri/geometry/Point', 'esri/tasks/query', 'dojo/topic'], function (_WidgetBase, declare, hash, ioQuery, Point, Query, topic) {
  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  return declare([_WidgetBase], {
    // properties passed in via constructor
    // map: esri/map
    map: null,
    // config: Object
    config: null,
    constructor: function constructor()
    /* props */
    {
      window.URLParams = {};
      this.inherited(arguments);
    },
    postCreate: function postCreate() {
      console.log('URLParams:postCreate', arguments);
      this.initializeRouter();
      this.inherited(arguments);
    },
    initializeRouter: function initializeRouter() {
      var _this = this;

      console.log('URLParams:initializeRouter', arguments);
      var params = ioQuery.queryToObject(hash());

      if (params.guid && params.layerid) {
        var layer = this.map.getLayer(params.layerid);
        var query = new Query();
        query.returnGeometry = true;
        query.where = "GlobalID = '".concat(params.guid, "'");
        layer.selectFeatures(query).then(function (features) {
          if (features.length > 0) {
            var feature = features[0];
            feature.fields = layer.fields;
            feature.displayField = layer.displayField;
            feature.layerID = layer.id; // to be picked up by ProjectInfo widget

            window.URLParams.project = feature;

            if (feature.geometry.type === 'point') {
              _this.map.centerAndZoom(feature.geometry, _this.config.pointZoomLevel);
            } else {
              _this.map.setExtent(feature.geometry.getExtent(), true);
            }
          }

          _this.wireEvents();
        });
      } else if (params.scale && params.x && params.y) {
        this.map.setScale(parseInt(params.scale, 10));
        this.map.centerAt(new Point({
          x: parseInt(params.x, 10),
          y: parseInt(params.y, 10),
          spatialReference: {
            wkid: this.map.spatialReference.wkid
          }
        })).then(this.wireEvents.bind(this));
      } else {
        this.wireEvents();
      }

      if (params.clickx && params.clicky) {
        // to be picked up by ProjectInfo
        window.URLParams.clickpoint = {
          x: params.clickx,
          y: params.clicky
        };
      }

      if (params.infopanel) {
        // to be picked up by BetterAbout
        window.URLParams.infopanel = params.infopanel;
      }

      if (params.basemap) {
        // to be picked up by LayerSelector
        window.URLParams.basemap = params.basemap;
      } // both of these to be picked up by WFRCFilter


      if (params.modes) {
        window.URLParams.modes = typeof params.modes === 'string' ? [params.modes] : params.modes;
      }

      if (params.phaseIndexes) {
        window.URLParams.phaseIndexes = params.phaseIndexes;
      }
    },
    wireEvents: function wireEvents() {
      console.log('URLParams:wireEvents', arguments);
      this.own(this.map.on('extent-change', this.onMapExtentChange.bind(this)), topic.subscribe('url-params-on-project-click', this.setProjectParams.bind(this)), this.map.on('click', this.removeParams.bind(this, ['guid', 'layerid'])), topic.subscribe('url-params-on-infopanel-open', this.setParams.bind(this, {
        infopanel: 'open'
      })), topic.subscribe('url-params-on-infopanel-close', this.setParams.bind(this, {
        infopanel: 'closed'
      })), topic.subscribe('url-params-on-map-click', this.setClickParams.bind(this)), topic.subscribe('url-params-on-layer-selector-change', this.setBaseMap.bind(this)), topic.subscribe('url-params-on-filter-change', this.setFilterParams.bind(this)));
    },
    setFilterParams: function setFilterParams(filterParams) {
      console.log('URLParams:setFilterParams', arguments);
      this.setParams(_objectSpread({}, filterParams));
    },
    setBaseMap: function setBaseMap(basemap) {
      console.log('URLParams:setBaseMap', arguments);
      this.setParams({
        basemap: basemap
      });
    },
    setClickParams: function setClickParams(mapPoint) {
      console.log('URLParams:setClickParams');
      this.setParams({
        clickx: mapPoint.x,
        clicky: mapPoint.y
      });
    },
    onMapExtentChange: function onMapExtentChange(event) {
      console.log('URLParams:onMapExtentChange', arguments);
      var center = event.extent.getCenter();

      if (center.x && center.y) {
        this.setParams({
          x: Math.round(center.x),
          y: Math.round(center.y),
          scale: Math.round(this.map.getScale())
        });
      }
    },
    setProjectParams: function setProjectParams(config) {
      // config contains url and guid
      console.log('URLParams:setProjectParams', arguments);
      this.setParams(config);
      this.removeParams(['x', 'y', 'scale', 'clickx', 'clicky']);
    },
    setParams: function setParams(params) {
      // sets the params in the URL without messing with other ones
      console.log('URLParams:setParams');
      var newParams = Object.assign(ioQuery.queryToObject(hash()), params);
      return hash(ioQuery.objectToQuery(newParams), true);
    },
    removeParams: function removeParams(params) {
      // params: string[]
      console.log('URLParams:removeParams', arguments);
      var newParams = ioQuery.queryToObject(hash());
      params.forEach(function (param) {
        return delete newParams[param];
      });
      return hash(ioQuery.objectToQuery(newParams), true);
    }
  });
});
//# sourceMappingURL=URLParams.js.map
