/**
 * Created by skyxu on 2019/11/27.
 */

const PopBase = cc.Class({
    extends: cc.Component,

    properties: {
        maskOpacity: 255, // 遮罩透明度
        touchClose: true, // 触摸关闭
    },

    initBase: function (params, popName) {
        if (CC_EDITOR) return;

        // 将代码传入的popName作为本模块名称
        this.popName = popName;

        // 逻辑组件名称
        this.componentName = null;
        this.component = null;
        const popNameSpArr = this.popName.split('/');
        if (popNameSpArr.length > 0) {
            this.componentName = popNameSpArr[popNameSpArr.length - 1];
            this.component = this.node.getComponent(this.componentName);
        }

        // 开启、关闭回调
        this.onLaunchedCallback = params.onLaunchedCallback;
        this.onClosedCallback = params.onClosedCallback;

        // 添加遮罩
        zy.Button.createNode({
            name: 'maskBtn',
            zIndex: zy.constData.ZIndex.POP_MASK,
            parent: this.node,
            url: 'textures/common/mask',
            touchAction: false,
            commonClickAudio: false,
            opacity: this.maskOpacity,
            width: zy.constData.DesignSize.width * 5,
            height: zy.constData.DesignSize.height * 5,
            eventHandler: {
                target: this.node,
                component: this.componentName,
                customEventData: this.componentName,
                handler: this.touchClose ? 'closeCallback' : null, // 操作
            }
        });
        // // 添加遮罩
        // let btnNode = new cc.Node();
        // let sp = btnNode.addComponent(cc.Sprite);
        // cc.loader.loadRes("textures/common/mask", cc.SpriteFrame, (err, spf)=>{
        //     if (!err) {
        //         sp.spriteFrame = spf;
        //         // mark: 需要在这里设置大小
        //         btnNode.width = zy.constData.DesignSize.width * 2;
        //         btnNode.height = zy.constData.DesignSize.height * 2;
        //     }
        // });
        // btnNode.name = "maskBtn";
        // btnNode.zIndex = zy.constData.ZIndex.POP_MASK;
        // btnNode.parent = this.node;
        // let clickEventHandler = new cc.Component.EventHandler();
        // clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
        // clickEventHandler.component = this.componentName;//这个是代码文件名
        // clickEventHandler.customEventData = this.componentName;
        // clickEventHandler.handler = this.touchClose ? 'closeCallback' : null; // 操作;
        // let btn = btnNode.addComponent(cc.Button);
        // btn.clickEvents.push(clickEventHandler);

        if (this.onLaunchedCallback) {
            this.onLaunchedCallback();
        }

        // 初始化pop popName传给控制脚本
        this.component.popName = this.popName;

        if (this.component.init) {
            this.component.init(params);
        }
    },

    cleanBase: function () {
        // 释放
        if (this.component && this.component.clean) {
            this.component.clean();
        }

        if (cc.isValid(this.node)) {
            this.node.destroy();
        }

        if (this.onClosedCallback) {
            this.onClosedCallback();
        }
    },

});

zy.PopBase = module.exports = PopBase;