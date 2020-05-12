/**
 * Created by skyxu on 2019/12/26.
 */

cc.Class({
    extends: cc.Component,

    statics: {
        alertNode: null,

        show (params) {
            cc.loader.loadRes("prefabs/common/Alert", (err, pf)=>{
                if (!err) {
                    if (cc.isValid(this.alertNode)) {
                        this.alertNode.destroy();
                    }
                    this.alertNode = cc.instantiate(pf);
                    this.alertNode.zIndex = zy.constData.ZIndex.ALERT;
                    this.alertNode.parent = zy.director.getUiRoot();
                    this.alertNode.getComponent("Alert").init(params);
                }
            })
        }
    },

    properties: {
        okBtn: cc.Node,
        cancleBtn: cc.Node,
        contentLabel: cc.Label,
    },

    init (params = {
        text: "",
        okText: "",
        cancleText: null,
        okCb: null,
        cancleCb: null,
    }) {
        this.contentLabel.string = params.text;
        this.okBtn.active = !!params.okText;
        this.okBtn.getComponentInChildren(cc.Label).string = params.okText ? params.okText : i18n.t("btn_ok");
        this.cancleBtn.active = !!params.cancleText;
        this.cancleBtn.getComponentInChildren(cc.Label).string = params.cancleText ? params.cancleText : i18n.t("btn_cancle");

        this.okCb = params.okCb;
        this.cancleCb = params.cancleCb;

        this.contentLabel._forceUpdateRenderData(true);
        let width = this.contentLabel.node.width;
        if (width > 400) {
            this.contentLabel.overflow = cc.Label.Overflow.SHRINK;
            this.contentLabel.node.width = 400;
            this.contentLabel.node.height = 260;
            this.contentLabel.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
        }
    },

    confirmCallback () {
        if (this.okCb) {
            this.okCb();
        }
        this.closeCallback();
    },

    cancleCallback () {
        if (this.cancleCb) {
            this.cancleCb();
        }
        this.closeCallback();
    },

    closeCallback () {
        this.node.destroy();
    },

    clean () {
        this.node.destroy();
    }

});