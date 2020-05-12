"use strict";
cc._RF.push(module, '6143cwQ3s5Gq5QJ4PeOZFhZ', 'Sprite');
// scripts/framework/ui/Sprite.js

'use strict';

/**
 * Created by skyxu on 2019/11/27.
 */

var Sprite = cc.Class({
    extends: cc.Sprite,

    statics: {
        // 工厂方法
        createNode: function createNode(params) {
            var node = new cc.Node();
            node.addComponent(zy.Sprite);
            zy.Sprite.updateNode(node, params);
            return node;
        },

        updateNode: function updateNode(node, params) {
            var sprite = node.getComponent(cc.Sprite);

            var url = params.url;
            var spriteFrame = params.spriteFrame;
            var loadCallback = params.loadCallback;

            var updateFunc = function updateFunc(_spriteFrame) {
                if (_spriteFrame) {
                    sprite.spriteFrame = _spriteFrame;
                }
                // cc.Sprite.State.NORMAL : cc.Sprite.State.GRAY // 2.0
                // cc.Scale9Sprite.state.NORMAL : GRAY : DISTORTION // 1.0
                if (params.hasOwnProperty('state')) {
                    sprite.setState(params.state);
                }

                // 叠加模式
                if (params.srcBlendFactor) {
                    sprite.srcBlendFactor = params.srcBlendFactor;
                }

                // 叠加模式
                if (params.dstBlendFactor) {
                    sprite.dstBlendFactor = params.dstBlendFactor;
                }

                // 再次刷新Node
                // 创建图片时 父节点已被销毁
                if (!params.hasOwnProperty('parent') || cc.isValid(params.parent)) {
                    zy.Node.updateNode(node, params);
                }
            };

            if (url) {
                sprite.url = url;
                cc.loader.loadRes(url, cc.SpriteFrame, null, function (err, spriteFrame) {
                    if (!err) {
                        if (cc.isValid(node) && sprite.url == url) {
                            sprite.spriteFrame = spriteFrame;
                            updateFunc();
                        }
                    } else {
                        cc.error("load: " + url + " error.");
                    }
                    if (loadCallback) {
                        loadCallback(err, node);
                    }
                });
            } else if (spriteFrame) {
                updateFunc(spriteFrame);
            } else {
                updateFunc();
            }
        }
    }
});

zy.Sprite = module.exports = Sprite;

cc._RF.pop();