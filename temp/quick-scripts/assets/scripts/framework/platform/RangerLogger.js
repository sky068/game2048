(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/framework/platform/RangerLogger.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '972dd3so6xBQbKfwz5fE+GK', 'RangerLogger', __filename);
// scripts/framework/platform/RangerLogger.js

"use strict";

/**
 * Created by skyxu on 2019/12/18.
 *
 * 头条sdk
 */

var PACKAGENAME = "com/zygame/utils/RangerAppLogHelper";

cc.Class({
    statics: {
        logEventWatchAds: function logEventWatchAds(placeId) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                return jsb.reflection.callStaticMethod(PACKAGENAME, "logEvent", "(Ljava/lang/String;)V", placeId);
            } else if (cc.sys.os == cc.sys.OS_IOS) {}
        },
        logEventLogin: function logEventLogin(uid) {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                return jsb.reflection.callStaticMethod(PACKAGENAME, "logLogin", "(Ljava/lang/String;)V", uid);
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
        //# sourceMappingURL=RangerLogger.js.map
        