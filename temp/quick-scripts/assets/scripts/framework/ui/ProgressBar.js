(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/framework/ui/ProgressBar.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7781cgsMwdAWZJB8Vw/YTXI', 'ProgressBar', __filename);
// scripts/framework/ui/ProgressBar.js

"use strict";

/**
 * Created by skyxu on 2019/12/9.
 *
 * 为cc.ProgressBar补充设置进度的过渡动画
 */

cc.Class({
    extends: cc.ProgressBar,

    /**
     * 设置进度
     * @param t
     * @param p
     * @param cb
     */
    setProgressBarToPercent: function setProgressBarToPercent(t, p, cb) {
        if (t <= 0) {
            this.progress = p;
            if (cb) {
                cb();
            }
            return;
        }
        this.unscheduleAllCallbacks(); // 若在进度中则停止重新开始
        this.speed = (p - this.progress) / t;
        this.desProgress = p;
        this.progressCb = cb;
        this.schedule(this.updateProgressBar.bind(this), 0);
    },
    updateProgressBar: function updateProgressBar(dt) {
        if (this.speed > 0 && this.progress < this.desProgress || this.speed < 0 && this.progress > this.desProgress) {
            this.progress += this.speed * dt;
        } else {
            this.progress = this.desProgress;
            this.unscheduleAllCallbacks();
            if (this.progressCb) {
                this.progressCb();
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
        //# sourceMappingURL=ProgressBar.js.map
        