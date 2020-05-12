"use strict";
cc._RF.push(module, 'a2a55RhwyZHfo0GMcF0EnW3', 'Director');
// scripts/framework/common/Director.js

'use strict';

/**
 * Created by skyxu on 2019/11/27.
 */
cc.Class({
    extends: cc.Component,

    statics: {
        // scene的单例
        scene: null,
        // sceneCanvas
        sceneCanvas: null,
        // scene挂载组件
        sceneComponent: null,

        // FIX后台
        isBackground: null,
        toBackgroundOSTime: null,

        activePops: null,

        // 事件类型
        EventType: {
            ALL_SINGLE_POP_CLOSE: 'ALL_SINGLE_POP_CLOSE' // 所有独立的POP被关闭
        },

        init: function init(initComponent) {

            this.scene = null;
            this.sceneCanvas = null;
            this.sceneComponent = null;
            this.sceneName = null;
            this.uiRoot = null; // 多摄像机的情况下ui节点不能直接加到canvas上

            this.isBackground = false;

            // POP列表
            this.activePops = [];

            // 常驻节点列表
            this.persistRootNodeList = [];

            // 前后台事件处理
            cc.game.on(cc.game.EVENT_HIDE, this.onEventHide, this);
            cc.game.on(cc.game.EVENT_SHOW, this.onEventShow, this);

            // 微信小游戏事件处理
            if (cc.sys.platform == cc.sys.WECHAT_GAME) {
                wx.onShow(this.onWXGShow.bind(this));
                wx.onHide(this.onWXGHide.bind(this));
                // wx.exitMiniProgram({
                //     success: function (res) {
                //         cc.log("wx.exitMiniProgram-success:", res);
                //     },
                //     fail: function (res) {
                //         cc.log("wx.exitMiniProgram-fail:", res);
                //     }
                // })
            }

            // 键盘事件
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

            // Canvas渲染事件(截屏)
            cc.director.on(cc.Director.EVENT_AFTER_DRAW, this.onAfterDraw, this);

            // 设置屏幕旋转(H5)
            cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
            // cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);

            // 设置屏幕适配
            // this.initResolutionPolicy();
            // this.setSceneResolution(initComponent);

            // 屏幕改变回调
            cc.view.setResizeCallback(function () {
                cc.log('setResizeCallback');
                // this.initResolutionPolicy();
                // this.setSceneResolution(this.getSceneComponent());
            }.bind(this));
        },

        // initResolutionPolicy: function () {
        //     // 手机分辨率
        //     let frameSize = cc.view.getFrameSize();
        //
        //     let frameScale = frameSize.width / frameSize.height;
        //     let designScale = ConstData.DesignSize.width / ConstData.DesignSize.height;
        //     let designMaxScale = ConstData.DesignMaxSize.width / ConstData.DesignMaxSize.height;
        //
        //     // 场景canvas
        //     if (frameScale >= designScale) {
        //         // 默认设计分辨率
        //         zc.sceneResolution = ConstData.DesignSize;
        //     } else {
        //         if (frameScale <= designMaxScale) {
        //             // 最大适配高度
        //             zc.sceneResolution = ConstData.DesignMaxSize;
        //         } else {
        //             let targetHeight = Math.floor(ConstData.DesignMaxSize.width * frameSize.height / frameSize.width);
        //             zc.sceneResolution = cc.size(ConstData.DesignMaxSize.width, targetHeight);
        //         }
        //     }
        //     cc.view.setResolutionPolicy(cc.ResolutionPolicy.SHOW_ALL);
        //     // pop
        //     let adapterHeight = zc.sceneResolution.height - ConstData.AdapterDiffSize.height;
        //     if (adapterHeight >= ConstData.DesignSize.height) {
        //         // 刘海屏适配
        //         zc.popResolution = cc.size(zc.sceneResolution.width, adapterHeight);
        //     } else {
        //         // 默认设计分辨率
        //         zc.popResolution = ConstData.DesignSize;
        //     }
        //
        //     zc.frameWidth = frameSize.width;
        //     zc.frameHeight = frameSize.height;
        //     zc.frameCx = zc.frameWidth / 2;
        //     zc.frameCy = zc.frameHeight / 2;
        //
        //     zc.width = zc.popResolution.width;
        //     zc.height = zc.popResolution.height;
        //     zc.cx = zc.width / 2;
        //     zc.cy = zc.height / 2;
        //
        //     cc.log('---------------------------');
        //     cc.log('zc.frameWidth', zc.frameWidth);
        //     cc.log('zc.frameHeight', zc.frameHeight);
        //     cc.log('zc.width', zc.width);
        //     cc.log('zc.height', zc.height);
        //     cc.log('zc.cx', zc.cx);
        //     cc.log('zc.cy', zc.cy);
        //     cc.log('zc.sceneResolution.width', zc.sceneResolution.width);
        //     cc.log('zc.sceneResolution.height', zc.sceneResolution.height);
        //     cc.log('zc.popResolution.width', zc.popResolution.width);
        //     cc.log('zc.popResolution.height', zc.popResolution.height);
        //     cc.log('---------------------------');
        // },

        // 分辨率适配
        // setSceneResolution: function (component) {
        //     let cvs = component.node.getComponent(cc.Canvas);
        //
        //     let content = component.node.getChildByName('Content');
        //     if (content) {
        //         zc.director.setPopResolution(content);
        //     }
        //
        //     cvs.fitWidth = true;
        //     cvs.fitHeight = true;
        //     cvs.designResolution = zc.sceneResolution;
        // },

        // pop分辨率适配
        // setPopResolution: function (node, type) {
        //     type = type || ConstData.AdapterType.POP;
        //     if (type == ConstData.AdapterType.POP) {
        //         node.width = zc.popResolution.width;
        //         node.height = zc.popResolution.height;
        //     } else {
        //         node.width = zc.sceneResolution.width;
        //         node.height = zc.sceneResolution.height;
        //     }
        // },

        onEventHide: function onEventHide() {
            if (!this.isBackground) {

                this.isBackground = true;

                // 进入后台的时间
                this.toBackgroundOSTime = zy.utils.time();
                cc.log('进入后台:', this.toBackgroundOSTime);

                // zc.audio.pauseAll();
                // 游戏逻辑处理
                zy.dataMng.saveDataToLocal();
            }
        },

        onEventShow: function onEventShow() {
            if (this.isBackground) {

                this.isBackground = false;

                var toForegroundOSTime = zy.utils.time();
                var interval = toForegroundOSTime - this.toBackgroundOSTime;
                cc.log('进入前台-interval:', interval);

                // zc.timer.reduceCDAll(interval);

                // zc.audio.resumeAll();
            }
        },

        // 微信小游戏hide
        onWXGHide: function onWXGHide(res) {
            cc.log('onWXGHide', res);
        },

        // 微信小游戏show
        onWXGShow: function onWXGShow(res) {
            cc.log('onWXGShow', res);
        },

        // 按下
        onKeyDown: function onKeyDown(event) {
            cc.log('onKeyDown', event.keyCode);
            switch (event.keyCode) {
                // case cc.macro.KEY.back: { // 2.0
                case cc.macro.KEY.back:
                    {// 1.0
                        // ZCSDK.exitSDK();
                    }
            }
        },

        // 渲染回调
        onAfterDraw: function onAfterDraw() {
            // let base64 = canvas.toDataURL('image/jpeg', 0.9);
        },

        preloadScene: function preloadScene(sceneName, onProgress, onLoad) {
            cc.director.preloadScene(sceneName, onProgress, onLoad);
        },

        // 加载Scene
        loadScene: function loadScene(sceneName, params, onLaunched) {
            // 清除所有POP
            zy.director.closeAllPops();

            window[this.sceneName + 'Scene'] = null;

            cc.director.loadScene(sceneName, function () {
                cc.log('loadScene:', sceneName);

                this.scene = cc.director.getScene();
                this.sceneCanvas = this.scene.getChildByName('Canvas');
                this.uiRoot = this.sceneCanvas.getChildByName("UIRoot") || this.sceneCanvas;
                this.sceneName = sceneName;
                this.sceneComponent = this.sceneCanvas.getComponent(sceneName + 'Scene');
                if (this.sceneComponent) {
                    this.sceneComponent.sceneName = sceneName + 'Scene';
                    if (this.sceneComponent.init) {
                        this.sceneComponent.init(params);
                    }
                }

                window[this.sceneName + 'Scene'] = this.sceneComponent;

                if (onLaunched) {
                    onLaunched(this.scene, this.sceneCanvas, this.sceneComponent);
                }

                // 解决IOS web下不播放音频的问题
                // zc.audio.showIOSWebMask();
            }.bind(this));
        },

        // 获取当前Scene名字
        getSceneName: function getSceneName() {
            return this.sceneName ? this.sceneName : '';
        },

        // 获取Scene脚本
        getSceneComponent: function getSceneComponent() {
            return this.sceneComponent;
        },

        // 获取Scene
        getScene: function getScene() {
            return this.scene;
        },

        // 获取Scene Canvas
        getSceneCanvas: function getSceneCanvas() {
            return this.sceneCanvas;
        },

        // 获取ui根节点
        getUiRoot: function getUiRoot() {
            return this.uiRoot;
        },

        // 退出
        // logout: function (restart) {
        //
        //     zc.event.emit(zc.director.EventType.ACCOUNT_LOG_OUT); // 退出登录
        //
        //     // 清除Player
        //     data.clean();
        //
        //     // 清理网络
        //     zc.http.clean();
        //
        //     // 清理订单
        //     ZCSDK.clean();
        //
        //     // 清理大厅socket
        //     zc.ws.close(true);
        //
        //     // 清理助手
        //     zc.helper.clean();
        //
        //     // 清理引导
        //     zc.guide.clean();
        //
        //     // 停止音效
        //     zc.audio.clean();
        //
        //     // 恢复倍速
        //     cc.director.getScheduler().setTimeScale(1);
        //
        //     // 清理登录状态
        //     GAMEUID = '';
        //     GAMETOKEN = '';
        //     SERVERID = '';
        //     SERVERADDR = '';
        //     SERVERPORTS = '';
        //     SERVERTCPPORTS = '';
        //
        //     // 是否重启
        //     if (restart) {
        //         zc.director.restart();
        //     } else {
        //         // 资源
        //         zc.resourceManager.clean();
        //
        //         zc.director.loadScene('login');
        //     }
        //
        // },

        // 重启
        // restart: function () {
        //     // 清理各种事件
        //     cc.game.off(cc.game.EVENT_HIDE, this.onEventHide, this);
        //     cc.game.off(cc.game.EVENT_SHOW, this.onEventShow, this);
        //     cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        //
        //     // 微信小游戏事件处理
        //     if (cc.sys.platform == cc.sys.WECHAT_GAME) {
        //         wx.offShow(this.onWXGShow);
        //         wx.offHide(this.onWXGHide);
        //     }
        //
        //     // 资源
        //     zc.resourceManager.clean(true);
        //
        //     // 停止音效
        //     zc.audio.clean();
        //
        //     // 清理常驻节点
        //     zc.director.cleanPersistRootNode();
        //
        //     // 释放所有资源
        //     // cc.sys.garbageCollect();
        //
        //     cc.game.restart();
        // },

        // 加载Prefab
        createPop: function createPop(popName, params, prefab) {
            params = params || {};

            var componentName = '';
            var popNameSpArr = popName.split('/');
            if (popNameSpArr.length > 0) {
                componentName = popNameSpArr[popNameSpArr.length - 1];
            }

            cc.log('createPop:' + popName, componentName);
            if (this.isPopActive(popName)) {
                cc.log('当前POP已存在:' + popName);
                return;
            }

            var initFunc = function (prefab) {
                var popNode = cc.instantiate(prefab);
                popNode.position = cc.v2(0, 0);
                popNode.zIndex = this.getTopPopZIndex() + 10;

                popNode.parent = this.uiRoot;
                // 存到列表
                var popData = { popName: popName, popNode: popNode };
                this.activePops.push(popData);
                // POPBase
                var popBase = popNode.getComponent('PopBase');
                popData.popBase = popBase; // 存入数据

                popBase.initBase(params, popName);
                popData.popComponent = popBase.component;
            }.bind(this);

            // 如果传入了prefab，直接使用
            if (prefab) {
                initFunc(prefab);
            } else {
                // 加载 Prefab
                cc.loader.loadRes(popName, cc.Prefab, null, function (err, prefab) {
                    if (err) {
                        cc.log(popName + '加载失败', err);
                        // zc.ui.loading.hide('pop');
                        return;
                    }

                    initFunc(prefab);
                }.bind(this));
            }
        },

        // 获取最上层的POP
        getTopPopData: function getTopPopData(_topIndex) {
            var topIndex = _topIndex ? _topIndex : 1;
            return this.activePops[this.activePops.length - topIndex];
        },

        getTopPopZIndex: function getTopPopZIndex() {
            var topPop = this.getTopPopData();
            if (topPop) {
                return topPop.popNode.zIndex;
            }
            return zy.constData.ZIndex.POP_BASE;
        },

        // 获取POP数据
        getPopData: function getPopData(popName) {
            for (var i in this.activePops) {
                var popData = this.activePops[i];
                if (popData.popName == popName) {
                    return popData;
                }
            }
        },

        // 获取POP
        getPop: function getPop(popName) {
            var popData = this.getPopData(popName);
            if (popData) {
                return popData.popComponent;
            }
        },

        // POP是否存在
        isPopActive: function isPopActive(popName) {
            if (this.getPopData(popName)) {
                return true;
            }
            return false;
        },

        getActivePops: function getActivePops() {
            return this.activePops;
        },

        // 关闭Prefab
        closePop: function closePop(popName) {
            cc.log('closePop:' + popName);
            var popData = this.getPopData(popName);
            if (popData) {
                for (var i in this.activePops) {
                    var _popData = this.activePops[i];
                    if (popData == _popData) {
                        this.activePops.splice(i, 1);
                        break;
                    }
                }

                // POPBase
                var popBase = popData.popBase;
                popBase.cleanBase();

                // 当所有独立的POP被关闭
                if (this.activePops.length == 0 && !popBase.onClosedCallback) {
                    zy.event.emit(zy.director.EventType.ALL_SINGLE_POP_CLOSE);
                }
            }
        },

        // 关闭所有Prefab
        closeAllPops: function closeAllPops() {
            while (this.activePops.length > 0) {
                var idx = this.activePops.length - 1;
                var popData = this.activePops[idx];

                var popName = popData.popName;
                cc.log('closeAllPops:' + popName);

                this.activePops.splice(idx, 1);

                var popBase = popData.popBase;
                popBase.cleanBase();
            }

            this.activePops = [];
        },

        // 常驻节点数据
        addPersistRootNode: function addPersistRootNode(node) {
            cc.game.addPersistRootNode(node);

            this.persistRootNodeList.push(node);
        },

        // 清理常驻节点数据
        cleanPersistRootNode: function cleanPersistRootNode() {
            for (var index in this.persistRootNodeList) {
                var node = this.persistRootNodeList[index];
                cc.game.removePersistRootNode(node);
            }
        }

    }

});

cc._RF.pop();