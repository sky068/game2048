var classJavaName = "com/up/ads/cocosjs/JsProxy";
var showLog = false;
var upltva = upltva || {
    setShowLog: function (print) {
        if (undefined != print && print != null) {
            showLog = print;
        }
    },

    printJsLog: function (msg) {
        if (showLog && undefined != msg && msg != null) {
            jsb.reflection.callStaticMethod("android/util/Log", "i", "(Ljava/lang/String;Ljava/lang/String;)I", "cocos2dx-js", msg);
        }
    },

    initAndroidSDK: function (androidAppKey, vokecall, callname) {
        //cc.log("===> js initAndroidSDK args zone: %d, call:%s", zone, callname);
        jsb.reflection.callStaticMethod(classJavaName, "initSDK", "(Ljava/lang/String;Ljava/lang/String;)V", androidAppKey, callname);
        jsb.reflection.callStaticMethod(classJavaName, "setInvokeDelegate", "(Ljava/lang/String;)V", vokecall);

    },

    initAndroidAbtConfigJson: function (gameAccountId, isCompleteTask, isPaid, promotionChannelName, gender, age, tagstring) {
        //var args = { game_id:gameAccountId, complete:isCompleteTask, paid:isPaid, channel_name:promotionChannelName, gender:gender, age:age, tag:tagstring};
        //cc.log("===> js initIosAbtConfigJson args string: %s", args.constructor());
        jsb.reflection.callStaticMethod(classJavaName, "initAbtConfigJsonForJs", "(Ljava/lang/String;ZILjava/lang/String;Ljava/lang/String;ILjava/lang/String;)V",
            gameAccountId, isCompleteTask, isPaid,
            promotionChannelName, gender, age, tagstring);
    },

    getAndroidAbtConfig: function (cpPlaceId) {
        return jsb.reflection.callStaticMethod(classJavaName, "getAbtConfig", "(Ljava/lang/String;)Ljava/lang/String;", cpPlaceId);
    },

    showAndroidRewardDebugUI: function () {
        jsb.reflection.callStaticMethod(classJavaName, "showRewardDebugActivity", "()V");
    },

    setAndroidRewardVideoLoadCallback: function () {
        jsb.reflection.callStaticMethod(classJavaName, "setRewardVideoLoadCallback", "()V");
    },

    isAndroidRewardReady: function () {
        return jsb.reflection.callStaticMethod(classJavaName, "isRewardReady", "()Z");
    },

    showAndroidRewardVideo: function (cpPlaceId) {
        if (cpPlaceId == null) {
            cpPlaceId = "reward_video";
        }
        jsb.reflection.callStaticMethod(classJavaName, "showRewardVideo", "(Ljava/lang/String;)V", cpPlaceId);
    },

    setAndroidInterstitialLoadCallback: function (cpPlaceId) {
        jsb.reflection.callStaticMethod(classJavaName, "setInterstitialCallbackAt", "(Ljava/lang/String;)V", cpPlaceId);
    },

    isAndroidInterstitialReadyAsyn: function (cpPlaceId, call) {
        //cc.log("===> isAndroidInterstitialReadyAsyn (%s, %s)", cpPlaceId, call);
        jsb.reflection.callStaticMethod(classJavaName, "isInterstitialReadyForJs", "(Ljava/lang/String;Ljava/lang/String;)V", cpPlaceId, call);
    },

    isAndroidInterstitialReady: function (cpPlaceId) {
        return jsb.reflection.callStaticMethod(classJavaName, "isInterstitialReady", "(Ljava/lang/String;)Z", cpPlaceId);
    },

    showAndroidInterstitialAd: function (cpPlaceId) {
        jsb.reflection.callStaticMethod(classJavaName, "showInterstitialForJs", "(Ljava/lang/String;)V", cpPlaceId);
    },

    showAndroidInterstitialDebugUI: function () {
        jsb.reflection.callStaticMethod(classJavaName, "showInterstitialDebugActivityForJs", "()V");
    },

    removeAndroidBannerAdAt: function (cpPlaceId) {
        jsb.reflection.callStaticMethod(classJavaName, "removeBanner", "(Ljava/lang/String;)V", cpPlaceId);
    },

    showAndroidBannerAdAtTop: function (cpPlaceId) {
        jsb.reflection.callStaticMethod(classJavaName, "showTopBanner", "(Ljava/lang/String;)V", cpPlaceId);
    },

    showAndroidBannerAdAtBottom: function (cpPlaceId) {
        jsb.reflection.callStaticMethod(classJavaName, "showBottomBanner", "(Ljava/lang/String;)V", cpPlaceId);
    },

    hideAndroidBannerAdAtTop: function () {
        jsb.reflection.callStaticMethod(classJavaName, "hideTopBanner", "()V");
    },

    hideAndroidBannerAdAtBottom: function () {
        jsb.reflection.callStaticMethod(classJavaName, "hideBottomBanner", "()V");
    },

    //展示icon广告
    showAndroidIconAdAt: function (x, y, width, height, rotationAngle, cpPlaceId) {
        jsb.reflection.callStaticMethod(classJavaName, "showIconAd", "(IIIIILjava/lang/String;)V", x, y, width, height, rotationAngle, cpPlaceId);
    },

    //移除icon广告
    removeAndroidIconAdAt: function (cpPlaceId) {
        jsb.reflection.callStaticMethod(classJavaName, "removeIconAd", "(Ljava/lang/String;)V", cpPlaceId);
    },

    loadAndroidAdsByManual: function () {

        jsb.reflection.callStaticMethod(classJavaName, "loadAnroidAdsByManual", "()V");
    },

    exitAndroidApp: function () {
        jsb.reflection.callStaticMethod(classJavaName, "exitAndroidApp", "()V");
    },

    setAndroidManifestPackageName: function (pkg) {
        jsb.reflection.callStaticMethod(classJavaName, "setManifestPackageName", "(Ljava/lang/String;)V", pkg);
    },

    onAndroidBackPressed: function () {
        jsb.reflection.callStaticMethod(classJavaName, "onBackPressed", "()V");
    },

    setAndroidCustomerId: function (androidid) {
        // cc.log("===> js call setAndroidCustomerId() " + (androidid));
        jsb.reflection.callStaticMethod(classJavaName, "setCustomerIdForJs", "(Ljava/lang/String;)V", androidid);
    },

    updateAndroidAccessPrivacyInfoStatus: function (gdprPermissionEnumValue) {
        jsb.reflection.callStaticMethod(classJavaName, "updateAccessPrivacyInfoStatus", "(I)V", gdprPermissionEnumValue);
    },

    getAndroidAccessPrivacyInfoStatus: function () {
        return jsb.reflection.callStaticMethod(classJavaName, "getAccessPrivacyInfoStatus", "()I");
    },

    notifyAndroidAccessPrivacyInfoStatus: function (callback, callId) {
        jsb.reflection.callStaticMethod(classJavaName, "notifyAccessPrivacyInfoStatus", "(Ljava/lang/String;I)V", callback, callId);
    },

    isAndroidEuropeanUnionUser: function (callback, callId) {
        jsb.reflection.callStaticMethod(classJavaName, "isEuropeanUnionUser", "(Ljava/lang/String;I)V", callback, callId);
    },

    reportIvokePluginMethodReceive: function (msg) {
        jsb.reflection.callStaticMethod(classJavaName, "reportIvokePluginMethodReceive", "(Ljava/lang/String;)V", msg);
    },

    reportRDRewardClose: function (msg) {
        jsb.reflection.callStaticMethod(classJavaName, "reportRDRewardClose", "(Ljava/lang/String;)V", msg);
    },

    reportRDRewardClick: function (msg) {
        jsb.reflection.callStaticMethod(classJavaName, "reportRDRewardClick", "(Ljava/lang/String;)V", msg);
    },

    reportRDRewardGiven: function (msg) {
        jsb.reflection.callStaticMethod(classJavaName, "reportRDRewardGiven", "(Ljava/lang/String;)V", msg);
    },

    reportRDShowDid: function (msg) {
        jsb.reflection.callStaticMethod(classJavaName, "reportRDShowDid", "(Ljava/lang/String;)V", msg);
    },

    reportRDRewardCancel: function (msg) {
        jsb.reflection.callStaticMethod(classJavaName, "reportRDRewardCancel", "(Ljava/lang/String;)V", msg);
    },

    reportILClose: function (msg, cpid) {
        jsb.reflection.callStaticMethod(classJavaName,
            "reportILClose",
            "(Ljava/lang/String;Ljava/lang/String;)V",
            cpid == undefined ? "" : cpid,
            msg);
    },

    reportILClick: function (msg, cpid) {
        jsb.reflection.callStaticMethod(classJavaName,
            "reportILClick",
            "(Ljava/lang/String;Ljava/lang/String;)V",
            cpid == undefined ? "" : cpid,
            msg);
    },


    reportILShowDid: function (msg, cpid) {
        jsb.reflection.callStaticMethod(classJavaName,
            "reportILShowDid",
            "(Ljava/lang/String;Ljava/lang/String;)V",
            cpid == undefined ? "" : cpid,
            msg);
    },

    isOnlineDebugReportEnable: function () {
        return jsb.reflection.callStaticMethod(classJavaName,
            "isReportOnlineEnable",
            "()Z");
    },

    isAndroidLogOpened: function () {
        return jsb.reflection.callStaticMethod(classJavaName, "isLogOpened", "()Z");
    },

    setAndroidIsChild: function (isChild) {
        jsb.reflection.callStaticMethod(classJavaName, "setIsChild", "(Z)V", isChild);
    },

    setAndroidBirthday: function (year, month) {
        jsb.reflection.callStaticMethod(classJavaName, "setBirthday", "(II)V", year, month);
    },

    autoOneKeyInspectByAndroid: function () {
        jsb.reflection.callStaticMethod(classJavaName, "autoOneKeyInspect", "()V");
    },

    tellToDoctorByAndroid: function (action, placeid, msg) {
        jsb.reflection.callStaticMethod(classJavaName, "tellToDoctor", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", action, placeid, msg);
    },
    
    setAppsFlyerUIDByAndroid : function (uid) {
        jsb.reflection.callStaticMethod(classJavaName, "setAppsflyerUID", "(Ljava/lang/String;)V", uid);
    },
    
    setAdjustIdByAndroid : function (ajid) {
        jsb.reflection.callStaticMethod(classJavaName, "setAdjustID", "(Ljava/lang/String;)V", ajid);
    }

};
module.exports = upltva