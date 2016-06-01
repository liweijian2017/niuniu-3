cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...

        loaddingPrefab: {
            default: null,
            type: cc.Prefab
        },
        
        promptBoxPrefab: {
            default: null,
            type: cc.Prefab
        },
    },

    // use this for initialization
    onLoad: function () {
        cc.audioEngine.playMusic(cc.url.raw('resources/sound/game_music.mp3'), true);
    },

    
    showDlg: function(info, confirmCallback, cancelCallback){
        //showDlg
        var promptBox = cc.instantiate(this.promptBoxPrefab);
        var canvas = cc.director.getScene().getChildByName('Canvas');
        var script = promptBox.getComponent('PromptBox');
        script.disabledUnderTouch();
        script.showPromptInfo(info, confirmCallback, cancelCallback);
        canvas.addChild(promptBox, 1000, 1000);
    },


    showLoadding:function(msg){
        var loadding = cc.instantiate(this.loaddingPrefab);            
        var canvas = cc.director.getScene().getChildByName('Canvas');
        canvas.addChild(loadding, 1000, 2000);

        if(msg)
        {
            loadding.getChildByName('label').getComponent(cc.Label).string = msg + '...';
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
