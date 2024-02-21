define(['dojo/_base/declare', 'jimu/BaseWidget', './URLParams/URLParams'], function (declare, BaseWidget, URLParams) {
  return declare([BaseWidget], {
    mainWidget: null,
    onOpen: function onOpen() {
      this.mainWidget = new URLParams({
        config: this.config,
        map: this.map
      });
    }
  });
});
//# sourceMappingURL=Widget.js.map
