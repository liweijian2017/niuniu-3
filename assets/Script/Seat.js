/**
 * 基本座位类
 */
cc.Class({
    extends: cc.Component,
    properties: {
        type:1,//0:自己的座位; 1:左边座位; 2:右边座位(改属性暂时无作用)
        id:0, //座位id
        posId:0, //本地显示位置id
        hold:false,//false:空位; true:有人
        multiple:-1,//-1:还没有开始抢;0:不抢; 0-4代表倍数,表示抢庄
        nameStr:'',
        score:0,
        point:0,
        playerMultiple:5,
        isBanker:false,//false:非庄;true:庄家
        spriteAtlas:{
            default:null,
            type:cc.SpriteAtlas  
        },
        holdPanel:{ //有人显示
            default:null,
            type:cc.Node
        },
        noHoldPanel:{ //空座显示
            default:null,
            type:cc.Node
        },
        handSeat:{//手牌组件
            default:null,
            type:cc.Node
        },
        nameLabel:{ //名字组件
            default:null,
            type:cc.Label
        },
        scoreLabel:{ //积分组件
            default:null,
            type:cc.Label
        },
        pointLabel:{ //筹码组件
            default:null,
            type:cc.Label
        },
        headImg:{//头像组件
            default:null,
            type:cc.Sprite
        },
        multipleLabel:{//倍数组件
            default:null,
            type:cc.Sprite
        },
        banker:{ //庄家组件
            default:null,
            type:cc.Sprite
        }
        
    },
    //初始化
    onLoad: function () {
        console.log('初始化座位: ' + this.id + '号');
    },
    
    start:function(){
        //渲染空位,设置空位数值
        this.updateSeat();
    },
    
    //更新座位显示
    updateSeat:function(){
        if(this.hold){ //有人
            if(this.noHoldPanel&&this.holdPanel){ //修改是否有人显示
                this.holdPanel.active = true;
                this.noHoldPanel.active = false;
            }
            //更新数据显示
            this.nameLabel.string = this.nameStr;
            this.scoreLabel.string = this.score;
            this.pointLabel.string = this.point;
            //叫倍更新
            if(this.multiple >= 0){
                this.multipleLabel.node.active = true;
                var key = 'fnt_bei' + this.multiple; 
                if(this.multiple == 0){ //协议调整 5 == 0
                    key = 'fnt_bei5';
                }
                this.multipleLabel.spriteFrame = this.spriteAtlas.getSpriteFrame(key + ".png");
            }else {
                this.multipleLabel.node.active = false;
            }
            //庄家状态
            this.banker.node.active = this.isBanker;
        }else { //空座
            if(this.noHoldPanel&&this.holdPanel){
                this.noHoldPanel.active = true;
                this.holdPanel.active = false;
            }
        }
    },
    
    
    
    //坐庄
    toBeBanker:function () {
        this.isBanker = true;
        this.setMultiple(-1);
        this.updateSeat();
    },
    
    //下庄
    toAwayBanker:function () {
        this.isBanker = false;
        this.updateSeat();
    },
    
    //设置用户数据（头像，姓名，积分，筹码）
    setUserData:function (userData) {
        if(!this.hold){ //目前是空座
            this.hold = true;
            this.nameStr = userData.name;
            this.score = userData.score;
            this.point = userData.point;
            //TODO 更新头像
            this.updateSeat();
        }
    },
    
    //清空用户数据;清空座位
    removeUserData:function () {
        this.hold = false;// 设置离开状态
        this.name = '空座';
        this.score = 0;
        this.point = 0;
        this.updateSeat();
    },
    
    //设置请求坐庄状态(叫倍)
    setMultiple:function (multiple) {
        this.multiple = multiple;//设置叫倍状态
        this.updateSeat();
    },
    
    /**
     * 发牌
     * data:接受到的数据
     */
    dealPokers:function(data){
        if(this.hold){
            if(this.handSeat.activeInHierarchy){
                this.handSeat.getComponent('HandPoker').setPokers(data);
            }

        }
    },
    //拿到4张牌(其他人的座位假处理)
    getFourPoker:function (data) {
        var data = [0x0102,0x0103,0x0104,0x0105];       
        this.handSeat.getComponent('HandPoker').setPokers(data);
    },
    
    //开牌
    showPokers:function (result) {
        if(this.hold){
            if(this.handSeat.activeInHierarchy){
                // this.handSeat.getComponent('HandPoker');
                this.handSeat.getComponent('HandPoker').show(result);
            }
        }
    },
    //拿到最后一张牌
    getLastPoker:function (onePoker) {
        this.handSeat.getComponent('HandPoker').addPoker(onePoker);
    },
    //点击发送自己的座位号
    clickEvent:function () {
        var event =  new cc.Event.EventCustom('SELECT_SEAT', true);
        event.setUserData({msg:this.id});
        this.node.dispatchEvent(event);
    },
    
    removePokers:function () {
        this.handSeat.getComponent('HandPoker').removePokers();
    },
    
    updataHandPoker:function (data) {
        this.handSeat.getComponent('HandPoker').updataPoker(data);
    }
    
});
