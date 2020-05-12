(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/framework/common/Audio.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'bc426H/sghBCZ8seMku3vc5', 'Audio', __filename);
// scripts/framework/common/Audio.js

"use strict";

/**
 * Created by skyxu on 2019/12/26.
 */

var BGM = {
    MAIN: "sounds/bgm/main"
};

var Effect = {
    CommonClick: "sounds/effect/common_click"
};

cc.Class({
    statics: {
        BGM: BGM,
        Effect: Effect,

        init: function init() {
            this.curBGMUrl = null;
            this.curBGMClip = null;

            this.bgmVolume = 0.9;
            this.effVolume = 1;
            this.bgmEnabled = true;
            this.effEnabled = true;

            var bgmEnabled = cc.sys.localStorage.getItem('bgmEnabled');
            if (bgmEnabled != null && bgmEnabled == 'false') {
                this.bgmEnabled = false;
            }

            var bgmVolume = cc.sys.localStorage.getItem('bgmVolume');
            if (bgmVolume != null) {
                this.bgmVolume = parseFloat(bgmVolume);
                cc.audioEngine.setMusicVolume(bgmVolume);
            }

            var effEnabled = cc.sys.localStorage.getItem('effEnabled');
            if (effEnabled != null && effEnabled == 'false') {
                this.effEnabled = false;
            }

            var effVolume = cc.sys.localStorage.getItem('effVolume');
            if (effVolume != null) {
                this.effVolume = parseFloat(effVolume);
                cc.audioEngine.setEffectsVolume(effVolume);
            }
        },


        // 当前bgmurl
        getCurBGMUrl: function getCurBGMUrl() {
            return this.curBGMUrl;
        },

        playBGM: function playBGM(url, force) {
            var _this = this;

            // 如果已经在播放就不播了
            if (this.curBGMUrl && this.curBGMUrl == url && !force) {
                return;
            }

            this.curBGMUrl = url;

            if (!this.bgmEnabled) {
                return;
            }

            if (this.curBGMClip) {
                this.uncache(this.curBGMClip);
            }

            cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
                if (!err) {
                    _this.curBGMClip = clip;
                    cc.audioEngine.playMusic(clip, true);
                }
            });
        },
        pauseBGM: function pauseBGM() {
            cc.audioEngine.pauseMusic();
        },
        resumeBGM: function resumeBGM() {
            cc.audioEngine.resumeMusic();
        },
        stopBGM: function stopBGM() {
            cc.audioEngine.stopMusic();
        },
        playEffect: function playEffect(url) {
            var loop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            if (!this.effEnabled) {
                return;
            }

            cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
                if (!err) {
                    cc.audioEngine.playEffect(clip, loop);
                }
            });
        },
        pauseAllEffects: function pauseAllEffects() {
            cc.audioEngine.pauseAllEffects();
        },
        resumeAllEffects: function resumeAllEffects() {
            cc.audioEngine.resumeAllEffects();
        },
        stopALlEffects: function stopALlEffects() {
            cc.audioEngine.stopAllEffects();
        },
        uncache: function uncache(clip) {
            cc.audioEngine.uncache(clip);
        },
        uncacheAll: function uncacheAll() {
            cc.audioEngine.uncacheAll();
        },
        pauseAll: function pauseAll() {
            cc.audioEngine.pauseAll();
        },
        resumeAll: function resumeAll() {
            cc.audioEngine.resumeAll();
        },
        stopAll: function stopAll() {
            cc.audioEngine.stopAll();
        },
        setBGMEnabled: function setBGMEnabled(enabled) {
            if (this.bgmEnabled != enabled) {
                cc.sys.localStorage.setItem('bgmEnabled', String(enabled));
                this.bgmEnabled = enabled;
                if (this.bgmEnabled == true && this.curBGMUrl != null) {
                    this.playBGM(this.curBGMUrl, true);
                } else {
                    this.stopBGM();
                }
            }
        },
        getBGMEnabled: function getBGMEnabled() {
            return this.bgmEnabled;
        },
        setBGMVolume: function setBGMVolume(v) {
            if (this.bgmVolume != v) {
                cc.sys.localStorage.setItem('bgmVolume', v);
                this.bgmVolume = v;
                cc.audioEngine.setMusicVolume(v);
            }
        },
        getBGMVomue: function getBGMVomue() {
            return this.bgmVolume;
        },
        setEffectsEnabled: function setEffectsEnabled(enabled) {
            if (this.effEnabled != enabled) {
                cc.sys.localStorage.setItem('effEnabled', String(enabled));
                this.effEnabled = enabled;
                if (!enabled) {
                    this.stopALlEffects();
                }
            }
        },
        getEffectsEnabled: function getEffectsEnabled() {
            return this.effEnabled;
        },
        setEffectsVolume: function setEffectsVolume(v) {
            if (this.effVolume != v) {
                cc.sys.localStorage.setItem('effVolume', v);
                this.effVolume = v;
                cc.audioEngine.setEffectsVolume(this.effVolume);
            }
        },
        getEffectVolume: function getEffectVolume() {
            return this.effVolume;
        },
        clean: function clean() {
            this.stopAll();
            this.uncacheAll();
            this.curBGMUrl = null;
            this.curBGMClip = null;
        }
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Audio.js.map
        