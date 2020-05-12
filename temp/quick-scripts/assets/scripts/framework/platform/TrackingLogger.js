(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/framework/platform/TrackingLogger.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6f7dejhclFBULHAZ3Q42UcD', 'TrackingLogger', __filename);
// scripts/framework/platform/TrackingLogger.js

"use strict";

/**
 * Created by skyxu on 2019/12/17.
 *
 * 热云统计
 */

var PACKAGENAME = "com/zygame/utils/TrackingHelper";
var CLASSNAME = "AppController"; //appKey == 14fff86b99b68c943591338142fc9253  channel_id == _default_ 正式上线需要修改Appid 为下载地址的后面数字

cc.Class({
    statics: {
        // eventName必须为event_1到event_12 http://doc.trackingio.com/sdkwen-dang/android/androidsdk-jie-ru-shuo-ming-wen-dang.html
        logEventWatchAds: function logEventWatchAds(placeId) {
            var eventName = 'event_' + placeId[placeId.length - 1];
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                return jsb.reflection.callStaticMethod(PACKAGENAME, "logEvent", "(Ljava/lang/String;)V", eventName);
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                return jsb.reflection.callStaticMethod(CLASSNAME, "logEvent:", eventName);
            }
        },
        logEventLogin: function logEventLogin(uid) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                return jsb.reflection.callStaticMethod(PACKAGENAME, "logLogin", "(Ljava/lang/String;)V", uid);
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                return jsb.reflection.callStaticMethod(CLASSNAME, "logLogin:", uid);
            }
        },
        logEventRegister: function logEventRegister(uid) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                return jsb.reflection.callStaticMethod(PACKAGENAME, "logRegister", "(Ljava/lang/String;)V", uid);
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                return jsb.reflection.callStaticMethod(CLASSNAME, "logRegister:", uid);
            }
        }
    }
});

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
        //# sourceMappingURL=TrackingLogger.js.map
        