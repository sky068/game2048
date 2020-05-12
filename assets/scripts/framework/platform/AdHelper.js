/**
 * Created by skyxu on 2019/12/17.
 */

let AdHelper = cc.Class({
    statics: {
        initAdSdk() {
            if (CHANNEL_ID == 101 || CHANNEL_ID == 102) {
                zy.UpltvHelper.initUpltv((ret)=>{
                    cc.log("===upltv init: " + ret);
                    if (ret) {
                        zy.UpltvHelper.setloadRdADCb();
                    }
                });
            } else if (CHANNEL_ID == 201 || CHANNEL_ID == 202) {
            }
        },

        isInterstitialReady(placeId) {
            if (CHANNEL_ID == 101 || CHANNEL_ID == 102) {
                return zy.UpltvHelper.isInterstitialReady(placeId);
            } else if (CHANNEL_ID == 201 || CHANNEL_ID == 202) {
                return zy.OpenAdsHelper.isIntersitialReady(placeId);
            }
        },

        showInterstitialAds(placeId) {
            if (CHANNEL_ID == 101 || CHANNEL_ID == 102) {
                zy.UpltvHelper.showInterstitial(placeId, null);
                zy.LogHelper.logEventWatchAds(placeId);
            } else if (CHANNEL_ID == 201 || CHANNEL_ID == 202) {
                zy.OpenAdsHelper.showInterstitialAds(placeId);
                zy.LogHelper.logEventWatchAds(placeId);
            }
        },

        isRdAdsReady(placeId) {
            if (CHANNEL_ID == 101 || CHANNEL_ID == 102) {
                return zy.UpltvHelper.rdADIsReady();
            } else if (CHANNEL_ID == 201 || CHANNEL_ID == 202) {
                return zy.OpenAdsHelper.isRdAdsReady(placeId);
            }
        },

        showRdAds(placeId, cb) {
            this.gotRdCall = cb;
            if (CHANNEL_ID == 101 || CHANNEL_ID == 102) {
                zy.UpltvHelper.rdAdShow(placeId);
            } else if (CHANNEL_ID == 201 || CHANNEL_ID == 202) {
                zy.OpenAdsHelper.showRdAds(placeId);
            }
            zy.AdHelper.pauseGame();
        },

        // --------native 回调js-------
        onOpenAdsReward(placeId, ret) {
            cc.log("===>js收到视频激励回调:" + placeId + ", " + ret);
            cc.log("===> typeof ret: " + typeof ret);
            if (this.gotRdCall) {
                this.gotRdCall(ret);
                this.gotRdCall = null;
            }
            if (ret) {
                zy.LogHelper.logEventWatchAds(placeId);
            }

            zy.AdHelper.resumeGame();
        },

        pauseGame() {
            cc.game.pause();
            zy.audioMng.pauseMusic();
        },

        resumeGame() {
            cc.game.resume();
            zy.audioMng.resumeMusic();
        }
    }
});

zy.AdHelper = AdHelper;