var Http = require("Http");
var Game = require("Game");
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
    },

    // use this for initialization
    onLoad: function () {

    },

    //quick start button which in the room list was pressed
    quickStartPressed: function () {
       //Http.quickGame(function(data){
           //cc.info(data);
           //loading
           var canvas = cc.director.getScene().getChildByName('Canvas');
           if(Http.userData.point < 1500)
           {
              canvas.getComponent('PopUp').showDlg('您的游戏币不足,去充值吗？', function(){
                  if(window.gotoPay)
                      window.gotoPay();
              }, function(){});
           }
           else
           {
             Game.socket.pause();
             
             canvas.getComponent('PopUp').showLoadding();
             Game.socket.sendQuickStart();
          }
       //});
    }
});
