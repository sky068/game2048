"use strict";
cc._RF.push(module, '670dbVclHRF+YTksSd2vsqs', 'NodePoolMng');
// scripts/NodePoolMng.js

"use strict";

/**
 * Created by skyxu on 2019/11/26.
 */

// 方便统一开关log
var SHOWLOG = false;

var myLog = function myLog(arg) {
    if (SHOWLOG) {
        cc.log.apply(cc.log, arguments);
    }
};

var NodePoolMng = cc.Class({
    extends: cc.Component,
    properties: {
        bulletPFList: [cc.Prefab],
        enemyPFList: [cc.Prefab],
        normalEffectPF: cc.Prefab,
        bloodDecreasePF: cc.Prefab,
        warningEnemy2PF: cc.Prefab,

        bulletCounts: 30, // 子弹对象池默认数量
        enemyCounts: 40, //敌人对象池默认数量
        normalEffectCounts: 30, // 通用特效默认缓存数量
        warningEnemy2Counts: 10 // 敌人2的提示警告缓存数量
    },

    onLoad: function onLoad() {
        zy.nodePoolMng = this;

        this.bulletPoolDic = {};
        this.bulletPFDic = {};

        this.enemyPoolDic = {};
        this.enemyPFDic = {};

        this.normalEffPool = null;

        this.bloodDecPool = null;

        this.warningEnemy2Pool = null;

        this.init();
    },
    init: function init() {
        // 创建子弹对象池
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = this.bulletPFList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var p = _step.value;

                var pool = new cc.NodePool();
                this.bulletPoolDic[p._name] = pool;
                this.bulletPFDic[p._name] = p;
                for (var _i3 = 0; _i3 < this.bulletCounts; _i3++) {
                    var _b = cc.instantiate(p);
                    pool.put(_b);
                }
            }

            // 创建敌人对象池
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

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = this.enemyPFList[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _p = _step2.value;

                var pool = new cc.NodePool();
                this.enemyPoolDic[_p._name] = pool;
                this.enemyPFDic[_p._name] = _p;

                var num = this.enemyCounts;
                if (_p._name == "enemy7") {
                    // boss 创建一个就行了，为了方便统一使用才这样处理
                    num = 1;
                }
                for (var _i4 = 0; _i4 < num; _i4++) {
                    var _e = cc.instantiate(_p);
                    pool.put(_e);
                }
            }

            // 创建通用特效对象池
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        this.normalEffPool = new cc.NodePool("NormalEffect");
        for (var i = 0; i < this.normalEffectCounts; i++) {
            var e = cc.instantiate(this.normalEffectPF);
            this.normalEffPool.put(e);
        }

        // 创建掉血label对象池
        this.bloodDecPool = new cc.NodePool();
        for (var _i = 0; _i < this.normalEffectCounts; _i++) {
            var b = cc.instantiate(this.bloodDecreasePF);
            this.bloodDecPool.put(b);
        }

        // 创建敌人2的提示警告对象池
        this.warningEnemy2Pool = new cc.NodePool();
        for (var _i2 = 0; _i2 < this.warningEnemy2Counts; _i2++) {
            var w = cc.instantiate(this.warningEnemy2PF);
            this.warningEnemy2Pool.put(w);
        }
    },


    /**
     * 获取子弹（需要初始化)
     * @param name{String} 节点名字
     * @returns {*}
     */
    getBullet: function getBullet(name) {
        cc.assert(this.bulletPoolDic[name], "错误的Bullet name: " + name + "，找不到对应的pool");
        var size = this.bulletPoolDic[name].size();
        if (size <= 0) {
            var b = cc.instantiate(this.bulletPFDic[name]);
            return b;
        }
        myLog(name + " pool size =" + size);
        return this.bulletPoolDic[name].get();
    },


    /**
     *
     * @param node{cc.Node} 子弹node
     */
    putBullet: function putBullet(node) {
        var name = node.name;
        cc.assert(this.bulletPoolDic[name], "错误的Bullet, name: " + name + "，找不到对应的pool");
        this.bulletPoolDic[name].put(node);

        var size = this.bulletPoolDic[name].size();
        myLog(name + " pool size =" + size);
    },


    /**
     * 获取敌人(需要初始化)
     * @param name
     * @returns {*}
     */
    getEnmey: function getEnmey(name) {
        cc.assert(this.enemyPoolDic[name], "错误的Enemy name: " + name + "，找不到对应的pool");
        var size = this.enemyPoolDic[name].size();
        if (size <= 0) {
            var e = cc.instantiate(this.enemyPFDic[name]);
            return e;
        }
        myLog(name + " pool size =" + size);
        return this.enemyPoolDic[name].get();
    },
    putEnemy: function putEnemy(node) {
        var name = node.name;
        cc.assert(this.enemyPoolDic[name], "错误的Enemy, name: " + name + "，找不到对应的pool");
        this.enemyPoolDic[name].put(node);

        var size = this.enemyPoolDic[name].size();
        myLog(name + " pool size =" + size);
    },


    // 获取一般特效（击中/敌人死亡/boss死亡）
    getNormalEffect: function getNormalEffect() {
        var size = this.normalEffPool.size();
        if (size <= 0) {
            var e = cc.instantiate(this.normalEffectPF);
            return e;
        }
        // myLog("normalEffPool size =" + size);
        return this.normalEffPool.get();
    },
    putNormalEffect: function putNormalEffect(node) {
        this.normalEffPool.put(node);
        // let size = this.normalEffPool.size();
        // myLog("normalEffPool size =" + size);
    },


    // 获取敌人掉血label节点
    getBloodDecNode: function getBloodDecNode() {
        var size = this.bloodDecPool.size();
        if (size <= 0) {
            var b = cc.instantiate(this.bloodDecreasePF);
            return b;
        }
        myLog("bloodDecPool size =" + size);
        return this.bloodDecPool.get();
    },
    putBloodDecNode: function putBloodDecNode(node) {
        this.bloodDecPool.put(node);
        myLog("bloodDecPool size =" + this.bloodDecPool.size());
    },


    // 获取敌人2的提示警告节点
    getWarningEnemy2DecNode: function getWarningEnemy2DecNode() {
        var size = this.warningEnemy2Pool.size();
        if (size <= 0) {
            var b = cc.instantiate(this.warningEnemy2PF);
            return b;
        }
        // cc.log("warningEnemy2Pool get size =" + size);
        return this.warningEnemy2Pool.get();
    },
    putWarningEnemy2DecNode: function putWarningEnemy2DecNode(node) {
        this.warningEnemy2Pool.put(node);
        // cc.log("warningEnemy2Pool put size =" + this.warningEnemy2Pool.size());
    }
});

cc._RF.pop();