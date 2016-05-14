cc.Class({
    extends: cc.Component,

    properties: {
        _index:0, //页号
        buttons:[cc.Button]
    },
    
    //初始化tab
    onLoad: function () {
        // var self = this;
        this.updateTab();
        this.node.on('switch-tab', function(event){
            this.switchTab(event.getUserData().msg);
        }, this);
    },
    //更新显示
    updateTab:function(){
        for(var i = 0; i<this.buttons.length; i++){
            if(i == this._index){
                this.buttons[i].interactable = false;//显示对应的view
            }else {
                this.buttons[i].interactable = true;
            }
        }
    },
    
    switchTab:function(index){
        this._index = index;
        this.updateTab();
    }
    
});
