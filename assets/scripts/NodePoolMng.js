/**
 * Created by skyxu on 2019/11/26.
 */

// 方便统一开关log
const SHOWLOG = false;

let myLog = function (arg) {
  if (SHOWLOG) {
      cc.log.apply(cc.log, arguments);
  }
};

let NodePoolMng = cc.Class({
    extends: cc.Component,
    properties: {
        bulletPFList: [cc.Prefab],
        enemyPFList: [cc.Prefab],
        normalEffectPF: cc.Prefab,
        bloodDecreasePF: cc.Prefab,
        warningEnemy2PF: cc.Prefab,

        bulletCounts: 30,   // 子弹对象池默认数量
        enemyCounts: 40,  //敌人对象池默认数量
        normalEffectCounts: 30,  // 通用特效默认缓存数量
        warningEnemy2Counts: 10,  // 敌人2的提示警告缓存数量
    },

    onLoad() {
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

    init() {
        // 创建子弹对象池
        for (let p of this.bulletPFList) {
            let pool = new cc.NodePool();
            this.bulletPoolDic[p._name] = pool;
            this.bulletPFDic[p._name] = p;
            for (let i=0; i<this.bulletCounts; i++) {
                let b = cc.instantiate(p);
                pool.put(b);
            }
        }

        // 创建敌人对象池
        for (let p of this.enemyPFList) {
            let pool = new cc.NodePool();
            this.enemyPoolDic[p._name] = pool;
            this.enemyPFDic[p._name] = p;

            let num = this.enemyCounts;
            if (p._name == "enemy7") {
                // boss 创建一个就行了，为了方便统一使用才这样处理
                num = 1;
            }
            for (let i=0; i<num; i++) {
                let e = cc.instantiate(p);
                pool.put(e);
            }
        }

        // 创建通用特效对象池
        this.normalEffPool = new cc.NodePool("NormalEffect");
        for (let i=0; i<this.normalEffectCounts; i++) {
            let e = cc.instantiate(this.normalEffectPF);
            this.normalEffPool.put(e);
        }

        // 创建掉血label对象池
        this.bloodDecPool = new cc.NodePool();
        for (let i=0; i<this.normalEffectCounts; i++) {
            let b = cc.instantiate(this.bloodDecreasePF);
            this.bloodDecPool.put(b);
        }

        // 创建敌人2的提示警告对象池
        this.warningEnemy2Pool = new cc.NodePool();
        for (let i=0; i<this.warningEnemy2Counts; i++) {
            let w = cc.instantiate(this.warningEnemy2PF);
            this.warningEnemy2Pool.put(w);
        }
    },

    /**
     * 获取子弹（需要初始化)
     * @param name{String} 节点名字
     * @returns {*}
     */
    getBullet(name) {
        cc.assert(this.bulletPoolDic[name], "错误的Bullet name: " + name + "，找不到对应的pool");
        let size = this.bulletPoolDic[name].size();
        if (size <= 0) {
            let b = cc.instantiate(this.bulletPFDic[name]);
            return b;
        }
        myLog(name + " pool size =" + size);
        return this.bulletPoolDic[name].get();
    },

    /**
     *
     * @param node{cc.Node} 子弹node
     */
    putBullet(node) {
        let name = node.name;
        cc.assert(this.bulletPoolDic[name], "错误的Bullet, name: " + name + "，找不到对应的pool");
        this.bulletPoolDic[name].put(node);

        let size = this.bulletPoolDic[name].size();
        myLog(name + " pool size =" + size);
    },


    /**
     * 获取敌人(需要初始化)
     * @param name
     * @returns {*}
     */
    getEnmey(name) {
        cc.assert(this.enemyPoolDic[name], "错误的Enemy name: " + name + "，找不到对应的pool");
        let size = this.enemyPoolDic[name].size();
        if (size <= 0) {
            let e = cc.instantiate(this.enemyPFDic[name]);
            return e;
        }
        myLog(name + " pool size =" + size);
        return this.enemyPoolDic[name].get();
    },

    putEnemy(node) {
        let name = node.name;
        cc.assert(this.enemyPoolDic[name], "错误的Enemy, name: " + name + "，找不到对应的pool");
        this.enemyPoolDic[name].put(node);

        let size = this.enemyPoolDic[name].size();
        myLog(name + " pool size =" + size);
    },

    // 获取一般特效（击中/敌人死亡/boss死亡）
    getNormalEffect() {
        let size = this.normalEffPool.size();
        if (size <= 0) {
            let e = cc.instantiate(this.normalEffectPF);
            return e;
        }
        // myLog("normalEffPool size =" + size);
        return this.normalEffPool.get();
    },

    putNormalEffect(node) {
        this.normalEffPool.put(node);
        // let size = this.normalEffPool.size();
        // myLog("normalEffPool size =" + size);
    },

    // 获取敌人掉血label节点
    getBloodDecNode() {
        let size = this.bloodDecPool.size();
        if (size <= 0) {
            let b = cc.instantiate(this.bloodDecreasePF);
            return b;
        }
        myLog("bloodDecPool size =" + size);
        return this.bloodDecPool.get();
    },

    putBloodDecNode(node) {
        this.bloodDecPool.put(node);
        myLog("bloodDecPool size =" + this.bloodDecPool.size());
    },

    // 获取敌人2的提示警告节点
    getWarningEnemy2DecNode() {
        let size = this.warningEnemy2Pool.size();
        if (size <= 0) {
            let b = cc.instantiate(this.warningEnemy2PF);
            return b;
        }
        // cc.log("warningEnemy2Pool get size =" + size);
        return this.warningEnemy2Pool.get();
    },

    putWarningEnemy2DecNode(node) {
        this.warningEnemy2Pool.put(node);
        // cc.log("warningEnemy2Pool put size =" + this.warningEnemy2Pool.size());
    }
});

