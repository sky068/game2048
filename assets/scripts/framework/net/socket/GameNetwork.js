/**
 * Created by skyxu on 2018/10/9.
 */

"use strict";

let GameWebSocket = require("./GameWebSocket");
let GameProtocols = require("./GameProtocols");

/**
 * 服务器回复消息状态，判断回复消息的各种问题
 */
var response_state = {
    ERROR_OK : '0'
};

/**
 * 请求回调对象，收到服务器回调后的回调方法
 */
var NetworkCallback = cc.Class({

    properties: {

        /**
         * @type {BaseRequest} request
         */
        request: null,

        /**
         * 请求回调对方法
         */
        callback: null
    },

    /**
     * @param {BaseRequest} request
     * @param {function(BaseResponse): boolean} callback
     */
    init: function (request, callback) {
        this.request = request;
        this.callback = callback;
    }
});


let GameNetwork = cc.Class({
    extends: GameWebSocket.GameWebSocketDelegate,

    ctor: function() {
        this._socket = null;

        this._delegate = null;

        /**
         * 每次发送请求，都需要有一个唯一的编号
         * @type {number}
         * @private
         */
        this._requestSequenceId = 0;

        /**
         * 接受服务器主动下发的response回调
         * key 表示BaseResponse.act
         * @type {Object.<string, function(object.<string, *>)>}
         */
        this.pushResponseCallback = {};

        /**
         * 根据seq保存Request和其callback，以便在收到服务器的响应后回调
         * @type {Object.<int, NetworkCallback>}
         * @private
         */
        this._networkCallbacks = {};
    },

    setDelegate: function (delegate) {
        this._delegate = delegate;
    },

    /**
     * 注册服务器主动推送的response 回调
     */
    registerPushResponseCallback : function(act, callback){
        this.pushResponseCallback[act] = callback;
    },

    /**
     * 判断socket已连接成功，可以通信
     * @returns {boolean}
     */
    isSocketOpened: function(){
        return (this._socket && this._socket.getState() == GameWebSocket.GameWebSocketState.OPEN);
    },

    isSocketClosed: function () {
        return this._socket == null;
    },

    /**
     * 启动连接
     */
    connect: function (url) {
        cc.log("webSocketUrls=" + url);
        this._requestSequenceId = 0;
        this._socket = new GameWebSocket.GameWebSocket();
        this._socket.init(url, this);
        this._socket.connect();
    },

    closeConnect: function () {
        if(this._socket){
            this._socket.close();
        }
    },

    onSocketOpen: function () {
        cc.log('Socket:onOpen');
        if(this._delegate && this._delegate.onNetworkOpen){
            this._delegate.onNetworkOpen();
        }
    },

    onSocketError: function () {
        cc.log('Socket:onError');
    },

    onSocketClosed: function (reason) {
        cc.log('Socket:onClose', reason);
        if (this._socket) {
            this._socket.close();
        }
        this._socket = null;

        if(this._delegate && this._delegate.onNetworkClose){
            this._delegate.onNetworkClose();
        }
    },

    onSocketMessage: function (msg) {
        this._onResponse(msg);
    },

    _onResponse: function(responseData){
        cc.log('response->resp:', responseData);
        var responseJson = JSON.parse(responseData);
        var responseClass = GameProtocols.response_classes[responseJson.act];
        /**
         * @type {object.<BaseResponse>}
         */
        var response = new responseClass();
        response.loadData(responseJson.data);
        response.act = responseJson.act;
        response.seq = responseJson.seq;
        response.err = responseJson.err;
        response.ts = responseJson.ts;

        // 如果指定了回调函数，先回调
        var ignoreError = false;
        if(response.seq != -1){
            // 处理服务器推送消息
            var pushCallback = this.pushResponseCallback[response.act];
            if(pushCallback){
                pushCallback(response);
            }

            // request回调
            var callbackObj = this._networkCallbacks[response.seq];
            if(callbackObj){
                ignoreError = callbackObj.callback(response);
                // try {
                //     ignoreError = callbackObj.callback(response);
                // } catch (err) {
                //     cc.log(err + " error in response callback of " + response.act);
                // } finally {
                //     delete this._networkCallbacks[response.seq];
                // }
            }
        }

        //有错，且不忽略，则统一处理错误
        if(response.err && response.err != response_state.ERROR_OK && !ignoreError){
            if (response.is_async) {  // 异步请求，如果出错了，应该需要重新登录
                // todo 重新登录？或者重新同步数据？
            } else {  // 同步请求，如果出错了，需要显示错误信息
                // todo 显示错误
                var msg = responseJson.msg;
                cc.log('server err ' + msg);
            }
        }
    },

    /**
     * 向服务器发送请求。
     *
     * 如果提供了callback，在收到response后会被回调。如果response是一个错误(status!=ERR_OK)，则需要决定由谁来负责处理错误。
     * 如果callback中已经对错误进行了处理，应该返回true，这样会忽略该错误。否则应该返回false，则负责处理该错误。
     *
     * 特别注意：如果这是一个异步(is_async)请求，且出错，一般来讲应该重新登录/同步。但是如果callback返回了true，不会进行
     * 任何处理，也就是不会重新登录/同步。请小心确定返回值。
     *
     * @param {object.<BaseRequest>}
     * @param {function(BaseResponse): boolean=} opt_callback 回调函数。出错的情况下，如果返回true，则不会再次处理错误。
     */
    sendRequest: function (request, opt_callback) {
        // 每个请求的seq应该唯一，且递增
        request.seq = ++this._requestSequenceId;

        //生成NetworkCallback对象，绑定请求seq和回调方法
        if(opt_callback){
            this._networkCallbacks[request.seq] = new NetworkCallback();
            this._networkCallbacks[request.seq].init(request, opt_callback);
        }
        this._sendSocketRequest(false, request);
    },

    /**
     * sendRequest的不发送data字段
     */
    sendRequestNoData: function (request, opt_callback) {
        // 每个请求的seq应该唯一，且递增
        request.seq = ++this._requestSequenceId;

        //生成NetworkCallback对象，绑定请求seq和回调方法
        if(opt_callback){
            this._networkCallbacks[request.seq] = new NetworkCallback();
            this._networkCallbacks[request.seq].init(request, opt_callback);
        }
        this._sendSocketRequest(true, request);
    },

    /**
     * @param {Boolean} isNoData
     * @param {object.<BaseRequest>} req
     */
    _sendSocketRequest: function (isNoData, req) {
        cc.assert(this._socket);

        if (this.isSocketOpened()){
            //通过json的方法生成请求字符串
            var msg = null;
            if(isNoData){
                msg = JSON.stringify({seq:req.seq, act:req.act});
            }else{
                msg = JSON.stringify({seq:req.seq, act:req.act, data:req});
            }
            cc.log("WebSocketDelegate::send->" + msg);
            this._socket.send(msg);
        } else{
            // todo
        }
    }
});

module.exports = GameNetwork;