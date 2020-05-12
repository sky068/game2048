/**
 * Created by skyxu on 2019/11/25.
 *
 * 数据管理, 配置数据读取, 保存读取本读数据
 */

let LevelData = require("./LevelData");
let UserData = require("./UserData");
let DataBase = require("./DataBase");

cc.Class({
    ctor() {
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
    loadDataFromLocalFile(progressCb, completeCb) {
        // 读取本地保存的用户数据
        this.loadSavedData();

        // 读取配置文件数据
        let keys = Object.keys(this);
        cc.log("====keys1: %s", JSON.stringify(keys));
        keys = keys.filter((k)=>{
            return this.hasOwnProperty(k) && (this[k] instanceof DataBase);
        });
        cc.log("====keys2: %s", JSON.stringify(keys));

        for (let key of keys) {
            let obj = this[key];
            let fileName = obj.fileDir;
            cc.loader.loadRes(fileName, cc.JsonAsset, (err, data)=>{
                if (err) {
                    cc.error("load local data: " + fileName + ", error: " + err);
                } else {
                    if (obj.initData) {
                        obj.initData.call(obj, data.json);
                    }
                }

                this.loadCounts ++;
                if (progressCb) {
                    progressCb(this.loadCounts, keys.length);
                }
                if (this.loadCounts >= keys.length) {

                    if (completeCb) {
                        completeCb();
                    }
                }
            });
        }
    },

    // 从localStorage读取数据
    loadSavedData() {
        this.userData.loadData();
    },
    // 保存数据到localStorage
    saveDataToLocal() {
        this.userData.saveData();
    }
});
