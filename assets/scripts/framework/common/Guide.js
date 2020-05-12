/**
 * Created by skyxu on 2019/12/12.
 */

/**
 * 引导配置
 */

// 引导全局开关
const OPEN_GUIDE = true;

const RENEW = {
    0: [1001, 1002],  // 开始引导 滑动创建炮塔
    1: [1001, 1003, 1004], // 引导升级炮塔
    2: [1005, 1006, 1007, 1008, 1009],  // 引导点击各技能按钮
    3: [1010, 1011],  // 引导升级血量
    4: [1012, 1013],  // 引导领取免费金币
};

const CFG = {};

// 引导点击炮塔升级按钮
CFG[1001] = ()=>{
    zy.guide.hit({
        name: "guide_button2",
        showMask: true,
        click: ()=>{
            zy.guide.showNext();
        }
    });
};

// 引导拖动建造激光炮
CFG[1002] = ()=>{
    zy.guide.slideTower({
        name: "guide_weapon_2",
        showMask: true,
        click: ()=>{
            zy.guide.showNext();
        }
    });
};

// 引导点击加特林
CFG[1003] = ()=>{
    zy.guide.hit({
        name: "guide_weapon_0",
        showMask: true,
        click: ()=>{
            zy.guide.showNext();
        }
    });
};

// 引导点击升级按钮
CFG[1004] = ()=>{
    zy.guide.hit({
        name: "guide_upgradeBtn",
        showMask: true,
        click: ()=>{
            zy.guide.showNext();
        }
    });
};

// 引导点击广告按钮加时间
CFG[1005] = ()=>{
    zy.guide.hit({
        name: "guide_skill_1",
        showMask: true,
        click: ()=>{
            zy.guide.showNext();
        }
    });
};

// 引导点击技能1
CFG[1006] = ()=>{
    zy.guide.hit({
        name: "guide_skill_2",
        showMask: true,
        click: ()=>{
            setTimeout(()=>{
                zy.guide.showNext();
            }, 500);
        }
    });
};

// 引导点击技能2
CFG[1007] = ()=>{
    zy.guide.hit({
        name: "guide_skill_3",
        showMask: true,
        click: ()=>{
            setTimeout(()=>{
                zy.guide.showNext();
            }, 500);
        }
    });
};

// 引导点击技能3
CFG[1008] = ()=>{
    zy.guide.hit({
        name: "guide_button_add_time",
        showMask: true,
        click: ()=>{
            setTimeout(()=>{
                zy.guide.showNext();
            }, 500);
        }
    });
};

// 引导查看倒计时
CFG[1009] = ()=>{
    zy.guide.look({
        name: "guide_skill_progressBar",
        showMask: true,
        click: ()=>{
            zy.guide.showNext();
            // let GameManager = require("GameManager");
            // GameManager.setGamePauseLogic(false);
        }
    });
};

// 主ui升级血量
CFG[1010] = ()=> {
    zy.guide.hit({
        name: "guide_button1",
        showMask: true,
        click: ()=>{
            zy.guide.showNext();
        }
    });
};

// 升级血量
CFG[1011] = ()=> {
    zy.guide.hit({
        name: "guide_upgrade_hp",
        showMask: true,
        click: ()=>{
            zy.guide.showNext();
        }
    });
};

// 主ui免费金币
CFG[1012] = ()=> {
    zy.guide.hit({
        name: "guide_button3",
        showMask: true,
        click: ()=>{
            zy.guide.showNext();
        }
    });
};

CFG[1013] = ()=> {
    zy.guide.hit({
        name: "guide_free_coins",
        showMask: true,
        click: ()=>{
            setTimeout(()=>{
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

        init(params) {
            cc.log("===init guide: ", params);
            this.step = params.step;  // 当前步数
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

        setStep(step) {
            this.step = step;
        },

        setOpenStatus(status) {
            this.openStatus = status;
        },

        getOpenStatus() {
            return this.openStatus;
        },

        getNextStep: function () {
            if (!zy.guide.getOpenStatus() || !OPEN_GUIDE) {
                return;
            }
            return this.stepList[0];
        },

        addStep: function (step) {
            if (this.stepList.length == 0) {
                this.stepList.push(step);
            }
        },

        checkGuide: function () {
            let data = RENEW[this.step];
            if (data) {
                this.stepList = zy.utils.clone(data);
                zy.guide.showNext();
            }
        },

        showNext(step, node) {
            if (!zy.guide.getOpenStatus() || !OPEN_GUIDE) {
                return;
            }
            if (step) {
                this.CFG[step](node);
            } else {
                let step = this.stepList.shift();
                if (step == null) {
                    zy.guide.clean();
                } else {
                    this.step = step;
                    cc.log('zy.guide.show', step);
                    this.CFG[this.step]();
                }
            }
        },

        // 引导点击
        hit(params) {
            this.hideMask();
            // 节点全局唯一名字
            let name = params.name;

            let hitNode = zy.ui.seekChildByName(zy.director.getSceneCanvas(), name);
            if (!hitNode) {
                let seq = cc.sequence(
                    cc.delayTime(0.5),
                    cc.callFunc(()=>{
                        this.hit(params);
                    })
                );
                this.node.runAction(seq);
                return;
            }

            let lastScale = hitNode.scale; // 计算worldPos时必须以1运算
            let lastPos = hitNode.position;
            let lastParent = hitNode.parent;
            let lastZIndex = hitNode.zIndex;
            let worldPos = lastParent.convertToWorldSpaceAR(lastPos);
            hitNode.parent = this.node; // 改变层级
            hitNode.position = this.node.convertToNodeSpaceAR(worldPos);
            hitNode.zIndex = 1;
            hitNode.scale = lastScale;

            let animation = hitNode.getComponent(cc.Animation);
            if (animation) {
                animation.play("guide_shake", 0);
            }

            cc.log("===oriPos:" + JSON.stringify(lastPos));

            cc.log("===newPos:" + JSON.stringify(hitNode.position));

            let maskNode = null;
            if (params.showMask) {
                maskNode = this.createMaskNode(hitNode, this.node, params.digging);
            }

            let hitClick = ()=> {
                cc.log("===click guide hit node");
                hitNode.off(cc.Node.EventType.TOUCH_START, hitClick, this, true);
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

        slideTower(params) {
            this.hideMask();
            let name = params.name;
            let hitNode = zy.ui.seekChildByName(zy.director.getSceneCanvas(), name);
            if (!hitNode) {
                let seq = cc.sequence(
                    cc.delayTime(0.5),
                    cc.callFunc(()=>{
                        this.slideTower(params);
                    })
                );
                this.node.runAction(seq);
                return;
            }

            let lastScale = hitNode.scale; // 计算worldPos时必须以1运算
            let lastPos = hitNode.position;
            let lastParent = hitNode.parent;
            let lastZIndex = hitNode.zIndex;
            let worldPos = lastParent.convertToWorldSpaceAR(lastPos);
            hitNode.parent = this.node; // 改变层级
            hitNode.position = this.node.convertToNodeSpaceAR(worldPos);
            hitNode.zIndex = 1;
            hitNode.scale = lastScale;

            let maskNode = null;
            if (params.showMask) {
                maskNode = this.createMaskNode(hitNode, this.node, params.digging);
            }

            let hitClick = ()=> {
                this.node.off(cc.Node.EventType.TOUCH_START, hitClick, this, true);

                hitNode.parent = lastParent;
                hitNode.position = lastPos;
                hitNode.zIndex = lastZIndex;

                this.slideAniNode.destroy();

                if (cc.isValid(maskNode)) {
                    maskNode.destroy();
                }

                if (params.click) {
                    params.click();
                }
            };

            cc.loader.loadRes("MainGame/Ui/gun_drag", cc.Prefab, (err, pf)=>{
                if (err) {
                    cc.log(err);
                } else {
                    let aniNode = this.slideAniNode = cc.instantiate(pf);
                    aniNode.zIndex = 2;
                    aniNode.parent = this.node;
                    aniNode.position = this.node.convertToNodeSpaceAR(hitNode.parent.convertToWorldSpaceAR(hitNode.position));
                    aniNode.getComponent(cc.Animation).play("guide_drag", 0);
                    this.node.on(cc.Node.EventType.TOUCH_START, hitClick, this, true);
                }
            });
        },

        // 引导查看某节点，点击屏幕任意位置结束
        look(params) {
            this.hideMask();
            // 节点全局唯一名字
            let name = params.name;

            let hitNode = zy.ui.seekChildByName(zy.director.getSceneCanvas(), name);
            if (!hitNode) {
                let seq = cc.sequence(
                    cc.delayTime(0.5),
                    cc.callFunc(()=>{
                        this.hit(params);
                    })
                );
                this.node.runAction(seq);
                return;
            }

            let lastScale = hitNode.scale; // 计算worldPos时必须以1运算
            let lastPos = hitNode.position;
            let lastParent = hitNode.parent;
            let lastZIndex = hitNode.zIndex;
            let worldPos = lastParent.convertToWorldSpaceAR(lastPos);
            hitNode.parent = this.node; // 改变层级
            hitNode.position = this.node.convertToNodeSpaceAR(worldPos);
            hitNode.zIndex = 1;
            hitNode.scale = lastScale;
            cc.log("===oriPos:" + JSON.stringify(lastPos));

            cc.log("===newPos:" + JSON.stringify(hitNode.position));

            let maskNode = null;
            if (params.showMask) {
                maskNode = this.createMaskNode(hitNode, this.node, params.digging);
            }

            let hitClick = ()=> {
                cc.log("===click guide look node");
                this.node.off(cc.Node.EventType.TOUCH_START, hitClick, this, true);
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
        createMaskNode: function (hitNode, parent, digging) {
            // mask节点
            let maskNode = zy.Node.createNode({
                name: "guideMaskNode",
                parent: parent,
                position: cc.v2(0,0),
            });

            if (digging) {
                let cr = Math.max(hitNode.width, hitNode.height);
                let hitPos = hitNode.parent.convertToWorldSpaceAR(hitNode.position);
                let pos = maskNode.convertToNodeSpaceAR(hitPos);

                let mask = maskNode.addComponent(cc.Mask);
                mask.type = cc.Mask.Type.RECT;
                mask.inverted = true;
                // 私有api
                mask._graphics.lineWidth = 1;
                mask._graphics.strokeColor = cc.color(255, 0, 0);
                mask._graphics.fillColor = cc.color(0, 255, 0);
                mask._graphics.circle(pos.x, pos.y, cr*0.5);
                mask._graphics.fill();
                mask._graphics.stroke();
            }

            // 半透明精灵
            let blackNode = zy.Node.createNode({
                parent: maskNode,
                position: cc.v2(0, 0),
            });
            blackNode.addComponent(zy.Sprite);
            zy.Sprite.updateNode(blackNode, {
                url: "textures/common/guide/guide_mask",
                width: zy.constData.DesignSize.width * 1.5,
                height: zy.constData.DesignSize.height * 1.5,
            });

            return maskNode;
        },

        // 检查遮罩（阻挡触摸)
        checkStatus() {
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
                    height: zy.constData.DesignSize.height * 2,
                });
            }
        },

        hideMask() {
            if (cc.isValid(this.maskNode)) {
                this.maskNode.active = false;
            }
        },

        // 添加遮罩
        showMask: function () {
            if (!this.openStatus) return;
            this.maskNode.active = true;
        },

        isShowMask: function () {
            if (cc.isValid(this.node) && cc.isValid(this.maskNode)) {
                return this.node.active && this.maskNode.active;
            } else {
                return false;
            }
        },

        clean: function () {
            this.openStatus = false;
            this.step = -1;

            if (cc.isValid(this.node)) {
                this.node.destroy();
                this.node = null;
            }
        },

    }
});