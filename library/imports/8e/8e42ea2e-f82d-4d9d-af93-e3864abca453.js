"use strict";
cc._RF.push(module, '8e42eou+C1Nna+T44ZKvKRT', 'ButtonSafe');
// scripts/framework/common/ButtonSafe.js

/**
 * Created by skyxu on 2018/9/12.
 */

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        safeTime: {
            default: 0.5,
            tooltip: "按钮保护时间，指定间隔内只能点击一次."
        }
    },

    start: function start() {
        var _this = this;

        var button = this.getComponent(cc.Button);
        if (!button) {
            return;
        }

        this.clickEvents = button.clickEvents;

        this.node.on('click', function () {
            button.clickEvents = [];
            _this.scheduleOnce(function (dt) {
                button.clickEvents = _this.clickEvents;
            }, _this.safeTime);

            // mark: 这种方式会导致快速点击按钮时触摸穿透（按钮禁用时不再接受触摸事件）
            // let autoGrey = button.enableAutoGrayEffect;
            // button.enableAutoGrayEffect = false;
            // button.interactable = false;
            // this.scheduleOnce((dt)=>{
            //     button.enableAutoGrayEffect = autoGrey;
            //     button.interactable = true;
            // }, this.safeTime);
        }, this);
    }
});

cc._RF.pop();