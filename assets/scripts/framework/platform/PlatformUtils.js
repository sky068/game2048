const PACKAGENAME = "com/zygame/utils/PlatformUtils";

function vibratorShort() {
    if (!zy.dataMng.userData.vibOn) {
        return;
    }
    if(cc.sys.os == cc.sys.OS_ANDROID){
        getVibrator(25);
    }else if(cc.sys.os == cc.sys.OS_IOS){
        jsb.reflection.callStaticMethod("PlatformUtils", "vibratorShort");
    }
}

function vibratorLong() {
    if (!zy.dataMng.userData.vibOn) {
        return;
    }
    if(cc.sys.os == cc.sys.OS_ANDROID){
        getVibrator(100);
    }else if(cc.sys.os == cc.sys.OS_IOS){
        jsb.reflection.callStaticMethod("PlatformUtils", "vibratorLong");
    }
}

// t震动时间（毫秒）短震动建议25ms，长震动100毫秒
function getVibrator(t) {
    if(cc.sys.os == cc.sys.OS_ANDROID){
        jsb.reflection.callStaticMethod(PACKAGENAME, "vibrator","(I)V", t);
    }else if(cc.sys.os == cc.sys.OS_IOS){

    }
}

function getMobilePhoneID() {
    if(cc.sys.os == cc.sys.OS_ANDROID){
        return jsb.reflection.callStaticMethod(PACKAGENAME, "getDeviceID","()Ljava/lang/String;");
    }else if(cc.sys.os == cc.sys.OS_IOS){
        return jsb.reflection.callStaticMethod("PlatformUtils", "getIdfa");
    } else {
        // web 暂时使用时间戳
        // let t = Date.now();
        // t = t + Math.round(Math.random()*100000000);
        // return t.toString();
        return "";
    }
}

function  getMobileMac() {
    return getMobilePhoneID();
}

function getMobileIdfa() {
    return getMobilePhoneID();
}

function getAppVersion() {
    if(cc.sys.os == cc.sys.OS_ANDROID){
        return jsb.reflection.callStaticMethod(PACKAGENAME, "getPackageVersion","()Ljava/lang/String;");
    }else if(cc.sys.os == cc.sys.OS_IOS){
        return jsb.reflection.callStaticMethod("PlatformUtils", "getAppVersion");
    } else {
        return "1.0.0w";
    }
}

function rmSplash() {
    if(cc.sys.os == cc.sys.OS_ANDROID){
        jsb.reflection.callStaticMethod(PACKAGENAME, "rmSplashView","()V");
    }else if(cc.sys.os == cc.sys.OS_IOS){
        jsb.reflection.callStaticMethod("RootViewController", "removeSplashView");
    }
}

module.exports = {
    getVibrator: getVibrator,
    getMobilePhoneID: getMobilePhoneID,
    getAppVersion: getAppVersion,
    vibratorShort: vibratorShort,
    vibratorLong: vibratorLong,
    rmSplash: rmSplash,
    getMobileIdfa: getMobileIdfa,
    getMobileMac: getMobileMac,
};





