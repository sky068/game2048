(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/scene/InitScene.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'be329An/tdHbbITHsY2sOVj', 'InitScene', __filename);
// scripts/scene/InitScene.js

'use strict';

/**
 * Created by skyxu on 2019/11/26.
 *
 * 初始化场景，处理游戏初始化等事务
 */
cc.Class({
        extends: cc.Component,
        properties: {},

        onLoad: function onLoad() {
                /**
                 * 更新包之后，删除热更新目录和记录
                 */

                if (cc.sys.isNative) {
                        var baseLocalVersion = cc.sys.localStorage.getItem('BASE_LOCAL_VERSION');
                        // 写本地版本记录
                        cc.sys.localStorage.setItem('BASE_LOCAL_VERSION', BASE_LOCAL_VERSION);
                        if (baseLocalVersion != '' && baseLocalVersion != BASE_LOCAL_VERSION) {
                                // 大版本更新，需要删除之前热更新版本内容
                                var path = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + HOT_UPDATE_SUB_PATH;
                                jsb.fileUtils.removeDirectory(path);
                                cc.log("大版本更新，path: " + path);
                                // 重启
                                cc.game.restart();
                        } else {
                                this.init();
                        }
                } else {
                        this.init();
                }

                cc.debug.setDisplayStats(DEBUG_OPEN); //隐藏左下方测试信息
        },
        init: function init() {
                window.i18n = require('./../framework/i18n/i18n');

                // 全局事件管理器
                zy.event = new cc.EventTarget();

                zy.utils = require("./../framework/common/UtilsOther");

                // http代理
                var HttpProxy = require("./../framework/net/HttpProxy");
                zy.httpProxy = new HttpProxy();

                // 固定配置信息
                zy.constData = require("./../data/ConstData");
                zy.constData.init();

                // shader工具
                zy.shaderUtils = require('./../framework/common/ShaderUtils');
                zy.shaderUtils.init();

                // 通用UI工具
                zy.ui = require('./../framework/common/UI');
                zy.ui.init();

                // 红点系统
                zy.cornerMng = require("./../framework/common/CornerMng");
                zy.cornerMng.init([]);

                // 设备信息
                zy.device = require('./../framework/common/Device');
                zy.device.init();

                // 音频管理
                zy.audio = require("./../framework/common/Audio");
                zy.audio.init();

                //--------以下放到最后处理-------
                zy.director = require("./../framework/common/Director");
                zy.director.init();

                // 配置表读取
                var DataMng = require("./../data/DataMng");
                zy.dataMng = new DataMng();
                zy.dataMng.loadDataFromLocalFile(function (c, t) {
                        cc.log("load local cfg: %d/%d", c, t);
                }, function () {
                        zy.director.loadScene("Game");
                });
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
        //# sourceMappingURL=InitScene.js.map
        