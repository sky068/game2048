var classIosName = "UpAdsBrigeJs";
var showLog = false;

var upltvoc = upltvoc || {
    setShowLog: function (print) {
        if (undefined != print && print != null) {
            showLog = print;
        }
    },

    printJsLog: function (msg) {
        if (showLog && undefined != msg && msg != null) {
            jsb.reflection.callStaticMethod(classIosName, "printJsLog:", msg);
        }
    },

    initIosSDK: function (appkey, zone, invokecallback, callback) {
        // if (undefined != callback && callback != null) {
        //     jsb.reflection.callStaticMethod(classIosName, "initSdkByJs:withCallback:", zone, callback);
        // } else {
        //     jsb.reflection.callStaticMethod(classIosName, "initSdkByJs:", zone);
        // }
        
        if (undefined != callback && callback != null) {
            jsb.reflection.callStaticMethod(classIosName, "initSdkByJsWithAppKey:zone:withCallback:", appkey, zone, callback);
        }
        else {
            jsb.reflection.callStaticMethod(classIosName, "initSdkByJsWithAppKey:zone:", appkey, zone);
        }

        jsb.reflection.callStaticMethod(classIosName, "setVokeMethod:", invokecallback);
    },

    initIosAbtConfigJson: function (gameAccountId, isCompleteTask, isPaid, promotionChannelName, gender, age, tagstring) {
        //var args = { game_id:gameAccountId, complete:isCompleteTask, paid:isPaid, channel_name:promotionChannelName, gender:gender, age:age, tag:tagstring};
        //cc.log("===> js initIosAbtConfigJson args string: %s", args.constructor());
        jsb.reflection.callStaticMethod(classIosName, "initAbtConfigJsonByJs:complete:paid:channel:gender:age:tags:",
            gameAccountId, isCompleteTask, isPaid,
            promotionChannelName, gender, age, tagstring);
    },

    getIosAbtConfig: function (cpPlaceId) {
        var r = jsb.reflection.callStaticMethod(classIosName, "getIosAbtConfigByJs:", cpPlaceId);
        //cc.log("===> js getIosAbtConfig : %s", r);
        return r;
    },

    showIosRewardDebugUI: function () {
        jsb.reflection.callStaticMethod(classIosName, "showRewardDebugActivityByJs");
    },

    setIosRewardVideoLoadCallback: function () {
        jsb.reflection.callStaticMethod(classIosName, "setRewardVideoLoadCallbackByJs");
    },

    isIosRewardReady: function () {
        return jsb.reflection.callStaticMethod(classIosName, "isIosRewardReadyByJs");
    },

    showIosRewardVideo: function (cpPlaceId) {
        jsb.reflection.callStaticMethod(classIosName, "showIosRewardVideoByJs:", cpPlaceId);
    },

    isIosInterstitialReadyAsyn: function (cpPlaceId, callback) {
        jsb.reflection.callStaticMethod(classIosName, "isInterstitialReadyAsynByJs:callback:", cpPlaceId, callback);
    },

    isIosInterstitialReady: function (cpPlaceId) {
        return jsb.reflection.callStaticMethod(classIosName, "isInterstitialReadyByJs:", cpPlaceId);
    },

    showIosInterstitialAd: function (cpPlaceId) {
        jsb.reflection.callStaticMethod(classIosName, "showInterstitialByJs:", cpPlaceId);
    },

    setIosInterstitialLoadCallback: function (cpPlaceId) {
        jsb.reflection.callStaticMethod(classIosName, "setInterstitialCallbackByJs:", cpPlaceId);
    },

    showIosInterstitialDebugUI: function () {
        jsb.reflection.callStaticMethod(classIosName, "showInterstitialDebugActivityByJs");
    },

    removeIosBannerAdAt: function (cpPlaceId) {
        jsb.reflection.callStaticMethod(classIosName, "removeBannerByJs:", cpPlaceId);
    },

    showIosBannerAdAtTop: function (cpPlaceId) {
        jsb.reflection.callStaticMethod(classIosName, "showTopBannerByJs:", cpPlaceId);
    },

    showIosBannerAdAtBottom: function (cpPlaceId) {
        jsb.reflection.callStaticMethod(classIosName, "showBottomBannerByJs:", cpPlaceId);
    },

    hideIosBannerAdAtTop: function () {
        jsb.reflection.callStaticMethod(classIosName, "hideTopBannerByJs");
    },

    hideIosBannerAdAtBottom: function () {
        jsb.reflection.callStaticMethod(classIosName, "hideBottomBannerByJs");
    },

    setIosTopBannerPading: function (padding) {
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
    showIosIconAdAt: function (x, y, width, height, rotationAngle, cpPlaceId) {
        jsb.reflection.callStaticMethod(classIosName, "showIconX:y:width:height:rotationAngle:placementId:", x, y, width, height, rotationAngle, cpPlaceId);
    },
    //移除icon广告
    removeIosIconAdAt: function (cpPlaceId) {
        jsb.reflection.callStaticMethod(classIosName, "removeIcon:", cpPlaceId);
    },

    loadIosAdsByManual: function () {
        jsb.reflection.callStaticMethod(classIosName, "loadIosAdsByManualByJs");
    },

    exitIosApp: function () {
        jsb.reflection.callStaticMethod(classIosName, "exitIosAppByJs");
    },

    updateIosAccessPrivacyInfoStatus: function (gdprPermissionEnumValue) {
        jsb.reflection.callStaticMethod(classIosName, "updateAccessPrivacyInfoStatusByJs:", gdprPermissionEnumValue);
    },

    getIosAccessPrivacyInfoStatus: function () {
        return jsb.reflection.callStaticMethod(classIosName, "getAccessPrivacyInfoStatusByJs");
    },

    notifyIosAccessPrivacyInfoStatus: function (callback, callId) {
        jsb.reflection.callStaticMethod(classIosName, "notifyAccessPrivacyInfoStatusByJs:callId:", callback, callId);
    },

    isIosEuropeanUnionUser: function (callback, callId) {
        jsb.reflection.callStaticMethod(classIosName, "isEuropeanUnionUserByJs:callId:", callback, callId);
    },

    reportIvokePluginMethodReceive: function (msg) {
        jsb.reflection.callStaticMethod(classIosName, "reportIvokePluginMethodReceiveByJs:", msg);
    },

    reportRDRewardClose: function (msg) {
        jsb.reflection.callStaticMethod(classIosName, "reportRDRewardCloseByJs:", msg);
    },

    reportRDRewardClick: function (msg) {
        jsb.reflection.callStaticMethod(classIosName, "reportRDRewardClickByJs:", msg);
    },

    reportRDRewardGiven: function (msg) {
        jsb.reflection.callStaticMethod(classIosName, "reportRDRewardGivenByJs:", msg);
    },

    reportRDShowDid: function (msg) {
        jsb.reflection.callStaticMethod(classIosName, "reportRDShowDidByJs:", msg);
    },

    reportRDRewardCancel: function (msg) {
        jsb.reflection.callStaticMethod(classIosName, "reportRDRewardCancelByJs:", msg);
    },

    reportILClose: function (msg, cpid) {
        jsb.reflection.callStaticMethod(classIosName,
            "reportILCloseByJs:msg:",
            cpid == undefined ? "" : cpid,
            msg);
    },

    reportILClick: function (msg, cpid) {
        jsb.reflection.callStaticMethod(classIosName,
            "reportILClickByJs:msg:",
            cpid == undefined ? "" : cpid,
            msg);
    },


    reportILShowDid: function (msg, cpid) {
        jsb.reflection.callStaticMethod(classIosName,
            "reportILShowDidByJs:msg:",
            cpid == undefined ? "" : cpid,
            msg);
    },

    isOnlineDebugReportEnable: function () {
        return jsb.reflection.callStaticMethod(classIosName, "isReportOnlineEnableByJs");
    },

    isIosLogOpened: function () {
        return jsb.reflection.callStaticMethod(classIosName, "isIosLogOpenedByJs");
    },

    autoOneKeyInspectByIos: function () {
        jsb.reflection.callStaticMethod(classIosName, "autoOneKeyInspectByJs");
    },

    tellToDoctorByIos: function (action, placeid, msg) {
        jsb.reflection.callStaticMethod(classIosName, "tellToDoctorByJs:adid:msg:", action, placeid, msg);
    },

    setAppsFlyerUIDByIos: function (uid) {
        jsb.reflection.callStaticMethod(classIosName, "setAppsFlyerUIDByJs:", uid);
    },

    setAdjustIdByIos: function (ajid) {
        jsb.reflection.callStaticMethod(classIosName, "setAdjustIdByJs:", ajid);
    }
}
module.exports = upltvoc