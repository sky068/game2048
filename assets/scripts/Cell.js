/**
 * Created by xujiawei on 2020-05-07 18:49:14
 */

const CELL_COLOR = {
    '2': '#ECE0D5',
    '4': '#EBDCC2',
    '8': '#F4A873',
    '16': '#F18151',
    '32': '#F1654D',
    '64': '#F0462D',
    '128': '#E8C65F',
    '256': '#E7C34F',
    '512': '#78C93A',
    '1024': '#C9963A',
    '2048': '#C2BC2F',
}

cc.Class({
    extends: cc.Component,
    properties: {
        bg: cc.Node,    // 套一层节点，放置移动和缩放动作相互影响, 移动跟节点，缩放只控制bg
        numLabel: cc.Label,
        num: {
            default: 0,
            notify() {
                this.numLabel.string = this.num;
                this.numLabel.node.color = this.num <= 4 ? cc.Color.BLACK : cc.Color.WHITE;
                this.bg.color = CELL_COLOR[String(this.num)] ? cc.color(CELL_COLOR[String(this.num)]) : cc.color("#ECE0D5");
            }
        }
    }
});