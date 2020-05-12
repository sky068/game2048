(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/framework/platform/AFLogger.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '25e69AZ0/xDH7MCLjFyNBxu', 'AFLogger', __filename);
// scripts/framework/platform/AFLogger.js

"use strict";

/**
 * Created by skyxu on 2019/11/25.
 */
/**
 * Created by skyxu on 2019/11/20.
 *
 * appflyer 应用事件上报
 */
var PACKAGENAMEFB = "com/zygame/utils/AFHelper";

cc.Class({
    statics: {
        /**
         * 上报当前等级
         * @param level{Integer}
         * @returns {*}
         */
        logEventLevel: function logEventLevel(level) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                return jsb.reflection.callStaticMethod(PACKAGENAMEFB, "trackEventLevel", "(I)V", level);
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("AppsFlyerHelper", "trackEventLevel", level);
            }
        },

        /**
         * 上报观看广告
         * @param adName{String} 广告位id
         * @returns {*}
         */
        logEventWatchAds: function logEventWatchAds(adName) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod(PACKAGENAMEFB, "trackEventWatchAD", "(Ljava/lang/String;)V", adName);
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("AppsFlyerHelper", "trackEventWatchAds", adName);
            }
        },

        /**
         * 上报点击按钮
         * @param btName{Stirng} 按钮id
         * @returns {*}
         */
        logEventClickButton: function logEventClickButton(btName) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod(PACKAGENAMEFB, "trackEventClickButton", "(Ljava/lang/String;)V", btName);
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("AppsFlyerHelper", "trackEventClickButton", btName);
            }
        },

        /**
         * 上报自定义事件
         * @param key{String}
         * @param value{String}
         * @returns {*}
         */
        logEvent: function logEvent(key, value) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod(PACKAGENAMEFB, "trackEvent", "(Ljava/lang/String;Ljava/lang/String;)V", key, value);
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                jsb.reflection.callStaticMethod("AppsFlyerHelper", "trackEvent:withValue:", key, value);
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
        //# sourceMappingURL=AFLogger.js.map
        