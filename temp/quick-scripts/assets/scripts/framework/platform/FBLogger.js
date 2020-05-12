(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/framework/platform/FBLogger.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'dce77Wl/ahBRrf7Vl0Wh2d/', 'FBLogger', __filename);
// scripts/framework/platform/FBLogger.js

"use strict";

/**
 * Created by skyxu on 2019/11/20.
 *
 * facebook应用事件上报
 */
var PACKAGENAMEFB = "com/zygame/utils/FBHelper";

cc.Class({
    statics: {
        /**
         * 上报当前等级
         * @param level{Integer}
         * @returns {*}
         */
        logEventLevel: function logEventLevel(level) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                return jsb.reflection.callStaticMethod(PACKAGENAMEFB, "logEventLevel", "(I)V", level);
            } else if (cc.sys.os == cc.sys.OS_IOS) {}
        },

        /**
         * 上报观看广告
         * @param adName{String} 广告位id
         * @returns {*}
         */
        logEventWatchAds: function logEventWatchAds(adName) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                return jsb.reflection.callStaticMethod(PACKAGENAMEFB, "logEventWatchAD", "(Ljava/lang/String;)V", adName);
            } else if (cc.sys.os == cc.sys.OS_IOS) {}
        },

        /**
         * 上报点击按钮
         * @param btName{Stirng} 按钮id
         * @returns {*}
         */
        logEventClickButton: function logEventClickButton(btName) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                return jsb.reflection.callStaticMethod(PACKAGENAMEFB, "logEventClickButton", "(Ljava/lang/String;)V", btName);
            } else if (cc.sys.os == cc.sys.OS_IOS) {}
        },

        /**
         * 上报自定义事件 有kv参数
         * @param eventName{String}
         * @param key{String}
         * @param value{String}
         * @returns {*}
         */
        logEvent: function logEvent(eventName, key, value) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                return jsb.reflection.callStaticMethod(PACKAGENAMEFB, "logEvent", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", eventName, key, value);
            } else if (cc.sys.os == cc.sys.OS_IOS) {}
        },

        // 上报事件无参数
        logEventName: function logEventName(eventName) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                return jsb.reflection.callStaticMethod(PACKAGENAMEFB, "logEventName", "(Ljava/lang/String;)V", eventName);
            } else if (cc.sys.os == cc.sys.OS_IOS) {}
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
        //# sourceMappingURL=FBLogger.js.map
        