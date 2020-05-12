/**
 * Created by skyxu on 2018/10/9.
 */

"use strict";

let GameNetwork = require("./GameNetwork");
let GameProtocols = require("./GameProtocols");
// let DataMgr = require("./../../Common/DataMgr");

let GAME_SERVER_URL = 'ws://127.0.0.1:3005';
// GAME_SERVER_URL = 'wss://echo.websocket.org';
// GAME_SERVER_URL = "ws://45.123.197.93:3005";

let NetProxy = cc.Class({
    ctor: function () {
        this.network = null;
        this._cachePushCallback = [];
    },

    init: function () {
        this.network = new GameNetwork();
        this.network.setDelegate(this);
        this.initPushCallback();
    },

    connect: function () {
        this.network.connect(GAME_SERVER_URL);
    },

    closeConnect: function () {
        this.network.closeConnect();
    },

    isNetworkOpened: function () {
        return this.network.isSocketOpened();
    },

    isNetworkClosed: function () {
        return this.network.isSocketClosed();
    },

    onNetworkOpen: function () {
        Global.eventMgr.emit(Global.config.EVENT_NETWORK_OPENED);
    },

    onNetworkClose: function () {
        Global.eventMgr.emit(Global.config.EVENT_NETWORK_CLOSED);
    },

    /**
     * 注册push回调接口
     */
    initPushCallback: function () {
        let self = this;
        let pushCallback = function (resp) {
            self.pushCallback(resp);
        };

        this.network.registerPushResponseCallback('chat', pushCallback);
        this.network.registerPushResponseCallback('exitRoom', pushCallback);
        this.network.registerPushResponseCallback('playChess', pushCallback);

        // let pushCallback = function(response){
        //     if(Util.DNN(farm.game) && farm.game.loginSuccess){
        //         this.dealCachePush();
        //         this.pushCallback(response);
        //     }else{
        //         this._cachePushCallback.push(response);
        //     }
        // }.bind(this);

        // this.network.registerPushResponseCallback('attacked', pushCallback);
        // this.network.registerPushResponseCallback('acceptWantHelp', pushCallback);
        // this.network.registerPushResponseCallback('sendSpNotify', pushCallback);
        // this.network.registerPushResponseCallback('takeSpNotify', pushCallback);
        // this.network.registerPushResponseCallback('wanted', pushCallback);
        // this.network.registerPushResponseCallback('incomplete', pushCallback);
        // this.network.registerPushResponseCallback('newFriend', pushCallback);
        // this.network.registerPushResponseCallback('news', pushCallback);
        // this.network.registerPushResponseCallback('hatredInfoSync', pushCallback);
        // this.network.registerPushResponseCallback('friendInfoSync', pushCallback);
    },

    /**
     * 注册推送
     * @param {String} key
     * @param {function(resp)} cb
     */
    registerPush(key, cb, target){
        let self = this;
        if (cb && target){
            cb = cb.bind(target);
        }
        let pushCallback = function (resp) {
            if (cb){
                cb(resp);
            }
            Global.eventMgr.emit(resp.act, resp);
        };

        this.network.registerPushResponseCallback(key, pushCallback);
    },

    /**
     * 处理缓存push
     */
    dealCachePush: function () {
        // if(this._cachePushCallback.length > 0){
        //     for(var i = 0; i < this._cachePushCallback.length; i++){
        //         this.pushCallback(this._cachePushCallback[i]);
        //     }
        // }
        // this._cachePushCallback = [];
    },

    beatHeart: function (callback) {
        let req = new GameProtocols.HeartRequest();
        req.t = Date.now();
        this.network.sendRequest(req, callback);
    },

    chat: function (msg) {
        let req = new GameProtocols.ChatRequest();
        // let uid = DataMgr.getInstance().playerObj.uid;
        let uid = "";
        req.uid = uid;
        req.msg = msg;
        this.network.sendRequest(req);
    },

    // 开始随机匹配
    randomMatch: function () {
        let req = new GameProtocols.RandomMatchRequest();
        // let uid = DataMgr.getInstance().playerObj.uid;
        let uid = "";
        req.uid = uid;
        this.network.sendRequest(req);
    },

    playChess: function (msg) {
        let req = new GameProtocols.PlayChessRequest();
        // let uid = DataMgr.getInstance().playerObj.uid;
        let uid = "";
        req.uid = uid;
        req.lastBedIndex = msg.lastBedIndex;
        req.cid = msg.cid;
        req.dest = msg.dest;
        this.network.sendRequest(req);
    },

    selectChess: function (msg) {
        let req = new GameProtocols.SelectChessRequest();
        req.cid = msg.cid;
        this.network.sendRequest(req);
    },

    createRoom: function (cb) {
        let req = new GameProtocols.CreateRoomRequest();
        this.network.sendRequest(req, cb);
    },

    joinRoom: function (rid) {
        let req = new GameProtocols.JoinRoomRequest();
        req.rid = rid;
        this.network.sendRequest(req);
    },

    /**
     * Facebook或者游客登录接口
     * @param {Object.<LoginOriginType>} origin
     * @param token
     */
    login: function (origin, token) {
        let req = new GameProtocols.LoginRequest();
        if(token) req.token = token;
        req.origin = origin;
        req.os = cc.sys.os;
        req.osVersion = cc.sys.osVersion;

        // let uid = DataMgr.getInstance().playerObj.uid;
        let uid = "";
        req.uid = uid;
        // req.language = cc.sys.language;//farm.FarmPlatformHelper.jsToOc(farm.FarmPlatformHelper.JSB_EVENT_JTO_GetCurrentLanguage);
        /*
         req.deviceModel = '';
         req.channelId = 0;
         req.idfa = '';
         req.androidId = '';
         req.googleAid = '';
         req.appVersion = '';
         req.packName = '';
         */
        let callback =  function (resp) {
            if(resp.err != 0){
                Global.eventMgr.emit(Global.config.EVENT_LOGIN_FAILED, resp);
                return;
            }
            // if(resp.token && resp.token.length > 0){
            //     farm.localStorage.setItem(farm.game.gmConst.GLS_KEY_GUEST_TOKEN, resp.token);
            // }
            // farm.localStorage.removeItem(farm.game.gmConst.GLS_KEY_IS_LOGOUT);
            //
            // //
            // farm.game.initConfig(resp);
            // farm.game.initData(resp);
            // farm.game.loginSuccess = true;

            // js 调取其他平台的sdk，传过去玩家id
            // farm.FarmPlatformHelper.jsToOc(farm.FarmPlatformHelper.JSB_EVENT_JTO_setSessionWithUid, farm.game.player.id.toString());
            //

            //登录
            Global.eventMgr.emit(Global.config.EVENT_LOGIN_SUC, resp);
        };
        this.network.sendRequest(req, callback);

    },

    /**
     * Facebook或者游客登出
     */
    logout: function () {
        // let req = new GameProtocols.LogoutRequest();
        // this.network.sendRequest(req, function (resp) {
        //     if(resp.err != 0){
        //         cc.log("网络请求---LogoutRequest 失败");
        //         farm.eventManager.emit(farm.game.gmConst.SP_EVENT_LOGOUT_FAILED);
        //         return;
        //     }
        //     cc.log("网络请求---LogoutRequest 成功");
        //     Global.eventMgr.emit(farm.game.gmConst.SP_EVENT_LOGOUT_SUCCESS);
        // });
    },

    /**
     * 绑定fb账号
     * @param {String} token
     */
    bindFacebook: function (token) {
        // let req = new GameProtocols.BindFacebookRequest();
        // req.token = token;
        // let callback =  function (resp) {
        //     //绑定过得逻辑
        //     if(resp.err == farm.game.gmConst.ERROR_USER_HAS_REGISTERED){
        //         cc.log("网络请求---BindFacebookRequest 已绑定");
        //         farm.eventManager.emit(farm.game.gmConst.SP_EVENT_HAS_BIND_FACEBOOK);
        //         return;
        //     }
        //     //绑定失败
        //     if(resp.err != 0){
        //         cc.log("网络请求---BindFacebookRequest 失败");
        //         farm.eventManager.emit(farm.game.gmConst.SP_EVENT_BIND_FACEBOOK_FAILED);
        //         return;
        //     }
        //     //绑定成功
        //     cc.log("网络请求---BindFacebookRequest 成功");
        //     if(resp.me){
        //         farm.game.player.parse(resp.me);
        //     }
        //     if(resp.friends){
        //         farm.game.initFriends(resp.friends);
        //     }
        //     //绑定成功后删除本地token
        //     farm.localStorage.removeItem(farm.game.gmConst.GLS_KEY_GUEST_TOKEN);
        //     farm.eventManager.emit(farm.game.gmConst.SP_EVENT_BIND_FACEBOOK_SUCCESS);
        // };
        // this.network.sendRequest(req, callback);
    },

    /**
     * 获取排名
     * @param {Number} rankType 0全部，1本地，2好友
     */
    getRank: function (rankType) {
        // let req = new GameProtocols.RankRequest();
        // req.type = rankType;
        // let callback =  function (resp) {
        //     if(resp.err != 0){
        //         cc.log("网络请求---getRank 失败");
        //         Global.eventMgr.emit(farm.game.gmConst.SP_EVENT_GET_RANK_FAILED, resp);
        //         return;
        //     }
        //     cc.log("网络请求---getRank 成功");
        //     // todo 暂定排名类型
        //     resp._rankType = rankType;
        //     //farm.game.initLeaderBoardArray(rankType, resp.myRank, resp.men);
        //     if(rankType == 2 && resp.men){
        //         farm.game.updateFriends(resp.men);
        //         resp.men = farm.game.sortFriendsByStar();
        //     }
        //     Global.eventMgr.emit(farm.game.gmConst.SP_EVENT_GET_RANK_SUCCESS, resp);
        // };
        // this.network.sendRequest(req, callback);
    },


    //push回调------------------------------------------------------------------------------

    /**
     * 推送回调
     */
    pushCallback: function (response) {
        switch (response.act){
            case "friendInfoSync":
                this.pushFriendSendTakeSp(response);
                break;
            case "playChess":
                this.pushPlayChess(response);
                break;
            case "chat":
                this.pushChat(response);
                break;
            case "exitRoom":
                this.pushExitRoom(response);
                break;
            default:
                break;
        }
    },
    /**
     * 好友间互赠体力推送
     * @param {PushSendSpResponse|PushTakeSpResponse} resp
     */
    pushFriendSendTakeSp: function (resp) {
        // cc.log("网络请求---push--- pushFriendSendTakeSp 成功");
        // if(resp.friend) farm.game.updateFriends(resp.friend);
        // farm.eventManager.emit(farm.game.gmConst.SP_PUSH_EVENT_UPDATE_FRIEND);
    },


    pushChat: function (resp) {
        Global.eventMgr.emit(Global.config.EVENT_CHAT, resp);
    },

    pushExitRoom: function (resp) {
        Global.eventMgr.emit(Global.config.EVENT_EXITROOM, resp);
    },

    pushPlayChess: function(resp){
        Global.eventMgr.emit(Global.config.EVENT_PLAYCHESS, resp);
    },

    /**
     * debug调试请求
     * @param {String} name
     */
    debug_addCoins: function (name) {
        var req = new GameProtocols.DebugChangeMeRequest();
        if (name === "btnAddCoins") {
            req.cmd = "player coins add 100000000";
        } else if (name === "btnClearCoins") {
            req.cmd = "player coins 0";
        } else if (name === "btnAddEnergy") {
            req.cmd = "player sp add 10";
        } else if (name === "btnClearEnergy") {
            req.cmd = "player sp 0";
        } else if (name == "btnAddWp") {
            req.cmd = "player wp add 10";
        } else if (name == "btnClearWp") {
            req.cmd = "player wp 0";
        } else if (name == "btnUnwrap"){
            req.cmd = "player fbuid null";
        } else if (name == "btnWizard1"){
            req.cmd = "player wizard1 0";
        } else if (name == "btnWizard2"){
            req.cmd = "player wizard2 0";
        } else if (name == "btnClearShield"){
            req.cmd = "player shield 0";
        } else if (name == "btnSpEc"){
            req.cmd = "SpEc stepInterval 60000";
        } else if (name == "btnFarmEc"){
            req.cmd = "FarmEc stepInterval 60000";
        } else if (name == "btnSpEcBack"){
            req.cmd = "SpEc stepInterval 3600000";
        } else if (name == "btnFarmBack"){
            req.cmd = "FarmEc stepInterval 86400000";
        } else if (name == "btnUpdateBuild"){
            req.cmd = "Building lv 5";
        } else {
            req.cmd = name;
        }
        // var callback = function (resp) {
        //     if (resp.err != 0) {
        //         return;
        //     }
        //     farm.game.player.parse(resp.me);
        //     farm.game.spTimer.updateSpTime(resp.spStepLeftTime, resp.spInterval);
        //     farm.game.dataUpdater.updateCoin();
        //     farm.game.dataUpdater.updateSp();
        //     farm.game.dataUpdater.updateShield();
        //     farm.game.dataUpdater.updateStar();
        //     //
        //     if((req.cmd == "FarmEc stepInterval 60000" || req.cmd == "FarmEc stepInterval 86400000")
        //         && farm.util.isNumber(resp.farmDailyOut)
        //         && farm.util.isNumber(resp.farmCoins)){
        //         farm.game.piggyBankTimer.init(resp.farmDailyOut, resp.farmCoins, resp.farmInterval);
        //     }
        //     if(req.cmd == "SpEc stepInterval 60000" || req.cmd == "SpEc stepInterval 3600000"){
        //         farm.game.spTimer.updateSpTime(resp.spStepLeftTime, resp.spInterval);
        //     }
        //     if(resp.buildings){
        //         for(var i = 0; i < resp.buildings.length; ++i){
        //             farm.game.buildings[i].parse(resp.buildings[i]);
        //         }
        //         farm.eventManager.emit(farm.game.gmConst.SP_EVENT_UPGRADE_BUILDING_SUCCESS, resp);
        //         farm.eventManager.emit(farm.game.gmConst.SP_DEBUG_EVENT_BUILD_TO_24_SUCCESS, resp);
        //     }
        // };
        // this.network.sendRequest(req, callback);
    },
});

module.exports = NetProxy;