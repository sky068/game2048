/**
 * Created by skyxu on 2019/12/26.
 */

cc.Class({
    extends: cc.Component,
    properties: {
        debugBtn: cc.Node,
    },

    init () {

    },

    start () {
        this.debugBtn.active = DEBUG_OPEN;
        zy.audio.playBGM(zy.audio.BGM.MAIN);
    },

    debugCall () {
        zy.director.createPop("prefabs/pop/DebugPop");
    },

    settingCall () {
        zy.director.createPop("prefabs/pop/SettingPop");
    }
});
