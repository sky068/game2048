/**
 * Created by skyxu on 2018/10/10.
 * 来源： http://forum.cocos.com/t/listview/67396
 * 由 typescript 改为 javascript 实现
 * ListView基于cc.ScrollView实现，避免重复造轮子写滚动逻辑
 * 使用方法：
 * 1：首先添加一个scrollView，然后把ListView组件添加上去
 * 2：定义数据集合，比如data = [1,2,3,4,5]
 * 3：实现Adapter（继承自ListAdapter)并重载updateView方法进行更新item
 * 4：创建一个adapter, 并给它设置数据源和item挂载的组件(setDataSet、setItemComponent),然后把adapter赋值给ListView即可
 */

"use strict";

let ListAdapter = cc.Class({
    ctor(){
        this.dataSet = [];
    },

    // 指定ItemPrefab挂载的脚本
    setItemComponent(itemComponent){
        this.itemComponent = itemComponent;
    },

    getComponentType(){
        return this.itemComponent;
    },

    setDataSet(data){
        this.dataSet = data;
    },

    getCount(){
        return this.dataSet.length;
    },

    getItem(posIndex){
        return this.dataSet[posIndex];
    },

    _getView(item, posIndex) {
        let itemComp = item.getComponent(this.itemComponent);
        if (itemComp) {
            this.updateView(itemComp, posIndex);
        } else {
            cc.warn("item 不包含组件:", this.itemComponent);
        }
        return item;
    },

    /**
     * 重载这个方法进行刷新item内容
     * @param item {cc.Component}
     * @param posIndex {cc.Integer}
     */
    updateView(item, posIndex){
        // 这里更新item内容
        // const data = this.getItem(posIndex);
        // item.setInfo(data);
    }
});


let ListView = cc.Class({
    extends: cc.Component,

    properties: {
        itemTemplate: {
            type: cc.Prefab,
            default: null
        },

        spacing: {
            type: cc.Float,
            default: 1
        },

        // 比可见元素多缓存3个, 缓存越多,快速滑动越流畅,但同时初始化越慢.
        spawnCount: {
            type: cc.Integer,
            default: 3
        },

        /*
         *  ListView组件需要借助ScrollView组件进行滚动显示.不需要自造轮子进行滚动逻辑.
         *  同时ListView 需要将待显示的Item 制成预制体.以便动态生成列表项.
         * */
        scrollView: {
            type: cc.ScrollView,
            default: null
        },

        content: {
            type: cc.Node,
            default: null,
            visible: false
        },

        adapter: {
            type: ListAdapter,
            default: null,
            visible: false,
            serializable: false
        },

        _items: {
            type: cc.NodePool,
            default: null,
            visible: false
        },

        // 记录当前填充在树上的索引. 用来快速查找哪些位置缺少item了.
        _filledIds: {
            type: Object,
            default: {},
            visible: false
        },

        horizontal: {
            default: false,
            visible: false
        },

        // 初始时即计算item的高度.因为布局时要用到.
        _itemHeight: 1,

        _itemWidth: 1,

        _itmesVisble: 1,

        lastStartIndex: {
            type: cc.Integer,
            default: -1,
            visible: false
        },

        // 是否触发上拉加载事件
        scrollTopNotifyed: {
            default: false,
            visible: false
        },

        // 是否触发下拉刷新事件
        scrollBottomNofityed: {
            default: false,
            visible: false
        },

        pullDownCallback: {
            type: Object,
            default: null,
            visible: false
        },

        pullUpCallback: {
            type: Object,
            default: null,
            visible: false
        }

    },

    onLoad(){
        if (this.scrollView) {
            this.content = this.scrollView.content;
            this.horizontal = this.scrollView.horizontal;
            if (this.horizontal) {
                this.scrollView.vertical = false;
                this.content.anchorX = 0;
                this.content.x = this.content.getParent().width * this.content.getParent().anchorX;
            } else {
                this.scrollView.vertical = true;
                this.content.anchorY = 1;
                this.content.y = this.content.getParent().height * this.content.getParent().anchorY;
            }
        } else {
            console.error("ListView need a scrollView for showing.")
        }

        this._items = this._items || new cc.NodePool();
        let itemOne = this._items.get() || cc.instantiate(this.itemTemplate);
        this._items.put(itemOne);
        this._itemHeight = itemOne.height || 10;
        this._itemWidth = itemOne.width || 10;

        if (this.horizontal) {
            this._itemsVisible = Math.ceil(this.content.getParent().width / this._itemWidth);
        } else {
            this._itemsVisible = Math.ceil(this.content.getParent().height / this._itemHeight);
        }
        console.log("可见区域的item数量为:", this._itemsVisible);
        this.adjustEvent();
    },

    setAdapter(adapter) {
        this.adapter = adapter;
        if (this.adapter == null) {
            cc.warn("adapter 为空.");
            return
        }
        if (this.itemTemplate == null) {
            cc.error("Listview 未设置待显示的Item模板.");
            return;
        }
        this._items.poolHandlerComp = this.adapter.getComponentType();

        this.notifyUpdate();
    },

    getItemIndex(height) {
        return Math.floor(Math.abs(height / ((this._itemHeight + this.spacing))));
    },

    getPositionInView(item) {
        let worldPos = item.getParent().convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    // 数据变更了需要进行更新UI显示, 可只更新某一条.
    notifyUpdate(updateIndex) {
        if (this.adapter == null) {
            return;
        }
        if (updateIndex && updateIndex.length > 0) {
            updateIndex.forEach(i => {
                if (this._filledIds.hasOwnProperty(i)) {
                    delete this._filledIds[i];
                }
            })
        } else {
            Object.keys(this._filledIds).forEach(key => {
                delete this._filledIds[key];
            })
        }
        this.lastStartIndex = -1;
        if (this.horizontal) {
            this.content.width = this.adapter.getCount() * (this._itemWidth + this.spacing) + this.spacing;
        } else {
            this.content.height = this.adapter.getCount() * (this._itemHeight + this.spacing) + this.spacing; // get total content height
        }
        this.scrollView.scrollToTop()
    },

    scrollToTop(anim) {
        this.scrollView.scrollToTop(anim ? 1 : 0);
    },

    scrollToBottom(anim) {
        this.scrollView.scrollToBottom(anim ? 1 : 0);
    },

    scrollToLeft(anim) {
        this.scrollView.scrollToLeft(anim ? 1 : 0);
    },

    scrollToRight(anim) {
        this.scrollView.scrollToRight(anim ? 1 : 0);
    },

    // 下拉事件.
    pullDown(callback) {
        this.pullDownCallback = callback;
    },

    // 上拉事件.
    pullUp(callback) {
        this.pullUpCallback = callback;
    },

    update(dt) {
        const startIndex = this.checkNeedUpdate();
        if (startIndex >= 0) {
            this.updateView(startIndex);
        }
    },

    // 向某位置添加一个item.
    _layoutVertical(child, posIndex) {
        this.content.addChild(child);
        // 增加一个tag 属性用来存储child的位置索引.
        child["_tag"] = posIndex;
        this._filledIds[posIndex] = posIndex;
        child.setPosition(0, -child.height * (0.5 + posIndex) - this.spacing * (posIndex + 1));
    },

    // 向某位置添加一个item.
    _layoutHorizontal(child, posIndex) {
        this.content.addChild(child);
        // 增加一个tag 属性用来存储child的位置索引.
        child["_tag"] = posIndex;
        this._filledIds[posIndex] = posIndex;
        child.setPosition(-child.width * (0.5 + posIndex) - this.spacing * (posIndex + 1), 0);
    },

    // 获取可回收item
    getRecycleItems(beginIndex, endIndex) {
        const children = this.content.children;
        const recycles = []
        children.forEach(item => {
            if (item["_tag"] < beginIndex || item["_tag"] > endIndex) {
                recycles.push(item);
                delete this._filledIds[item["_tag"]];
            }
        });
        return recycles;
    },

    // 填充View.
    updateView(startIndex) {
        let itemStartIndex = startIndex;
        // 比实际元素多3个.
        let itemEndIndex = itemStartIndex + this._itemsVisible + (this.spawnCount || 2);
        const totalCount = this.adapter.getCount();
        if (itemStartIndex >= totalCount) {
            return;
        }

        if (itemEndIndex > totalCount) {
            itemEndIndex = totalCount;
            if (!this.scrollBottomNotifyed) {
                this.notifyScrollToBottom()
                this.scrollBottomNotifyed = true;
            }
        } else {
            this.scrollBottomNotifyed = false;
        }

        // 回收需要回收的元素位置.向上少收一个.向下少收2两.
        const recyles = this.getRecycleItems(itemStartIndex - (this.spawnCount || 2), itemEndIndex);
        recyles.forEach(item => {
            this._items.put(item);
        });

        // 查找需要更新的元素位置.
        const updates = this.findUpdateIndex(itemStartIndex, itemEndIndex)

        // 更新相应位置.
        for (let index of updates) {
            let child = this.adapter._getView(this._items.get() || cc.instantiate(this.itemTemplate), index);
            this.horizontal ?
                this._layoutHorizontal(child, index) :
                this._layoutVertical(child, index);
        }
    },

    // 检测是否需要更新UI.
    checkNeedUpdate() {
        if (this.adapter == null) {
            return -1
        }

        let scroll = this.horizontal ? (this.content.x - this.content.getParent().width * this.content.getParent().anchorX)
            : (this.content.y - this.content.getParent().height * this.content.getParent().anchorY);
        let itemStartIndex = Math.floor(scroll / ((this.horizontal ? this._itemWidth : this._itemHeight) + this.spacing));
        if (itemStartIndex < 0 && !this.scrollTopNotifyed) {
            this.notifyScrollToTop();
            this.scrollTopNotifyed = true;
            return itemStartIndex;
        }
        // 防止重复触发topNotify.仅当首item不可见后才能再次触发
        if (itemStartIndex > 0) {
            this.scrollTopNotifyed = false;
        }

        if (this.lastStartIndex != itemStartIndex) {
            this.lastStartIndex = itemStartIndex;
            return itemStartIndex;
        }

        return -1;
    },

    // 查找需要补充的元素索引.
    findUpdateIndex(itemStartIndex, itemEndIndex) {
        const d = [];
        for (let i = itemStartIndex; i < itemEndIndex; i++) {
            if (this._filledIds.hasOwnProperty(i)) {
                continue;
            }
            d.push(i);
        }
        return d;
    },

    notifyScrollToTop() {
        if (!this.adapter || this.adapter.getCount() <= 0) {
            return;
        }
        if (this.pullDownCallback) {
            this.pullDownCallback();
        }
    },

    notifyScrollToBottom() {
        if (!this.adapter || this.adapter.getCount() <= 0) {
            return;
        }
        if (this.pullUpCallback) {
            this.pullUpCallback();
        }
    },

    adjustEvent(){
        this.content.on(this.isMobile() ? cc.Node.EventType.TOUCH_END : cc.Node.EventType.MOUSE_UP, () => {
            this.scrollTopNotifyed = false;
            this.scrollBottomNotifyed = false;
        }, this);
        this.content.on(this.isMobile() ? cc.Node.EventType.TOUCH_CANCEL : cc.Node.EventType.MOUSE_LEAVE, () => {
            this.scrollTopNotifyed = false;
            this.scrollBottomNotifyed = false;
        }, this);
    },

    isMobile() {
        return (cc.sys.isMobile || cc.sys.platform === cc.sys.WECHAT_GAME || cc.sys.platform === cc.sys.QQ_PLAY)
    }
});

module.exports = {
    ListAdapter: ListAdapter,
    ListView: ListView,
};

