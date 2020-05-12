/**
 * Created by skyxu on 2019/12/17.
 */
const AFLogger = require("./AFLogger");
const FBLogger = require("./FBLogger");
const TrackingLogger = require("./TrackingLogger");
const RangerLogger = require("./RangerLogger");

let LogHelper = cc.Class({
    statics: {
        logEventWatchAds(placeId) {
            if (CHANNEL_ID == 101 || CHANNEL_ID == 102) {
                // 国外安卓 iOS
                AFLogger.logEventWatchAds(placeId);
                FBLogger.logEventWatchAds(placeId);
            } else if (CHANNEL_ID == 201 || CHANNEL_ID == 201) {
                // 国内安卓 iOS
                TrackingLogger.logEventWatchAds(placeId);
                RangerLogger.logEventWatchAds(placeId);
            }
        },

        logEventLogin(uid) {
            if (CHANNEL_ID == 101) {
                // 国外安卓

            } else if (CHANNEL_ID == 102) {
                // 国外iOS
            } else if (CHANNEL_ID == 201 || CHANNEL_ID == 202) {
                // 国内安卓 iOS
                TrackingLogger.logEventLogin(uid);
                RangerLogger.logEventLogin(uid);
            }
        }
    }
});

zy.LogHelper = LogHelper;