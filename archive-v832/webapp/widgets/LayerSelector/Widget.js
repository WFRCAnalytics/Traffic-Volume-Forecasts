define(['dojo/_base/declare', 'jimu/BaseWidget', './layer-selector/LayerSelector', './utilities', 'dojo/aspect', 'dojo/topic'], function (declare, BaseWidget, LayerSelector, _utilities, aspect, topic) {
  var applyFactories = _utilities.applyFactories;

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

  return declare([BaseWidget], {
    mainWidget: null,
    postCreate: function postCreate() {
      console.log('LayerSelector:postCreate');
      this.config = applyFactories(this.config);
      this.mainWidget = new LayerSelector(_objectSpread({}, this.config, {
        map: this.map
      }));
      this.mainWidget.startup();

      if (window.URLParams && window.URLParams.basemap) {
        var radioButtons = this.mainWidget.domNode.querySelectorAll("input[value='".concat(window.URLParams.basemap, "']"));

        if (radioButtons.length === 1) {
          radioButtons[0].click();
        }
      }

      aspect.after(this.mainWidget, '_updateMap', this.onChange.bind(this), true);
    },
    onChange: function onChange(layerItem) {
      console.log('LayerSelector:onChange', arguments);

      if (layerItem.get('selected') && layerItem.layerType === 'baselayer') {
        topic.publish('url-params-on-layer-selector-change', layerItem.name);
      }
    }
  });
});
//# sourceMappingURL=Widget.js.map
