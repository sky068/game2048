"use strict";
cc._RF.push(module, 'a8defv/RNBAp70l9SJpqyMU', 'UPLTVAndroid');
// scripts/framework/platform/UPLTVAndroid.js

"use strict";

var classJavaName = "com/up/ads/cocosjs/JsProxy";
var showLog = false;
var upltva = upltva || {
    setShowLog: function setShowLog(print) {
        if (undefined != print && print != null) {
            showLog = print;
        }
    },

    printJsLog: function printJsLog(msg) {
        if (showLog && undefined != msg && msg != null) {
            jsb.reflection.callStaticMethod("android/util/Log", "i", "(Ljava/lang/String;Ljava/lang/String;)I", "cocos2dx-js", msg);
        }
    },

    initAndroidSDK: function initAndroidSDK(androidAppKey, vokecall, callname) {
        //cc.log("===> js initAndroidSDK args zone: %d, call:%s", zone, callname);
        jsb.reflection.callStaticMethod(classJavaName, "initSDK", "(Ljava/lang/String;Ljava/lang/String;)V", androidAppKey, callname);
        jsb.reflection.callStaticMethod(classJavaName, "setInvokeDelegate", "(Ljava/lang/String;)V", vokecall);
    },

    initAndroidAbtConfigJson: function initAndroidAbtConfigJson(gameAccountId, isCompleteTask, isPaid, promotionChannelName, gender, age, tagstring) {
        //var args = { game_id:gameAccountId, complete:isCompleteTask, paid:isPaid, channel_name:promotionChannelName, gender:gender, age:age, tag:tagstring};
        //cc.log("===> js initIosAbtConfigJson args string: %s", args.constructor());
        jsb.reflection.callStaticMethod(classJavaName, "initAbtConfigJsonForJs", "(Ljava/lang/String;ZILjava/lang/String;Ljava/lang/String;ILjava/lang/String;)V", gameAccountId, isCompleteTask, isPaid, promotionChannelName, gender, age, tagstring);
    },

    getAndroidAbtConfig: function getAndroidAbtConfig(cpPlaceId) {
        return jsb.reflection.callStaticMethod(classJavaName, "getAbtConfig", "(Ljava/lang/String;)Ljava/lang/String;", cpPlaceId);
    },

    showAndroidRewardDebugUI: function showAndroidRewardDebugUI() {
        jsb.reflection.callStaticMethod(classJavaName, "showRewardDebugActivity", "()V");
    },

    setAndroidRewardVideoLoadCallback: function setAndroidRewardVideoLoadCallback() {
        jsb.reflection.callStaticMethod(classJavaName, "setRewardVideoLoadCallback", "()V");
    },

    isAndroidRewardReady: function isAndroidRewardReady() {
        return jsb.reflection.callStaticMethod(classJavaName, "isRewardReady", "()Z");
    },

    showAndroidRewardVideo: function showAndroidRewardVideo(cpPlaceId) {
        if (cpPlaceId == null) {
            cpPlaceId = "reward_video";
        }
        jsb.reflection.callStaticMethod(classJavaName, "showRewardVideo", "(Ljava/lang/String;)V", cpPlaceId);
    },

    setAndroidInterstitialLoadCallback: function setAndroidInterstitialLoadCallback(cpPlaceId) {
        jsb.reflection.callStaticMethod(classJavaName, "setInterstitialCallbackAt", "(Ljava/lang/String;)V", cpPlaceId);
    },

    isAndroidInterstitialReadyAsyn: function isAndroidInterstitialReadyAsyn(cpPlaceId, call) {
        //cc.log("===> isAndroidInterstitialReadyAsyn (%s, %s)", cpPlaceId, call);
        jsb.reflection.callStaticMethod(classJavaName, "isInterstitialReadyForJs", "(Ljava/lang/String;Ljava/lang/String;)V", cpPlaceId, call);
    },

    isAndroidInterstitialReady: function isAndroidInterstitialReady(cpPlaceId) {
        return jsb.reflection.callStaticMethod(classJavaName, "isInterstitialReady", "(Ljava/lang/String;)Z", cpPlaceId);
    },

    showAndroidInterstitialAd: function showAndroidInterstitialAd(cpPlaceId) {
        jsb.reflection.callStaticMethod(classJavaName, "showInterstitialForJs", "(Ljava/lang/String;)V", cpPlaceId);
    },

    showAndroidInterstitialDebugUI: function showAndroidInterstitialDebugUI() {
        jsb.reflection.callStaticMethod(classJavaName, "showInterstitialDebugActivityForJs", "()V");
    },

    removeAndroidBannerAdAt: function removeAndroidBannerAdAt(cpPlaceId) {
        jsb.reflection.callStaticMethod(classJavaName, "removeBanner", "(Ljava/lang/String;)V", cpPlaceId);
    },

    showAndroidBannerAdAtTop: function showAndroidBannerAdAtTop(cpPlaceId) {
        jsb.reflection.callStaticMethod(classJavaName, "showTopBanner", "(Ljava/lang/String;)V", cpPlaceId);
    },

    showAndroidBannerAdAtBottom: function showAndroidBannerAdAtBottom(cpPlaceId) {
        jsb.reflection.callStaticMethod(classJavaName, "showBottomBanner", "(Ljava/lang/String;)V", cpPlaceId);
    },

    hideAndroidBannerAdAtTop: function hideAndroidBannerAdAtTop() {
        jsb.reflection.callStaticMethod(classJavaName, "hideTopBanner", "()V");
    },

    hideAndroidBannerAdAtBottom: function hideAndroidBannerAdAtBottom() {
        jsb.reflection.callStaticMethod(classJavaName, "hideBottomBanner", "()V");
    },

    //展示icon广告
    showAndroidIconAdAt: function showAndroidIconAdAt(x, y, width, height, rotationAngle, cpPlaceId) {
        jsb.reflection.callStaticMethod(classJavaName, "showIconAd", "(IIIIILjava/lang/String;)V", x, y, width, height, rotationAngle, cpPlaceId);
    },

    //移除icon广告
    removeAndroidIconAdAt: function removeAndroidIconAdAt(cpPlaceId) {
        jsb.reflection.callStaticMethod(classJavaName, "removeIconAd", "(Ljava/lang/String;)V", cpPlaceId);
    },

    loadAndroidAdsByManual: function loadAndroidAdsByManual() {

        jsb.reflection.callStaticMethod(classJavaName, "loadAnroidAdsByManual", "()V");
    },

    exitAndroidApp: function exitAndroidApp() {
        jsb.reflection.callStaticMethod(classJavaName, "exitAndroidApp", "()V");
    },

    setAndroidManifestPackageName: function setAndroidManifestPackageName(pkg) {
        jsb.reflection.callStaticMethod(classJavaName, "setManifestPackageName", "(Ljava/lang/String;)V", pkg);
    },

    onAndroidBackPressed: function onAndroidBackPressed() {
        jsb.reflection.callStaticMethod(classJavaName, "onBackPressed", "()V");
    },

    setAndroidCustomerId: function setAndroidCustomerId(androidid) {
        // cc.log("===> js call setAndroidCustomerId() " + (androidid));
        jsb.reflection.callStaticMethod(classJavaName, "setCustomerIdForJs", "(Ljava/lang/String;)V", androidid);
    },

    updateAndroidAccessPrivacyInfoStatus: function updateAndroidAccessPrivacyInfoStatus(gdprPermissionEnumValue) {
        jsb.reflection.callStaticMethod(classJavaName, "updateAccessPrivacyInfoStatus", "(I)V", gdprPermissionEnumValue);
    },

    getAndroidAccessPrivacyInfoStatus: function getAndroidAccessPrivacyInfoStatus() {
        return jsb.reflection.callStaticMethod(classJavaName, "getAccessPrivacyInfoStatus", "()I");
    },

    notifyAndroidAccessPrivacyInfoStatus: function notifyAndroidAccessPrivacyInfoStatus(callback, callId) {
        jsb.reflection.callStaticMethod(classJavaName, "notifyAccessPrivacyInfoStatus", "(Ljava/lang/String;I)V", callback, callId);
    },

    isAndroidEuropeanUnionUser: function isAndroidEuropeanUnionUser(callback, callId) {
        jsb.reflection.callStaticMethod(classJavaName, "isEuropeanUnionUser", "(Ljava/lang/String;I)V", callback, callId);
    },

    reportIvokePluginMethodReceive: function reportIvokePluginMethodReceive(msg) {
        jsb.reflection.callStaticMethod(classJavaName, "reportIvokePluginMethodReceive", "(Ljava/lang/String;)V", msg);
    },

    reportRDRewardClose: function reportRDRewardClose(msg) {
        jsb.reflection.callStaticMethod(classJavaName, "reportRDRewardClose", "(Ljava/lang/String;)V", msg);
    },

    reportRDRewardClick: function reportRDRewardClick(msg) {
        jsb.reflection.callStaticMethod(classJavaName, "reportRDRewardClick", "(Ljava/lang/String;)V", msg);
    },

    reportRDRewardGiven: function reportRDRewardGiven(msg) {
        jsb.reflection.callStaticMethod(classJavaName, "reportRDRewardGiven", "(Ljava/lang/String;)V", msg);
    },

    reportRDShowDid: function reportRDShowDid(msg) {
        jsb.reflection.callStaticMethod(classJavaName, "reportRDShowDid", "(Ljava/lang/String;)V", msg);
    },

    reportRDRewardCancel: function reportRDRewardCancel(msg) {
        jsb.reflection.callStaticMethod(classJavaName, "reportRDRewardCancel", "(Ljava/lang/String;)V", msg);
    },

    reportILClose: function reportILClose(msg, cpid) {
        jsb.reflection.callStaticMethod(classJavaName, "reportILClose", "(Ljava/lang/String;Ljava/lang/String;)V", cpid == undefined ? "" : cpid, msg);
    },

    reportILClick: function reportILClick(msg, cpid) {
        jsb.reflection.callStaticMethod(classJavaName, "reportILClick", "(Ljava/lang/String;Ljava/lang/String;)V", cpid == undefined ? "" : cpid, msg);
    },

    reportILShowDid: function reportILShowDid(msg, cpid) {
        jsb.reflection.callStaticMethod(classJavaName, "reportILShowDid", "(Ljava/lang/String;Ljava/lang/String;)V", cpid == undefined ? "" : cpid, msg);
    },

    isOnlineDebugReportEnable: function isOnlineDebugReportEnable() {
        return jsb.reflection.callStaticMethod(classJavaName, "isReportOnlineEnable", "()Z");
    },

    isAndroidLogOpened: function isAndroidLogOpened() {
        return jsb.reflection.callStaticMethod(classJavaName, "isLogOpened", "()Z");
    },

    setAndroidIsChild: function setAndroidIsChild(isChild) {
        jsb.reflection.callStaticMethod(classJavaName, "setIsChild", "(Z)V", isChild);
    },

    setAndroidBirthday: function setAndroidBirthday(year, month) {
        jsb.reflection.callStaticMethod(classJavaName, "setBirthday", "(II)V", year, month);
    },

    autoOneKeyInspectByAndroid: function autoOneKeyInspectByAndroid() {
        jsb.reflection.callStaticMethod(classJavaName, "autoOneKeyInspect", "()V");
    },

    tellToDoctorByAndroid: function tellToDoctorByAndroid(action, placeid, msg) {
        jsb.reflection.callStaticMethod(classJavaName, "tellToDoctor", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", action, placeid, msg);
    },

    setAppsFlyerUIDByAndroid: function setAppsFlyerUIDByAndroid(uid) {
        jsb.reflection.callStaticMethod(classJavaName, "setAppsflyerUID", "(Ljava/lang/String;)V", uid);
    },

    setAdjustIdByAndroid: function setAdjustIdByAndroid(ajid) {
        jsb.reflection.callStaticMethod(classJavaName, "setAdjustID", "(Ljava/lang/String;)V", ajid);
    }

};
module.exports = upltva;

cc._RF.pop();