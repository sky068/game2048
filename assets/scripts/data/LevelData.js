/**
 * Created by xujiawei on 2020-04-30 17:14:55
 */

let Utils = require("./../framework/common/UtilsOther");
let DataBase = require("./DataBase");

cc.Class({
    extends: DataBase,

    ctor() {
        this.fileDir = "config/levelCfg";
    },

    initData(data) {
        if (!data) {
            return;
        }
        this.dataObj = data;
        this.len = this.dataObj.length;
        this.dataObj = Utils.arrayToDict(this.dataObj, "level");
    },

    getLevelData(level) {
        let data = this.dataObj[level];
        return data;
    },

    getMaxLevel() {
        return this.len;
    }
});