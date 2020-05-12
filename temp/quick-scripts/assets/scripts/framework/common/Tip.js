(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/framework/common/Tip.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6fc55rUrPFDxLyLc2cpq/Zh', 'Tip', __filename);
// scripts/framework/common/Tip.js

'use strict';

/**
 * Created by skyxu on 2019/11/28.
 */

cc.Class({
    extends: cc.Component,
    properties: {
        tipLabel: cc.Label,
        tipBg: cc.Node
    },

    statics: {
        tipNode: null,

        // 显示Tip
        show: function show(text) {
            cc.loader.loadRes('prefabs/common/Tip', cc.Prefab, function (err, prefab) {
                if (!err) {
                    if (cc.isValid(this.tipNode)) {
                        this.tipNode.destroy();
                    }
                    this.tipNode = cc.instantiate(prefab);
                    this.tipNode.zIndex = zy.constData.ZIndex.TIP;
                    this.tipNode.parent = zy.director.getUiRoot();
                    this.tipNode.getComponent('Tip').init(text);
                }
            }.bind(this));
        }
    },

    onLoad: function onLoad() {
        // 原始大小
        this.originalWidth = this.tipBg.width;
        this.originalHeight = this.tipBg.height;

        this.tipBg.opacity = 0;
        this.tipLabel.string = '';
    },
    init: function init(text) {
        this.text = text;

        this.node.y = 0;
        this.tipLabel.string = this.text;

        if (this.tipLabel.node.height > this.originalHeight) {
            this.tipBg.height = this.tipLabel.node.height + 50;
        }

        var seq = cc.sequence(cc.spawn(cc.moveBy(0.25, cc.v2(0, 100)), cc.fadeIn(0.25)), cc.delayTime(1.25), cc.spawn(cc.moveBy(0.25, cc.v2(0, 100)), cc.fadeOut(0.25)), cc.callFunc(function () {
            this.node.destroy();
        }.bind(this)));

        this.tipBg.runAction(seq);
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
        //# sourceMappingURL=Tip.js.map
        