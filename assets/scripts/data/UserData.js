/**
 * Created by skyxu on 2019/11/27.
 *
 * 玩家在游戏中动态修改的数据
 */

cc.Class({
    ctor() {
        this.curLevel = 1; // 当前等级
    },

    saveData() {
        let obj = {};
        for (let key of Object.keys(this)) {
            obj[key] = this[key];
        }
        let data = JSON.stringify(obj);
        cc.sys.localStorage.setItem(zy.constData.StaticKey.PlayerDataKey + zy.constData.StaticKey.SaveDataVersion, data);
    },

    loadData() {
        let data = cc.sys.localStorage.getItem(zy.constData.StaticKey.PlayerDataKey + zy.constData.StaticKey.SaveDataVersion);
        if (data) {
            data = JSON.parse(data);
            for (let key of Object.keys(data)) {
                if (this.hasOwnProperty(key)) {
                    this[key] = data[key];
                }
            }
        }
    }
});