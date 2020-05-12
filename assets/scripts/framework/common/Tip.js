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
        show (text) {
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
            }.bind(this))
        },
    },

    onLoad() {
        // 原始大小
        this.originalWidth = this.tipBg.width;
        this.originalHeight = this.tipBg.height;

        this.tipBg.opacity = 0;
        this.tipLabel.string = '';
    },

    init(text) {
        this.text = text;

        this.node.y = 0;
        this.tipLabel.string = this.text;

        if (this.tipLabel.node.height > this.originalHeight) {
            this.tipBg.height = this.tipLabel.node.height + 50;
        }

        let seq = cc.sequence(
            cc.spawn(cc.moveBy(0.25, cc.v2(0, 100)), cc.fadeIn(0.25)),
            cc.delayTime(1.25),
            cc.spawn(cc.moveBy(0.25, cc.v2(0, 100)), cc.fadeOut(0.25)),
            cc.callFunc(function () {
                this.node.destroy();
            }.bind(this)),
        );

        this.tipBg.runAction(seq);
    }

});