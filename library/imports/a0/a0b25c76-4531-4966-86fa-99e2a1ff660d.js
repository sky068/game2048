"use strict";
cc._RF.push(module, 'a0b25x2RTFJZob6meKh/2YN', 'UpdatePanel');
// scripts/hotUpdate/UpdatePanel.js

"use strict";

cc.Class({
    extends: cc.Component,
    properties: {
        progressBar: require("./../framework/ui/ProgressBar"),
        fileProgress: require("./../framework/ui/ProgressBar"),
        byteProgress: require("./../framework/ui/ProgressBar"),
        fileLabel: cc.Label,
        byteLabel: cc.Label,

        info: cc.Label
    }

});

cc._RF.pop();