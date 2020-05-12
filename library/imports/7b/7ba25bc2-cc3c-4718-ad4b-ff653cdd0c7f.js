"use strict";
cc._RF.push(module, '7ba25vCzDxHGK1L/2U83Qx/', 'GameWebSocket');
// scripts/framework/net/socket/GameWebSocket.js

'use strict';

/**
 * @enum {number}
 */
var GameWebSocketState = cc.Enum({
    CONNECTING: 1,
    OPEN: 2,
    CLOSING: 3,
    CLOSED: 4
});

/**
 * @interface
 */
var GameWebSocketDelegate = cc.Class({

    onSocketOpen: function onSocketOpen() {},

    /**
     * 收到了消息
     * @param {string|Uint8Array} data
     */
    onSocketMessage: function onSocketMessage(data) {},

    onSocketError: function onSocketError() {},

    /**
     * 连接关闭
     * @param {string} reason
     */
    onSocketClosed: function onSocketClosed(reason) {}
});

/**
 * @interface
 */
var GameWebSocketInterface = cc.Class({

    connect: function connect() {},

    send: function send() {},

    close: function close() {},

    getState: function getState() {}
});

var GameWebSocket = cc.Class({
    extends: GameWebSocketInterface,

    properties: {

        /**
         * @type {String} 服务器地址
         */
        _address: null,

        /**
         * @type {GameWebSocketDelegate}
         */
        _delegate: null,

        /**
         * @type {WebSocket}
         */
        _webSocket: null
    },

    /**
     * @param {string} address 服务器地址
     * @param {GameWebSocketDelegate} delegate 回调接口
     */
    init: function init(address, delegate) {
        this._address = address;
        this._delegate = delegate;
        this._webSocket = null;
    },

    connect: function connect() {
        cc.log('connect to ' + this._address);

        var ws = this._webSocket = new WebSocket(this._address);
        ws.onopen = this._delegate.onSocketOpen.bind(this._delegate);
        ws.onmessage = function (param) {
            this._delegate.onSocketMessage(param.data);
        }.bind(this);
        ws.onerror = this._delegate.onSocketError.bind(this._delegate);
        // function({code: Number, reason: String, wasClean: Boolean})}
        ws.onclose = function (param) {
            this._delegate.onSocketClosed(param.reason);
        }.bind(this);
    },

    /**
     * 发送数据
     * @param {string|Uint8Array} stringOrBinary
     */
    send: function send(stringOrBinary) {
        this._webSocket.send(stringOrBinary);
    },

    close: function close() {
        if (!this._webSocket) {
            return;
        }

        try {
            this._webSocket.close();
        } catch (err) {
            cc.log('error while closing webSocket', err.toString());
        }
        this._webSocket = null;
    },

    getState: function getState() {
        if (this._webSocket) {
            switch (this._webSocket.readyState) {
                case WebSocket.OPEN:
                    return GameWebSocketState.OPEN;
                case WebSocket.CONNECTING:
                    return GameWebSocketState.CONNECTING;
                case WebSocket.CLOSING:
                    return GameWebSocketState.CLOSING;
                case WebSocket.CLOSED:
                    return GameWebSocketState.CLOSED;
            }
        }
        return GameWebSocketState.CLOSED;
    }
});

module.exports = {
    GameWebSocketState: GameWebSocketState,
    GameWebSocketDelegate: GameWebSocketDelegate,
    GameWebSocketInterface: GameWebSocketInterface,
    GameWebSocket: GameWebSocket
};

cc._RF.pop();