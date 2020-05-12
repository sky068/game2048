(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Cell.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '567e3eDBHBGNrXIk7TU2HRo', 'Cell', __filename);
// scripts/Cell.js

"use strict";

/**
 * Created by xujiawei on 2020-05-07 18:49:14
 */

cc.Class({
    extends: cc.Component,
    properties: {
        numLabel: cc.Label,
        num: {
            default: 0,
            notify: function notify() {
                this.numLabel.string = this.num;
                this.node.opacity = this.num == 0 ? 0 : 255;
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
        //# sourceMappingURL=Cell.js.map
        