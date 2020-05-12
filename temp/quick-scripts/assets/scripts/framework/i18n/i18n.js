(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/framework/i18n/i18n.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '93789C/shtIL6entYsZPjee', 'i18n', __filename);
// scripts/framework/i18n/i18n.js

'use strict';

var Polyglot = require('polyglot');
var lang = cc.sys.language;
cc.log("====lang: ", lang);
// lang = 'en';
if (lang !== 'zh') {
    lang = 'en';
}
var data = require(lang); // update this to set your default displaying language in editor
// let polyglot = null;
var polyglot = new Polyglot({ phrases: data, allowMissing: true });

module.exports = {
    /**
     * This method allow you to switch language during runtime, language argument should be the same as your data file name
     * such as when language is 'zh', it will load your 'zh.js' data source.
     * @method init
     * @param language - the language specific data file name, such as 'zh' to load 'zh.js'
     */
    init: function init(language) {
        lang = language;
        data = require(lang);
        polyglot.replace(data);
    },

    /**
     * this method takes a text key as input, and return the localized string
     * Please read https://github.com/airbnb/polyglot.js for details
     * @method t
     * @return {String} localized string
     * @example
     *
     * var myText = i18n.t('MY_TEXT_KEY');
     *
     * // if your data source is defined as
     * // {"hello_name": "Hello, %{name}"}
     * // you can use the following to interpolate the text
     * var greetingText = i18n.t('hello_name', {name: 'nantas'}); // Hello, nantas
     */
    t: function t(key, opt) {
        return polyglot.t(key, opt);
    }
};

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=i18n.js.map
        