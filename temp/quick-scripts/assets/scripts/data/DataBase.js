(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/data/DataBase.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '4bc8dkqHTBMcaHi1VJ5zUzI', 'DataBase', __filename);
// scripts/data/DataBase.js

"use strict";

/**
 * Created by skyxu on 2019/11/26.
 */

cc.Class({
    ctor: function ctor() {
        this.dataObj = null;
        this.fileDir = ""; // 配置文件路径
    },
    initData: function initData(data) {
        if (!data) {
            return;
        }

        this.dataObj = data;
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
        //# sourceMappingURL=DataBase.js.map
        