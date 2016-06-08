cc.Class({
    extends: cc.Component,
    properties: {
        loaddingPrefab: {
            default: null,
            type: cc.Prefab
        },
        promptBoxPrefab: {
            default: null,
            type: cc.Prefab
        },
        bankruptWinPrefab: {
            default: null,
            type: cc.Prefab
        },
        moneyParPrefab:{
            default:null,
            type:cc.Prefab
        },
    },
    onLoad: function () {
        cc.audioEngine.playMusic(cc.url.raw('resources/sound/game_music.mp3'), true);
    },
    showDlg: function(info, confirmCallback, cancelCallback){
        //文本弹框提示
        var promptBox = cc.instantiate(this.promptBoxPrefab);
        var canvas = cc.director.getScene().getChildByName('Canvas');
        var script = promptBox.getComponent('PromptBox');
        script.disabledUnderTouch();
        script.showPromptInfo(info, confirmCallback, cancelCallback);
        canvas.addChild(promptBox, 1000, 1000);
    },
    showLoadding:function(msg){
        var loadding = cc.instantiate(this.loaddingPrefab);
        loadding.name = "loading";          
        var canvas = cc.director.getScene().getChildByName('Canvas');
        canvas.addChild(loadding, 1000, 2000);
        if(msg){
            loadding.getChildByName('label').getComponent(cc.Label).string = msg + '...';
        }
    },
    removeLoadding: function(){
        var canvas = cc.director.getScene().getChildByName('Canvas');
        canvas.getChildByName('loading').removeFromParent();
    },
    //破产
    showBankruptWin:function(point, num, cb){
        var promptBox = cc.instantiate(this.bankruptWinPrefab);
        promptBox.name = 'bankrupt';
        var canvas = cc.director.getScene().getChildByName('Canvas');
        var script = promptBox.getComponent('BankruptWin');
        script.setPoint(point, num);
        if(cb)script.setCallBack(cb);
        canvas.addChild(promptBox, 999, 999);
    },
    closeBankruptWin:function(){
        var canvas = cc.director.getScene().getChildByName('Canvas');
        canvas.getChildByName('bankrupt').removeFromParent();
    },
    playMoneyPar:function(){
        var canvas = cc.director.getScene().getChildByName('Canvas');
        this.node.addChild(cc.instantiate(this.moneyParPrefab));
    },
});
