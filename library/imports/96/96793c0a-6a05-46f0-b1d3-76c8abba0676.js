"use strict";
cc._RF.push(module, '96793wKagVG8LHTdsirugZ2', 'GameScene');
// scripts/scene/GameScene.js

"use strict";

/**
 * Created by xujiawei on 2020-04-29 17:37:50
 */

var SHAKE = 10; // 滑动阀值
var ACTION_TIME = 0.1; // cell移动时间

cc.Class({
    extends: cc.Component,
    properties: {
        panel: cc.Node,
        cellPF: cc.Prefab,
        scoreLabel: cc.Label,
        bestLabel: cc.Label,
        score: {
            default: 0,
            type: cc.Integer,
            notify: function notify() {
                this.scoreLabel.string = this.score;

                if (this.score > zy.dataMng.userData.bestScore) {
                    zy.dataMng.userData.bestScore = this.score;
                    this.bestLabel.string = this.score;
                }
            }
        }
    },

    init: function init(params) {
        this.reloadCell();
        this.bestLabel.string = zy.dataMng.userData.bestScore;
    },
    start: function start() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        // 默认聚焦画布，否则不点击屏幕就收不到键盘事件
        cc.game.canvas.focus();
    },
    reloadCell: function reloadCell() {
        this.moved = false; // 标记本次touchmove已经移动过不再计算
        this.moving = false; // 执行动画中暂不能移动
        this.score = 0;
        this.panel.destroyAllChildren();
        this.boardCells = []; // 存cell节点
        this.board = []; // 存数据, 数据是立即改变的，cell存在动作延后
        for (var row = 0; row < 4; row++) {
            var colsData = [];
            var cols = [];
            for (var col = 0; col < 4; col++) {
                colsData[col] = 0;
                cols[col] = null;
            }
            this.board.push(colsData);
            this.boardCells.push(cols);
        }

        this.randomCell();
        this.randomCell();
    },
    getPanelPos: function getPanelPos(row, col) {
        return cc.v2(-270 + col * 180, 270 - row * 180);
    },
    onTouchMove: function onTouchMove(event) {
        if (this.moved) {
            return;
        }
        // let pre = event.getPreviousLocation();
        var startPos = event.getStartLocation();
        var cur = event.getLocation();
        var diff = cur.subSelf(startPos);
        if (Math.abs(diff.x) > Math.abs(diff.y)) {
            if (Math.abs(diff.x) < SHAKE) {
                return;
            }
            this.moved = true;
            if (diff.x > 0) {
                this.moveRight();
            } else {
                this.moveLeft();
            }
        } else {
            if (Math.abs(diff.y) < SHAKE) {
                return;
            }
            this.moved = true;
            if (diff.y > 0) {
                this.moveUp();
            } else {
                this.moveDown();
            }
        }
    },
    onTouchEnd: function onTouchEnd(event) {
        this.moved = false;
    },
    onKeyDown: function onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.up:
                this.moveUp();
                break;
            case cc.macro.KEY.down:
                this.moveDown();
                break;
            case cc.macro.KEY.left:
                this.moveLeft();
                break;
            case cc.macro.KEY.right:
                this.moveRight();
                break;
            default:
                break;
        }
    },
    randomCell: function randomCell() {
        var i = Math.round(Math.random() * 3);
        var j = Math.round(Math.random() * 3);
        while (this.board[i][j] != 0) {
            i = Math.round(Math.random() * 3);
            j = Math.round(Math.random() * 3);
        }

        cc.log("rpos:", i, j);
        this.board[i][j] = 2;
        var cell = cc.instantiate(this.cellPF);
        cell.parent = this.panel;
        cell.position = this.getPanelPos(i, j);
        cell = cell.getComponent("Cell");
        this.boardCells[i][j] = cell;
        cell.num = 2;
        cell.bg.scale = 0;
        cell.bg.runAction(cc.scaleTo(ACTION_TIME, 1));
    },
    canMoveUp: function canMoveUp() {
        for (var col = 0; col <= 3; col++) {
            for (var row = 1; row <= 3; row++) {
                if (this.board[row][col] != 0) {
                    if (this.board[row - 1][col] == 0 || this.board[row - 1][col] == this.board[row][col]) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    canMoveDown: function canMoveDown() {
        for (var col = 0; col <= 3; col++) {
            for (var row = 2; row >= 0; row--) {
                if (this.board[row][col] != 0) {
                    if (this.board[row + 1][col] == 0 || this.board[row + 1][col] == this.board[row][col]) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    canMoveLeft: function canMoveLeft() {
        for (var row = 3; row >= 0; row--) {
            for (var col = 1; col <= 3; col++) {
                if (this.board[row][col] != 0) {
                    if (this.board[row][col - 1] == 0 || this.board[row][col - 1] == this.board[row][col]) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    canMoveRight: function canMoveRight() {
        for (var row = 3; row >= 0; row--) {
            for (var col = 2; col >= 0; col--) {
                if (this.board[row][col] != 0) {
                    if (this.board[row][col + 1] == 0 || this.board[row][col + 1] == this.board[row][col]) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    moveUp: function moveUp() {
        cc.log('上滑动');
        if (!this.canMoveUp()) {
            return;
        }
        if (this.moving) {
            return;
        }

        for (var col = 0; col <= 3; col++) {
            var tmp = 0;
            for (var row = 0; row <= 3; row++) {
                if (this.board[row][col] == 0) {
                    continue;
                }
                for (var k = 0 + tmp; k < row; k++) {
                    if (this.board[k][col] == 0 && this.noBlockVertical(col, k, row)) {
                        this.board[k][col] = this.board[row][col];
                        this.board[row][col] = 0;

                        this.moveActionVertical(row, col, k, false);
                    } else if (this.board[k][col] == this.board[row][col] && this.noBlockVertical(col, k, row)) {
                        this.score += this.board[row][col] * 2;
                        this.board[k][col] += this.board[row][col];
                        this.board[row][col] = 0;
                        tmp++;

                        this.moveActionVertical(row, col, k, true);
                    }
                }
            }
        }
        this.randomCell();
    },
    moveDown: function moveDown() {
        cc.log("下滑动");
        if (!this.canMoveDown()) {
            return;
        }
        if (this.moving) {
            return;
        }

        for (var col = 0; col <= 3; col++) {
            var tmp = 0;
            for (var row = 3; row >= 0; row--) {
                if (this.board[row][col] == 0) {
                    continue;
                }
                for (var k = 3 - tmp; k > row; k--) {
                    if (this.board[k][col] == 0 && this.noBlockVertical(col, row, k)) {
                        this.board[k][col] = this.board[row][col];
                        this.board[row][col] = 0;

                        this.moveActionVertical(row, col, k, false);
                    } else if (this.board[k][col] == this.board[row][col] && this.noBlockVertical(col, row, k)) {
                        this.score += this.board[row][col] * 2;
                        this.board[k][col] += this.board[row][col];
                        this.board[row][col] = 0;
                        tmp++;

                        this.moveActionVertical(row, col, k, true);
                    }
                }
            }
        }
        this.randomCell();
    },
    moveLeft: function moveLeft() {
        cc.log("左滑动");
        if (!this.canMoveLeft()) {
            return;
        }
        if (this.moving) {
            return;
        }

        for (var row = 3; row >= 0; row--) {
            var tmp = 0;
            for (var col = 0; col <= 3; col++) {
                if (this.board[row][col] == 0) {
                    continue;
                }
                for (var k = 0 + tmp; k < col; k++) {
                    if (this.board[row][k] == 0 && this.noBlockHorizonal(row, k, col)) {
                        this.board[row][k] = this.board[row][col];
                        this.board[row][col] = 0;

                        this.moveActionHorizonal(row, col, k, false);
                    } else if (this.board[row][k] == this.board[row][col] && this.noBlockHorizonal(row, col, k)) {
                        this.score += this.board[row][col] * 2;
                        this.board[row][k] += this.board[row][col];
                        this.board[row][col] = 0;
                        tmp++;

                        this.moveActionHorizonal(row, col, k, true);
                    }
                }
            }
        }
        this.randomCell();
    },
    moveRight: function moveRight() {
        cc.log('右滑动');
        if (!this.canMoveRight()) {
            return;
        }
        if (this.moving) {
            return;
        }

        for (var row = 3; row >= 0; row--) {
            var tmp = 0;
            for (var col = 3; col >= 0; col--) {
                if (this.board[row][col] == 0) {
                    continue;
                }
                for (var k = 3 - tmp; k > col; k--) {
                    if (this.board[row][k] == 0 && this.noBlockHorizonal(row, col, k)) {
                        this.board[row][k] = this.board[row][col];
                        this.board[row][col] = 0;

                        this.moveActionHorizonal(row, col, k, false);
                    } else if (this.board[row][k] == this.board[row][col] && this.noBlockHorizonal(row, col, k)) {
                        this.score += this.board[row][col] * 2;
                        this.board[row][k] += this.board[row][col];
                        this.board[row][col] = 0;
                        tmp++;

                        this.moveActionHorizonal(row, col, k, true);
                    }
                }
            }
        }
        this.randomCell();
    },
    moveActionHorizonal: function moveActionHorizonal(row, col, k, hasNewValue) {
        var _this = this;

        // 处理动画
        var cell = this.boardCells[row][col];
        if (cell) {
            this.boardCells[row][col] = null;
            cell.node.stopAllActions();
            this.moving = true;
            if (hasNewValue) {
                cell.node.runAction(cc.sequence(cc.moveTo(ACTION_TIME, this.getPanelPos(row, k)), cc.callFunc(function () {
                    _this.boardCells[row][k].num = _this.board[row][k];
                    _this.boardCells[row][k].bg.runAction(cc.sequence(cc.scaleTo(ACTION_TIME * 0.4, 1.2), cc.delayTime(ACTION_TIME * 0.2), cc.scaleTo(ACTION_TIME * 0.3, 1)));
                    cell.node.destroy();
                    _this.moving = false;
                    _this.getGameResult(_this.board[row][k]);
                })));
            } else {
                this.boardCells[row][k] = cell;
                cell.node.runAction(cc.sequence(cc.moveTo(ACTION_TIME, this.getPanelPos(row, k)), cc.callFunc(function () {
                    _this.moving = false;
                    _this.getGameResult(_this.board[row][k]);
                })));
            }
        }
    },
    moveActionVertical: function moveActionVertical(row, col, k, hasNewValue) {
        var _this2 = this;

        var cell = this.boardCells[row][col];
        if (cell) {
            this.boardCells[row][col] = null;
            cell.node.stopAllActions();
            this.moving = true;
            if (hasNewValue) {
                cell.node.runAction(cc.sequence(cc.moveTo(ACTION_TIME, this.getPanelPos(k, col)), cc.callFunc(function () {
                    _this2.boardCells[k][col].num = _this2.board[k][col];
                    _this2.boardCells[k][col].bg.runAction(cc.sequence(cc.scaleTo(ACTION_TIME * 0.4, 1.2), cc.delayTime(ACTION_TIME * 0.2), cc.scaleTo(ACTION_TIME * 0.3, 1)));
                    cell.node.destroy();
                    _this2.moving = false;
                    _this2.getGameResult(_this2.board[k][col]);
                })));
            } else {
                this.boardCells[k][col] = cell;
                cell.node.runAction(cc.sequence(cc.moveTo(ACTION_TIME, this.getPanelPos(k, col)), cc.callFunc(function () {
                    _this2.moving = false;
                    _this2.getGameResult(_this2.board[k][col]);
                })));
            }
        }
    },
    noBlockHorizonal: function noBlockHorizonal(row, col1, col2) {
        for (var i = col1 + 1; i < col2; i++) {
            if (this.board[row][i] != 0) {
                return false;
            }
        }
        return true;
    },
    noBlockVertical: function noBlockVertical(col, row1, row2) {
        for (var i = row1 + 1; i < row2; i++) {
            if (this.board[i][col] != 0) {
                return false;
            }
        }
        return true;
    },
    showGameSuc: function showGameSuc() {
        var _this3 = this;

        zy.ui.alert.show({
            text: "再来一局吧!",
            okText: "确定",
            okCb: function okCb() {
                _this3.reloadCell();
            }
        });
    },
    showGameFail: function showGameFail() {
        var _this4 = this;

        zy.ui.alert.show({
            text: "游戏失败，再试一次吧!",
            okText: "确定",
            okCb: function okCb() {
                _this4.reloadCell();
            }
        });
    },
    getGameResult: function getGameResult(lastValue) {
        if (lastValue == 2048) {
            this.showGameSuc();
            return;
        }
        this.getIsGameOver();
    },
    getIsGameOver: function getIsGameOver() {
        if (!this.canMoveUp() && !this.canMoveDown() && !this.canMoveLeft() && !this.canMoveRight()) {
            this.showGameFail();
        }
    }
});

cc._RF.pop();