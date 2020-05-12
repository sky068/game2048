/**
 * Created by skyxu on 2019/12/11.
 *
 * 红点系统
 */

const CornerType = cc.Enum({
    // 服务器下发红点

    // 客户端自定义红点
    CORNER_ID_UPGRADE_OTHER: 1001,
    CORNER_ID_UPGRADE_TOWER: 1010,
    CORNER_ID_FREE_COINS: 1020,
});

/**
 * 自定义红点配置，一个id可以对应多个红点id
 * 比如id a对应b和c，只要满足b或者满足c则注册a的节点均显示红点
 * @type {{}}
 */
const CornerConfig = {
    // [CornerType.CORNER_ID_FREE_COINS]: [CornerType.CORNER_ID_FREE_COINS, CornerType.CORNER_ID_UPGRADE_OTHER],
};

// 红点位置等配置信息
const UI_CONFIG = {
    [CornerType.CORNER_ID_UPGRADE_OTHER]: {offset: cc.v2(-10,-10)},
    [CornerType.CORNER_ID_UPGRADE_TOWER]: {offset: cc.v2(-10,-10)},
    [CornerType.CORNER_ID_FREE_COINS]: {offset: cc.v2(-10,-10)},
};

// 服务器通用更新标识
const OPFlag = cc.Enum({
    NORMAL: 0,  // 无
    NEW: 1,  // 新的
    UPDATE: 2,  // 更新
    DELETE: 3,  // 删除
});

const CORNER_ZINDEX = 9999;

cc.Class({
    extends: cc.Component,

    statics: {
        CornerType: CornerType,  // 注册红点类型
        CornerConfig: CornerConfig,
        UI_CONFIG: UI_CONFIG,

        prepare() {
            // 红点信息列表
            this.cornerList = {};
            // 激活节点列表
            this.cornerUI = {};
        },

        init(data) {
            this.prepare();
            this.initData(data);
        },

        initData(data) {
            this.updateCorner(data);
        },

        // 注册节点
        registOn(node, cornerType) {
            if (node && cc.isValid(node)) {
                if (!this.cornerUI[cornerType]) {
                    this.cornerUI[cornerType] = [];
                }
                this.cornerUI[cornerType].push(node);
            }
            this.updateNode(cornerType);
        },

        // 取消注册
        registOff(cornerType) {
            if (this.cornerUI[cornerType]) {
                delete this.cornerUI[cornerType];
            }
        },

        addClientCorner(id) {
            this.updateCorner([{
                id: id,
                flag: OPFlag.NEW,
            }]);
        },

        deleteClientCorner(id) {
            this.updateCorner([{
                id: id,
                flag: OPFlag.DELETE,
            }]);
        },

        getCornerData(id) {
            return this.cornerList[id];
        },

        updateCorner(data) {
            for (let c of data) {
                let id = c.id || 0;
                if (c.flag == OPFlag.DELETE) {
                    delete this.cornerList[id];
                } else {
                    this.cornerList[id] = 1;
                }
            }

            if (data && data.length > 0) {
                this.updateAllCorner();
            }
        },

        updateAllCorner() {
            for (const cornerType in this.cornerUI) {
                this.updateNode(cornerType);
            }
        },

        updateNode(cornerTpe) {
            let nodeList = this.cornerUI[cornerTpe];
            if (!nodeList) {
                return;
            }

            // 位置转换
            let getPosition = (node, cfg) => {
                let anchor = node.getAnchorPoint();
                let posX = node.width * (1 - anchor.x);
                let posY = node.height * (1 - anchor.y);
                if (cfg) {
                    posX += cfg.offset.x;
                    posY += cfg.offset.y;
                }

                return cc.v2(posX, posY);
            };

            // 添加红点
            let corner = this.checkCorner(cornerTpe);
            for (let node of nodeList) {
                if (node && cc.isValid(node)) {
                    if (corner) {
                        let cornerNode = node.getChildByName("CORNER_NODE_UI"); // 红点node
                        if (!cornerNode) {
                            let uiCfg = UI_CONFIG[cornerTpe];
                            let srcUrl = uiCfg && uiCfg.src || 'textures/common/red_dot';
                            let srcScale = uiCfg && uiCfg.scale || 1;

                            cornerNode = zy.Node.createNode({
                                zIndex: CORNER_ZINDEX,
                                name: "CORNER_NODE_UI",
                                parent: node,
                            });
                            cornerNode.addComponent(zy.Sprite);
                            zy.Sprite.updateNode(cornerNode, {
                                url: srcUrl,
                                scale: srcScale,
                            });

                            if (cc.isValid(cornerNode)) {
                                let cornerPos = getPosition(node, uiCfg);
                                cornerNode.position = cornerPos;
                            }
                        }

                        if (cc.isValid(cornerNode)) {
                            cornerNode.active = true;
                        }
                    } else {
                        let cornerNode = node.getChildByName("CORNER_NODE_UI"); // 红点node
                        if (cornerNode && cc.isValid(cornerNode)) {
                            cornerNode.active = false;
                        }
                    }
                }
            }
        },

        checkCorner(id) {
            if (this.cornerList[id]) {
                return true;
            } else {
                let cfg = CornerConfig[id] || [];
                for (const _id of cfg) {
                    if (this.cornerList[_id]) {
                        return true;
                    } else if (CornerConfig[_id] && this.checkCorner(_id)) {
                        return true;
                    }
                }
            }

            return false;
        },

        clean() {
            this.prepare();
        }
    }
});