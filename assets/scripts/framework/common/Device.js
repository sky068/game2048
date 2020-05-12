/**
 * Created by skyxu on 2019/12/16.
 */

const PACKAGENAME = "com/zygame/utils/PlatformUtils";

cc.Class({
    extends: cc.Component,

    statics: {

        model: 'unknown',
        mac: '00:00:00:00:00:00',

        openudid: '',
        deviceToken: '',
        osName: '',
        osVersion: '',
        ssid: '',
        language: 'cn',
        region: 'unknown',

        // IOS
        odin: '',
        idfa: '',
        idfaEnable: '',
        advertisingId: '',

        // Android
        androidId: '',

        /**
         * 动态改变的
         */

        // 地理位置(原始数据)
        locationInfo: {},

        // IP
        ipAddress: '0.0.0.0',


        init: function () {
            const PROCUDT_ID = "com.game.test";
            this.osName = cc.sys.os;
            this.osVersion = cc.sys.osVersion;
            this.language = cc.sys.language;
            this.openudid = PROCUDT_ID;

            let info = '{}';
            if (cc.sys.isNative) {

                if (cc.sys.os === cc.sys.OS_ANDROID) {
                    info = jsb.reflection.callStaticMethod(PACKAGENAME, 'getDeviceInfo', '()Ljava/lang/String;');
                } else if (cc.sys.os == cc.sys.OS_IOS){
                    info = jsb.reflection.callStaticMethod('PlatformUtils', 'getDeviceInfo');
                }

                this.initNative(JSON.parse(info));

            } else {
                this.initHtml();
            }

        },

        initHtml: function () {

            // this.model       = '';
            // this.mac         = '';
            // this.idfa        = '';
            // this.openudid    = '';
            // this.deviceToken = '';
            // this.osVersion   = '';
            // this.androidId   = '';
            // this.ssid        = '';

        },

        initNative: function (deviceInfo) {

            for (const key in deviceInfo) {
                this[key] = deviceInfo[key];
            }

            cc.log(JSON.stringify(deviceInfo));
        },


        // // 设置位置
        // setLocationInfo: function (locationInfo) {
        //     cc.log('Device:获取地理位置成功');
        //
        //     this.locationInfo = locationInfo;
        //
        //     // 同步地理位置
        //     zc.helper.syncLocationInfo();
        // },

        // 获取位置
        // getLocationInfo: function () {
        //     let locationInfo = {
        //         longitude: '0', // 经度
        //         latitude: '0', // 纬度
        //         country: 'unknown', // 国家
        //         province: 'unknown', // 省
        //         city: 'unknown', // 市
        //         district: 'unknown', // 区
        //         address: 'unknown', // 位置描述
        //     };
        //
        //     if (cc.sys.isNative) {
        //         if (cc.sys.os === cc.sys.OS_ANDROID) {
        //             if (this.locationInfo.hasOwnProperty('city') && this.locationInfo.hasOwnProperty('district')) {
        //                 locationInfo = {
        //                     longitude: this.locationInfo.longitude, // 经度
        //                     latitude: this.locationInfo.latitude, // 纬度
        //                     country: this.locationInfo.country, // 国家
        //                     province: this.locationInfo.province, // 省
        //                     city: this.locationInfo.city, // 市
        //                     district: this.locationInfo.district, // 区
        //                     address: this.locationInfo.addressStr, // 位置描述
        //                 }
        //             } else {
        //                 zy.device.getLocation();
        //             }
        //         } else {
        //
        //             if (this.locationInfo.hasOwnProperty('State') && this.locationInfo.hasOwnProperty('SubLocality')) {
        //                 locationInfo = {
        //                     longitude: this.locationInfo.longitude, // 经度
        //                     latitude: this.locationInfo.latitude, // 纬度
        //                     country: this.locationInfo.Country, // 国家
        //                     province: this.locationInfo.State, // 省
        //                     city: this.locationInfo.City, // 市
        //                     district: this.locationInfo.SubLocality, // 区
        //                     address: this.locationInfo.formattedAddress, // 位置描述
        //                 }
        //             } else {
        //                 zc.device.getLocation();
        //             }
        //         }
        //     } else {
        //         // WEB
        //         if (this.locationInfo.hasOwnProperty('latitude') && this.locationInfo.hasOwnProperty('longitude')) {
        //             locationInfo.longitude = this.locationInfo.longitude;
        //             locationInfo.latitude = this.locationInfo.latitude;
        //         } else {
        //             zc.device.getLocation();
        //         }
        //     }
        //
        //     return locationInfo;
        // },

        // 设置IP地址
        // setIPAddress: function (ipAddress) {
        //     this.ipAddress = ipAddress;
        // },

        // 获取IP地址
        // getIPAddress: function () {
        //     let ipAddress = '0.0.0.0';
        //     if (this.ipAddress != '0.0.0.0') {
        //         ipAddress = this.ipAddress;
        //     } else {
        //         zc.helper.syncGetIPAddress();
        //     }
        //
        //     return ipAddress;
        // },

        // 获取位置(SDKHelper)
        // getLocation: function () {
        //     if (APP_REVIEW) return;
        //
        //     // if (cc.sys.isNative) {
        //
        //     //     if (cc.sys.os === cc.sys.OS_ANDROID) {
        //     //         jsb.reflection.callStaticMethod('com/zhanyou/zhuding/AppController', 'getLocation', '()V');
        //     //     } else {
        //     //         jsb.reflection.callStaticMethod('MyApi', 'getLocation');
        //     //     }
        //
        //     // } else {
        //     //     if (cc.sys.platform == cc.sys.WECHAT_GAME) {
        //
        //     //     } else if (cc.sys.browserType == cc.sys.BROWSER_TYPE_WECHAT){
        //     //         wx.getLocation({
        //     //             type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        //     //             success: function (res) {
        //     //                 let latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        //     //                 let longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
        //     //                 let speed = res.speed; // 速度，以米/每秒计
        //     //                 let accuracy = res.accuracy; // 位置精度
        //
        //     //                 SDKHelper.locationResult({
        //     //                     latitude: latitude,
        //     //                     longitude: longitude,
        //     //                 });
        //     //             }
        //     //             });
        //     //     }
        //
        //     // }
        // },

        // 获取通讯录(SDKHelper)
        // getContact: function () {
        //     if (cc.sys.isNative) {
        //
        //         if (cc.sys.os === cc.sys.OS_ANDROID) {
        //             jsb.reflection.callStaticMethod('com/zhanyou/zhuding/AppController', 'getContact', '()V');
        //         } else {
        //             jsb.reflection.callStaticMethod('MyApi', 'getContact');
        //         }
        //
        //     } else {
        //
        //     }
        //
        // },

        // 获取网络状态
        // getNetworkStatus: function () {
        //     if (cc.sys.isNative) {
        //
        //         if (cc.sys.os === cc.sys.OS_ANDROID) {
        //             const ret = jsb.reflection.callStaticMethod('com/zhanyou/zhuding/AppController', 'getNetworkStatus', '()Ljava/lang/String;');
        //             const networkStatus = JSON.parse(ret);
        //             cc.log('networkStatus', networkStatus);
        //         } else {
        //             const ret = jsb.reflection.callStaticMethod('MyApi', 'getNetworkStatus');
        //             const networkStatus = JSON.parse(ret);
        //             cc.log('networkStatus', networkStatus);
        //         }
        //
        //     } else {
        //
        //     }
        // },


        // 获取电量状态
        // getBatteryLevel: function () {
        //     if (cc.sys.isNative) {
        //
        //         if (cc.sys.os === cc.sys.OS_ANDROID) {
        //             const ret = jsb.reflection.callStaticMethod('com/zhanyou/zhuding/AppController', 'getBatteryLevel', '()Ljava/lang/String;');
        //             const batteryLevel = JSON.parse(ret);
        //             cc.log('batteryLevel', batteryLevel);
        //         } else {
        //             const ret = jsb.reflection.callStaticMethod('MyApi', 'getBatteryLevel');
        //             const batteryLevel = JSON.parse(ret);
        //             cc.log('batteryLevel', batteryLevel);
        //         }
        //
        //     } else {
        //
        //     }
        // },

        // 获取网络信号状态
        // getSignalStrengthLevel: function () {
        //     if (cc.sys.isNative) {
        //
        //         if (cc.sys.os === cc.sys.OS_ANDROID) {
        //             const ret = jsb.reflection.callStaticMethod('com/zhanyou/zhuding/AppController', 'getSignalStrengthLevel', '()Ljava/lang/String;');
        //             const signalStrengthLevel = JSON.parse(ret);
        //             cc.log('signalStrengthLevel', signalStrengthLevel);
        //         } else {
        //             const ret = jsb.reflection.callStaticMethod('MyApi', 'getSignalStrengthLevel');
        //             const signalStrengthLevel = JSON.parse(ret);
        //             cc.log('signalStrengthLevel', signalStrengthLevel);
        //         }
        //
        //     } else {
        //
        //     }
        // },

        // 获取麦克风权限
        // requestRecordPermission: function () {
        //     if (cc.sys.isNative) {
        //
        //         if (cc.sys.os === cc.sys.OS_ANDROID) {
        //             jsb.reflection.callStaticMethod('com/zhanyou/zhuding/AppController', 'requestRecordPermission', '()V');
        //         } else {
        //             jsb.reflection.callStaticMethod('MyApi', 'requestRecordPermission');
        //         }
        //
        //     } else {
        //
        //     }
        // },

        // 手机振动
        // phoneShake: function () {
        //     if (cc.sys.isNative) {
        //
        //         if (cc.sys.os === cc.sys.OS_ANDROID) {
        //             jsb.reflection.callStaticMethod('com/zhanyou/zhuding/AppController', 'phoneShake', '()V');
        //         } else {
        //             jsb.reflection.callStaticMethod('MyApi', 'phoneShake');
        //         }
        //
        //     } else {
        //
        //     }
        // },

        // 横竖屏切换
        // landscapeAction: function () {
        //     if (cc.sys.isNative) {
        //
        //         if (cc.sys.os === cc.sys.OS_ANDROID) {
        //             jsb.reflection.callStaticMethod('com/zhanyou/zhuding/AppController', 'landscapeAction', '()V');
        //         } else {
        //             jsb.reflection.callStaticMethod('MyApi', 'landscapeAction');
        //         }
        //
        //     } else {
        //
        //     }
        // },

        // portraitAction: function () {
        //     if (cc.sys.isNative) {
        //
        //         if (cc.sys.os === cc.sys.OS_ANDROID) {
        //             jsb.reflection.callStaticMethod('com/zhanyou/zhuding/AppController', 'portraitAction', '()V');
        //         } else {
        //             jsb.reflection.callStaticMethod('MyApi', 'portraitAction');
        //         }
        //
        //     } else {
        //
        //     }
        // },

        // 可用内存
        // getAvailableMemory: function () {
        //     if (cc.sys.isNative) {
        //
        //         if (cc.sys.os === cc.sys.OS_ANDROID) {
        //             const ret = jsb.reflection.callStaticMethod('com/zhanyou/zhuding/AppController', 'getAvailableMemory', '()F');
        //             cc.log('getAvailableMemory', ret);
        //         } else {
        //
        //             const ret = jsb.reflection.callStaticMethod('MyApi', 'getAvailableMemory');
        //             cc.log('getAvailableMemory', ret);
        //         }
        //
        //     } else {
        //
        //     }
        // },

        // 使用内存
        // getUsedMemory: function () {
        //     if (cc.sys.isNative) {
        //
        //         if (cc.sys.os === cc.sys.OS_ANDROID) {
        //             const ret = jsb.reflection.callStaticMethod('com/zhanyou/zhuding/AppController', 'getUsedMemory', '()F');
        //             cc.log('getUsedMemory', ret);
        //         } else {
        //
        //             const ret = jsb.reflection.callStaticMethod('MyApi', 'getUsedMemory');
        //             cc.log('getUsedMemory', ret);
        //         }
        //
        //     } else {
        //
        //     }
        // },

        // CPU使用率
        // getCpuUsage: function () {
        //     if (cc.sys.isNative) {
        //
        //         if (cc.sys.os === cc.sys.OS_ANDROID) {
        //             const ret = jsb.reflection.callStaticMethod('com/zhanyou/zhuding/AppController', 'getCpuUsage', '()F');
        //             cc.log('getCpuUsage', ret);
        //         } else {
        //
        //             const ret = jsb.reflection.callStaticMethod('MyApi', 'getCpuUsage');
        //             cc.log('getCpuUsage', ret);
        //         }
        //
        //     } else {
        //
        //     }
        // },


        vibratorShort: function () {
            getVibrator(25);
        },

        vibratorLong: function () {
            getVibrator(100);
        },

        // t震动时间（毫秒）短震动建议25ms，长震动100毫秒
        getVibrator: function (t) {
            if (!zy.dataMng.userData.vibOn) {
                return;
            }

            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod(PACKAGENAME, "vibrator", "(I)V", t);
            } else if (cc.sys.os == cc.sys.OS_IOS) {

            }
        },


        // 清理
        clean: function () {
            if (cc.sys.browserType == cc.sys.BROWSER_TYPE_WECHAT) {
                // 隐藏所有非基础按钮接口
                wx.hideAllNonBaseMenuItem();
            }
        },

    },

});