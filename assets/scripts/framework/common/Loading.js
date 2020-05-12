/**
 * Created by skyxu on 2019/11/28.
 */

let Loading = cc.Class({
    extends: cc.Component,

    statics: {
        // loading
        loadingNode: null,
        loadingComponent: null,

        // 显示Loading
        show: function (loadingName) {
            if (!cc.isValid(this.loadingNode)) {
                this.loadingNode = zy.Node.createNode({
                    name: 'loading',
                    width: zy.constData.DesignSize.width * 2,
                    height: zy.constData.DesignSize.width * 2,
                    zIndex: zy.constData.ZIndex.LOADING,
                    parent: zy.director.getUiRoot(),
                });
                this.loadingComponent = this.loadingNode.addComponent('Loading');
                this.loadingComponent.init();
            }

            this.loadingComponent.show(loadingName);

        },

        // 隐藏Loading
        hide: function (loadingName) {
            if (cc.isValid(this.loadingNode)) {
                this.loadingComponent.hide(loadingName);
            }
        },
    },

    properties: {},

    init: function () {
        // 当前显示的loading列表
        this.loadingList = [];

        // 控制触摸
        this.node.width = zy.constData.DesignSize.width * 2;
        this.node.height = zy.constData.DesignSize.height * 2;
        this.node.addComponent(cc.BlockInputEvents);

        // 黑色遮罩
        this.maskNode = zy.Sprite.createNode({
            name: 'maskNode',
            url: 'textures/common/mask',
            parent: this.node,
            size: cc.size(zy.constData.DesignSize.width * 2, zy.constData.DesignSize.height * 2),
            loadCallback: function (err, node) {
                node.width = zy.constData.DesignSize.width * 2;
                node.height = zy.constData.DesignSize.height * 2;
            }.bind(this),
        });

        // todo: loading动画
        zy.Label.createNode({
            string: "Loading...",
            parent: this.maskNode,
            systemFont: false,
        });
        this.maskNode.active = false;
    },

    show: function (name) {
        // 存在当前loading
        if (this.loadingList.indexOf(name) == -1) {
            this.loadingList.push(name);
        }

        this.node.active = true;

        this.node.stopAllActions();

        let delaySeq = cc.sequence(
            cc.delayTime(1), // 先有遮罩一秒钟后才触发loading,
            cc.callFunc(function () {
                this.delaySeq = null;
                this.maskNode.active = true;
            }.bind(this))
        );

        this.node.runAction(delaySeq);
    },

    hide: function (name) {
        // 存在当前loading
        const index = this.loadingList.indexOf(name);
        if (index > -1) {
            this.loadingList.splice(index, 1);
        }

        if (this.loadingList.length == 0) {
            this.node.active = false;
            this.maskNode.active = false;
        }
    },

    clean: function () {
        this.node.active = false;
        this.loadingList = [];
    }
});