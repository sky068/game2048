/**
 * Created by skyxu on 2019/11/28.
 */

cc.Class({
    extends: cc.Component,

    statics: {
        init: function () {
            this.alert = require('Alert');
            // this.mask = require('mask');
            this.loading = require('Loading');
            this.tip = require('Tip');
        },

        /**
         * 通用工具
         * 全场景查找节点
         */
        seekChildByName: function (node, name) {
            if (node.name == name) return node;

            for (const i in node.children) {
                const child = node.children[i];
                if (child) {
                    let res = zy.ui.seekChildByName(child, name);
                    if (res) return res;
                }
            }
        },

        /**
         * 通用UI效果
         */
        // 背景放大效果
        bgScaleAction: function (node, params = {}) {
            node.scale = 0.5;
            let seq = cc.sequence(
                cc.scaleTo(0.2, 1.0).easing(cc.easeSineOut()),
                cc.callFunc(function () {
                    if (params.callback) params.callback();
                }),
            );
            node.runAction(seq)
        },

        // 数字放大
        numScaleAction: function (node, params) {
            node.stopAllActions();
            let seq = cc.sequence(
                cc.scaleTo(0.1, 1.2).easing(cc.easeSineOut()),
                cc.scaleTo(0.1, 0.8).easing(cc.easeSineInOut()),
                cc.scaleTo(0.1, 1.1).easing(cc.easeSineInOut()),
                cc.scaleTo(0.1, 0.95).easing(cc.easeSineInOut()),
                cc.scaleTo(0.1, 1).easing(cc.easeSineInOut()),
            );
            node.runAction(seq)
        },

        // 按钮缩放效果
        btnScaleActoin: function (btnList) {
            for (const i in btnList) {
                let btn = btnList[i];
                let btnScale = btn.scale;
                btn.stopAllActions();
                btn.scale = btnScale / 4;
                btn.runAction(cc.sequence(
                    cc.scaleTo(0.12, btnScale + 0.1),
                    cc.scaleTo(0.08, btnScale - 0.1),
                    cc.scaleTo(0.08, btnScale),
                ));
            }
        },

        // 屏幕震动
        shakeScreen: function (params) {
            let node = params.node; // 节点
            let times = params.times ? params.times : 1; // 次数
            let offsetX = params.hasOwnProperty('offsetX') ? params.offsetX : 20; // 偏移宽度
            let offsetY = params.hasOwnProperty('offsetY') ? params.offsetY : 20; // 偏移高度
            let ratio = params.ratio ? params.ratio : 1; // 递增系数
            let rate = params.rate ? params.rate : 1 / 15; // 帧率

            // 原始Pos
            let basePosition = node.basePosition ? node.basePosition : node.position;
            node.stopAllActions();
            node.setPosition(basePosition);

            node.basePosition = basePosition;

            let actArray = [];

            let moveAction = cc.moveBy(rate, cc.v2(offsetX, offsetY)).easing(cc.easeOut(1.0));
            actArray.push(moveAction);

            for (let i = 0; i < times - 1; i++) {
                let moveAction_1 = cc.moveBy(rate, cc.v2(-offsetX * 2, -offsetY * 2)).easing(cc.easeOut(1.0));
                actArray.push(moveAction_1);

                let moveAction_2 = cc.moveBy(rate, cc.v2(offsetX * 3 / 2, offsetY * 3 / 2)).easing(cc.easeOut(1.0));
                actArray.push(moveAction_2);

                offsetX = offsetX / ratio;
                offsetY = offsetY / ratio;
            }

            let backAction = cc.moveTo(rate, basePosition).easing(cc.easeOut(1.0));
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
        flyNode: function (node, parent, startPos, endPos, num, cb) {
            if (num <= 0) {
                return;
            }
            startPos = parent.convertToNodeSpaceAR(startPos);
            endPos = parent.convertToNodeSpaceAR(endPos);
            let count = 0;
            for (let i=0; i<num; i++) {
                let flyNode = cc.instantiate(node);
                flyNode.position = startPos;
                flyNode.parent = parent;

                let midPos = startPos.add(endPos).div(2); // 起始点中心点的坐标
                let midPosVec = midPos.sub(startPos); // 中心点到起点的向量

                // 向量最多旋转50度，间隔5度一个单位，最多旋转180度
                let rotate = Math.round(Math.random()*10) * 5 * (Math.random()>0.5?1:-1); // 向量随机旋转角度
                let desPosVec = midPosVec.rotate(rotate * Math.PI / 180);
                let desPos = startPos.add(desPosVec);
                let distance = Math.sqrt(Math.pow(endPos.x-startPos.x, 2) + Math.pow(endPos.y-startPos.y, 2));

                // 执行贝塞尔曲线
                let bezierList = [desPos, desPos, endPos];
                let bezier = cc.bezierTo(distance/3000 + Math.random()*0.5, bezierList);
                let seq = cc.sequence(bezier, cc.callFunc(()=>{
                    count ++;
                    if (cb) {
                        cb (count >= num);
                    }
                    flyNode.destroy();
                }));

                flyNode.runAction(seq);
            }

        }
    }
});