/**
 * Created by skyxu on 2019/12/17.
 *
 * 穿山甲广告sdk
 */

const PACKAGENAMEFB = "com/zygame/utils/OpenAdsHelper";
const CLASSNAME = "BuAdHelper";

let OpenAdsHelper = cc.Class({
    statics: {
        showInterstitialAds(placeId) {
            if(cc.sys.os == cc.sys.OS_ANDROID){
                placeId = zy.constData.OpenAdsKey[placeId];
                return jsb.reflection.callStaticMethod(PACKAGENAMEFB, "showInteractionAds","(Ljava/lang/String;)V", placeId);
            }else if(cc.sys.os == cc.sys.OS_IOS){
                placeId = zy.constData.OpenAdsKeyIOS[placeId];
                return jsb.reflection.callStaticMethod(CLASSNAME,"showInteractionAds:", placeId);
            }
        },

        isIntersitialReady(placeId) {
            if(cc.sys.os == cc.sys.OS_ANDROID){
                placeId = zy.constData.OpenAdsKey[placeId];
                return jsb.reflection.callStaticMethod(PACKAGENAMEFB, "isInteractionReady","(Ljava/lang/String;)Z", placeId);
            }else if(cc.sys.os == cc.sys.OS_IOS){
                placeId = zy.constData.OpenAdsKeyIOS[placeId];
                return jsb.reflection.callStaticMethod(CLASSNAME,"isInteractionReady:", placeId);
            }
        },

        loadIntersitialAds(placeId) {
            if(cc.sys.os == cc.sys.OS_ANDROID){
                placeId = zy.constData.OpenAdsKey[placeId];
                return jsb.reflection.callStaticMethod(PACKAGENAMEFB, "loadExpressAd","(Ljava/lang/String;)V", placeId);
            }else if(cc.sys.os == cc.sys.OS_IOS){
                placeId = zy.constData.OpenAdsKeyIOS[placeId];
                return jsb.reflection.callStaticMethod(CLASSNAME,"loadExpressAd:", placeId);
            }
        },

        isRdAdsReady(placeId) {
            if(cc.sys.os == cc.sys.OS_ANDROID){
                placeId = zy.constData.OpenAdsKey[placeId];
                return jsb.reflection.callStaticMethod(PACKAGENAMEFB, "isRewardAdsReady","(Ljava/lang/String;)Z", placeId);
            }else if(cc.sys.os == cc.sys.OS_IOS){
                placeId = zy.constData.OpenAdsKeyIOS[placeId];
                return jsb.reflection.callStaticMethod(CLASSNAME,"isRewardAdsReady:", placeId);
            }

            return false;
        },

        loadRdAds(placeId) {
            if(cc.sys.os == cc.sys.OS_ANDROID){
                placeId = zy.constData.OpenAdsKey[placeId];
                return jsb.reflection.callStaticMethod(PACKAGENAMEFB, "loadRewardAds","(Ljava/lang/String;)V", placeId);
            }else if(cc.sys.os == cc.sys.OS_IOS){
                placeId = zy.constData.OpenAdsKeyIOS[placeId];
                return jsb.reflection.callStaticMethod(CLASSNAME,"loadRewardAds:", placeId);
            }
        },

        showRdAds(placeId) {
            if(cc.sys.os == cc.sys.OS_ANDROID){
                placeId = zy.constData.OpenAdsKey[placeId];
                return jsb.reflection.callStaticMethod(PACKAGENAMEFB, "showRewardAds","(Ljava/lang/String;)V", placeId);
            }else if(cc.sys.os == cc.sys.OS_IOS){
                placeId = zy.constData.OpenAdsKeyIOS[placeId];
                return jsb.reflection.callStaticMethod(CLASSNAME,"showRewardAds:", placeId);
            }
        }
    }
});

zy.OpenAdsHelper = OpenAdsHelper;