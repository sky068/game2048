(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/framework/ui/Button.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cab9bUXOXBDk6Oo/t2eesSG', 'Button', __filename);
// scripts/framework/ui/Button.js

'use strict';

/**
 * Created by skyxu on 2019/11/27.
 * 适用于ccc2.x版本
 */

//2.0 HitTest

var mat4 = {};
var _mat4 = function _mat4(m00, m01, m02, m03, m04, m05, m06, m07, m08, m09, m10, m11, m12, m13, m14, m15) {
    this.m00 = m00;
    this.m01 = m01;
    this.m02 = m02;
    this.m03 = m03;
    this.m04 = m04;
    this.m05 = m05;
    this.m06 = m06;
    this.m07 = m07;
    this.m08 = m08;
    this.m09 = m09;
    this.m10 = m10;
    this.m11 = m11;
    this.m12 = m12;
    this.m13 = m13;
    this.m14 = m14;
    this.m15 = m15;
};
mat4.create = function () {
    return new _mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
};

mat4.invert = function (out, a) {
    var a00 = a.m00,
        a01 = a.m01,
        a02 = a.m02,
        a03 = a.m03,
        a10 = a.m04,
        a11 = a.m05,
        a12 = a.m06,
        a13 = a.m07,
        a20 = a.m08,
        a21 = a.m09,
        a22 = a.m10,
        a23 = a.m11,
        a30 = a.m12,
        a31 = a.m13,
        a32 = a.m14,
        a33 = a.m15;

    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
        return null;
    }
    det = 1.0 / det;

    out.m00 = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out.m01 = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out.m02 = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out.m03 = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out.m04 = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out.m05 = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out.m06 = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out.m07 = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out.m08 = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out.m09 = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out.m10 = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out.m11 = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out.m12 = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out.m13 = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out.m14 = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out.m15 = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};

var vec2 = {};
vec2.transformMat4 = function (out, a, m) {
    var x = a.x,
        y = a.y;
    out.x = m.m00 * x + m.m04 * y + m.m12;
    out.y = m.m01 * x + m.m05 * y + m.m13;
    return out;
};

var math = {
    mat4: mat4,
    vec2: vec2
};

var _mat4_temp = math.mat4.create();

var Button = cc.Class({
    extends: cc.Button,

    statics: {
        // 工厂方法
        createNode: function createNode(params) {
            var node = new cc.Node();
            node.addComponent(zy.Sprite);
            zy.Sprite.updateNode(node, params);

            node.addComponent(zy.Button);

            zy.Button.updateNode(node, params);

            return node;
        },

        // 更新ButtonNode
        updateNode: function updateNode(node, params) {
            var button = node.getComponent(zy.Button);
            if (!button) {
                button = node.getComponent(cc.Button);
            }

            var eventHandler = params.eventHandler;

            if (params.hasOwnProperty('touchAction')) {
                button.touchAction = params.touchAction;
            }

            if (params.hasOwnProperty('commonClickAudio')) {
                button.commonClickAudio = params.commonClickAudio;
            }

            if (eventHandler) {
                var clickEventHandler = new cc.Component.EventHandler();
                clickEventHandler.target = eventHandler.target; //这个 node 节点是你的事件处理代码组件所属的节点
                clickEventHandler.component = eventHandler.component; //这个是代码文件名
                clickEventHandler.customEventData = eventHandler.customEventData;
                clickEventHandler.handler = eventHandler.handler;
                button.clickEvents.push(clickEventHandler);
            }

            // 是否自动置灰
            if (params.hasOwnProperty('enableAutoGrayEffect')) {
                button.enableAutoGrayEffect = params.enableAutoGrayEffect;
            }

            // 可交互
            if (params.hasOwnProperty('interactable')) {
                button.interactable = params.interactable;
            }

            zy.Node.updateNode(node, params);
        }
    },

    properties: {
        touchAction: {
            override: true,
            default: true,
            tooltip: 'display custom action'
        },
        commonClickAudio: {
            default: true,
            tooltip: 'common click audio'
        },
        isPolygonCollider: {
            default: false,
            tooltip: 'is polygon collider'
        },
        polygonPoints: {
            visible: function visible() {
                return this.isPolygonCollider === true;
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.physics.physics_collider.points',
            default: function _default() {
                return [];
            },
            type: [cc.Vec2]
        },
        brightTargets: {
            default: function _default() {
                return [];
            },
            type: [cc.Node]
        }
    },

    onLoad: function onLoad() {
        this.touchScaleAction = null;
        this.touchScaleRatio = 0.8;

        // 2.2.0之后无效
        if (!CC_EDITOR) {
            // 重设点击区域
            // this.node.__hitTest = this.node._hitTest;
            // this.node._hitTest = this._hitTest;
        }
    },

    _polygonCheckRect: function _polygonCheckRect(_point) {
        var point = this.node.convertToNodeSpaceAR(_point);
        if (point.x < -this.node.width / 2 || point.x > this.node.width / 2 || point.y < -this.node.height / 2 || point.y > this.node.height / 2) {
            return false;
        }
        var i = void 0,
            j = void 0,
            c = false;
        var nvert = this.polygonPoints.length;
        for (i = 0, j = nvert - 1; i < nvert; j = i++) {
            if (this.polygonPoints[i].y > point.y != this.polygonPoints[j].y > point.y && point.x < (this.polygonPoints[j].x - this.polygonPoints[i].x) * (point.y - this.polygonPoints[i].y) / (this.polygonPoints[j].y - this.polygonPoints[i].y) + this.polygonPoints[i].x) c = !c;
        }
        return c;
    },

    _polygonCheckIn: function _polygonCheckIn(point) {
        if (!this.isPolygonCollider || this.polygonPoints.length <= 2) {
            return true;
        } else {
            return this._polygonCheckRect(point);
        }
    },

    // 2.0
    _hitTest: function _hitTest(point, listener) {
        var w = this._contentSize.width,
            h = this._contentSize.height,
            cameraPt = cc.v2(),
            testPt = cc.v2();

        var camera = cc.Camera.findCamera(this);
        if (camera) {
            camera.getScreenToWorldPoint(point, cameraPt);
        } else {
            cameraPt.set(point);
        }

        this._updateWorldMatrix();
        math.mat4.invert(_mat4_temp, this._worldMatrix);
        math.vec2.transformMat4(testPt, cameraPt, _mat4_temp);
        testPt.x += this._anchorPoint.x * w;
        testPt.y += this._anchorPoint.y * h;

        // 重写判定区域
        var minX = 0;
        var minY = 0;
        var button = this.getComponent(cc.Button);
        if (button && button.touchAction && button._pressed) {
            var offsetX = w * button.nodeScaleX * (1 - button.touchScaleRatio) / 2;
            var offsetY = h * button.nodeScaleY * (1 - button.touchScaleRatio) / 2;
            minX -= offsetX;
            minY -= offsetY;
            w += offsetX;
            h += offsetY;
            // cc.log(testPt.x, testPt.y, offsetX, offsetY, w, h);
        }

        if (testPt.x >= minX && testPt.y >= minY && testPt.x <= w && testPt.y <= h) {
            if (listener && listener.mask) {
                var mask = listener.mask;
                var parent = this;
                for (var i = 0; parent && i < mask.index; ++i, parent = parent.parent) {}
                // find mask parent, should hit test it
                if (parent === mask.node) {
                    var comp = parent.getComponent(cc.Mask);
                    return comp && comp.enabledInHierarchy ? comp._hitTest(cameraPt) : true;
                }
                // mask parent no longer exists
                else {
                        listener.mask = null;
                        return true;
                    }
            } else {
                return true;
            }
        } else {
            return false;
        }
    },
    _onTouchBegan: function _onTouchBegan(event) {
        this._super(event);
        if (!this.interactable || !this.enabledInHierarchy) return;

        // 高亮 _updateState后
        this._setBrightEffect(true);

        if (!this.touchAction) return;

        // cc.log('_onTouchBegan', event);
        if (this.touchScaleAction) {
            this.node.stopAction(this.touchScaleAction);
            this.node.scaleX = this.nodeScaleX;
            this.node.scaleY = this.nodeScaleY;
        } else {
            this.nodeScaleX = this.node.scaleX;
            this.nodeScaleY = this.node.scaleY;
        }

        this.touchScaleAction = cc.sequence(cc.scaleTo(0.08, this.touchScaleRatio * this.nodeScaleX, this.touchScaleRatio * this.nodeScaleY), cc.callFunc(function () {
            this.touchScaleAction = null;
        }.bind(this)));

        this.node.runAction(this.touchScaleAction);
    },
    _onTouchMove: function _onTouchMove(event) {
        //cc.log('_onTouchMove', event);
        this._super(event);
        if (!this.interactable || !this.enabledInHierarchy || !this._pressed) return;
    },
    _onTouchEnded: function _onTouchEnded(event) {
        // cc.log('_onTouchEnded', event);
        // this._super(event);
        if (this.commonClickAudio) {
            // 通用音效
            zy.audio.playEffect(zy.audio.Effect.CommonClick);
        }
        if (!this.interactable || !this.enabledInHierarchy) {
            this._resetScale();
            return;
        }
        // 高亮还原 _updateState前
        this._setBrightEffect(false);

        if (this._pressed) {
            cc.Component.EventHandler.emitEvents(this.clickEvents, event);
            this.node.emit('click', this);
        }
        this._pressed = false;
        this._updateState();
        event.stopPropagation();

        this._endTouchScaleAction();
    },
    _onTouchCancel: function _onTouchCancel() {
        // cc.log('_onTouchCancel');
        // 高亮还原 _updateState前
        this._setBrightEffect(false);

        this._super();
        if (!this.interactable || !this.enabledInHierarchy) {
            this._resetScale();
            return;
        }
        this._endTouchScaleAction();
    },


    _resetScale: function _resetScale() {
        if (!this.touchAction) return;

        if (this.touchScaleAction) {
            this.node.stopAction(this.touchScaleAction);
            this.touchScaleAction = null;
        }

        if (this.nodeScaleX && this.nodeScaleY) {
            this.node.scaleX = this.nodeScaleX;
            this.node.scaleY = this.nodeScaleY;
        }
    },

    _endTouchScaleAction: function _endTouchScaleAction() {
        if (!this.touchAction) return;

        if (this.touchScaleAction) {
            this.node.stopAction(this.touchScaleAction);
            this.node.scaleX = this.nodeScaleX * this.touchScaleRatio;
            this.node.scaleY = this.nodeScaleY * this.touchScaleRatio;
            this.touchScaleAction = null;
        }

        this.touchScaleAction = cc.sequence(cc.scaleTo(0.08, this.nodeScaleX * 1.1, this.nodeScaleY * 1.1), cc.scaleTo(0.08, this.nodeScaleX * 0.9, this.nodeScaleY * 0.9), cc.scaleTo(0.08, this.nodeScaleX * 1, this.nodeScaleY * 1), cc.callFunc(function () {
            this.touchScaleAction = null;
        }.bind(this)));
        this.node.runAction(this.touchScaleAction);
    },


    _setBrightEffect: function _setBrightEffect(bright) {
        if (this.brightTargets.length != 0) {
            var shader = bright ? zy.shaderUtils.Effect.Bright : zy.shaderUtils.Effect.Normal;

            for (var i in this.brightTargets) {
                var _node = this.brightTargets[i];
                if (_node.getComponent(cc.Sprite)) {
                    var component = _node.getComponent(cc.Sprite);
                    var state = component.getState();
                    // 置灰状态无高亮
                    if (bright && state != 1) {
                        zy.shaderUtils.setShader(component, shader);
                    } else {
                        component.setState(state);
                    }
                } else if (_node.getComponent(sp.Skeleton)) {
                    var _component = _node.getComponent(sp.Skeleton);
                    zy.shaderUtils.setShader(_component, shader);
                }
            }
        }
    },

    onDisable: function onDisable() {
        this._super();
        if (!this.touchAction) return;

        this._resetScale();
    }
});

zy.Button = module.exports = Button;

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
        //# sourceMappingURL=Button.js.map
        