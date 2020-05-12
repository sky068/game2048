cc.Class({
    extends: cc.Component,
    properties: {
        progressBar: require("./../framework/ui/ProgressBar"),
        fileProgress: require("./../framework/ui/ProgressBar"),
        byteProgress: require("./../framework/ui/ProgressBar"),
        fileLabel: cc.Label,
        byteLabel: cc.Label,

        info: cc.Label,
    }

});