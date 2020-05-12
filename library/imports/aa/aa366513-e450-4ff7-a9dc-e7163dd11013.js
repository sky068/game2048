"use strict";
cc._RF.push(module, 'aa366UT5FBP96nc5xY90RAT', 'SettingPop');
// scripts/pop/SettingPop.js

"use strict";

/**
 * Created by skyxu on 2019/12/9.
 */

var PlatformUtils = require("./../framework/platform/PlatformUtils");

cc.Class({
    extends: cc.Component,
    properties: {
        vibNode: cc.Node,
        soundsNode: cc.Node,
        soudsVolume: cc.Node,
        versionLabel: cc.Label
    },

    init: function init(params) {
        this.soundsNode.getComponent("SwitchControl").setIsOn(zy.audio.getBGMEnabled(), false);
        this.soudsVolume.getComponent(cc.Slider).progress = zy.audio.getBGMVomue();

        this.versionLabel.string = "v" + PlatformUtils.getAppVersion() + "  c" + CHANNEL_ID;
    },
    onVibCall: function onVibCall() {
        zy.audioMng.playButtonAudio();
        zy.dataMng.userData.vibOn = !zy.dataMng.userData.vibOn;
        // if (zy.dataMng.userData.vibOn) {
        //     this.vibNode.getComponent(cc.Animation).play("setBtnOn", 0);
        //     PlatformUtils.vibratorShort();
        // } else {
        //     this.vibNode.getComponent(cc.Animation).play("setBtnOff", 0);
        // }
    },
    onSoundsCall: function onSoundsCall(sc) {
        zy.audio.playEffect(zy.audio.Effect.CommonClick);
        zy.audio.setBGMEnabled(sc.isOn);
        zy.audio.setEffectsEnabled(sc.isOn);
    },
    sliderCallback: function sliderCallback(slider) {
        zy.audio.setBGMVolume(slider.progress);
        zy.audio.setEffectsVolume(slider.progress);
    },
    closeCallback: function closeCallback() {
        zy.director.closePop(this.popName);
    }
});

cc._RF.pop();