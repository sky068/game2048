let UpdatePanel = require("./UpdatePanel");

cc.Class({
    extends: cc.Component,

    properties: {
        panel: UpdatePanel,
        manifestUrl: {
            type: cc.Asset,
            default: null
        },
        versionUrl: {
            type: cc.Asset,
            default: null
        },

        updateUI: cc.Node,
        _updating: false,
        _canRetry: false,
        _storagePath: ''
    },

    checkCb: function (event) {
        cc.log('Code: ' + event.getEventCode());
        let hasNew = false;
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                // this.panel.info.string = "No local manifest file found, hot update skipped.";
                cc.log("No local manifest file found, hot update skipped.");
                cc.director.loadScene("InitScene");
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                // this.panel.info.string = "Fail to download manifest file, hot update skipped.";
                cc.log("Fail to download manifest file, hot update skipped.");
                cc.director.loadScene("InitScene");
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                // this.panel.info.string = "Already up to date with the latest remote version.";
                cc.log("Already up to date with the latest remote version.");
                cc.director.loadScene("InitScene");
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                // this.panel.info.string = 'New version found, please try to update.';
                this.panel.fileProgress.progress = 0;
                this.panel.byteProgress.progress = 0;
                hasNew = true;
                break;
            default:
                return;
        }

        this._am.setEventCallback(null);
        // this._updateListener = new jsb.EventListenerAssetsManager(this._am,null);
        // cc.eventManager.addListener(this._updateListener, 1);

        this._checkListener = null;
        this._updating = false;

        if (hasNew) {
            this.show();
        }
    },

    updateCb: function (event) {
        let needRestart = false;
        let failed = false;
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.panel.info.string = 'No local manifest file found, hot update skipped.';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                this.panel.byteProgress.progress = event.getPercent();
                this.panel.fileProgress.progress = event.getPercentByFile();

                this.panel.fileLabel.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                this.panel.byteLabel.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();

                let msg = event.getMessage();
                if (msg) {
                    this.panel.info.string = 'Updated file: ' + msg;
                    // cc.log(event.getPercent()/100 + '% : ' + msg);
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.panel.info.string = 'Fail to download manifest file, hot update skipped.';
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.panel.info.string = 'Already up to date with the latest remote version.';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this.panel.info.string = 'Update finished. ' + event.getMessage();
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.panel.info.string = 'Update failed. ' + event.getMessage();
                this.panel.retryBtn.active = true;
                this._updating = false;
                this._canRetry = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                this.panel.info.string = 'Asset update error: ' + event.getAssetId() + ', ' + event.getMessage();
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this.panel.info.string = event.getMessage();
                break;
            default:
                break;
        }

        if (failed) {
            this._am.setEventCallback(null);
            // this._updateListener = new jsb.EventListenerAssetsManager(this._am,null);
            // cc.eventManager.addListener(this._updateListener, 1);

            this._updateListener = null;
            this._updating = false;
        }

        if (needRestart) {
            this._am.setEventCallback(null);
            // this._updateListener = new jsb.EventListenerAssetsManager(this._am,null);
            // cc.eventManager.addListener(this._updateListener, 1);

            this._updateListener = null;
            // Prepend the manifest's search path
            let searchPaths = jsb.fileUtils.getSearchPaths();
            let newPaths = this._am.getLocalManifest().getSearchPaths();
            console.log(JSON.stringify(newPaths));
            Array.prototype.unshift.apply(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            cc.log("seachPaths: "+ JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            cc.audioEngine.stopAll();
            cc.game.restart();
        }
    },

    loadCustomManifest: function () {
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            let manifest = new jsb.Manifest(customManifestStr, this._storagePath);
            this._am.loadLocalManifest(manifest, this._storagePath);
            this.panel.info.string = 'Using custom manifest';
        }
    },

    retry: function () {
        if (!this._updating && this._canRetry) {
            this.panel.retryBtn.active = false;
            this._canRetry = false;

            this.panel.info.string = 'Retry failed Assets...';
            this._am.downloadFailedAssets();
        }
    },

    checkUpdate: function () {
        if (this._updating) {
            this.panel.info.string = 'Checking or updating ...';
            return;
        }
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            // Resolve md5 url
            let url = this.manifestUrl.nativeUrl;
            if (cc.loader.md5Pipe) {
                url = cc.loader.md5Pipe.transformURL(url);
            }
            this._am.loadLocalManifest(url);
        }
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            this.panel.info.string = 'Failed to load local manifest ...';
            return;
        }
        // 2.x版本直接使用assetManager.setEventCallback
        this._am.setEventCallback(this.checkCb.bind(this));
        // 这里有问题，2.x以下版本无法使用
        // this.updateListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
        // cc.eventManager.addListener(this.updateListener, 1);

        this._am.checkUpdate();
        this._updating = true;
    },

    hotUpdate: function () {
        cc.log("111111");
        cc.log(this._am);
        cc.log(this._updating);
        if (this._am && !this._updating) {
            this._am.setEventCallback(this.updateCb.bind(this));
            // this.updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
            // cc.eventManager.addListener(this.updateListener, 1);
            cc.log("2222222");
            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                // Resolve md5 url
                let url = this.manifestUrl.nativeUrl;
                if (cc.loader.md5Pipe) {
                    url = cc.loader.md5Pipe.transformURL(url);
                }
                this._am.loadLocalManifest(url);
                cc.log("33333");
            }
            cc.log("4444");
            this._failCount = 0;
            this._am.update();
            this._updating = true;
        }
    },

    show: function () {
        if (this.updateUI.active == false) {
            this.updateUI.active = true;
            this.hotUpdate();
        }
    },

    // use this for initialization
    onLoad: function () {
        // Hot update is only available in Native build
        if (!cc.sys.isNative) {
            return;
        }
        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + HOT_UPDATE_SUB_PATH);
        cc.log('Storage path for remote asset : ' + this._storagePath);

        // Setup your own version compare handler, versionA and B is versions in string
        // if the return value greater than 0, versionA is greater than B,
        // if the return value equals 0, versionA equals to B,
        // if the return value smaller than 0, versionA is smaller than B.
        this.versionCompareHandle = function (versionA, versionB) {
            cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            let vA = versionA.split('.');
            let vB = versionB.split('.');
            for (let i = 0; i < vA.length; ++i) {
                let a = parseInt(vA[i]);
                let b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                }
                else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        };

        // Init with empty manifest url for testing custom manifest
        this._am = new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle);

        let panel = this.panel;
        // Setup the verification callback, but we don't have md5 check function yet, so only print some message
        // Return true if the verification passed, otherwise return false
        this._am.setVerifyCallback(function (path, asset) {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            let compressed = asset.compressed;
            // Retrieve the correct md5 value.
            let expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            let relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            let size = asset.size;
            if (compressed) {
                panel.info.string = "Verification passed : " + relativePath;
                return true;
            }
            else {
                panel.info.string = "Verification passed : " + relativePath + ' (' + expectedMD5 + ')';
                return true;
            }
        });

        // this.panel.info.string = 'Hot update is ready, please check or directly update.';
        cc.log("Hot update is ready, please check or directly update.");

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this._am.setMaxConcurrentTask(2);
            // this.panel.info.string = "Max concurrent tasks count have been limited to 2";
            cc.log("android: Max concurrent tasks count have been limited to 2");
        }

        this.panel.fileProgress.progress = 0;
        this.panel.byteProgress.progress = 0;
    },

    start(){
        if (!cc.sys.isNative) {
            cc.director.loadScene("InitScene");
            return;
        }
        this.checkUpdate();

        const PlatformUtils = require("./../framework/platform/PlatformUtils");
        PlatformUtils.rmSplash();
    },

    onDestroy: function () {
        if (this._updateListener) {
            this._am.setEventCallback(null);
            // this._updateListener = new jsb.EventListenerAssetsManager(this._am,null);
            // cc.eventManager.addListener(this._updateListener, 1);

            this._updateListener = null;
        }
    }
});
