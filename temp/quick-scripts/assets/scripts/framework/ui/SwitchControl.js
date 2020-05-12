(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/framework/ui/SwitchControl.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5c214EcPrdAlL5yW61AqZqh', 'SwitchControl', __filename);
// scripts/framework/ui/SwitchControl.js

/**
 * Created by skyxu on 2019/12/27.
 */

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        _isOn: true,
        isOn: {
            set: function set(v) {
                this.setIsOn(v, true);
            },
            get: function get() {
                return this._isOn;
            }
        },

        interactable: true,

        bgOnSp: cc.Sprite,
        bgOffSp: cc.Sprite,
        barSp: cc.Sprite,

        switchEvents: {
            default: [],
            type: cc.Component.EventHandler
        }
    },

    setIsOn: function setIsOn(isOn) {
        var ani = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        this._isOn = isOn;
        this._updateState(ani);
    },
    _updateState: function _updateState(ani) {
        var posX = this.isOn ? this.bgOffSp.node.x : this.bgOnSp.node.x;
        if (CC_EDITOR || !ani) {
            this.barSp.node.x = posX;
        } else {
            this.barSp.node.stopAllActions();
            this.barSp.node.runAction(cc.moveTo(0.1, cc.v2(posX, this.barSp.node.y)));
        }
    },
    onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    },
    onClick: function onClick(event) {
        if (!this.interactable) {
            return;
        }
        this.isOn = !this.isOn;
        if (this.switchEvents) {
            cc.Component.EventHandler.emitEvents(this.switchEvents, this);
        }
    },
    start: function start() {}
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
        //# sourceMappingURL=SwitchControl.js.map
        