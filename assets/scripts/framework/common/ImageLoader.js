/**
 * Created by skyxu on 2018/7/11.
 *
 * 参考: https://www.jianshu.com/p/a5c77a045063
 */

"use strict";

function __loadImage(url, callback){
    cc.loader.load({url: url, type: "jpeg"}, (err, tex)=>{
        if (err){
            cc.error(err);
        } else {
            callback(tex);
        }
    });
}

/**
 * 下载远程图片
 * @param url{String} 图片链接地址
 * @param callback{function(tex:cc.Texture2d)} 下载成功回调
 */
function loadImage(url, callback){
    // Web平台直接加载
    if (!cc.sys.isNative){
        __loadImage(url, callback);
        return;
    }

    let dirpath = jsb.fileUtils.getWritablePath() + "TclGameImg/";
    cc.log("dirpath: " + dirpath);

    let md5 = require("./../encrypt/Md5");
    let md5Url = md5.md5_hex(url);
    let filePath = dirpath + md5Url + '.jpg';
    cc.log("filepath: " + filePath);

    function loadEnd() {
        cc.loader.load(filePath, (err, tex)=>{
            if (err){
                cc.error(err);
            } else {
                callback(tex);
            }
        });
    }

    if (jsb.fileUtils.isFileExist(filePath)){
        cc.log("Remote img is find: " + filePath);
        loadEnd();
        return;
    }

    let saveFile = function (data) {
        if (data && typeof data !== "undefined"){
            if (!jsb.fileUtils.isDirectoryExist(dirpath)){
                jsb.fileUtils.createDirectory(dirpath);
            } else {
                cc.log("路径 " + dirpath + "已经存在。");
            }

            if(jsb.fileUtils.writeDataToFile(new Uint8Array(data), filePath)){
                cc.log("Remote img save succeed.");
                loadEnd();
            }else {
                cc.log("Remote img save failed.");
            }
        } else {
            cc.log("Remote img download failed.");
        }
    };

    let xhr = cc.loader.getXMLHttpRequest();
    xhr.onreadystatechange = function () {
        cc.log("xhr.readyState: " + xhr.readyState);
        cc.log("xhr.status: " + xhr.status);
        if (xhr.readyState === 4){
            if (xhr.status === 200){
                saveFile(xhr.response);
            } else {
                saveFile(null);
            }
        }
    }.bind(this);
    xhr.responseType = 'arraybuffer';
    xhr.open('GET', url, true);
    xhr.send();
}

module.exports = {
    loadImage: loadImage
};

