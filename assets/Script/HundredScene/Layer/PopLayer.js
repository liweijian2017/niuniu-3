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
        this._winningWin = this.node.getChildByName('OpenPoundWin');
        this._addChumaWin = this.node.getChildByName('AddChumaWin');
        this._menuListWin = this.node.getChildByName('MenuList');
        this._resultWin = this.node.getChildByName('ResultWin');
        this._hint = this.node.getChildByName('Hint');
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

    //提示
    showHint:function(str){
        this._hint.active = true;
        this._hint.getChildByName('Lable').getComponent(cc.Label).string = str;
        this._hint.getComponent('NodeTransition').show();
        this._hint.getComponent('NodeTransition').timingHide(null, 1.5);
    },
    //关闭提示
    closeHint:function(){
        this._hint.getComponent('NodeTransition').hide();
    },

    //打开玩家列表
    openPlayerListWin:function(data){
        this._playerListWin.active = true;
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
    openRecordWin:function(data){
        this._recordWin.active = true;
        this._recordWin.getComponent('RecordWin').init(data);
        this._recordWin.getComponent('NodeTransition').show();
    },
    //关闭比赛记录窗口
    closeRecordWin:function(){
        this._recordWin.getComponent('NodeTransition').hide();
    },

    //打开奖池信息
    openPoundInfoWin:function(data){
        this._poundInfoWin.active = true;
        this._poundInfoWin.getComponent('PoundInfoWin').init(data);
        this._poundInfoWin.getComponent('NodeTransition').show();
    },
    //关闭奖池信息
    closePoundInfoWin:function(){
        this._poundInfoWin.getComponent('NodeTransition').hide();
        this._poundInfoWin.getComponent('PoundInfoWin').onCloseWin();
    },

    //打开上庄列表
    openBeBankerWin:function(data){
        this._beBankerWin.active = true;
        this._beBankerWin.getComponent('BeBankerWin').init(data); //加载请求数据
        this._beBankerWin.getComponent('NodeTransition').show();
    },
    //关闭上庄列表
    closeBeBankerWin:function(){
        this._beBankerWin.getComponent('BeBankerWin').clearChildren();
        this._beBankerWin.getComponent('NodeTransition').hide();
    },

    //打开中奖窗口-奖池开奖
    openWinningWin:function(){
        this._winningWin.active = true;
        this._winningWin.getComponent('NodeTransition').show();
    },
    //关闭中奖窗口
    closeWinningWin:function(){
        this._winningWin.getComponent('NodeTransition').hide();
    },

    //打开追加框
    openAddChumaWin:function(){
        this._addChumaWin.active = true;
        this._addChumaWin.getComponent('NodeTransition').show();
    },
    //关闭追加框
    closeAddChumaWin:function(){
        this._addChumaWin.getComponent('NodeTransition').hide();
    },

    openResultWin:function(){
        this._resultWin.active = true;
        this._resultWin.getComponent('NodeTransition').show();
    },

    closeResultWin:function(){
        this._resultWin.getComponent('NodeTransition').hide();
    },

});
