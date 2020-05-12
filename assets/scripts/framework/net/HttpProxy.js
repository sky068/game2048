/**
 * Created by skyxu on 2018/7/13.
 */

"use strict";

let GameHttp = require("./GameHttp");
let Md5 = require("./../encrypt/Md5").md5_hex_hmac;
let UtilsCross = require("./../platform/PlatformUtils");

let UCRETRY = 5;  // ucai统计最多重连5次
let LOGINRETRY = 5;  // 登陆重连次数

// let urlroot = "http://192.168.132.71:8080/zc_game?m="; // 内网
// let urlroot = "http://106.75.93.189:8080/zc_game?m="; // 外网

let port = [8010,8011,8012,8015,8016,8017][Math.round(Math.random() * 5)];
let urlroot = "http://mini-game.zhanyougame.com:" + port + "/zc_game?m="; // 外网 8010,8011,8012,8015,8016,8017

let encryptKey = "zygame";

let HttpProxy = cc.Class({
    statics: {
        instance: null,
        getInstance() {
            if (!this.instance) {
                this.instance = new HttpProxy();
            }
            return this.instance;
        }
    },

    /**
     * 登陆游戏
     * @param onSuc
     * @param onFailed
     */
    login(onSuc, onFailed){
        cc.log("===urlroot:" + urlroot);

        let data = {
            energy: 1,  // 次元能量
            // focusingatt: GameManager.getCurrSkillTime(),  // 聚焦协同攻击时间
            // vip: GameManager.getPlayerLevel(),  // vip等级
            otherpassplies: 1,  // 次元关卡通关层数
            // kaleidoscopeatt: GameManager.getCurrSkillTime(),  // 万花筒协同攻击时间
            // salvoatt: GameManager.getCurrSkillTime(),  // 齐射协同攻击时间
            loginday: 1,  // 登陆天数
            diamond: 10,  // 钻石数量
            // gold: GameManager.getPlayerGold(),  // 金币数量
            allautoatt: 10, // 主炮塔自动攻击时间
            normalpassplies: 1,  // 普通通关层数
            cversion: UtilsCross.getAppVersion(),  // 客户端版本号
            healthlevel: zy.dataMng.userData.hpLevel,
            goldrewardlevel: zy.dataMng.userData.freeCoinsLevel,
            // level: GameManager.getLevel(),
            // experience: GameManager.getPlayer_UpgradeprogressNum(), // 升星经验值
            stamina: zy.dataMng.userData.phPower, // 体力值
            channel: CHANNEL_ID,
            macaddress: zy.device.mac,
            idfa: zy.device.idfa,


        };
        let url = urlroot + "user_join_game";
        let failCb = ()=>{
            if (onFailed) {
                onFailed();
            }
            if (LOGINRETRY > 0) {
                LOGINRETRY -= 1;
                setTimeout(()=>{
                    this.login();
                }, 5000);
            }
        };

        this.serverRequest(url, data, onSuc, failCb);
    },

    /**
     * 更新玩家基础信息
     * @param id{Number} 0金币,1钻石,2vip等级,3登录天数,4普通通关层数,5次元能量,6次元关
     * @param value
     * @param onSuc
     * @param onFailed
     */
    updateBase(id, value, onSuc, onFailed) {
        let data = {
            baseinfoid: id,
            value: value,
        };

        let url = urlroot + "base_info_change";
        this.serverRequest(url, data, onSuc, onFailed);
    },

    /**
     * 炮塔更新
     * @param onSuc
     * @param onFailed
     *
     * 炮塔id 0:加特林机枪,1:镭射炮,2:冰枪,3:火舌,4:电磁,5:榴弹炮
     * lock 0:未解锁，1:解锁
     */
    updateTurret(id, level, star, lock, onSuc, onFailed){
        let data = {
            level: level,// 火力等级
            turretid: id, // id
            star: star, // 星
            lock: lock, // 1
        };

        let url = urlroot + "turret_info";
        this.serverRequest(url, data, onSuc, onFailed);
    },

    /**
     * 建筑更新
     * @param onSuc
     * @param onFailed
     *
     * 科技建筑id 0:资源中心,1:科技研究院
     * 是否解锁：0:未解锁，1:解锁
     **/
    updateBuilding(id, lock, onSuc, onFailed) {
        let data = {
            buildingid: id,
            lock: lock,
        };
        let url = urlroot + "building_info";
        this.serverRequest(url, data, onSuc, onFailed);
    },

    /**
     * 宝物信息更新
     * @param onSuc
     * @param onFailed
     */
    updateTreasure(id, lock, onSuc, onFailed) {
        let data = {
            treasureid: id,
            lock: lock,
        };
        let url = urlroot + "treasure_info";
        this.serverRequest(url, data, onSuc, onFailed);
    },

    /**
     * 观看广告
     * @param placeId {string} 广告位
     * @param onSuc
     * @param onFailed
     */
    watchAds(placeId, onSuc, onFailed) {
        let data = {
            adstationid: placeId,
        };
        let url = urlroot + "watch_advertisement";
        this.serverRequest(url, data, onSuc, onFailed);
    },

    /**
     * 点击按钮
     * @param btnId {string} 按钮名字（要唯一）
     * @param onSuc
     * @param onFailed
     */
    clickButton(btnId, onSuc, onFailed) {
        let data = {
            buttonid: btnId,
        };
        let url = urlroot + "click_button";
        this.serverRequest(url, data, onSuc, onFailed);
    },

    getServerTime(onSuc, onFailed) {
        let data = {
        };
        let url = urlroot + "request_unixtime";
        this.serverRequest(url, data, onSuc, onFailed);
    },

    /**
     *
     * @param url
     * @param data
     * @param onSuc
     * @param onFailed
     */
    serverRequest(url, data, onSuc, onFailed){
        cc.log("===>serverRequest: " + typeof data + " | " + JSON.stringify(data));
        data = typeof data == "string" ? data : JSON.stringify(data);
        // 加密校验传输
        let encryptStr = Md5(encryptKey, data);
        let uid = UtilsCross.getMobilePhoneID();
        uid = uid == undefined ? "" : uid;
        cc.log("uid=" + uid);
        let newData = {
            data: JSON.parse(data),
            encrypt: encryptStr,
            roleid: uid,
            token: ""
        };

        newData = JSON.stringify(newData);

        GameHttp.httpPost(url, newData, (rep)=>{
            cc.log("===>response:" + rep.getBody());
            if (rep.isOk()){
                cc.log("===>requrest: " + url + " 成功。");
                if (onSuc){
                    onSuc(JSON.parse(rep.getBody()));
                }
            } else {
                cc.log("===>requrest: " + url + " 失败。");
                if (onFailed){
                    onFailed(rep.getError() || rep.getBody());
                }
            }
        });
    }
});
