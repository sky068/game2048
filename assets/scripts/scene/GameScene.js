/**
 * Created by xujiawei on 2020-04-29 17:37:50
 */

const SHAKE = 10;  // 滑动阀值
const ACTION_TIME = 0.1; // cell移动时间

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
            notify() {
                this.scoreLabel.string = this.score;

                if (this.score > zy.dataMng.userData.bestScore) {
                    zy.dataMng.userData.bestScore = this.score;
                    this.bestLabel.string = this.score;
                }
            }
        }
    },

    init(params) {
        this.reloadCell();
        this.bestLabel.string = zy.dataMng.userData.bestScore;
    },

    start() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    reloadCell() {
        this.moved = false;  // 标记本次touchmove已经移动过不再计算
        this.moving = false;   // 执行动画中暂不能移动
        this.score = 0;
        this.panel.destroyAllChildren();
        this.boardCells = []; // 存cell节点
        this.board = []; // 存数据, 数据是立即改变的，cell存在动作延后
        for (let row = 0; row < 4; row++) {
            let colsData = [];
            let cols = [];
            for (let col = 0; col < 4; col++) {
                colsData[col] = 0;
                cols[col] = null;
            }
            this.board.push(colsData);
            this.boardCells.push(cols);
        }

        this.randomCell();
        this.randomCell();
    },

    getPanelPos(row, col) {
        return cc.v2(-270 + col * 180, 270 - row * 180);
    },

    onTouchMove(event) {
        if (this.moved) {
            return;
        }
        // let pre = event.getPreviousLocation();
        let startPos = event.getStartLocation();
        let cur = event.getLocation();
        let diff = cur.subSelf(startPos);
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

    onTouchEnd(event) {
        this.moved = false;
    },

    onKeyDown(event) {
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

    randomCell() {
        let i = Math.round(Math.random() * 3);
        let j = Math.round(Math.random() * 3);
        while (this.board[i][j] != 0) {
            i = Math.round(Math.random() * 3);
            j = Math.round(Math.random() * 3);
        }

        cc.log("rpos:", i, j);
        this.board[i][j] = 2;
        let cell = cc.instantiate(this.cellPF);
        cell.parent = this.panel;
        cell.position = this.getPanelPos(i, j);
        cell = cell.getComponent("Cell");
        this.boardCells[i][j] = cell;
        cell.num = 2;
        cell.bg.scale = 0;
        cell.bg.runAction(cc.scaleTo(ACTION_TIME, 1));
    },

    canMoveUp() {
        for (let col = 0; col <= 3; col++) {
            for (let row = 1; row <= 3; row++) {
                if (this.board[row][col] != 0) {
                    if (this.board[row - 1][col] == 0 || this.board[row - 1][col] == this.board[row][col]) {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    canMoveDown() {
        for (let col = 0; col <= 3; col++) {
            for (let row = 2; row >= 0; row--) {
                if (this.board[row][col] != 0) {
                    if (this.board[row + 1][col] == 0 || this.board[row + 1][col] == this.board[row][col]) {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    canMoveLeft() {
        for (let row = 3; row >= 0; row--) {
            for (let col = 1; col <= 3; col++) {
                if (this.board[row][col] != 0) {
                    if (this.board[row][col - 1] == 0 || this.board[row][col - 1] == this.board[row][col]) {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    canMoveRight() {
        for (let row = 3; row >= 0; row--) {
            for (let col = 2; col >= 0; col--) {
                if (this.board[row][col] != 0) {
                    if (this.board[row][col + 1] == 0 || this.board[row][col + 1] == this.board[row][col]) {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    moveUp() {
        cc.log('上滑动');
        if (!this.canMoveUp()) {
            return;
        }
        if (this.moving) {
            return;
        }

        for (let col = 0; col <= 3; col++) {
            let tmp = 0;
            for (let row = 0; row <= 3; row++) {
                if (this.board[row][col] == 0) {
                    continue;
                }
                for (let k = 0 + tmp; k < row; k++) {
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

    moveDown() {
        cc.log("下滑动");
        if (!this.canMoveDown()) {
            return;
        }
        if (this.moving) {
            return;
        }

        for (let col = 0; col <= 3; col++) {
            let tmp = 0;
            for (let row = 3; row >= 0; row--) {
                if (this.board[row][col] == 0) {
                    continue;
                }
                for (let k = 3 - tmp; k > row; k--) {
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

    moveLeft() {
        cc.log("左滑动");
        if (!this.canMoveLeft()) {
            return;
        }
        if (this.moving) {
            return;
        }

        for (let row = 3; row >= 0; row--) {
            let tmp = 0;
            for (let col = 0; col <= 3; col++) {
                if (this.board[row][col] == 0) {
                    continue;
                }
                for (let k = 0 + tmp; k < col; k++) {
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

    moveRight() {
        cc.log('右滑动');
        if (!this.canMoveRight()) {
            return;
        }
        if (this.moving) {
            return;
        }

        for (let row = 3; row >= 0; row--) {
            let tmp = 0;
            for (let col = 3; col >= 0; col--) {
                if (this.board[row][col] == 0) {
                    continue;
                }
                for (let k = 3 - tmp; k > col; k--) {
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

    moveActionHorizonal(row, col, k, hasNewValue) {
        // 处理动画
        let cell = this.boardCells[row][col];
        if (cell) {
            this.boardCells[row][col] = null;
            cell.node.stopAllActions();
            this.moving = true;
            if (hasNewValue) {
                cell.node.runAction(cc.sequence(cc.moveTo(ACTION_TIME, this.getPanelPos(row, k)), cc.callFunc(() => {
                    this.boardCells[row][k].num = this.board[row][k];
                    this.boardCells[row][k].bg.runAction(cc.sequence(cc.scaleTo(ACTION_TIME*0.4,1.2), cc.delayTime(ACTION_TIME*0.2), cc.scaleTo(ACTION_TIME*0.3, 1)));
                    cell.node.destroy();
                    this.moving = false;
                    this.getGameResult(this.board[row][k]);
                })));
            } else {
                this.boardCells[row][k] = cell;
                cell.node.runAction(cc.sequence(cc.moveTo(ACTION_TIME, this.getPanelPos(row, k)), cc.callFunc(()=>{
                    this.moving = false;
                    this.getGameResult(this.board[row][k]);
                })));
            }
        }
    },

    moveActionVertical(row, col, k, hasNewValue) {
        let cell = this.boardCells[row][col];
        if (cell) {
            this.boardCells[row][col] = null;
            cell.node.stopAllActions();
            this.moving = true;
            if (hasNewValue) {
                cell.node.runAction(cc.sequence(cc.moveTo(ACTION_TIME, this.getPanelPos(k, col)), cc.callFunc(() => {
                    this.boardCells[k][col].num = this.board[k][col];
                    this.boardCells[k][col].bg.runAction(cc.sequence(cc.scaleTo(ACTION_TIME*0.4,1.2), cc.delayTime(ACTION_TIME*0.2), cc.scaleTo(ACTION_TIME*0.3, 1)));
                    cell.node.destroy();
                    this.moving = false;
                    this.getGameResult(this.board[k][col]);
                })));
            } else {
                this.boardCells[k][col] = cell;
                cell.node.runAction(cc.sequence(cc.moveTo(ACTION_TIME, this.getPanelPos(k, col)), cc.callFunc(()=>{
                    this.moving = false;
                    this.getGameResult(this.board[k][col]);
                })));
            }
        }
    },

    noBlockHorizonal(row, col1, col2) {
        for (let i = col1 + 1; i < col2; i++) {
            if (this.board[row][i] != 0) {
                return false;
            }
        }
        return true;
    },

    noBlockVertical(col, row1, row2) {
        for (let i = row1 + 1; i < row2; i++) {
            if (this.board[i][col] != 0) {
                return false;
            }
        }
        return true;
    },

    showGameSuc() {
        zy.ui.alert.show({
            text: "再来一局吧!",
            okText: "确定",
            okCb: ()=>{
                this.reloadCell();
            }
        });
    },

    showGameFail() {
        zy.ui.alert.show({
            text: "游戏失败，再试一次吧!",
            okText: "确定",
            okCb: ()=>{
                this.reloadCell();
            }
        })
    },

    getGameResult(lastValue) {
        if (lastValue == 2048) {
            this.showGameSuc();
            return;
        }
        this.getIsGameOver();
    },

    getIsGameOver() {
        if (!this.canMoveUp() && !this.canMoveDown() && !this.canMoveLeft() && !this.canMoveRight()) {
            this.showGameFail();
        }
    }

});