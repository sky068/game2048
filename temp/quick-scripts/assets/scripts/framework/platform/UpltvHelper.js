(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/framework/platform/UpltvHelper.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '41a16DjJLVAI7JimL0iu4o/', 'UpltvHelper', __filename);
// scripts/framework/platform/UpltvHelper.js

"use strict";

/**
 * Created by skyxu on 2019/11/21.
 */

var upltv = require("UPLTV").upltv;
cc.bridgeInterface = require("UPLTV").bridgeInterface;

var UpltvHelper = cc.Class({
    statics: {
        initUpltv: function initUpltv(cb) {
            // UPLTV 为 iOS 应用定义的发行地区(0，海外；1，中国大陆；2，根据 IP 自动定位区域), 无 iOS 应用时须填入0
            var iosZone = 2;
            upltv.initSdk(UPLTV_ANDROID_APPKEY, UPLTV_IOS_APPKEY, iosZone, function (r) {
                cc.log("===> js upltv intSdk result:, %s", r);
                if (cb) {
                    cb(r);
                }
                // 自动测试
                // upltv.autoOneKeyInspect();
            });
        },
        setloadRdADCb: function setloadRdADCb() {
            upltv.setRewardVideoLoadCallback(function (cpid, msg) {
                cc.log("===> js RewardVideo LoadCallback Success at: %s", cpid);
            }, function (cpid, msg) {
                cc.log("===> js RewardVideo LoadCallback Fail at: %s", cpid);
            });
        },


        // 手动加载广告
        loadAndroidAdsByManual: function loadAndroidAdsByManual() {
            cc.bridgeInterface.loadAndroidAdsByManual();
        },
        rdADIsReady: function rdADIsReady() {
            var r = upltv.isRewardReady();
            cc.log("===> js isRewardReady r: %s", r.toString());
            return r;
        },


        /**
         *
         * @param rewardPlaceId{String} 广告位id
         * @brief video_reward_1 体力
         * @brief video_reward_2 离线奖励翻倍
         * @brief video_reward_3 协同攻击
         * @brief video_reward_4 复活
         * @brief video_reward_5 关卡奖励翻倍
         * @brief video_reward_6 体验满星炮塔
         */
        rdAdShow: function rdAdShow(rewardPlaceId) {
            upltv.setRewardVideoShowCallback(function (type, cpid) {
                var event = "unkown";
                if (type == upltv.AdEventType.VIDEO_EVENT_DID_SHOW) {
                    event = "Did_Show";
                } else if (type == upltv.AdEventType.VIDEO_EVENT_DID_CLICK) {
                    event = "Did_Click";
                } else if (type == upltv.AdEventType.VIDEO_EVENT_DID_CLOSE) {
                    event = "Did_Close";
                    zy.AdHelper.resumeGame();
                } else if (type == upltv.AdEventType.VIDEO_EVENT_DID_GIVEN_REWARD) {
                    event = "Did_Given_Reward";

                    zy.httpProxy.watchAds(rewardPlaceId);
                    zy.AdHelper.onOpenAdsReward(rewardPlaceId, true);
                } else if (type == upltv.AdEventType.VIDEO_EVENT_DID_ABANDON_REWARD) {
                    event = "Did_Abandon_Reward";
                    zy.AdHelper.onOpenAdsReward(rewardPlaceId, false);
                }
                cc.log("===> js RewardVideo Show Callback, event: %s, at: %s", event, cpid);
            });

            var r = upltv.isRewardReady();
            cc.log("===> js isRewardReady r: %s", r);
            if (r == true) {
                cc.log("===> js showRewardVideo call");
                upltv.showRewardVideo(rewardPlaceId);
            }
        },
        showRewardDebugUI: function showRewardDebugUI() {
            upltv.showRewardDebugUI();
        },


        //-----------------插屏广告---------------
        setInterstitialLoadCallback: function setInterstitialLoadCallback(placeId, suc, fail) {
            upltv.setInterstitialLoadCallback(placeId, suc, fail);
        },
        isInterstitialReady: function isInterstitialReady(placeId) {
            var ret = upltv.isInterstitialReady(placeId);
            cc.log("===> js isInterstitialReady ret: %s", ret.toString());
            return ret;
        },


        /**
         *
         * @param placeId{String}广告位id interstitial_1 ...
         * @param cb
         */
        showInterstitial: function showInterstitial(placeId, cb) {
            upltv.setInterstitialShowCallback(placeId, cb);
            upltv.showInterstitialAd(placeId);
        },

        // 插屏广告测试页面
        showInterstitialDebugUI: function showInterstitialDebugUI() {
            upltv.showInterstitialDebugUI();
        }
    }
});

zy.UpltvHelper = UpltvHelper;

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
        //# sourceMappingURL=UpltvHelper.js.map
        