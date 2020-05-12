/**
 * Created by skyxu on 2018/3/13.
 * 专门用来显示数字的Label，实现滚动效果
 */

"use strict";

let UtilsOther = require('UtilsOther');

let LabelFormType = cc.Enum({
    None: 0, // 不做格式化
    ThousandSeparator: 1, // 3位分隔
    FormatTime: 2 // 格式化时间
});

/**
 *
 * @param s {Number} 秒
 * @return {string}
 */
let formatTime = function (s) {
    let t;
    if (s >= 0) {
        let hour = Math.floor(s / 3600);
        let min = Math.floor(s / 60) % 60;
        let sec = s % 60;
        let day = parseInt(hour / 24);
        if (day == 1) {
            return day + " day";
        }
        if (day > 1) {
            return day + " days";
        }

        if (day > 0) {
            hour = hour - 24 * day;
            t = day + "day " + ('00' + hour).slice(-2) + ":";
        }
        else if (hour > 0) {
            t = ('00' + hour).slice(-2) + ":";
        } else {
            t = "";
        }

        if (min < 10) {
            t += "0";
        }
        t += min + ":";
        if (sec < 10) {
            t += "0";
        }
        t += parseInt(sec);
    }
    return t;
};

cc.Class({
    extends: cc.Label,

    properties: {
        formType: {
            tooltip: 'None: 不做格式化\nThousandSeparator: 3位逗号分隔\nFormatTime: 格式化时间',
            type: LabelFormType,
            default: LabelFormType.None,
            notify: function(oldValue){
                this.setValue(this.string);
            }
        },

        animationDuration: {
            tooltip: '动画时间',
            default: 0.5
        },

        /**
         * label的实际数值
         */
        _textKey: 0,

        string: {
            override: true,
            tooltip: '必须是数字',
            get: function () {
                return this._textKey;
            },
            set: function (value) {
                // 编辑器输入默认是字符串，这里必须转成数字方便计算
                this._textKey = Number(value);
                if (this._sgNode) {
                    switch(this.formType){
                        case LabelFormType.ThousandSeparator:
                        {
                            value = value.toString().split('').reverse().join('').replace(/(\d{3}(?=\d)(?!\d+\.|$))/g, '$1,').split('').reverse().join('');
                        }
                            break;
                        case LabelFormType.FormatTime:
                        {
                            value = formatTime(value);
                        }
                            break;
                    }
                    this._sgNode.setString(value);
                    this._updateNodeSize();
                }
            }
        },

        _curValue: 0,
        _toValue: 0,
        _delta: 0
    },

    /**
     * 设置数值
     * @param {int} value
     * @param {boolean} animate 是否动画
     */
    setValue: function (value, animate) {
        if (value === "" || value === null || isNaN(value)){
            cc.assert(false, "The value of LabelInteger must be a Number!");
        }

        if(animate){
            this._toValue = value;
        }
        else{
            this._toValue = value;
            this._curValue = value;
            this.string = value;
            //this.setFormString(value.toString());
        }
        this._delta = 0;
    },

    setFormString: function(value){
        switch(this.formType){
            case LabelFormType.None:
            {
                this.string = value;
            }
                break;
            case LabelFormType.ThousandSeparator:
            {
                this.string = value.split('').reverse().join('').replace(/(\d{3}(?=\d)(?!\d+\.|$))/g, '$1,').split('').reverse().join('');
            }
                break;
            case LabelFormType.FormatTime:
            {
                this.string = formatTime(value);
            }
                break;
        }
    },

    update: function (dt) {
        if(this._toValue != this._curValue){
            if(this._delta == 0){
                this._delta = this._toValue - this._curValue;
            }
            let step = dt / this.animationDuration * this._delta;
            if(this._delta > 0){
                step = parseInt(step);
                if(step == 0){
                    step = 1;
                }
                this._curValue += step;
                this._curValue = Math.min(this._curValue, this._toValue);
            }
            else{
                step = -step;
                step = parseInt(step);
                if(step == 0){
                    step = 1;
                }
                this._curValue -= step;
                this._curValue = Math.max(this._curValue, this._toValue);
            }
            this.string = this._curValue;
            //this.setFormString(this._curValue.toString());

            if(this._toValue == this._curValue){
                this._delta = 0;
            }
        }
    },

    onLoad: function(){
        // 为了初始就显示正确的格式
        this.setValue(this.string);
    }
});
