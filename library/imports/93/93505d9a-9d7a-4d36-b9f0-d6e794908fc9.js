"use strict";
cc._RF.push(module, '935052anXpNNrnw1ueUkI/J', 'DataMng');
// scripts/data/DataMng.js

"use strict";

/**
 * Created by skyxu on 2019/11/25.
 *
 * 数据管理, 配置数据读取, 保存读取本读数据
 */

var LevelData = require("./LevelData");
var UserData = require("./UserData");
var DataBase = require("./DataBase");

cc.Class({
    ctor: function ctor() {
        this.loadCounts = 0;

        // todo: 每添加新的配置表都需要在这里创建对应的对象
        this.levelData = new LevelData();

        // 动态数据
        this.userData = new UserData();
    },


    /**
     * 读取本地配置文件
     * @param progressCb(cur,total) 进度回调
     * @param completeCb{Function} 读取结束回调
     */
    loadDataFromLocalFile: function loadDataFromLocalFile(progressCb, completeCb) {
        var _this = this;

        // 读取本地保存的用户数据
        this.loadSavedData();

        // 读取配置文件数据
        var keys = Object.keys(this);
        cc.log("====keys1: %s", JSON.stringify(keys));
        keys = keys.filter(function (k) {
            return _this.hasOwnProperty(k) && _this[k] instanceof DataBase;
        });
        cc.log("====keys2: %s", JSON.stringify(keys));

        var _loop = function _loop(key) {
            var obj = _this[key];
            var fileName = obj.fileDir;
            cc.loader.loadRes(fileName, cc.JsonAsset, function (err, data) {
                if (err) {
                    cc.error("load local data: " + fileName + ", error: " + err);
                } else {
                    if (obj.initData) {
                        obj.initData.call(obj, data.json);
                    }
                }

                _this.loadCounts++;
                if (progressCb) {
                    progressCb(_this.loadCounts, keys.length);
                }
                if (_this.loadCounts >= keys.length) {

                    if (completeCb) {
                        completeCb();
                    }
                }
            });
        };

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var key = _step.value;

                _loop(key);
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
    },


    // 从localStorage读取数据
    loadSavedData: function loadSavedData() {
        this.userData.loadData();
    },

    // 保存数据到localStorage
    saveDataToLocal: function saveDataToLocal() {
        this.userData.saveData();
    }
});

cc._RF.pop();