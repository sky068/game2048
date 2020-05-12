"use strict";
cc._RF.push(module, '14638K9xV1Mg4d0HwW7hmJE', 'ConstData');
// scripts/data/ConstData.js

"use strict";

/**
 * Created by skyxu on 2019/11/27.
 */

var ZIndex = {
    // 基于CANVAS
    POP_BASE: 1,
    LOADING: 888,
    ALERT: 998,
    TIP: 999,

    // 基于POP
    POP_MASK: -999, // POP遮罩

    GUIDE: 900
};

// 设计分辨率
var DesignSize = cc.size(1334, 750);

//
var StaticKey = {
    SaveDataVersion: "V1", // 附加给本地储存的key上，用来更新版本强制清空用户数据
    PlayerDataKey: "playerDataKey"
};

// 广告位
var AdKey = {
    VdFreePh: "video_reward_1", // 免费体力
    VdOfflineCoins: "video_reward_2", // 离线奖励翻倍
    VdAddTime: "video_reward_3", // 增加协同攻击时间
    VdLevelCoins: "video_reward_5", // 关卡奖励翻倍
    VdREVIVE: 'video_reward_4', // 复活
    InterLevel: "interstitial_1", // 过关插屏广告
    FreeCoins: "video_reward_6" // 免费金币
};

// 穿山甲广告位需要把上面的广告位转换下
var OpenAdsKey = {
    video_reward_1: "941627716",
    video_reward_2: "942161521",
    video_reward_3: "941627750",
    video_reward_4: "941627756",
    video_reward_5: "941627759",
    video_reward_6: "941630566",
    interstitial_1: "941627740"
};

// IOS穿山甲广告位需要把上面的广告位转换下
var OpenAdsKeyIOS = {
    video_reward_1: "942341544",
    video_reward_2: "942341562",
    video_reward_3: "942341570",
    video_reward_4: "942341573",
    video_reward_5: "942341577",
    video_reward_6: "942341579",
    interstitial_1: "942341589"
};

var Font = {
    FONT_NORMAL: "fonts/Montserrat-Bold" // 通用字体
};

cc.Class({
    statics: {
        // 宏定义区
        ZIndex: ZIndex,
        DesignSize: DesignSize,
        StaticKey: StaticKey,
        AdKey: AdKey,
        OpenAdsKey: OpenAdsKey,
        OpenAdsKeyIOS: OpenAdsKeyIOS,

        Font: Font,

        init: function init(data) {},

        clean: function clean() {}
    }
});

cc._RF.pop();