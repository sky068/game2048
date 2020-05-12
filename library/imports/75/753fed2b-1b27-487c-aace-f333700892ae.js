"use strict";
cc._RF.push(module, '753fe0rGydIfKrO8zNwCJKu', 'ClientConfig');
// scripts/ClientConfig.js

"use strict";

/**
 * Created by skyxu on 2019/12/17.
 */

window.zy = window.zy || {};

/**
 * !!!重要，渠道id，打包前一定要修改
 * 国外安卓 101, 国外iOS 102, 国内安卓 201, 国内iOS 202
 * @type {number}
 */
window.CHANNEL_ID = 201;

window.DEBUG_OPEN = false;

window.UPLTV_IOS_APPKEY = "";
window.UPLTV_ANDROID_APPKEY = "";

window.BASE_LOCAL_VERSION = '2020011302'; // !!!非常重要，每次发包（上传包）都需要修改，保障最新内容覆盖热更目录
window.VERSION_NAME = "1.0.0";
window.HOT_UPDATE_SUB_PATH = "zy/download" + VERSION_NAME;

cc._RF.pop();