/* eslint-disable no-unused-vars, no-undef */
var profile = {
    resourceTags: {
        amd: function (filename, mid) {
            return !this.copyOnly(filename, mid) && /\.js$/.test(filename);
        },
        copyOnly: function (filename, mid) {
            return (/^layer-selector\/resources\//.test(mid) && !/\.css$/.test(filename));
        }
    }
};
