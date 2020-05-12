(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/hotUpdate/UpdatePanel.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a0b25x2RTFJZob6meKh/2YN', 'UpdatePanel', __filename);
// scripts/hotUpdate/UpdatePanel.js

"use strict";

cc.Class({
    extends: cc.Component,
    properties: {
        progressBar: require("./../framework/ui/ProgressBar"),
        fileProgress: require("./../framework/ui/ProgressBar"),
        byteProgress: require("./../framework/ui/ProgressBar"),
        fileLabel: cc.Label,
        byteLabel: cc.Label,

        info: cc.Label
    }

});

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
        //# sourceMappingURL=UpdatePanel.js.map
        