(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/framework/ui/ProgressCircle.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '84313JeWl9JKJA3YMCZTbFD', 'ProgressCircle', __filename);
// scripts/framework/ui/ProgressCircle.js

"use strict";

/**
 * Created by skyxu on 2019/12/27.
 *
 *  圆形进度条
 *  把bar 的填充模式设为 cc.Sprite.Type.FILLED
 *  fillStart系统默认0从右侧为起点，一般我们设置为0.25从正上方为起点开始
 *  fillCenter系统默认是(0, 0)，一般我们设为(0.5, 0.5)
 *
 */

cc.Class({
    extends: cc.Component,
    properties: {
        bar: cc.Sprite,
        progress: {
            default: 0,
            min: 0,
            max: 1,
            notify: function notify() {
                this._updateProgress();
            }
        }
    },

    _updateProgress: function _updateProgress() {
        if (!this.bar || this.bar.type != cc.Sprite.Type.FILLED) {
            cc.log("圆形进度条的bar必须设为filled模式。");
            return;
        }
        this.bar.fillRange = this.progress;
    },


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
        //# sourceMappingURL=ProgressCircle.js.map
        