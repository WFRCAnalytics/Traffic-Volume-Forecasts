define([
    'dijit/_TemplatedMixin',
    'dijit/_WidgetBase',

    'dojo/dom-attr',
    'dojo/dom-class',
    'dojo/on',
    'dojo/text!./templates/LayerSelectorItem.html',
    'dojo/_base/declare',
    'dojo/_base/lang'
], function (
    _TemplatedMixin,
    _WidgetBase,

    domAttr,
    domClass,
    on,
    template,
    declare,
    lang
) {
    return declare([_WidgetBase, _TemplatedMixin], {
        /**
         * @const
         * @private
         * @prop {string} templateString - The class' html `templateString`.
         */
        templateString: template,
        /**
         * @const
         * @private
         * @default layer-selector-item
         * @prop {string} baseClass - The class' css `baseClass` name.
         */
        baseClass: 'layer-selector-item',
        /**
         * @name selected
         * @memberof LayerSelectorItem
         * @prop {function} - `_WidgetBase` custom setter for setting the checkbox on an input.
         * @param {boolean} checked - `true` if the widgets input should be checked.
         * @example
         * this.set('selected', true);
         * this.get('selected');
         */
        _setSelectedAttr: {
            node: 'input',
            type: 'attribute',
            attribute: 'checked'
        },
        /**
         * @name hidden
         * @memberof LayerSelectorItem
         * @prop {function} - `_WidgetBase` custom setter for setting the css class on the widget domNode.
         * @param {boolean} hide - `true` if the widget should add a CSS class to hide itself.
         * @example
         * this.set('hidden', true);
         * this.get('hidden');
         */
        _setHiddenAttr: function (hide) {
            this._set('hidden', hide);
            domClass.toggle(this.domNode, 'layer-selector-hidden');
        },
        /**
         * @name layerFactory
         * @memberof LayerSelectorItem
         * @prop {function} - `_WidgetBase` custom setter for setting the the alt text and label name.
         * We do not always have the name at build rendering time (layer tokens). Therefore the templateString
         * has been modified and the values are updated with this function.
         * @param {layerFactory} layerFactory - The `layerFactory` to build the UI markup from.
         * @example
         * this.set('layerFactory', {});
         * this.get('layerFactory');
         */
        _setLayerFactoryAttr: function (layerFactory) {
            this.name = (layerFactory.title || layerFactory.id || layerFactory.name || 'unknown');

            domAttr.set(this.label, 'alt', this.name);
            domAttr.set(this.label, 'title', this.name);
            domAttr.set(this.input, 'value', this.name);
            this.label.appendChild(document.createTextNode(this.name));
        },
        /**
         * @name inputType
         * @memberof LayerSelectorItem
         * @prop {function} - `_WidgetBase` custom setter for applying the input type attribute.
         * @param {string} [inputType=radio]
         * @example
         * this.set('inputType', 'radio');
         * this.get('inputType');
         */
        _setInputTypeAttr: function (inputType) {
            var type = inputType || 'radio';
            this.layerType = type === 'radio' ? 'baselayer' : 'overlayer';

            domAttr.set(this.input, 'type', type);
            domAttr.set(this.input, 'name', this.layerType);
            domAttr.set(this.input, 'value', this.name);

            this._set('inputType', type);
        },
        /**
        * @memberof LayerSelectorItem
        * @prop {string} layerType- The type of `LayerSelectorItem`. `baselayer` (radio) or `overlayer` (checkbox).
        */
        layerType: null,
        /**
         * The UI element wrapping a radio or checkbox and label representing a `esri/layer/Layer` that can be turned
         * on and off in a map.
         * @name LayerSelectorItem
         * @param {HTMLElement|string} [node] - The domNode or string id of a domNode to create this widget on. If null
         * a new div will be created but not placed in the dom. You will need to place it programmatically.
         * @param {object} params
         * @param {layerFactory} params.layerFactory - The Factory object representing a layer.
         * @param {string} [params.inputType=radio] - `radio` or `checkbox` depending on the type of input.
         */
        postCreate: function () {
            console.log('layer-selector-item::postCreate', arguments);

            domClass.add(this.domNode, ['radio', 'checkbox', 'layer-selector-input']);

            this._setupConnections();

            this.inherited(arguments);
        },
        /**
         * @private
         * wire events, and such
         */
        _setupConnections: function () {
            console.log('layer-selector-item::setupConnections', arguments);

            this.watch('selected', lang.hitch(this, function changed() {
                on.emit(this.domNode, 'changed', this);
            }));

            this.own(
                on(this.input, 'click', lang.hitch(this, function changed(e) {
                    this.set('selected', e.target.checked);
                }))
            );
        }
    });
});
/**
* The info about a layer needed to create it and show it on a map and in the layer selector successfully.
* @typedef {object} layerFactory
* @prop {function} Factory - the constructor function for creating a layer.
* @prop {string} url - The url to the map service.
* @prop {string} id - The id of the layer. This is shown in the LayerSelectorItem.
* @prop {object} tileInfo - The `esri/TileInfo` object if the layer has custom levels.
* @prop {string[]} linked - The id of overlays to automatically enable when selected.
*/
