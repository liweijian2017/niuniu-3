var Game = require('Game');
var Http = require('Http');
var GameSocket = require('GameSocket');
var P = require('GAME_SOCKET_PROTOCOL');

cc.Class({
    extends: cc.Component,
    properties: {
        selfSeat:{
            default:null,
            type:cc.Node
        },
        seats:{
            default:[],
            type:[cc.Node]
        },
        toast:{
            default: null,
            type:cc.Node
        },
        
        IsSit:false, //用户自己是否已经坐下
        isOk:false, //是否在等待(已经做下,但是还没有开始),false表示等待开始,true表示,已经可以开始了
        gameStatus:0, //房间状态
        
    },

    onLoad: function () {
        this.playerList = null;
        this.bankerSeat = null; //当前局庄家是谁
        this.mapFun = {  //函数地图
			[P.SVR_JOIN_SUCCESS] : this.SVR_JOIN_SUCCESS,
            [P.SVR_TURN_TO] : this.SVR_TURN_TO,
            [P.SVR_GAME_START] : this.SVR_GAME_START,
            [P.SVR_DO_SUCCESS] : this.SVR_DO_SUCCESS,
            [P.SVR_DEAL_ONE_CARD] : this.SVR_DEAL_ONE_CARD,
            [P.SVR_GAME_OVER] :this.SVR_GAME_OVER,
		};

        //监听用户的倍数选择
        this.node.on('SELECT_MULTIPLE', function(event){
            var index = event.getUserData().msg;
            event.stopPropagation();
            Game.instance.socket.sendDo(index);
        }, this);
         
         //监听闲家选择倍数            
        this.node.on('PLAYER_SELECT_MULTIPLE', function(event){
            var index = event.getUserData().msg;
            event.stopPropagation();
            Game.instance.socket.sendDo(index);
        }, this);
         
        //开牌结果处理
        this.node.on('COUNT_HANDLEPOKER', function(event){
            var index = event.getUserData().msg;
            if(0 == index){ //有牛
                //开牌
                this.selfSeat.getComponent('SelfSeat').showPokers(8);
                this.selfSeat.getComponent('SelfSeat').closeResultPanel();
                //2.关闭窗口
            }else { //没牛
                //TODO 判断是否真的有牛,如果有
                if(true){ //开牌
                    
                }else {//给出提示
                    
                }
            }
            event.stopPropagation();
        }, this);
         
        //玩家选择座位,处理         
        this.node.on('SELECT_SEAT', function(event){
             var index = event.getUserData().msg;
             if(this.playerList){
                  this.selectSeatDowm(index, this.playerList);
             }
        }, this); 
        
    },
    
    onProcessPacket: function(pack){
		if(typeof(this.mapFun[pack.cmd]) == 'function')
			this.mapFun[pack.cmd].call(this, pack);
	},

    //游戏开始入口
    start:function () {
        
        //接受服务器包
        Game.instance.socket.addEventListener(GameSocket.EVT_PACKET_RECEIVED, function(event){
            this.onProcessPacket(event.data);
        }, this);
        
        //加入房间
        Game.instance.socket.sendJoinRoom(1);
        
        //模拟数据
        var data = [0x0102,0x0103,0x0104,0x0105];//0x0106
        var multiple = 2;
        var userData = {
            name:'Dall',
            score:199,
            point:2000,
        }
    },
    
    //选择位置坐下 index : 点击的座位号; playerList:其他人的信息
    selectSeatDowm:function (index, playerList) {
        if(this.IsSit)return;
        this.IsSit = true; //添加自己坐下状态
        if(this.gameStatus == 100){ //当前是游戏未开局状态
            this.isOk = true;
        }
        this.moveAllPosId(index);
        this.updataSeats(playerList);
        this.setSelfSeatData(index);
        //通知服务器,已经做下
        Game.instance.socket.sendSitDown(index);
    },
    
    //设置用户面板数据
    setSelfSeatData:function (id) {
        var userData = {  //用户自己数据
            name:Http.userData.name,
            score:Http.userData.score,
            point:Http.userData.point,
            imgUrl:Http.userData.image
        }
        //移除最后一个座位
        this.node.removeChild(this.seats[4]);
        this.seats.pop();
        
        this.selfSeat.active = true;
        this.selfSeat.getComponent("SelfSeat").setUserData(userData);
        this.selfSeat.getComponent("SelfSeat").id = id;
    },
        
    //更新位置(移动座位)
    updataSeats:function (playerList) {   
        for(var j=0; j<this.seats.length; j++){ //遍历座位
            this.seats[j].getComponent("Seat").removeUserData();
            for(var i=0; i<playerList.length; i++){  //遍历用户
                var data = {  //拿到用户数据
                    name:playerList[i].nick,
                    score:playerList[i].point,
                    point:playerList[i].seatChips,
                    imgUrl:playerList[i].img,
                }
                if(this.seats[j].getComponent("Seat").posId == this.playerList[i].seatId){ 
                    //在对应的位置上面设置数据
                    this.seats[j].getComponent("Seat").setUserData(data);
                }

            }            
        }
    },
    
    //移动座位位置id, 用户座位为4; index:用户选择的位置id
    moveAllPosId:function (index) {
         var offX = index-4; //+:左移动; -:右移动
         for(var i=0; i<this.seats.length; i++){
             var x = this.seats[i].getComponent('Seat').posId;
             var nx = (x + offX + 5) % 5;
             this.seats[i].getComponent('Seat').posId = nx;
         }
    },
    //处理所有的座位
    handleAllSeats:function (cb) {
        for(var i=0; i<this.seats.length; i++){
            cb(this.seats[i].getComponent("Seat"));
        }
        if(this.IsSit && this.isOk){
            cb(this.selfSeat.getComponent('SelfSeat'));
        }
    },
    //处理除自己以为的座位
    handleOtherSeat:function (cb) {
        for(var i=0; i<this.seats.length; i++){
            cb(this.seats[i].getComponent("Seat"));
        }
    },
    
    
    
    
    //成功加入房间
    SVR_JOIN_SUCCESS:function (pack) {
        this.gameStatus = pack.gameStatus;
        this.playerList = pack.playerList;
        this.updataSeats(pack.playerList);
        cc.info('====ACK====  当前的游戏状态是: ' + this.gameStatus);
        for(var i=0;i<pack.playerList.length;i++){
            if(pack.playerList[i].uid == Http.userData.uid){
                //属于重新连接 TODO
                console.log('--------------------重新接入房间---------------------------');
                //1.旋转座位
                this.moveAllPosId(pack.playerList[i].seatId); //pack.playerList[i].seatId
                this.updataSeats(pack.playerList);
                //2.显示操作面板
                //3.根据游戏状态加载面板对应的数据
                this.setSelfSeatData(pack.playerList[i].seatId);
                this.IsSit = true; 
                this.isOk = true;
            }
        }
        
        switch(pack.gameStatus){
            case 1: //正在抢庄
                this.handleOtherSeat(function (seat) {
                    seat.getFourPoker();
                });
                break;
            case 2: //正在叫倍(设置谁是庄家)
                var self = this; 
                this.handleAllSeats(function (seat) {
                    seat.getFourPoker();
                    if(seat.id == pack.dealerSeatId){
                        seat.toBeBanker();
                        self.bankerSeat = seat;
                    }
                });
                break;
            case 3: //正在看牛
                this.handleOtherSeat(function (seat) {
                    seat.getFourPoker();
                    seat.getlastPoker(0x0203);
                });
                break;
            case 100://正在计算当局结果,准备重新开始
                this.isOk = true; 
                break;
            default:
                //TODO 网络异常
                break;  
        }
    },
    //状态切换时
    SVR_TURN_TO:function (pack) {
        this.gameStatus = pack.gameStatus;
        switch(this.gameStatus){
            case 2: //叫庄结束了
                if(pack.bankerSeatId > -1){ //产生庄家
                    var self = this;
                    this.handleAllSeats(function (seat) {
                        seat.setMultiple(-1);
                        if(seat.id == pack.bankerSeatId){
                            self.bankerSeat = seat;//记录当前局的庄家      
                            seat.toBeBanker();
                        }
                    });                    
                }
                if(this.IsSit && this.isOk){ //定时(一定时间后,自己选择)
                    this.selfSeat.getComponent('SelfSeat').showPalyerMultipleWin();
                    this.selfSeat.getComponent('SelfSeat').closeSelectMultipleWin();
                }
                break;
            case 3: //叫倍结束, 发下第5张牌
                break;
            default:
                //TODO 网络异常
                break;  
        }
    },
    //游戏开始
    SVR_GAME_START:function (pack) {
        this.toast.getComponent("Toast").show(); 
        //移除所有手牌
        this.handleAllSeats(function (seat) {
            seat.removePokers();
        });
        //更改游戏状态
        this.gameStatus = 1;
        //发4张牌
        var pokers = [pack.handCard1, pack.handCard2, pack.handCard3, pack.handCard4];
        this.handleAllSeats(function (seat) {
            seat.getFourPoker(pokers);
        });
        //准备叫庄
        if(this.IsSit && this.isOk){
            this.selfSeat.getComponent('SelfSeat').showMultipleWin();
        }
        this.selfSeat.getComponent('SelfSeat').closeResultPanel();
    },
    //其他玩家,更新当前状态,判断出当前动作,做出对应的动作显示
    SVR_DO_SUCCESS:function (pack) {
        switch(pack.state) {
            case 1 : //
                break;
            case 2 : //某个玩家,抢庄结束
                for(var j=0; j<this.seats.length; j++){ //遍历座位
                    if(this.seats[j].getComponent("Seat").id == pack.seatId){ 
                        console.log('====ACK==== '+ pack.seatId +'号,座位玩家,抢庄结束');
                        this.seats[j].getComponent("Seat").setMultiple(pack.betX);
                    }
                }
                break;
            case 3 ://某个玩家,叫倍结束
                for(var j=0; j<this.seats.length; j++){ //遍历座位
                    if(this.seats[j].getComponent("Seat").id == pack.seatId){ 
                        console.log('====ACK==== '+ pack.seatId +'号,座位玩家,叫倍结束');
                        this.seats[j].getComponent("Seat").playerMultiple = pack.betX;
                    }
               }
                break;
            case 4 :
                
                break;
        }
    },
    //下发第五张牌
    SVR_DEAL_ONE_CARD:function (pack) {
        cc.info('====ACK==== 拿到第五张牌,提供计算器');
        this.handleAllSeats(function (seat) {
            seat.getLastPoker(pack.handCard5);
        });
        //定时(一定时间后,自己选择)
        if(this.IsSit && this.isOk){ 
            this.selfSeat.getComponent('SelfSeat').showResultPanel();
            this.selfSeat.getComponent('SelfSeat').closePalyerMultipleWin();
        }
    },
    //游戏结束,清空所有人的手牌,计算积分
    SVR_GAME_OVER:function (pack) {
        cc.info('====ACK==== 游戏结束,所有人开牌');
        this.gameStatus = 100;
        
        //TODO 强制开牛
        
        // this.selfSeat.getComponent('SelfSeat').showPokers(8);
        // this.selfSeat.getComponent('SelfSeat').closeResultPanel();
        this.isOk = true; //用户如果已经做下,就可以开始下一句了
        var playerCardsList = pack.playerCardsList;
        if(this.bankerSeat)this.bankerSeat.toAwayBanker();
        this.bankerSeat = null;
        this.handleAllSeats(function (seat) {
            for(var i=0; i<playerCardsList.length; i++){
                var palyer = playerCardsList[i];
                if(palyer.seatId == seat.id){
                    var data = [palyer.handCard1, palyer.handCard2, palyer.handCard3, palyer.handCard4, palyer.handCard5];
                    seat.updataHandPoker(data);
                    seat.showPokers(playerCardsList[i].cardType);
                }
            }    
        });
    },
});
