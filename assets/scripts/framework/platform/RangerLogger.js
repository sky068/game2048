/**
 * Created by skyxu on 2019/12/18.
 *
 * 头条sdk
 */

const PACKAGENAME = "com/zygame/utils/RangerAppLogHelper";

cc.Class({
    statics: {
        logEventWatchAds(placeId) {
            if(cc.sys.os == cc.sys.OS_ANDROID){
                return jsb.reflection.callStaticMethod(PACKAGENAME, "logEvent","(Ljava/lang/String;)V", placeId);
            }else if(cc.sys.os == cc.sys.OS_IOS){

            }
        },

        logEventLogin(uid) {
            if(cc.sys.os == cc.sys.OS_ANDROID){
                return jsb.reflection.callStaticMethod(PACKAGENAME, "logLogin","(Ljava/lang/String;)V", uid);
            }else if(cc.sys.os == cc.sys.OS_IOS){

            }
        },
    }
});