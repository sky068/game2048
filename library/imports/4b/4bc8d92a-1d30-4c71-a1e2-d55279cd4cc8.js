"use strict";
cc._RF.push(module, '4bc8dkqHTBMcaHi1VJ5zUzI', 'DataBase');
// scripts/data/DataBase.js

"use strict";

/**
 * Created by skyxu on 2019/11/26.
 */

cc.Class({
    ctor: function ctor() {
        this.dataObj = null;
        this.fileDir = ""; // 配置文件路径
    },
    initData: function initData(data) {
        if (!data) {
            return;
        }

        this.dataObj = data;
    }
});

cc._RF.pop();