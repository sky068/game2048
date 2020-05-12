"use strict";
cc._RF.push(module, 'b4036SOD9lMEK0kFdgVPqge', 'CornerMng');
// scripts/framework/common/CornerMng.js

"use strict";

var _UI_CONFIG;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Created by skyxu on 2019/12/11.
 *
 * 红点系统
 */

var CornerType = cc.Enum({
    // 服务器下发红点

    // 客户端自定义红点
    CORNER_ID_UPGRADE_OTHER: 1001,
    CORNER_ID_UPGRADE_TOWER: 1010,
    CORNER_ID_FREE_COINS: 1020
});

/**
 * 自定义红点配置，一个id可以对应多个红点id
 * 比如id a对应b和c，只要满足b或者满足c则注册a的节点均显示红点
 * @type {{}}
 */
var CornerConfig = {
    // [CornerType.CORNER_ID_FREE_COINS]: [CornerType.CORNER_ID_FREE_COINS, CornerType.CORNER_ID_UPGRADE_OTHER],
};

// 红点位置等配置信息
var UI_CONFIG = (_UI_CONFIG = {}, _defineProperty(_UI_CONFIG, CornerType.CORNER_ID_UPGRADE_OTHER, { offset: cc.v2(-10, -10) }), _defineProperty(_UI_CONFIG, CornerType.CORNER_ID_UPGRADE_TOWER, { offset: cc.v2(-10, -10) }), _defineProperty(_UI_CONFIG, CornerType.CORNER_ID_FREE_COINS, { offset: cc.v2(-10, -10) }), _UI_CONFIG);

// 服务器通用更新标识
var OPFlag = cc.Enum({
    NORMAL: 0, // 无
    NEW: 1, // 新的
    UPDATE: 2, // 更新
    DELETE: 3 // 删除
});

var CORNER_ZINDEX = 9999;

cc.Class({
    extends: cc.Component,

    statics: {
        CornerType: CornerType, // 注册红点类型
        CornerConfig: CornerConfig,
        UI_CONFIG: UI_CONFIG,

        prepare: function prepare() {
            // 红点信息列表
            this.cornerList = {};
            // 激活节点列表
            this.cornerUI = {};
        },
        init: function init(data) {
            this.prepare();
            this.initData(data);
        },
        initData: function initData(data) {
            this.updateCorner(data);
        },


        // 注册节点
        registOn: function registOn(node, cornerType) {
            if (node && cc.isValid(node)) {
                if (!this.cornerUI[cornerType]) {
                    this.cornerUI[cornerType] = [];
                }
                this.cornerUI[cornerType].push(node);
            }
            this.updateNode(cornerType);
        },


        // 取消注册
        registOff: function registOff(cornerType) {
            if (this.cornerUI[cornerType]) {
                delete this.cornerUI[cornerType];
            }
        },
        addClientCorner: function addClientCorner(id) {
            this.updateCorner([{
                id: id,
                flag: OPFlag.NEW
            }]);
        },
        deleteClientCorner: function deleteClientCorner(id) {
            this.updateCorner([{
                id: id,
                flag: OPFlag.DELETE
            }]);
        },
        getCornerData: function getCornerData(id) {
            return this.cornerList[id];
        },
        updateCorner: function updateCorner(data) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var c = _step.value;

                    var id = c.id || 0;
                    if (c.flag == OPFlag.DELETE) {
                        delete this.cornerList[id];
                    } else {
                        this.cornerList[id] = 1;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            if (data && data.length > 0) {
                this.updateAllCorner();
            }
        },
        updateAllCorner: function updateAllCorner() {
            for (var cornerType in this.cornerUI) {
                this.updateNode(cornerType);
            }
        },
        updateNode: function updateNode(cornerTpe) {
            var nodeList = this.cornerUI[cornerTpe];
            if (!nodeList) {
                return;
            }

            // 位置转换
            var getPosition = function getPosition(node, cfg) {
                var anchor = node.getAnchorPoint();
                var posX = node.width * (1 - anchor.x);
                var posY = node.height * (1 - anchor.y);
                if (cfg) {
                    posX += cfg.offset.x;
                    posY += cfg.offset.y;
                }

                return cc.v2(posX, posY);
            };

            // 添加红点
            var corner = this.checkCorner(cornerTpe);
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = nodeList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var node = _step2.value;

                    if (node && cc.isValid(node)) {
                        if (corner) {
                            var cornerNode = node.getChildByName("CORNER_NODE_UI"); // 红点node
                            if (!cornerNode) {
                                var uiCfg = UI_CONFIG[cornerTpe];
                                var srcUrl = uiCfg && uiCfg.src || 'textures/common/red_dot';
                                var srcScale = uiCfg && uiCfg.scale || 1;

                                cornerNode = zy.Node.createNode({
                                    zIndex: CORNER_ZINDEX,
                                    name: "CORNER_NODE_UI",
                                    parent: node
                                });
                                cornerNode.addComponent(zy.Sprite);
                                zy.Sprite.updateNode(cornerNode, {
                                    url: srcUrl,
                                    scale: srcScale
                                });

                                if (cc.isValid(cornerNode)) {
                                    var cornerPos = getPosition(node, uiCfg);
                                    cornerNode.position = cornerPos;
                                }
                            }

                            if (cc.isValid(cornerNode)) {
                                cornerNode.active = true;
                            }
                        } else {
                            var _cornerNode = node.getChildByName("CORNER_NODE_UI"); // 红点node
                            if (_cornerNode && cc.isValid(_cornerNode)) {
                                _cornerNode.active = false;
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        },
        checkCorner: function checkCorner(id) {
            if (this.cornerList[id]) {
                return true;
            } else {
                var cfg = CornerConfig[id] || [];
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = cfg[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var _id = _step3.value;

                        if (this.cornerList[_id]) {
                            return true;
                        } else if (CornerConfig[_id] && this.checkCorner(_id)) {
                            return true;
                        }
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }
            }

            return false;
        },
        clean: function clean() {
            this.prepare();
        }
    }
});

cc._RF.pop();