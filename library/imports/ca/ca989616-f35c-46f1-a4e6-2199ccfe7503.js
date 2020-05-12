"use strict";
cc._RF.push(module, 'ca989YW81xG8aTmIZnM/nUD', 'LevelData');
// scripts/data/LevelData.js

"use strict";

/**
 * Created by xujiawei on 2020-04-30 17:14:55
 */

var Utils = require("./../framework/common/UtilsOther");
var DataBase = require("./DataBase");

cc.Class({
    extends: DataBase,

    ctor: function ctor() {
        this.fileDir = "config/levelCfg";
    },
    initData: function initData(data) {
        if (!data) {
            return;
        }
        this.dataObj = data;
        this.len = this.dataObj.length;
        this.dataObj = Utils.arrayToDict(this.dataObj, "level");
    },
    getLevelData: function getLevelData(level) {
        var data = this.dataObj[level];
        return data;
    },
    getMaxLevel: function getMaxLevel() {
        return this.len;
    }
});

cc._RF.pop();