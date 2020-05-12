/**
 * Created by skyxu on 2019/12/16.
 */

const i18n = require('i18n');

const Label = cc.Class({
    extends: cc.Label,

    statics: {
        // 工厂方法
        createNode: function (params) {
            let node = new cc.Node();
            node.addComponent(zy.Label);
            zy.Label.updateNode(node, params);
            return node;
        },

        updateNode: function (node, params) {
            let label = node.getComponent(zy.Label);
            if (!label) {
                label = node.getComponent(cc.Label);
            }
            let font = params.font ? params.font : zy.constData.Font.FONT_NORMAL;
            let loadCallback = params.loadCallback;
            let systemFont = params.systemFont; // 系统字体 默认为FONT_NORMAL

            let updateFunc = function () {
                if (params.overflow) {
                    label.overflow = params.overflow;
                }

                if (params.hasOwnProperty('string')) {
                    label.string = params.string;
                }

                if (params.hasOwnProperty('verticalAlign')) {
                    label.verticalAlign = params.verticalAlign;
                }

                if (params.fontSize) {
                    label.fontSize = params.fontSize
                }

                if (params.outlineWidth || params.outlineColor) {
                    let outline = node.getComponent(cc.LabelOutline);
                    if (!outline) {
                        outline = node.addComponent(cc.LabelOutline);
                    }
                    if (params.outlineWidth) {
                        outline.width = params.outlineWidth;
                    }
                    if (params.outlineColor) {
                        outline.color = params.outlineColor;
                    }
                }
            }.bind(this);

            if (!systemFont) {
                cc.loader.loadRes(font, cc.Font, null, function (err, _font) {
                    if (!err) {
                        if (cc.isValid(node)) {
                            // 字体
                            label.font = _font;

                            updateFunc();
                        }
                    } else {
                        cc.log('zy.Label.updateLabel err:', err);
                    }

                    if (loadCallback) {
                        loadCallback(err, node);
                    }

                }.bind(this));
            } else {
                updateFunc();

                if (loadCallback) {
                    loadCallback(null, node);
                }
            }

            zy.Node.updateNode(node, params);
        },


        // 创建属性文本 label+img+label...
        createAttrNode: function (attrs, params) {
            let attrNode = zy.Node.createNode(params);

            // 添加Layout
            let layout = attrNode.addComponent(cc.Layout);
            layout.type = cc.Layout.Type.HORIZONTAL;
            layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;

            // 附加节点
            let subNodes = [];
            for (const i in attrs) {
                let subNode = null;

                const attr = attrs[i];
                attr.anchor = attr.anchor ? attr.anchor : cc.v2(0, 0.5);
                // attr.position = cc.v2(0, 0);
                attr.parent = attrNode;

                if (attr.type == 'text') {

                    subNode = zy.Label.createNode(attr);

                    if (attr.color) {
                        subNode.color = attr.color;
                    }

                }
                // else if (attr.type == 'img') {
                //     if (attr.resType) {
                //         attr.url = Data.getResItemUrl(attr.resType, attr.resId);
                //     }
                //
                //     let scale = attr.scale;
                //     delete attr.scale;
                //
                //     attr.loadCallback = function (err, node) {
                //         node.width = node.width * scale;
                //         node.height = node.height * scale;
                //     }
                //
                //     subNode = zy.Sprite.createNode(attr);
                //     subNode.__scale = scale;
                // }

                subNode.__type = attr.type;

                subNodes.push(subNode);

            }

            attrNode.subNodes = subNodes;

            return attrNode;
        },

        // 更新属性文本
        updateAttrNode: function (node, attrs, params) {
            // 附加节点
            let subNodes = node.subNodes;

            for (const i in attrs) {
                const attr = attrs[i];

                let subNode = subNodes[i];
                let __type = subNode.__type;

                if (__type == 'text') {
                    zy.Label.updateNode(subNode, attr);
                }
                // else if (__type == 'img') {
                //     if (attr.scale) {
                //         subNode.__scale = attr.scale;
                //         delete attr.scale;
                //     }
                //
                //     if (attr.resType) {
                //         attr.url = Data.getResItemUrl(attr.resType, attr.resId);
                //     }
                //
                //     attr.loadCallback = function () {
                //         if (subNode.__scale) {
                //             subNode.width = subNode.width * subNode.__scale;
                //             subNode.height = subNode.height * subNode.__scale;
                //         }
                //     }
                //
                //     zy.Sprite.updateNode(subNode, attr);
                // }
            }
        },
    },

    properties: {
        textKey: {
            override: true,
            default: '',
            multiline: true,
            tooltip: 'Enter i18n key here',
            notify: function () {
                this.string = this.localizedString;
            }
        },
        textValueOption: {
            override: true,
            default: '',
            multiline: true,
            tooltip: 'Enter textValueOption here',
            notify: function (oldValue) {
                this.string = this.localizedString;
            },
        },
        localizedString: {
            override: true,
            tooltip: 'Here shows the localized string of Text Key',
            get: function () {
                let _textKeyOption;
                if (this.textValueOption && this.textValueOption != '') {
                    try {
                        _textKeyOption = JSON.parse(this.textValueOption);
                    } catch (error) {
                        // cc.log('Please set label text key in Text Value Option.');
                    }
                }
                return i18n.t(this.textKey, _textKeyOption);
            },
            set: function (value) {
                this.textKey = value;
                if (CC_EDITOR) {
                    cc.warn('Please set label text key in Text Key property.');
                }
            }
        },
    },

    onLoad: function () {
        if (this.localizedString) {
            this.string = this.localizedString;
        }
    },

});

zy.Label = module.exports = Label;