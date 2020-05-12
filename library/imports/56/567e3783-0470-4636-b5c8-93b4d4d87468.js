"use strict";
cc._RF.push(module, '567e3eDBHBGNrXIk7TU2HRo', 'Cell');
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