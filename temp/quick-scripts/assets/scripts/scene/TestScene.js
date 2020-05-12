(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/scene/TestScene.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '38e56QiJiVISLcEczrs95RS', 'TestScene', __filename);
// scripts/scene/TestScene.js

"use strict";

/**
 * Created by skyxu on 2019/12/26.
 */

cc.Class({
    extends: cc.Component,
    properties: {
        debugBtn: cc.Node
    },

    init: function init() {},
    start: function start() {
        this.debugBtn.active = DEBUG_OPEN;
        zy.audio.playBGM(zy.audio.BGM.MAIN);
    },
    debugCall: function debugCall() {
        zy.director.createPop("prefabs/pop/DebugPop");
    },
    settingCall: function settingCall() {
        zy.director.createPop("prefabs/pop/SettingPop");
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
        //# sourceMappingURL=TestScene.js.map
        