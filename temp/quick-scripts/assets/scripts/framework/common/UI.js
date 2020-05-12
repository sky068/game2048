(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/framework/common/UI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3d0d8pVBVlMerkrdm4ogFdE', 'UI', __filename);
// scripts/framework/common/UI.js

'use strict';

/**
 * Created by skyxu on 2019/11/28.
 */

cc.Class({
    extends: cc.Component,

    statics: {
        init: function init() {
            this.alert = require('Alert');
            // this.mask = require('mask');
            this.loading = require('Loading');
            this.tip = require('Tip');
        },

        /**
         * 通用工具
         * 全场景查找节点
         */
        seekChildByName: function seekChildByName(node, name) {
            if (node.name == name) return node;

            for (var i in node.children) {
                var child = node.children[i];
                if (child) {
                    var res = zy.ui.seekChildByName(child, name);
                    if (res) return res;
                }
            }
        },

        /**
         * 通用UI效果
         */
        // 背景放大效果
        bgScaleAction: function bgScaleAction(node) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            node.scale = 0.5;
            var seq = cc.sequence(cc.scaleTo(0.2, 1.0).easing(cc.easeSineOut()), cc.callFunc(function () {
                if (params.callback) params.callback();
            }));
            node.runAction(seq);
        },

        // 数字放大
        numScaleAction: function numScaleAction(node, params) {
            node.stopAllActions();
            var seq = cc.sequence(cc.scaleTo(0.1, 1.2).easing(cc.easeSineOut()), cc.scaleTo(0.1, 0.8).easing(cc.easeSineInOut()), cc.scaleTo(0.1, 1.1).easing(cc.easeSineInOut()), cc.scaleTo(0.1, 0.95).easing(cc.easeSineInOut()), cc.scaleTo(0.1, 1).easing(cc.easeSineInOut()));
            node.runAction(seq);
        },

        // 按钮缩放效果
        btnScaleActoin: function btnScaleActoin(btnList) {
            for (var i in btnList) {
                var btn = btnList[i];
                var btnScale = btn.scale;
                btn.stopAllActions();
                btn.scale = btnScale / 4;
                btn.runAction(cc.sequence(cc.scaleTo(0.12, btnScale + 0.1), cc.scaleTo(0.08, btnScale - 0.1), cc.scaleTo(0.08, btnScale)));
            }
        },

        // 屏幕震动
        shakeScreen: function shakeScreen(params) {
            var node = params.node; // 节点
            var times = params.times ? params.times : 1; // 次数
            var offsetX = params.hasOwnProperty('offsetX') ? params.offsetX : 20; // 偏移宽度
            var offsetY = params.hasOwnProperty('offsetY') ? params.offsetY : 20; // 偏移高度
            var ratio = params.ratio ? params.ratio : 1; // 递增系数
            var rate = params.rate ? params.rate : 1 / 15; // 帧率

            // 原始Pos
            var basePosition = node.basePosition ? node.basePosition : node.position;
            node.stopAllActions();
            node.setPosition(basePosition);

            node.basePosition = basePosition;

            var actArray = [];

            var moveAction = cc.moveBy(rate, cc.v2(offsetX, offsetY)).easing(cc.easeOut(1.0));
            actArray.push(moveAction);

            for (var i = 0; i < times - 1; i++) {
                var moveAction_1 = cc.moveBy(rate, cc.v2(-offsetX * 2, -offsetY * 2)).easing(cc.easeOut(1.0));
                actArray.push(moveAction_1);

                var moveAction_2 = cc.moveBy(rate, cc.v2(offsetX * 3 / 2, offsetY * 3 / 2)).easing(cc.easeOut(1.0));
                actArray.push(moveAction_2);

                offsetX = offsetX / ratio;
                offsetY = offsetY / ratio;
            }

            var backAction = cc.moveTo(rate, basePosition).easing(cc.easeOut(1.0));
            actArray.push(backAction);

            node.runAction(cc.sequence(actArray));
        },

        /**
         * 创建节点并飞到指定目标点
         * @param node 要飞的节点（比如金币等,可以是Node或者Prefab)
         * @param startPos {cc.Vec2} 起点坐标（注意要世界坐标）
         * @param endPos {cc.Vec2} 终点坐标 （注意要世界坐标）
         * @param num 创建的数量
         * @param cb 飞完结束的回调
         */
        flyNode: function flyNode(node, parent, startPos, endPos, num, cb) {
            if (num <= 0) {
                return;
            }
            startPos = parent.convertToNodeSpaceAR(startPos);
            endPos = parent.convertToNodeSpaceAR(endPos);
            var count = 0;

            var _loop = function _loop(i) {
                var flyNode = cc.instantiate(node);
                flyNode.position = startPos;
                flyNode.parent = parent;

                var midPos = startPos.add(endPos).div(2); // 起始点中心点的坐标
                var midPosVec = midPos.sub(startPos); // 中心点到起点的向量

                // 向量最多旋转50度，间隔5度一个单位，最多旋转180度
                var rotate = Math.round(Math.random() * 10) * 5 * (Math.random() > 0.5 ? 1 : -1); // 向量随机旋转角度
                var desPosVec = midPosVec.rotate(rotate * Math.PI / 180);
                var desPos = startPos.add(desPosVec);
                var distance = Math.sqrt(Math.pow(endPos.x - startPos.x, 2) + Math.pow(endPos.y - startPos.y, 2));

                // 执行贝塞尔曲线
                var bezierList = [desPos, desPos, endPos];
                var bezier = cc.bezierTo(distance / 3000 + Math.random() * 0.5, bezierList);
                var seq = cc.sequence(bezier, cc.callFunc(function () {
                    count++;
                    if (cb) {
                        cb(count >= num);
                    }
                    flyNode.destroy();
                }));

                flyNode.runAction(seq);
            };

            for (var i = 0; i < num; i++) {
                _loop(i);
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
        //# sourceMappingURL=UI.js.map
        