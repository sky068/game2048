"use strict";
cc._RF.push(module, '758846ZgwpGZLjqN2ZhXxS8', 'Guide');
// scripts/framework/common/Guide.js

"use strict";

/**
 * Created by skyxu on 2019/12/12.
 */

/**
 * 引导配置
 */

// 引导全局开关
var OPEN_GUIDE = true;

var RENEW = {
    0: [1001, 1002], // 开始引导 滑动创建炮塔
    1: [1001, 1003, 1004], // 引导升级炮塔
    2: [1005, 1006, 1007, 1008, 1009], // 引导点击各技能按钮
    3: [1010, 1011], // 引导升级血量
    4: [1012, 1013] // 引导领取免费金币
};

var CFG = {};

// 引导点击炮塔升级按钮
CFG[1001] = function () {
    zy.guide.hit({
        name: "guide_button2",
        showMask: true,
        click: function click() {
            zy.guide.showNext();
        }
    });
};

// 引导拖动建造激光炮
CFG[1002] = function () {
    zy.guide.slideTower({
        name: "guide_weapon_2",
        showMask: true,
        click: function click() {
            zy.guide.showNext();
        }
    });
};

// 引导点击加特林
CFG[1003] = function () {
    zy.guide.hit({
        name: "guide_weapon_0",
        showMask: true,
        click: function click() {
            zy.guide.showNext();
        }
    });
};

// 引导点击升级按钮
CFG[1004] = function () {
    zy.guide.hit({
        name: "guide_upgradeBtn",
        showMask: true,
        click: function click() {
            zy.guide.showNext();
        }
    });
};

// 引导点击广告按钮加时间
CFG[1005] = function () {
    zy.guide.hit({
        name: "guide_skill_1",
        showMask: true,
        click: function click() {
            zy.guide.showNext();
        }
    });
};

// 引导点击技能1
CFG[1006] = function () {
    zy.guide.hit({
        name: "guide_skill_2",
        showMask: true,
        click: function click() {
            setTimeout(function () {
                zy.guide.showNext();
            }, 500);
        }
    });
};

// 引导点击技能2
CFG[1007] = function () {
    zy.guide.hit({
        name: "guide_skill_3",
        showMask: true,
        click: function click() {
            setTimeout(function () {
                zy.guide.showNext();
            }, 500);
        }
    });
};

// 引导点击技能3
CFG[1008] = function () {
    zy.guide.hit({
        name: "guide_button_add_time",
        showMask: true,
        click: function click() {
            setTimeout(function () {
                zy.guide.showNext();
            }, 500);
        }
    });
};

// 引导查看倒计时
CFG[1009] = function () {
    zy.guide.look({
        name: "guide_skill_progressBar",
        showMask: true,
        click: function click() {
            zy.guide.showNext();
            // let GameManager = require("GameManager");
            // GameManager.setGamePauseLogic(false);
        }
    });
};

// 主ui升级血量
CFG[1010] = function () {
    zy.guide.hit({
        name: "guide_button1",
        showMask: true,
        click: function click() {
            zy.guide.showNext();
        }
    });
};

// 升级血量
CFG[1011] = function () {
    zy.guide.hit({
        name: "guide_upgrade_hp",
        showMask: true,
        click: function click() {
            zy.guide.showNext();
        }
    });
};

// 主ui免费金币
CFG[1012] = function () {
    zy.guide.hit({
        name: "guide_button3",
        showMask: true,
        click: function click() {
            zy.guide.showNext();
        }
    });
};

CFG[1013] = function () {
    zy.guide.hit({
        name: "guide_free_coins",
        showMask: true,
        click: function click() {
            setTimeout(function () {
                zy.guide.showNext();
            }, 500);
        }
    });
};

cc.Class({
    extends: cc.Component,

    statics: {
        OPEN_GUIDE: OPEN_GUIDE,
        CFG: CFG,

        init: function init(params) {
            cc.log("===init guide: ", params);
            this.step = params.step; // 当前步数
            this.stepList = [];
            this.cb = null;

            if (this.step == 1001) {
                this.step = 0;
            }

            if (this.OPEN_GUIDE) {
                this.openStatus = true;
            } else {
                this.openStatus = false;
            }

            // if (this.OPEN_GUIDE && this.step == 0) {
            //     this.openStatus = true;
            // } else {
            //     this.openStatus = false;
            //     if (this.step < 8901) {
            //         this.step = 8901;
            //         // 告诉服务器
            //     }
            // }

            this.node = null;
            this.maskNode = null;
        },
        setStep: function setStep(step) {
            this.step = step;
        },
        setOpenStatus: function setOpenStatus(status) {
            this.openStatus = status;
        },
        getOpenStatus: function getOpenStatus() {
            return this.openStatus;
        },


        getNextStep: function getNextStep() {
            if (!zy.guide.getOpenStatus() || !OPEN_GUIDE) {
                return;
            }
            return this.stepList[0];
        },

        addStep: function addStep(step) {
            if (this.stepList.length == 0) {
                this.stepList.push(step);
            }
        },

        checkGuide: function checkGuide() {
            var data = RENEW[this.step];
            if (data) {
                this.stepList = zy.utils.clone(data);
                zy.guide.showNext();
            }
        },

        showNext: function showNext(step, node) {
            if (!zy.guide.getOpenStatus() || !OPEN_GUIDE) {
                return;
            }
            if (step) {
                this.CFG[step](node);
            } else {
                var _step = this.stepList.shift();
                if (_step == null) {
                    zy.guide.clean();
                } else {
                    this.step = _step;
                    cc.log('zy.guide.show', _step);
                    this.CFG[this.step]();
                }
            }
        },


        // 引导点击
        hit: function hit(params) {
            var _this = this;

            this.hideMask();
            // 节点全局唯一名字
            var name = params.name;

            var hitNode = zy.ui.seekChildByName(zy.director.getSceneCanvas(), name);
            if (!hitNode) {
                var seq = cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
                    _this.hit(params);
                }));
                this.node.runAction(seq);
                return;
            }

            var lastScale = hitNode.scale; // 计算worldPos时必须以1运算
            var lastPos = hitNode.position;
            var lastParent = hitNode.parent;
            var lastZIndex = hitNode.zIndex;
            var worldPos = lastParent.convertToWorldSpaceAR(lastPos);
            hitNode.parent = this.node; // 改变层级
            hitNode.position = this.node.convertToNodeSpaceAR(worldPos);
            hitNode.zIndex = 1;
            hitNode.scale = lastScale;

            var animation = hitNode.getComponent(cc.Animation);
            if (animation) {
                animation.play("guide_shake", 0);
            }

            cc.log("===oriPos:" + JSON.stringify(lastPos));

            cc.log("===newPos:" + JSON.stringify(hitNode.position));

            var maskNode = null;
            if (params.showMask) {
                maskNode = this.createMaskNode(hitNode, this.node, params.digging);
            }

            var hitClick = function hitClick() {
                cc.log("===click guide hit node");
                hitNode.off(cc.Node.EventType.TOUCH_START, hitClick, _this, true);
                hitNode.parent = lastParent;
                hitNode.position = lastPos;
                hitNode.zIndex = lastZIndex;

                if (animation) {
                    animation.setCurrentTime(0, 'guide_shake');
                    animation.stop("guide_shake");
                }

                if (cc.isValid(maskNode)) {
                    maskNode.destroy();
                }

                if (params.click) {
                    params.click();
                }
            };
            hitNode.on(cc.Node.EventType.TOUCH_START, hitClick, this, true);
        },
        slideTower: function slideTower(params) {
            var _this2 = this;

            this.hideMask();
            var name = params.name;
            var hitNode = zy.ui.seekChildByName(zy.director.getSceneCanvas(), name);
            if (!hitNode) {
                var seq = cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
                    _this2.slideTower(params);
                }));
                this.node.runAction(seq);
                return;
            }

            var lastScale = hitNode.scale; // 计算worldPos时必须以1运算
            var lastPos = hitNode.position;
            var lastParent = hitNode.parent;
            var lastZIndex = hitNode.zIndex;
            var worldPos = lastParent.convertToWorldSpaceAR(lastPos);
            hitNode.parent = this.node; // 改变层级
            hitNode.position = this.node.convertToNodeSpaceAR(worldPos);
            hitNode.zIndex = 1;
            hitNode.scale = lastScale;

            var maskNode = null;
            if (params.showMask) {
                maskNode = this.createMaskNode(hitNode, this.node, params.digging);
            }

            var hitClick = function hitClick() {
                _this2.node.off(cc.Node.EventType.TOUCH_START, hitClick, _this2, true);

                hitNode.parent = lastParent;
                hitNode.position = lastPos;
                hitNode.zIndex = lastZIndex;

                _this2.slideAniNode.destroy();

                if (cc.isValid(maskNode)) {
                    maskNode.destroy();
                }

                if (params.click) {
                    params.click();
                }
            };

            cc.loader.loadRes("MainGame/Ui/gun_drag", cc.Prefab, function (err, pf) {
                if (err) {
                    cc.log(err);
                } else {
                    var aniNode = _this2.slideAniNode = cc.instantiate(pf);
                    aniNode.zIndex = 2;
                    aniNode.parent = _this2.node;
                    aniNode.position = _this2.node.convertToNodeSpaceAR(hitNode.parent.convertToWorldSpaceAR(hitNode.position));
                    aniNode.getComponent(cc.Animation).play("guide_drag", 0);
                    _this2.node.on(cc.Node.EventType.TOUCH_START, hitClick, _this2, true);
                }
            });
        },


        // 引导查看某节点，点击屏幕任意位置结束
        look: function look(params) {
            var _this3 = this;

            this.hideMask();
            // 节点全局唯一名字
            var name = params.name;

            var hitNode = zy.ui.seekChildByName(zy.director.getSceneCanvas(), name);
            if (!hitNode) {
                var seq = cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
                    _this3.hit(params);
                }));
                this.node.runAction(seq);
                return;
            }

            var lastScale = hitNode.scale; // 计算worldPos时必须以1运算
            var lastPos = hitNode.position;
            var lastParent = hitNode.parent;
            var lastZIndex = hitNode.zIndex;
            var worldPos = lastParent.convertToWorldSpaceAR(lastPos);
            hitNode.parent = this.node; // 改变层级
            hitNode.position = this.node.convertToNodeSpaceAR(worldPos);
            hitNode.zIndex = 1;
            hitNode.scale = lastScale;
            cc.log("===oriPos:" + JSON.stringify(lastPos));

            cc.log("===newPos:" + JSON.stringify(hitNode.position));

            var maskNode = null;
            if (params.showMask) {
                maskNode = this.createMaskNode(hitNode, this.node, params.digging);
            }

            var hitClick = function hitClick() {
                cc.log("===click guide look node");
                _this3.node.off(cc.Node.EventType.TOUCH_START, hitClick, _this3, true);
                hitNode.parent = lastParent;
                hitNode.position = lastPos;
                hitNode.zIndex = lastZIndex;

                if (cc.isValid(maskNode)) {
                    maskNode.destroy();
                }

                if (params.click) {
                    params.click();
                }
            };
            this.node.on(cc.Node.EventType.TOUCH_START, hitClick, this, true);
        },


        /**
         * 创建黑色遮罩
         * @param hitNode
         * @param parent
         * @param digging {boolean} 是否挖孔显示
         */
        createMaskNode: function createMaskNode(hitNode, parent, digging) {
            // mask节点
            var maskNode = zy.Node.createNode({
                name: "guideMaskNode",
                parent: parent,
                position: cc.v2(0, 0)
            });

            if (digging) {
                var cr = Math.max(hitNode.width, hitNode.height);
                var hitPos = hitNode.parent.convertToWorldSpaceAR(hitNode.position);
                var pos = maskNode.convertToNodeSpaceAR(hitPos);

                var mask = maskNode.addComponent(cc.Mask);
                mask.type = cc.Mask.Type.RECT;
                mask.inverted = true;
                // 私有api
                mask._graphics.lineWidth = 1;
                mask._graphics.strokeColor = cc.color(255, 0, 0);
                mask._graphics.fillColor = cc.color(0, 255, 0);
                mask._graphics.circle(pos.x, pos.y, cr * 0.5);
                mask._graphics.fill();
                mask._graphics.stroke();
            }

            // 半透明精灵
            var blackNode = zy.Node.createNode({
                parent: maskNode,
                position: cc.v2(0, 0)
            });
            blackNode.addComponent(zy.Sprite);
            zy.Sprite.updateNode(blackNode, {
                url: "textures/common/guide/guide_mask",
                width: zy.constData.DesignSize.width * 1.5,
                height: zy.constData.DesignSize.height * 1.5
            });

            return maskNode;
        },

        // 检查遮罩（阻挡触摸)
        checkStatus: function checkStatus() {
            if (!this.openStatus) {
                return;
            }

            if (!cc.isValid(this.node)) {
                this.node = zy.Button.createNode({
                    name: "guideNode",
                    zIndex: zy.constData.ZIndex.GUIDE,
                    parent: zy.director.getUiRoot(),
                    touchAction: false,
                    width: zy.constData.DesignSize.width * 2,
                    height: zy.constData.DesignSize.height * 2
                });
            }
        },
        hideMask: function hideMask() {
            if (cc.isValid(this.maskNode)) {
                this.maskNode.active = false;
            }
        },


        // 添加遮罩
        showMask: function showMask() {
            if (!this.openStatus) return;
            this.maskNode.active = true;
        },

        isShowMask: function isShowMask() {
            if (cc.isValid(this.node) && cc.isValid(this.maskNode)) {
                return this.node.active && this.maskNode.active;
            } else {
                return false;
            }
        },

        clean: function clean() {
            this.openStatus = false;
            this.step = -1;

            if (cc.isValid(this.node)) {
                this.node.destroy();
                this.node = null;
            }
        }

    }
});

cc._RF.pop();