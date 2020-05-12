/**
 * Created by skyxu on 2019/12/27.
 */

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        _isOn: true,
        isOn: {
            set (v) {
                this.setIsOn(v, true);
            },
            get () {
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
        },
    },

    setIsOn (isOn, ani=true) {
        this._isOn = isOn;
        this._updateState(ani);
    },

    _updateState (ani) {
        let posX = this.isOn ? this.bgOffSp.node.x : this.bgOnSp.node.x ;
        if (CC_EDITOR || !ani) {
            this.barSp.node.x = posX;
        } else {
            this.barSp.node.stopAllActions();
            this.barSp.node.runAction(cc.moveTo(0.1, cc.v2(posX, this.barSp.node.y)));
        }
    },

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    },

    onClick (event) {
        if (!this.interactable){
            return;
        }
        this.isOn = !this.isOn;
        if (this.switchEvents){
            cc.Component.EventHandler.emitEvents(this.switchEvents, this);
        }
    },

    start () {

    }
});
