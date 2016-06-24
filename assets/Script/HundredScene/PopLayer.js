cc.Class({
    extends: cc.Component,

    properties: {
        _menuIsOpen:false,
    },

    onLoad: function () {
        this._startHint = this.node.getChildByName('StartHint');

        this._playerListWin = this.node.getChildByName('PlayerListWin');
        this._recordWin = this.node.getChildByName('RecordWin');
        this._poundInfoWin = this.node.getChildByName('PoundInfoWin');
        this._beBankerWin = this.node.getChildByName('BeBankerWin');
        this._winningWin = this.node.getChildByName('WinningWin');
        
        this._menuListWin = this.node.getChildByName('MenuList');
        this._toast = this.node.getChildByName('Toast');
    },
    //显示开始提示
    showStartHint:function(callback){
        this._startHint.active = true;
        this._startHint.getComponent('NodeTransition').show();
        this._startHint.getComponent('NodeTransition').timingHide(null, 2, callback);
    },
    //吐司提示
    showToast:function(str){
        this._toast.active = true;
        this._toast.getChildByName('Lable').getComponent(cc.Label).string = str;
        this._toast.getComponent('NodeTransition').show();
    },
    //关闭吐司提示
    closeToast:function(){
        this._toast.getComponent('NodeTransition').hide();
    },
    //打开玩家列表
    openPlayerListWin:function(){
        this._playerListWin.active = true;
        //TODO 请求无座玩家列表
        var data = [];
        for(var i=0; i<11; i++){
            var user = { uid:999,nick:'Dall',img:'',buyinChips:10000};
            data.push(user);
        }
        this._playerListWin.getComponent('PlayerListWin').init(data); //加载请求数据
        this._playerListWin.getComponent('NodeTransition').show();
    },
    //关闭玩家列表
    closePlayerListWin:function(){
        this._playerListWin.getComponent('PlayerListWin').clearChildren();
        this._playerListWin.getComponent('NodeTransition').hide();
    },
    //打开菜单
    openMenu:function(){
        this._menuIsOpen = !this._menuIsOpen;
        if(this._menuIsOpen){
            this._menuListWin.active = true;
            this._menuListWin.getComponent('NodeTransition').show();
        }else {
            this._menuListWin.getComponent('NodeTransition').hide();
        }  
    },
    //关闭菜单
    closeMenu:function(){
        this._menuListWin.getComponent('NodeTransition').hide();
    },

    //打开比赛记录窗口
    openRecordWin:function(){
        this._recordWin.active = true;
        this._recordWin.getComponent('NodeTransition').show();
    },
    //关闭比赛记录窗口
    closeRecordWin:function(){
        this._recordWin.getComponent('NodeTransition').hide();
    },

    //打开奖池信息
    openPoundInfoWin:function(){
        this._poundInfoWin.active = true;
        this._poundInfoWin.getComponent('NodeTransition').show();
    },
    //关闭奖池信息
    closePoundInfoWin:function(){
        this._poundInfoWin.getComponent('NodeTransition').hide();
    },

    //打开上庄列表
    openBeBankerWin:function(){
        this._beBankerWin.active = true;
        var data = [];
        for(var i=0; i<11; i++){
            var user = { uid:999,nick:'Dall',img:'',buyinChips:10000, readyBuyin:9999};
            data.push(user);
        }
        this._beBankerWin.getComponent('BeBankerWin').init(data); //加载请求数据
        this._beBankerWin.getComponent('NodeTransition').show();
    },
    //关闭上庄列表
    closeBeBankerWin:function(){
        this._beBankerWin.getComponent('BeBankerWin').clearChildren();
        this._beBankerWin.getComponent('NodeTransition').hide();
    },

    //打开中奖窗口
    openWinningWin:function(){
        this._winningWin.active = true;
        this._winningWin.getComponent('NodeTransition').show();
    },
    //关闭中奖窗口
    closeWinningWin:function(){
        this._winningWin.getComponent('NodeTransition').hide();
    },
});
