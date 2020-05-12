"use strict";
cc._RF.push(module, '38e56QiJiVISLcEczrs95RS', 'TestScene');
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