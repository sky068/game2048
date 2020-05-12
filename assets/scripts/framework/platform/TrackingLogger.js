/**
 * Created by skyxu on 2019/12/17.
 *
 * 热云统计
 */

const PACKAGENAME = "com/zygame/utils/TrackingHelper";
const CLASSNAME = "AppController";//appKey == 14fff86b99b68c943591338142fc9253  channel_id == _default_ 正式上线需要修改Appid 为下载地址的后面数字

cc.Class({
    statics: {
        // eventName必须为event_1到event_12 http://doc.trackingio.com/sdkwen-dang/android/androidsdk-jie-ru-shuo-ming-wen-dang.html
        logEventWatchAds(placeId) {
            let eventName = 'event_' + placeId[placeId.length - 1];
            if(cc.sys.os == cc.sys.OS_ANDROID){
                return jsb.reflection.callStaticMethod(PACKAGENAME, "logEvent","(Ljava/lang/String;)V", eventName);
            }else if(cc.sys.os == cc.sys.OS_IOS){
                return jsb.reflection.callStaticMethod(CLASSNAME,"logEvent:", eventName);
            }
        },

        logEventLogin(uid) {
            if(cc.sys.os == cc.sys.OS_ANDROID){
                return jsb.reflection.callStaticMethod(PACKAGENAME, "logLogin","(Ljava/lang/String;)V", uid);
            }else if(cc.sys.os == cc.sys.OS_IOS){
                return jsb.reflection.callStaticMethod(CLASSNAME,"logLogin:", uid);
            }
        },

        logEventRegister(uid) {
            if(cc.sys.os == cc.sys.OS_ANDROID){
                return jsb.reflection.callStaticMethod(PACKAGENAME, "logRegister","(Ljava/lang/String;)V", uid);
            }else if(cc.sys.os == cc.sys.OS_IOS){
                return jsb.reflection.callStaticMethod(CLASSNAME, "logRegister:", uid);
            }
        }
    }
});
