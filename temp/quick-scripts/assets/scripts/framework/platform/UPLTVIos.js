(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/framework/platform/UPLTVIos.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '56bf2BM76RD3pMS97NjxIwH', 'UPLTVIos', __filename);
// scripts/framework/platform/UPLTVIos.js

"use strict";

var classIosName = "UpAdsBrigeJs";
var showLog = false;

var upltvoc = upltvoc || {
    setShowLog: function setShowLog(print) {
        if (undefined != print && print != null) {
            showLog = print;
        }
    },

    printJsLog: function printJsLog(msg) {
        if (showLog && undefined != msg && msg != null) {
            jsb.reflection.callStaticMethod(classIosName, "printJsLog:", msg);
        }
    },

    initIosSDK: function initIosSDK(appkey, zone, invokecallback, callback) {
        // if (undefined != callback && callback != null) {
        //     jsb.reflection.callStaticMethod(classIosName, "initSdkByJs:withCallback:", zone, callback);
        // } else {
        //     jsb.reflection.callStaticMethod(classIosName, "initSdkByJs:", zone);
        // }

        if (undefined != callback && callback != null) {
            jsb.reflection.callStaticMethod(classIosName, "initSdkByJsWithAppKey:zone:withCallback:", appkey, zone, callback);
        } else {
            jsb.reflection.callStaticMethod(classIosName, "initSdkByJsWithAppKey:zone:", appkey, zone);
        }

        jsb.reflection.callStaticMethod(classIosName, "setVokeMethod:", invokecallback);
    },

    initIosAbtConfigJson: function initIosAbtConfigJson(gameAccountId, isCompleteTask, isPaid, promotionChannelName, gender, age, tagstring) {
        //var args = { game_id:gameAccountId, complete:isCompleteTask, paid:isPaid, channel_name:promotionChannelName, gender:gender, age:age, tag:tagstring};
        //cc.log("===> js initIosAbtConfigJson args string: %s", args.constructor());
        jsb.reflection.callStaticMethod(classIosName, "initAbtConfigJsonByJs:complete:paid:channel:gender:age:tags:", gameAccountId, isCompleteTask, isPaid, promotionChannelName, gender, age, tagstring);
    },

    getIosAbtConfig: function getIosAbtConfig(cpPlaceId) {
        var r = jsb.reflection.callStaticMethod(classIosName, "getIosAbtConfigByJs:", cpPlaceId);
        //cc.log("===> js getIosAbtConfig : %s", r);
        return r;
    },

    showIosRewardDebugUI: function showIosRewardDebugUI() {
        jsb.reflection.callStaticMethod(classIosName, "showRewardDebugActivityByJs");
    },

    setIosRewardVideoLoadCallback: function setIosRewardVideoLoadCallback() {
        jsb.reflection.callStaticMethod(classIosName, "setRewardVideoLoadCallbackByJs");
    },

    isIosRewardReady: function isIosRewardReady() {
        return jsb.reflection.callStaticMethod(classIosName, "isIosRewardReadyByJs");
    },

    showIosRewardVideo: function showIosRewardVideo(cpPlaceId) {
        jsb.reflection.callStaticMethod(classIosName, "showIosRewardVideoByJs:", cpPlaceId);
    },

    isIosInterstitialReadyAsyn: function isIosInterstitialReadyAsyn(cpPlaceId, callback) {
        jsb.reflection.callStaticMethod(classIosName, "isInterstitialReadyAsynByJs:callback:", cpPlaceId, callback);
    },

    isIosInterstitialReady: function isIosInterstitialReady(cpPlaceId) {
        return jsb.reflection.callStaticMethod(classIosName, "isInterstitialReadyByJs:", cpPlaceId);
    },

    showIosInterstitialAd: function showIosInterstitialAd(cpPlaceId) {
        jsb.reflection.callStaticMethod(classIosName, "showInterstitialByJs:", cpPlaceId);
    },

    setIosInterstitialLoadCallback: function setIosInterstitialLoadCallback(cpPlaceId) {
        jsb.reflection.callStaticMethod(classIosName, "setInterstitialCallbackByJs:", cpPlaceId);
    },

    showIosInterstitialDebugUI: function showIosInterstitialDebugUI() {
        jsb.reflection.callStaticMethod(classIosName, "showInterstitialDebugActivityByJs");
    },

    removeIosBannerAdAt: function removeIosBannerAdAt(cpPlaceId) {
        jsb.reflection.callStaticMethod(classIosName, "removeBannerByJs:", cpPlaceId);
    },

    showIosBannerAdAtTop: function showIosBannerAdAtTop(cpPlaceId) {
        jsb.reflection.callStaticMethod(classIosName, "showTopBannerByJs:", cpPlaceId);
    },

    showIosBannerAdAtBottom: function showIosBannerAdAtBottom(cpPlaceId) {
        jsb.reflection.callStaticMethod(classIosName, "showBottomBannerByJs:", cpPlaceId);
    },

    hideIosBannerAdAtTop: function hideIosBannerAdAtTop() {
        jsb.reflection.callStaticMethod(classIosName, "hideTopBannerByJs");
    },

    hideIosBannerAdAtBottom: function hideIosBannerAdAtBottom() {
        jsb.reflection.callStaticMethod(classIosName, "hideBottomBannerByJs");
    },

    setIosTopBannerPading: function setIosTopBannerPading(padding) {
        //cc.log("===> js setIosTopBannerPading padding: %d, type:%s", padding, typeof padding);
        var strPading = "0";
        if (typeof padding == "number") {
            strPading = String(padding);
        } else if (typeof padding == "string") {
            strPading = padding;
        }
        jsb.reflection.callStaticMethod(classIosName, "setTopBannerPadingForIphonexByJs:", strPading);
    },

    //展示icon广告
    showIosIconAdAt: function showIosIconAdAt(x, y, width, height, rotationAngle, cpPlaceId) {
        jsb.reflection.callStaticMethod(classIosName, "showIconX:y:width:height:rotationAngle:placementId:", x, y, width, height, rotationAngle, cpPlaceId);
    },
    //移除icon广告
    removeIosIconAdAt: function removeIosIconAdAt(cpPlaceId) {
        jsb.reflection.callStaticMethod(classIosName, "removeIcon:", cpPlaceId);
    },

    loadIosAdsByManual: function loadIosAdsByManual() {
        jsb.reflection.callStaticMethod(classIosName, "loadIosAdsByManualByJs");
    },

    exitIosApp: function exitIosApp() {
        jsb.reflection.callStaticMethod(classIosName, "exitIosAppByJs");
    },

    updateIosAccessPrivacyInfoStatus: function updateIosAccessPrivacyInfoStatus(gdprPermissionEnumValue) {
        jsb.reflection.callStaticMethod(classIosName, "updateAccessPrivacyInfoStatusByJs:", gdprPermissionEnumValue);
    },

    getIosAccessPrivacyInfoStatus: function getIosAccessPrivacyInfoStatus() {
        return jsb.reflection.callStaticMethod(classIosName, "getAccessPrivacyInfoStatusByJs");
    },

    notifyIosAccessPrivacyInfoStatus: function notifyIosAccessPrivacyInfoStatus(callback, callId) {
        jsb.reflection.callStaticMethod(classIosName, "notifyAccessPrivacyInfoStatusByJs:callId:", callback, callId);
    },

    isIosEuropeanUnionUser: function isIosEuropeanUnionUser(callback, callId) {
        jsb.reflection.callStaticMethod(classIosName, "isEuropeanUnionUserByJs:callId:", callback, callId);
    },

    reportIvokePluginMethodReceive: function reportIvokePluginMethodReceive(msg) {
        jsb.reflection.callStaticMethod(classIosName, "reportIvokePluginMethodReceiveByJs:", msg);
    },

    reportRDRewardClose: function reportRDRewardClose(msg) {
        jsb.reflection.callStaticMethod(classIosName, "reportRDRewardCloseByJs:", msg);
    },

    reportRDRewardClick: function reportRDRewardClick(msg) {
        jsb.reflection.callStaticMethod(classIosName, "reportRDRewardClickByJs:", msg);
    },

    reportRDRewardGiven: function reportRDRewardGiven(msg) {
        jsb.reflection.callStaticMethod(classIosName, "reportRDRewardGivenByJs:", msg);
    },

    reportRDShowDid: function reportRDShowDid(msg) {
        jsb.reflection.callStaticMethod(classIosName, "reportRDShowDidByJs:", msg);
    },

    reportRDRewardCancel: function reportRDRewardCancel(msg) {
        jsb.reflection.callStaticMethod(classIosName, "reportRDRewardCancelByJs:", msg);
    },

    reportILClose: function reportILClose(msg, cpid) {
        jsb.reflection.callStaticMethod(classIosName, "reportILCloseByJs:msg:", cpid == undefined ? "" : cpid, msg);
    },

    reportILClick: function reportILClick(msg, cpid) {
        jsb.reflection.callStaticMethod(classIosName, "reportILClickByJs:msg:", cpid == undefined ? "" : cpid, msg);
    },

    reportILShowDid: function reportILShowDid(msg, cpid) {
        jsb.reflection.callStaticMethod(classIosName, "reportILShowDidByJs:msg:", cpid == undefined ? "" : cpid, msg);
    },

    isOnlineDebugReportEnable: function isOnlineDebugReportEnable() {
        return jsb.reflection.callStaticMethod(classIosName, "isReportOnlineEnableByJs");
    },

    isIosLogOpened: function isIosLogOpened() {
        return jsb.reflection.callStaticMethod(classIosName, "isIosLogOpenedByJs");
    },

    autoOneKeyInspectByIos: function autoOneKeyInspectByIos() {
        jsb.reflection.callStaticMethod(classIosName, "autoOneKeyInspectByJs");
    },

    tellToDoctorByIos: function tellToDoctorByIos(action, placeid, msg) {
        jsb.reflection.callStaticMethod(classIosName, "tellToDoctorByJs:adid:msg:", action, placeid, msg);
    },

    setAppsFlyerUIDByIos: function setAppsFlyerUIDByIos(uid) {
        jsb.reflection.callStaticMethod(classIosName, "setAppsFlyerUIDByJs:", uid);
    },

    setAdjustIdByIos: function setAdjustIdByIos(ajid) {
        jsb.reflection.callStaticMethod(classIosName, "setAdjustIdByJs:", ajid);
    }
};
module.exports = upltvoc;

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
        //# sourceMappingURL=UPLTVIos.js.map
        