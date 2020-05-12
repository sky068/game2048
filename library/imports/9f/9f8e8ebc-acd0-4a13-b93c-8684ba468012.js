"use strict";
cc._RF.push(module, '9f8e868rNBKE7k8hoS6RoAS', 'Alert');
// scripts/framework/common/Alert.js

"use strict";

/**
 * Created by skyxu on 2019/12/26.
 */

cc.Class({
    extends: cc.Component,

    statics: {
        alertNode: null,

        show: function show(params) {
            var _this = this;

            cc.loader.loadRes("prefabs/common/Alert", function (err, pf) {
                if (!err) {
                    if (cc.isValid(_this.alertNode)) {
                        _this.alertNode.destroy();
                    }
                    _this.alertNode = cc.instantiate(pf);
                    _this.alertNode.zIndex = zy.constData.ZIndex.ALERT;
                    _this.alertNode.parent = zy.director.getUiRoot();
                    _this.alertNode.getComponent("Alert").init(params);
                }
            });
        }
    },

    properties: {
        okBtn: cc.Node,
        cancleBtn: cc.Node,
        contentLabel: cc.Label
    },

    init: function init() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
            text: "",
            okText: "",
            cancleText: null,
            okCb: null,
            cancleCb: null
        };

        this.contentLabel.string = params.text;
        this.okBtn.active = !!params.okText;
        this.okBtn.getComponentInChildren(cc.Label).string = params.okText ? params.okText : i18n.t("btn_ok");
        this.cancleBtn.active = !!params.cancleText;
        this.cancleBtn.getComponentInChildren(cc.Label).string = params.cancleText ? params.cancleText : i18n.t("btn_cancle");

        this.okCb = params.okCb;
        this.cancleCb = params.cancleCb;

        this.contentLabel._forceUpdateRenderData(true);
        var width = this.contentLabel.node.width;
        if (width > 400) {
            this.contentLabel.overflow = cc.Label.Overflow.SHRINK;
            this.contentLabel.node.width = 400;
            this.contentLabel.node.height = 260;
            this.contentLabel.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
        }
    },
    confirmCallback: function confirmCallback() {
        if (this.okCb) {
            this.okCb();
        }
        this.closeCallback();
    },
    cancleCallback: function cancleCallback() {
        if (this.cancleCb) {
            this.cancleCb();
        }
        this.closeCallback();
    },
    closeCallback: function closeCallback() {
        this.node.destroy();
    },
    clean: function clean() {
        this.node.destroy();
    }
});

cc._RF.pop();