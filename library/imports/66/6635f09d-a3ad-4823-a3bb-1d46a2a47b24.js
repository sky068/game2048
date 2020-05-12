"use strict";
cc._RF.push(module, '6635fCdo61II6O7HUaipHsk', 'LoggerHelper');
// scripts/framework/platform/LoggerHelper.js

"use strict";

/**
 * Created by skyxu on 2019/12/17.
 */
var AFLogger = require("./AFLogger");
var FBLogger = require("./FBLogger");
var TrackingLogger = require("./TrackingLogger");
var RangerLogger = require("./RangerLogger");

var LogHelper = cc.Class({
    statics: {
        logEventWatchAds: function logEventWatchAds(placeId) {
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
        logEventLogin: function logEventLogin(uid) {
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

cc._RF.pop();