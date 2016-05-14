var Http = require('Http');
var DataProxy = require('DataProxy');
var GameSocket = require('GameSocket');
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
        //取消请求测试
        Http.getRoomList(function(data){
            cc.info(data);
        });

        var xhr = Http.getOnline(1, function(data){
            cc.info(data);
        }, function(data){
            cc.info(data);
        });
        Http.cancelRequest(xhr);
        

        //DataProxy 测试
        var userData = {
            'name' : 'ALeo', 
            'point': 1000
        };
        var userData = DataProxy.extend(userData);
        
        userData.addDataObserver('name', function(){
            cc.info(this.name, '1');
        });
        
        var handle = userData.addDataObserver('name', function(){
           cc.info(this.name, '2'); 
        });
        cc.info(userData.name);
        userData.name = 'hello';
        userData.removeDataObserver('name', handle);
        userData.name = 'world';
        
        userData.point = 2222;

        var list = Http.getConfigData().serverList[0];
        var gameSocket = new GameSocket();
        gameSocket.connect(list[0], list[1]);
        gameSocket.sendJoinRoom(1);
        
        //server测试
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
