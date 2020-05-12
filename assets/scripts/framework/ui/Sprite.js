/**
 * Created by skyxu on 2019/11/27.
 */

const Sprite = cc.Class({
    extends: cc.Sprite,

    statics: {
        // 工厂方法
        createNode: function (params) {
            let node = new cc.Node();
            node.addComponent(zy.Sprite);
            zy.Sprite.updateNode(node, params);
            return node;
        },

        updateNode: function (node, params) {
            let sprite = node.getComponent(cc.Sprite);

            let url = params.url;
            let spriteFrame = params.spriteFrame;
            let loadCallback = params.loadCallback;

            let updateFunc = function (_spriteFrame) {
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
                cc.loader.loadRes(url, cc.SpriteFrame, null, (err, spriteFrame) => {
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
        },
    },
});

zy.Sprite = module.exports = Sprite;