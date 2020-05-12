/**
 * Created by skyxu on 2018/3/13.
 */

"use strict";

let Md5 = require("./../encrypt/Md5");
let CSVParser = require("./CSVParser");

let UtilsOther = UtilsOther || {};

/**
 * 移除数组的指定的元素（重复元素只移除第一个）
 * @param {Array} arr
 * @param {Object} obj
 */
UtilsOther.arrayRmObj = function (arr, obj) {
    let index = arr.indexOf(obj);
    arr.splice(index,1);
};

/**
 * pop a item from a array by idx
 * @param {Array} array
 * @param {Number} idx
 * @return {*}
 */
UtilsOther.arrayPopByIdx = function (array, idx) {
    let item = array[idx];
    array.splice(idx, 1);

    return item;
};

UtilsOther.valueInArray = function (arr, value) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        if (arr[i] == value) {
            return true;
        }
    }
    return false;
};

UtilsOther.arrayRandomValue = function (arr) {
    let num = arr.length;
    if (num <= 0) {
        return null;
    }

    let idx = UtilsOther.randomInteger(0, num - 1);
    return arr[idx];
};

UtilsOther.shuffle = function (arr) {
    let i,
        j,
        temp;
    for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
};

UtilsOther.clearArrayValue = function (array, length, value) {
    for (let i = 0; i < length; i++) {
        array[i] = value;
    }
};

/**
 * create a object with keys from array and initial value
 * @param {Array} array
 * @param {*} value
 * @returns {Object}
 */
UtilsOther.createObjectWithArray = function (array, value) {
    let object = {};
    for (let i in array) {
        object[array[i]] = value;
    }

    return object;
};

UtilsOther.arrayToDict = function (array, key) {
    let dict = {};
    let data = null;
    for (let i in array) {
        data = array[i];
        dict[data[key]] = data;
    }
    return dict;
};

UtilsOther.dictToArray = function (dict) {
    let array = [];
    for (let key in dict) {
        if (dict.hasOwnProperty(key) && dict[key]) {
            array.push(dict[key]);
        }
    }
    return array;
};

/**
 * 字典转数组
 * @param {Object} obj
 * @param {Array=} opt_arr
 * @param {Number=} opt_exclude
 * @return {Array}
 */
UtilsOther.objectToArrayExcludeNumber = function (obj, opt_arr, opt_exclude) {
    let tempArr;
    if (isArray(opt_arr)) {
        tempArr = opt_arr;
    } else {
        tempArr = [];
    }
    let key;
    if (isNumber(opt_exclude)) {
        let temp = opt_exclude.toString();
        for (key in obj) {
            if (obj.hasOwnProperty(key) && obj[key] && temp != key) {
                tempArr.push(obj[key]);
            }
        }
    } else {
        for (key in obj) {
            if (obj.hasOwnProperty(key) && obj[key]) {
                tempArr.push(obj[key]);
            }
        }
    }

    return tempArr;
};

/**
 * 根据数据元素的类型来分割字符串，返回数据元素数组
 * @param {String} str
 * @param {*} valueType
 * @param {String} separator
 * @returns {Array}
 */
UtilsOther.splitWithValueType = function (str, valueType, separator) {
    if (separator === undefined) {
        separator = ",";
    }

    let arr = str.split(separator);
    arr.forEach(function (currentValue, index, array) {
        try {
            array[index] = valueType (currentValue);
        } catch (e) {
            array[index] = null;
        }
    });

    return arr;
};

/**
 * UTC 1970开始的秒数，与时区无关
 * @returns {number}
 */
UtilsOther.time = function () {
    return parseInt(Date.now() / 1000.0);
};

// 年月日 返回 1970开始的秒数
/**
 *
 * @param year {int}
 * @param month {int} 1-12表示1-12月
 * @param day{int} 1-31
 * @param hour{int} 0-23
 * @param minute{int} 0-59
 * @param second{int} 0-59
 */
UtilsOther.time2second = function (year, month, day, hour, minute, second) {
    let date = new Date(year, month - 1, day, hour, minute, second);
    let n = date.getTime();
    return parseInt(n / 1000.0);
};

/**
 * 获取某个日期之后多少天的日期
 * @param time {Date || String || Number} 标准时间格式 或者 秒数(since 1970)
 * @param days {Number} 20
 * @return {Date}
 */
UtilsOther.getTimeAfterDays = function (time, days) {
    cc.assert(time, "getTimeForDayAfterDays:time is null!");
    var date = null;
    if (cc.isNumber(time)) {
        date = new Date(time * 1000);
    } else {
        date = new Date(time);
    }
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
};

/**
 * 判断两个日期相差多少天
 * @param strDateStart  开始时间 标准时间格式 或者 秒数（since 1970)
 * @param strDateEnd    结束时间 标准时间格式 或者 秒数（since 1970)
 * @return {Number|*}   天数
 */
UtilsOther.getDaysDiff = function (dateStart, dateEnd) {
    cc.assert(dateStart && dateEnd, "getDaysDiff: date must be not null!");
    var iDays;
    if (UtilsOther.isNumber(dateStart)) {
        dateStart = new Date(dateStart * 1000);
    } else {
        dateStart = new Date(dateStart);
    }
    if (UtilsOther.isNumber(dateEnd)) {
        dateEnd = new Date(dateEnd * 1000);
    } else {
        dateEnd = new Date(dateEnd);
    }

    var strDateS = new Date(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate());
    var strDateE = new Date(dateEnd.getFullYear(), dateEnd.getMonth(), dateEnd.getDate());
    iDays = parseInt(Math.abs(strDateE - strDateS) / 1000 / 60 / 60 / 24);   //把相差的毫秒数转换为天数
    iDays *= (strDateE >= strDateS ? 1 : -1);
    // cc.log("day dif:" + iDays);
    return iDays;
};

/**
 *
 * @param date{Date || String || Number} 标准时间格式 或者 秒数(since 1970)
 * @return {string} 格式 "2017-08-02"
 */
UtilsOther.getTimeForDay = function (date) {
    if (!date) {
        date = new Date();
    } else if (cc.isNumber(date)) {
        date = new Date(date * 1000);
    } else {
        date = new Date(date);
    }
    var year = date.getFullYear();
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    var day = date.getDate() < 10 ? "0" + date.getDate() : date
        .getDate();
    var dateStr = year + "-" + month + "-" + day;
    return dateStr;
};


/**
 *
 * @param s {Number} 秒
 * @return {string}
 */
UtilsOther.formatTime = function (s) {
    let t;
    if (s >= 0) {
        let hour = Math.floor(s / 3600);
        let min = Math.floor(s / 60) % 60;
        let sec = s % 60;
        let day = parseInt(hour / 24);
        if (day == 1) {
            return day + " day";
        }
        if (day > 1) {
            return day + " days";
        }

        if (day > 0) {
            hour = hour - 24 * day;
            t = day + "day " + ('00' + hour).slice(-2) + ":";
        }
        else if (hour > 0) {
            t = ('00' + hour).slice(-2) + ":";
        } else {
            t = "";
        }
        
        if (min < 10) {
            t += "0";
        }
        t += min + ":";
        if (sec < 10) {
            t += "0";
        }
        t += parseInt(sec);
    }
    return t;
};

/**
 * 返回100，000类型字符串
 * @param {Number} number
 * @returns {String}
 */
UtilsOther.getThousandSeparatorString = function (number) {

    // return number.toString().split('').reverse().join('').replace(/(\d{3}(?=\d)(?!\d+\.|$))/g, '$1,').split('').reverse().join('');
    // 保留一位小数
    let str = number.toString().split('').reverse().join('').replace(/(\d{3}(?=\d)(?!\d+\.|$))/g, '$1,').split('').reverse().join('');
    let dot = str.indexOf('.');
    if (dot >= 0) {
        str = str.substring(0, dot + 2);
    }
    return str;
};

UtilsOther.getKMBString = function (number) {
    if (!this.isNumber(number)) {
        return number;
    }

    if (number / 1000000000 >= 1) {
        return this.getThousandSeparatorString(number / 1000000000) + "B";
    }
    else if (number / 1000000 >= 1) {
        return this.getThousandSeparatorString(number / 1000000) + "M";
    }
    // 至少显示10k
    else if (number / 10000 >= 1) {
        return this.getThousandSeparatorString(number / 1000) + "K";
    }
    return this.getThousandSeparatorString(number);
};

/**
 * 返回截止日期
 * @param {Number} current
 * @param {Number} cutOff
 * @return {Number}
 */
UtilsOther.getLastCutOffDay = function (current, cutOff) {
    let time = cutOff - current;
    if (time < 0) return -1;
    time = parseInt(time / (24 * 3600));
    return time;
};

UtilsOther._dumpObject = function (prefix, o, depth, extraBlank, _ignore_function_member, max_depth) {
    if (UtilsOther.D(max_depth) && depth > max_depth) {
        return;
    }

    function printWithDepth(txt, depth, extraBlank) {
        while (depth > 0) {
            txt = "  " + txt;
            --depth;
        }
        if (extraBlank > 0) {
            let blanks = "";
            let i;
            for (i = 0; i < extraBlank; ++i) {
                blanks += " ";
            }
            txt = blanks + txt;
        }
        cc.log(txt);
    }

    function getFuncDescriptor(f) {
        return (f.toString().replace(/function\s?/mi, "").split(")"))[0] + ")";
    }

    let type = Object.prototype.toString.call(o).slice(8, -1);
    let t;
    let neb;
    let npfx;
    let len;
    let blanks;
    switch (type) {
        case "Number":
        case "String":
            t = "\"" + o.toString() + "\"";
            if (prefix) {
                t = prefix + t;
            }
            printWithDepth(t, depth, extraBlank);
            break;
        case "Undefined":
            t = 'UNDEFINED!';
            if (prefix) {
                t = prefix + t;
            }
            printWithDepth(t, depth, extraBlank);
            break;
        case "Boolean":

            t = o.toString();
            if (prefix) {
                t = prefix + t;
            }
            printWithDepth(t, depth, extraBlank);

            break;
        case "Object":

            t = "{";
            if (prefix) {
                t = prefix + t;
            }
            printWithDepth(t, depth, extraBlank);
            let prop;
            for (prop in o) {
                if (!o.hasOwnProperty(prop)) {
                    continue;
                }
                npfx = "\"" + prop + "\" : ";
                neb = (prefix ? prefix.length : 0) - 2 + extraBlank;
                _dumpObject(npfx, o[prop], depth + 1, neb, _ignore_function_member, max_depth);
            }

            len = prefix ? prefix.length : 0;
            t = "}";
            if (len > 0) {
                blanks = "";
                let i1;
                for (i1 = 0; i1 < len; ++i1) {
                    blanks += " ";
                }
                t = blanks + t;
            }
            printWithDepth(t, depth, extraBlank);

            break;
        case "Array":

            t = "[";
            if (prefix) {
                t = prefix + t;
            }
            printWithDepth(t, depth, extraBlank);
            let i2;
            for (i2 = 0; i2 < o.length; ++i2) {
                npfx = i2 + " : ";
                neb = (prefix ? prefix.length : 0) - 2 + extraBlank;
                _dumpObject(npfx, o[i2], depth + 1, neb, _ignore_function_member, max_depth);
            }

            len = prefix ? prefix.length : 0;
            t = "]";
            if (len > 0) {
                blanks = "";
                let i;
                for (i = 0; i < len; ++i) {
                    blanks += " ";
                }
                t = blanks + t;
            }
            printWithDepth(t, depth, extraBlank);

            break;
        case "Function":

            if (!_ignore_function_member) {
                t = getFuncDescriptor(o);
                if (prefix) {
                    t = prefix + t;
                }
                printWithDepth(t, depth, extraBlank);
            }
            break;
    }
};

/**
 * 打印对象的所有属性和方法
 * @param o 目标对象
 * @param _ignore_function_member 是否忽略函数
 * @param max_depth 显示的深度
 */
UtilsOther.dumpObject = function (o, _ignore_function_member, max_depth) {
    UtilsOther._dumpObject(undefined, o, 0, 0, _ignore_function_member || false, max_depth);
};

/**
 * 对象已定义
 * @param {*} obj
 * @returns {boolean}
 */
UtilsOther.D = function (obj) {
    return obj !== undefined;
};

/**
 * 对象已定义，且不为空
 * @param {*} obj
 * @returns {boolean}
 */
UtilsOther.DNN = function (obj) {
    return obj !== undefined && obj !== null;
};

/**
 * Check the obj whether is function or not
 * @param {*} obj
 * @returns {boolean}
 */
UtilsOther.isFunction = function (obj) {
    return typeof obj === 'function';
};

/**
 * Check the obj whether is number or not
 * @param {*} obj
 * @returns {boolean}
 */
UtilsOther.isNumber = function (obj) {
    return typeof obj === 'number' || Object.prototype.toString.call(obj) === '[object Number]';
};

/**
 * Check the obj whether is string or not
 * @param {*} obj
 * @returns {boolean}
 */
UtilsOther.isString = function (obj) {
    return typeof obj === 'string' || Object.prototype.toString.call(obj) === '[object String]';
};

UtilsOther.isArray = function (obj) {
    return Array.isArray(obj) ||
        (typeof obj === 'object' && Object.prototype.toString.call(obj) === '[object Array]');

};

/**
 * Check the obj whether is undefined or not
 * @param {*} obj
 * @returns {boolean}
 */
UtilsOther.isUndefined = function (obj) {
    return obj === undefined;
};

/**
 * Check the obj whether is object or not
 * @param {*} obj
 * @returns {boolean}
 */
UtilsOther.isObject = function (obj) {
    return typeof obj === "object" && Object.prototype.toString.call(obj) === '[object Object]';
};

/**
 * Check the obj whether is {}, [] or not
 * @param {*} obj
 * @returns {boolean}
 */
UtilsOther.isEmpty = function (obj) {
    return (Array.isArray(obj) && obj.length === 0)
        || (Object.prototype.isPrototypeOf(obj) && Object.keys(obj).length === 0);
};

/**
 * Check the obj whether is boolean or not
 * @param {Array | Object}obj
 * @returns {boolean}
 */
UtilsOther.isBoolean = function (obj) {
    return obj === true || obj === false || Object.prototype.toString.call(obj) === '[object Boolean]';
};

/**
 * Create a new object and copy all properties in an exist object to the new object
 * @function
 * @param {object|Array} obj The source object
 * @param {object|Array} newObj The target object
 * @return {Array|object} The created object
 */
UtilsOther.clone = function (obj, newObj) {
    // Cloning is better if the new object is having the same prototype chain
    // as the copied obj (or otherwise, the cloned object is certainly going to
    // have a different hidden class). Play with C1/C2 of the
    // PerformanceVirtualMachineTests suite to see how this makes an impact
    // under extreme conditions.
    //
    // Object.create(Object.getPrototypeOf(obj)) doesn't work well because the
    // prototype lacks a link to the constructor (Carakan, V8) so the new
    // object wouldn't have the hidden class that's associated with the
    // constructor (also, for whatever reasons, utilizing
    // Object.create(Object.getPrototypeOf(obj)) + Object.defineProperty is even
    // slower than the original in V8). Therefore, we call the constructor, but
    // there is a big caveat - it is possible that the this.init() in the
    // constructor would throw with no argument. It is also possible that a
    // derived class forgets to set "constructor" on the prototype. We ignore
    // these possibities for and the ultimate solution is a standardized
    // Object.clone(<object>).
    if (!newObj) {
        newObj = (obj.constructor) ? new obj.constructor() : {};
    }

    // Assuming that the constuctor above initialized all properies on obj, the
    // following keyed assignments won't turn newObj into dictionary mode
    // becasue they're not *appending new properties* but *assigning existing
    // ones* (note that appending indexed properties is another story). See
    // CCClass.js for a link to the devils when the assumption fails.
    let key;
    let copy;
    for (key in obj) {
        if (!obj.hasOwnProperty(key)) {
            continue;
        }
        copy = obj[key];
        // Beware that typeof null == "object" !
        if (((typeof copy) === "object") && copy) {
            newObj[key] = UtilsOther.clone(copy, null);
        } else {
            newObj[key] = copy;
        }
    }
    return newObj;
};

//---------------------------------------------------------------------------

/**
 * Load a single resource as txt synchronize with check platform.
 * @param {String} fileName
 * @returns {String}
 */
UtilsOther.getStringFromFile = function (fileName) {
    if (cc.sys.isNative) {
        return jsb.fileUtils.getStringFromFile(fileName);
    } else {
        let _loadTxtSync = function (url) {
            if (!cc._isNodeJs) {
                let xhr = this.getXMLHttpRequest();
                xhr.timeout = 0;
                xhr.open("GET", url, false);
                if (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
                    // IE-specific logic here
                    xhr.setRequestHeader("Accept-Charset", "utf-8");
                } else {
                    if (xhr.overrideMimeType) xhr.overrideMimeType("text\/plain; charset=utf-8");
                }
                xhr.send(null);
                if (!xhr.readyState === 4 || xhr.status !== 200) {
                    return null;
                }
                return xhr.responseText;
            } else {
                let fs = require("fs");
                return fs.readFileSync(url).toString();
            }
        }.bind(cc.loader);

        return _loadTxtSync(fileName);
    }
};

/**
 * 求线段ab和cd的交点，如果不相交则返回false，相交则返回交点坐标
 * @param a{cc.Vec2}
 * @param b{cc.Vec2}
 * @param c{cc.Vec2}
 * @param d{cc.Vec2}
 * @returns {*}
 */
UtilsOther.getSegmentsInter = function (a, b, c, d) {
    //线段ab的法线N1
    var nx1 = (b.y - a.y), ny1 = (a.x - b.x);

    //线段cd的法线N2
    var nx2 = (d.y - c.y), ny2 = (c.x - d.x);

    //两条法线做叉乘, 如果结果为0, 说明线段ab和线段cd平行或共线,不相交
    var denominator = nx1*ny2 - ny1*nx2;
    if (denominator==0) {
        return false;
    }

    //在法线N2上的投影
    var distC_N2=nx2 * c.x + ny2 * c.y;
    var distA_N2=nx2 * a.x + ny2 * a.y-distC_N2;
    var distB_N2=nx2 * b.x + ny2 * b.y-distC_N2;

    // 点a投影和点b投影在点c投影同侧 (对点在线段上的情况,本例当作不相交处理);
    if ( distA_N2*distB_N2>=0  ) {
        return false;
    }

    //
    //判断点c点d 和线段ab的关系, 原理同上
    //
    //在法线N1上的投影
    var distA_N1=nx1 * a.x + ny1 * a.y;
    var distC_N1=nx1 * c.x + ny1 * c.y-distA_N1;
    var distD_N1=nx1 * d.x + ny1 * d.y-distA_N1;
    if ( distC_N1*distD_N1>=0  ) {
        return false;
    }

    //计算交点坐标
    var fraction= distA_N2 / denominator;
    var dx= fraction * ny1,
        dy= -fraction * nx1;
    return { x: a.x + dx , y: a.y + dy };
};

UtilsOther.getDistance = function(vec1, vec2) {
    let d = Math.sqrt(Math.pow(vec2.x-vec1.x, 2) + Math.pow(vec2.y-vec1.y, 2));
    return d;
};

/**
 * 读取远程图片资源（在native平台会缓存下来）
 * @param url
 * @param callback
 */
UtilsOther.loadRemoteImg = function (url, callback) {
    if (cc.sys.isBrowser){
        cc.log("Remote img load web");
        cc.loader.load(url,function(progress){
            cc.log("Remote img load progress:"+progress);
        },function(error,tex){
            if(error)
            {
                cc.log("Remote img load error:"+error);
                return;
            }
            cc.log("Remote img load success.");
            callback(tex);
        });

        return;
    }

    cc.log("Remote img load: native");
    let dirpath = jsb.fileUtils.getWritablePath() + 'img/';
    let filepath = dirpath + Md5.md5_hex(url) + '.png';

    function loadEnd() {
        cc.loader.load(filepath, function (err, tex) {
            if (err) {
                cc.error(err);
            } else {
                callback(tex);
            }
        });

    }

    if (jsb.fileUtils.isFileExist(filepath)) {
        cc.log('Remote is find' + filepath);
        loadEnd();
        return;
    }

    let saveFile = function (data) {
        cc.log(typeof data);
        cc.log(data);
        let b = new Uint8Array(data);
        cc.log(typeof b);
        cc.log(b.length);
        if (typeof data !== 'undefined') {
            if (!jsb.fileUtils.isDirectoryExist(dirpath)) {
                jsb.fileUtils.createDirectory(dirpath);
            }
            cc.log("111111" + filepath);
            if (jsb.fileUtils.writeDataToFile(new Uint8Array(data), filepath)) {
                cc.log('Remote img save succeed.');
                cc.log("22222");

                loadEnd();
            } else {
                cc.log('Remote img save failed.');
            }
        } else {
            cc.log('Remote img download failed.');
        }
    };

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        cc.log("xhr.readyState  " + xhr.readyState);
        cc.log("xhr.status  " + xhr.status);
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                xhr.responseType = 'arraybuffer';
                saveFile(xhr.response);
            } else {
                saveFile(null);
            }
        }
    }.bind(this);
    xhr.open("GET", url, true);
    xhr.send();
};

/**
 * 检测触摸是否击中
 * @param {cc.Point} touchPoint
 * @param {cc.Node} node
 * @return {Boolean}
 */
UtilsOther.checkTouchIsHit = function (touchPoint, node) {
    return cc.rectContainsPoint(node.getBoundingBoxToWorld(), touchPoint);
};

/**
 * 创建剪裁容器
 * @param {String} spriteName
 * @return {cc.ClippingNode}
 */
UtilsOther.createCliper = function (spriteName) {
    //创建一个遮罩的模板
    let stencil = new cc.Sprite(spriteName);
    //创建一个ClippingNode 并设置一些基础属性 容器宽高与模板有关
    let clippingNode = new cc.ClippingNode();
    clippingNode.attr({
        stencil: stencil,
        anchorX: 0.5,
        anchorY: 0.5,
        alphaThreshold: 0.8 //设置裁剪透明值阀值 默认值为1 等于1时alpha = 0的部分也被裁剪
    });

    return clippingNode;
};

// TODO: 暂时未使用
/**
 * 得到节点在世界坐标系中的边界
 * @param node
 * @return {{x, y, width, height}}
 */
UtilsOther.convertBoundingBoxToWorld = function (node) {
    if (!node) {
        return cc.rect();
    }

    let leftBottom = node.convertToWorldSpace(cc.p());
    let rightTop = node.convertToWorldSpace(cc.pFromSize(node.getContentSize()));

    return cc.rect(leftBottom.x, leftBottom.y, rightTop.x - leftBottom.x, rightTop.y - leftBottom.y);
};

/**
 * 根据节点和指定的锚点得到坐标
 * @param {cc.Node} node
 * @param {cc.Point} anchorPoint
 * @return {*}
 */
UtilsOther.getPositionByAnchor = function (node, anchorPoint) {
    if (!node) {
        return cc.p();
    }

    let bounding = node.getBoundingBox();
    bounding.x += bounding.width * anchorPoint.x;
    bounding.y += bounding.height * anchorPoint.y;
    return cc.p(bounding.x, bounding.y);
};

/**
 * 运行震动效果
 * @param node
 * @param range
 * @param times
 */
UtilsOther.runShakeAction = function (node, range, times) {
    node.runAction(cc.repeat(
        cc.sequence(
            cc.moveBy(0.02, cc.p(0, range)),
            cc.moveBy(0.04, cc.p(0, -range * 2)),
            cc.moveBy(0.02, cc.p(0, range))
        ), times
    ))
};

/**
 * 根据配置的权重随机出一个对象
 * @param array {Array} Object对象的数组
 * @param keyForWeight {String} Object对象中定义权重的属性key(权重为Number类型)
 * @return {Object}
 */
UtilsOther.randomByWeight = function (array, keyForWeight) {
    if (!UtilsOther.isArray(array) || !UtilsOther.isString(keyForWeight)) {
        return null;
    }

    let sumWeight = 0;
    sumWeight = array.reduce(function (sumSoFar, item) {
        sumSoFar = sumSoFar + item[keyForWeight];
        return sumSoFar;
    }, sumWeight);

    cc.log("sumWeight:" + sumWeight);
    let tempWeight = 0;
    let randomValue = Math.random() * sumWeight;
    let value = null;
    for (let i in array) {
        value = array[i];
        tempWeight += value[keyForWeight];
        if (randomValue < tempWeight) {
            return value;
        }
    }

    return value;
};

/**
 * 根据最小值和最大值得到一个随机整数
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
UtilsOther.randomInteger = function (min, max) {
    let range = Math.round((max - min) * Math.random());
    return (min + range);
};

//******************csv begin*****************
/**
 * @return String[][]
 * DefaultOptions: {
        delim: ',',
        quote: '"',
        rowdelim: '\n'
        // rowdelim: '\r\n'
    }
 */
UtilsOther.parse = function (str, options) {
    let parser = new CSVParser(str, options);
    let all = [];
    while (parser.hasNext()) {
        let ar = parser.nextRow();
        all.push(ar);
    }
    return all;
};

UtilsOther.parseOneLine = function (str, options) {
    let parser = new CSVParser(str, options);
    let all = [];
    while (parser.hasNext()) {
        let ar = parser.nextRow();
        all.push(ar);
    }
    if (all.length <= 1) {
        return all[0];
    }
    return all;
};

/**
 * @param rows String[][]
 * @param colnames String[]
 * @param {Boolean} isParseNumber 是否需要解析成相应的数字
 * @return Object[]
 */
UtilsOther.bindColumns = function (rows, colnames, isParseNumber) {
    if (!colnames) {
        colnames = rows.shift();
    }
    return rows.map(function (row) {
        let obj = {};
        for (let i = 0; i < row.length; i++) {
            if (isParseNumber) {
                obj[colnames[i]] = (isNaN(row[i]) ? row[i] : Number(row[i]));
            } else {
                obj[colnames[i]] = row[i];
            }
        }
        return obj;
    });
};

UtilsOther.bindColumnsSimple = function (rows, colnames) {
    if (!colnames) {
        colnames = rows.shift();
    }
    return rows.map(function (row) {
        let obj = {};
        for (let i = 0; i < row.length; i++) {
            obj[colnames[i]] = CSV.parseOneSimple(row[i]);
        }
        return obj;
    });
};
//*******************csv end*******************

// 模拟屏幕点击
UtilsOther.getHTMLElementPosition = function(element) {
    var docElem = document.documentElement;
    var leftOffset = window.pageXOffset - docElem.clientLeft;
    var topOffset = window.pageYOffset - docElem.clientTop;
    if (typeof element.getBoundingClientRect === 'function') {
        var box = element.getBoundingClientRect();
        return {
            left: box.left + leftOffset,
            top: box.top + topOffset,
            width: box.width,
            height: box.height
        };
    }
    else {
        if (element instanceof HTMLCanvasElement) {
            return {
                left: leftOffset,
                top: topOffset,
                width: element.width,
                height: element.height
            };
        }
        else {
            return {
                left: leftOffset,
                top: topOffset,
                width: parseInt(element.style.width),
                height: parseInt(element.style.height)
            };
        }
    }
}

// x,y世界坐标
UtilsOther.touchSimulation = function(x, y) {
    let rect;
    //兼容2.2.x 与 2.3.2
    let inputManager = window._cc ? window['_cc'].inputManager : cc.internal.inputManager;
    if (cc.sys.isBrowser) {
        let canvas = document.getElementById("GameCanvas");
        rect = UtilsOther.getHTMLElementPosition(canvas);
    } else {
        rect = cc.view.getFrameSize();
        rect.left = 0;
        rect.top = 0;
    }
    
    // 将x,y从Creator世界坐标转换到设备窗口坐标
    let vp = cc.view.getViewportRect();
    let sx = cc.view.getScaleX();
    let sy = cc.view.getScaleY();
    let ratio = cc.view.getDevicePixelRatio();
    let htmlx = (x * sx  + vp.x) / ratio + rect.left;
    let htmly = rect.top + rect.height - (y * sy + vp.y) / ratio;
    let pt = cc.v2(htmlx, htmly);

    cc.log(`模拟点击坐标：${pt.x}, ${pt.y}`);
    let touch = inputManager.getTouchByXY(pt.x, pt.y, rect);
    inputManager.handleTouchesBegin([touch]);
    setTimeout(() => {
        inputManager.handleTouchesEnd([touch]);    
    }, 200);
}

module.exports = UtilsOther;