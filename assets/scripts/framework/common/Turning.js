/**
 * Created by skyxu on 2019/12/27.
 *
 * 轮盘抽奖
 */

cc.Class({
    extends: cc.Component,
    properties: {
        turn: cc.Sprite,  // 旋转的盘子
    },

    prepare () {
        this.turnStatus = 0;  // 0待操作，1正在加速旋转，2正在减速状态
        this.curSpeed = 0;  // 当前转盘速度
        this.spinTime = 0;  // 已经旋转的时间
        this.gearNum = 8;  // 转盘齿轮数量
        this.gearAngle = 360 / this.gearNum;
        this.defaultAngle = 180;  // 指针指向id为1的格子的默认修正角度
        this.finalAngle = 0;  // 最终需要旋转到的角度
        this.decAngle = 1 * 360;  // 减速旋转圈数 360的整数倍
        this.springback = false;  // 旋转结束是否反推一格
        this.targetId = 6;  // 1 -- gearNum, 旋转结果id从1开始
        this.maxSpeed = 10;  // 最大旋转速度6-15比较合适
        this.duration = 2;  // 减速前旋转的时间
        this.acc = 0.1;  // 加速度 0.01-0.2比较合适
    },

    init () {
        this.prepare();
    },

    loadRewardItem () {
        // 加载转盘上的奖励物品
    },

    /**
     * 开始旋转转盘，并设置结果
     * @param retId
     */
    startTurn(retId) {
        if (this.turnStatus != 0) {
            return;
        }

        this.caculateFinalAngle(retId);

        this.turnStatus = 1;
        this.curSpeed = 0;
        this.spinTime = 0;
    },

    forceStopTurn() {
        this.turnStatus = 0;
        this.turn.node.rotation = this.finalAngle;
    },

    // 设置目标角度
    caculateFinalAngle(targetId) {
        if (targetId <= 0) {
            // 随机一个
            cc.log("targetId must be big than 0");
            targetId = 1;
        }
        this.targetId = targetId;
        cc.log("====targetId:" + this.targetId);
        this.finalAngle = 360 - (this.targetId - 1) * this.gearAngle + this.defaultAngle;
        if (this.springback) {
            this.finalAngle += this.gearAngle;
        }
    },

    showRes() {
        // 如果因为某些处理这里转盘没有停止则强制停止转动
        this.forceStopTurn();
        cc.log("show res: " + this.targetId);
    },

    update(dt) {
        if (this.turnStatus == 0) {
            return;
        }

        if (this.turnStatus == 1) {
            // 加速状态
            this.spinTime += dt;
            this.turn.node.rotation += this.curSpeed;
            if (this.curSpeed < this.maxSpeed) {
                this.curSpeed += this.acc;
            } else {
                if (this.spinTime < this.duration) {
                    return;
                }
                // 开始减速
                this.turn.node.rotation = this.finalAngle;
                this.turnStatus = 2;
            }
        } else if (this.turnStatus == 2) {
            // 减速过程
            let curRo = this.turn.node.rotation; // 此时等于finalAngle
            let hadRo = curRo - this.finalAngle;
            this.curSpeed = this.maxSpeed * ((this.decAngle - hadRo) / this.decAngle) + 0.2;
            this.turn.node.rotation = curRo + this.curSpeed;

            if ((this.decAngle - hadRo) <= 0) {
                // 停止转动
                this.turnStatus = 0;
                this.turn.node.rotation = this.finalAngle;
                if (this.springback) {
                    let act = cc.rotateBy(0.5, -this.gearAngle);
                    let seq = cc.sequence(cc.delayTime(0.2), act, cc.callFunc(this.showRes, this));
                    this.turn.node.runAction(seq);
                } else {
                    this.showRes();
                }
            }
        }
    }

});