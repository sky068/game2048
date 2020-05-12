(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/scene/GameScene.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '96793wKagVG8LHTdsirugZ2', 'GameScene', __filename);
// scripts/scene/GameScene.js

"use strict";

/**
 * Created by xujiawei on 2020-04-29 17:37:50
 */

var SHAKE = 10; // 滑动阀值
cc.Class({
    extends: cc.Component,
    properties: {
        panel: cc.Node,
        cellPF: cc.Prefab,
        scoreLabel: cc.Label,
        score: {
            default: 0,
            type: cc.Integer,
            notify: function notify() {
                this.scoreLabel.string = this.score;
            }
        }
    },

    init: function init(params) {
        this.loadCell();
    },
    start: function start() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        this.board[0][3].num = 2;
        this.board[0][2].num = 2;
        this.board[0][1].num = 4;
        this.board[0][0].num = 4;
    },
    loadCell: function loadCell() {
        this.moved = false;
        this.score = 0;
        this.panel.destroyAllChildren();
        this.board = [];
        for (var i = 0; i < 4; i++) {
            var rows = [];
            for (var j = 0; j < 4; j++) {
                var cell = cc.instantiate(this.cellPF);
                cell.getComponent("Cell").num = 0;
                cell.x = -270 + j * 180;
                cell.y = 270 - i * 180;
                cell.parent = this.panel;
                rows.push(cell.getComponent("Cell"));
            }
            this.board.push(rows);
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
        while (this.board[i][j].num != 0) {
            i = Math.round(Math.random() * 3);
            j = Math.round(Math.random() * 3);
        }

        cc.log("rpos:", i, j);
        this.board[i][j].num = 2;
    },
    canMoveUp: function canMoveUp() {
        for (var col = 0; col <= 3; col++) {
            for (var row = 1; row <= 3; row++) {
                if (this.board[row][col].num != 0) {
                    if (this.board[row - 1][col].num == 0 || this.board[row - 1][col].num == this.board[row][col].num) {
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
                if (this.board[row][col].num != 0) {
                    if (this.board[row + 1][col].num == 0 || this.board[row + 1][col].num == this.board[row][col].num) {
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
                if (this.board[row][col].num != 0) {
                    if (this.board[row][col - 1].num == 0 || this.board[row][col - 1].num == this.board[row][col].num) {
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
                if (this.board[row][col].num != 0) {
                    if (this.board[row][col + 1].num == 0 || this.board[row][col + 1].num == this.board[row][col].num) {
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

        for (var col = 0; col <= 3; col++) {
            var tmp = 0;
            for (var row = 0; row <= 3; row++) {
                if (this.board[row][col].num == 0) {
                    continue;
                }
                for (var k = 0 + tmp; k < row; k++) {
                    if (this.board[k][col].num == 0 && this.noBlockVertical(col, k, row)) {
                        this.board[k][col].num = this.board[row][col].num;
                        this.board[row][col].num = 0;
                        break;
                    } else if (this.board[k][col].num == this.board[row][col].num && this.noBlockVertical(col, k, row)) {
                        this.score += this.board[row][col].num * 2;
                        this.board[k][col].num += this.board[row][col].num;
                        this.board[row][col].num = 0;
                        tmp++;
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

        for (var col = 0; col <= 3; col++) {
            var tmp = 0;
            for (var row = 3; row >= 0; row--) {
                if (this.board[row][col].num == 0) {
                    continue;
                }
                for (var k = 3 - tmp; k > row; k--) {
                    if (this.board[k][col].num == 0 && this.noBlockVertical(col, row, k)) {
                        this.board[k][col].num = this.board[row][col].num;
                        this.board[row][col].num = 0;
                    } else if (this.board[k][col].num == this.board[row][col].num && this.noBlockVertical(col, row, k)) {
                        this.score += this.board[row][col].num * 2;
                        this.board[k][col].num += this.board[row][col].num;
                        this.board[row][col].num = 0;
                        tmp++;
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

        for (var row = 3; row >= 0; row--) {
            var tmp = 0;
            for (var col = 0; col <= 3; col++) {
                if (this.board[row][col].num == 0) {
                    continue;
                }
                for (var k = 0 + tmp; k < col; k++) {
                    if (this.board[row][k].num == 0 && this.noBlockHorizonal(row, k, col)) {
                        this.board[row][k].num = this.board[row][col].num;
                        this.board[row][col].num = 0;
                    } else if (this.board[row][k].num == this.board[row][col].num && this.noBlockHorizonal(row, col, k)) {
                        this.score += this.board[row][col].num * 2;
                        this.board[row][k].num += this.board[row][col].num;
                        this.board[row][col].num = 0;
                        tmp++;
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

        for (var row = 3; row >= 0; row--) {
            var tmp = 0;
            for (var col = 3; col >= 0; col--) {
                if (this.board[row][col].num == 0) {
                    continue;
                }
                for (var k = 3 - tmp; k > col; k--) {
                    if (this.board[row][k].num == 0 && this.noBlockHorizonal(row, col, k)) {
                        this.board[row][k].num = this.board[row][col].num;
                        this.board[row][col].num = 0;
                    } else if (this.board[row][k].num == this.board[row][col].num && this.noBlockHorizonal(row, col, k)) {
                        this.score += this.board[row][col].num * 2;
                        this.board[row][k].num += this.board[row][col].num;
                        this.board[row][col].num = 0;
                        tmp++;
                    }
                }
            }
        }
        this.randomCell();
    },
    noBlockHorizonal: function noBlockHorizonal(row, col1, col2) {
        for (var i = col1 + 1; i < col2; i++) {
            if (this.board[row][i].num != 0) {
                return false;
            }
        }
        return true;
    },
    noBlockVertical: function noBlockVertical(col, row1, row2) {
        for (var i = row1 + 1; i < row2; i++) {
            if (this.board[i][col].num != 0) {
                return false;
            }
        }
        return true;
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
        //# sourceMappingURL=GameScene.js.map
        