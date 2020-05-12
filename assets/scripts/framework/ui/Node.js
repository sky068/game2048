/**
 * Created by skyxu on 2019/11/27.
 */

const Node = cc.Class({
    extends: cc.Node,

    statics: {
        // 工厂方法
        createNode: function (params) {
            let node = new zy.Node();
            zy.Node.updateNode(node, params);
            return node;
        },

        updateNode: function (node, params) {
            if (params.name) {
                node.name = params.name;
            }

            if (params.anchor) {
                node.setAnchorPoint(params.anchor);
            }

            if (typeof params.x == 'number') {
                node.x = params.x;
            }

            if (typeof params.y == 'number') {
                node.y = params.y;
            }

            if (params.position) {
                node.position = params.position;
            }

            if (typeof params.width == 'number') {
                node.width = params.width;
            }

            if (typeof params.height == 'number') {
                node.height = params.height;
            }

            if (params.size) {
                node.width = params.size.x;
                node.height = params.size.y;
            }

            if (typeof params.opacity == 'number') {
                node.opacity = params.opacity;
            }

            if (params.color) {
                node.color = params.color;
            }

            if (typeof params.zIndex == 'number') {
                node.zIndex = params.zIndex;
            }

            if (typeof params.rotation == 'number') {
                node.rotation = params.rotation;
            }

            if (typeof params.scale == 'number') {
                node.scale = params.scale;
            }

            if (typeof params.scaleX == 'number') {
                node.scaleX = params.scaleX;
            }

            if (typeof params.scaleY == 'number') {
                node.scaleY = params.scaleY;
            }

            if (params.hasOwnProperty('flipX')) {
                if (params.flipX) {
                    node.scaleX = -1 * Math.abs(node.getScaleX());
                } else {
                    node.scaleX = 1 * Math.abs(node.getScaleX());
                }
            }

            if (params.hasOwnProperty('flipY')) {
                if (params.flipY) {
                    node.scaleY = -1 * Math.abs(node.getScaleY());
                } else {
                    node.scaleY = 1 * Math.abs(node.getScaleY());
                }
            }

            if (params.hasOwnProperty('active')) {
                node.active = params.active;
            }

            if (params.parent) {
                node.parent = params.parent;
            }
        },
    },

    properties: {

    },
});

zy.Node = module.exports = Node;