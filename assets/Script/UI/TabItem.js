cc.Class({
    extends: cc.Component,

    properties: {
        roomItemPrefab: {
            default: null,
            type: cc.Prefab
        },

        scrollView: {
            default: null,
            type: cc.ScrollView
        },

        //[...] tab按钮各个状态的sprite
        tabSprites: {
            default: [],
            type: cc.SpriteFrame
        },

        chujiBtn: {
            default: null,
            type: cc.Node
        },

        zhongjiBtn: {
            default: null,
            type: cc.Node
        },

        gaojiBtn: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        
    },
    
    chujiPressed: function (type) {

        this.btnPressed('chuji');
        this.scrollView.content.removeAllChildren();
        this.scrollView.content.setPosition(cc.v2(0, 126));
        this.showRoomList(1);
    },

    zhongjiPressed: function () {

        this.btnPressed('zhongji');
        this.scrollView.content.removeAllChildren();
        this.scrollView.content.setPosition(cc.v2(0, 126));
        this.showRoomList(2);
    },

    gaojiPressed: function () {

        this.btnPressed('gaoji');
        this.scrollView.content.removeAllChildren();
        this.scrollView.content.setPosition(cc.v2(0, 126));
        this.showRoomList(3);
    },

    //某个按钮点击后，该按钮高亮，其他两个按钮变回初始状态
    btnPressed: function (name) {

        if(name === 'chuji') {

            this.chujiBtn.getComponent(cc.Sprite).spriteFrame = this.tabSprites[1];
            this.chujiBtn.getChildByName('fontSprite').getComponent(cc.Sprite).spriteFrame = this.tabSprites[3];

            this.zhongjiBtn.getComponent(cc.Sprite).spriteFrame = this.tabSprites[0];
            this.zhongjiBtn.getChildByName('fontSprite').getComponent(cc.Sprite).spriteFrame = this.tabSprites[4];

            this.gaojiBtn.getComponent(cc.Sprite).spriteFrame = this.tabSprites[0];
            this.gaojiBtn.getChildByName('fontSprite').getComponent(cc.Sprite).spriteFrame = this.tabSprites[6];

        }else if(name === 'zhongji') {

            this.chujiBtn.getComponent(cc.Sprite).spriteFrame = this.tabSprites[0];
            this.chujiBtn.getChildByName('fontSprite').getComponent(cc.Sprite).spriteFrame = this.tabSprites[2];

            this.zhongjiBtn.getComponent(cc.Sprite).spriteFrame = this.tabSprites[1];
            this.zhongjiBtn.getChildByName('fontSprite').getComponent(cc.Sprite).spriteFrame = this.tabSprites[5];

            this.gaojiBtn.getComponent(cc.Sprite).spriteFrame = this.tabSprites[0];
            this.gaojiBtn.getChildByName('fontSprite').getComponent(cc.Sprite).spriteFrame = this.tabSprites[6];

        }else if(name === 'gaoji') {

            this.chujiBtn.getComponent(cc.Sprite).spriteFrame = this.tabSprites[0];
            this.chujiBtn.getChildByName('fontSprite').getComponent(cc.Sprite).spriteFrame = this.tabSprites[2];

            this.zhongjiBtn.getComponent(cc.Sprite).spriteFrame = this.tabSprites[0];
            this.zhongjiBtn.getChildByName('fontSprite').getComponent(cc.Sprite).spriteFrame = this.tabSprites[4];

            this.gaojiBtn.getComponent(cc.Sprite).spriteFrame = this.tabSprites[1];
            this.gaojiBtn.getChildByName('fontSprite').getComponent(cc.Sprite).spriteFrame = this.tabSprites[7];
        }
    },

    /**
     * @param  type 1初级场 2 中级场 3 高级场
     */
    showRoomList : function (type) {

        var me = this;
        var type = type || 1;
        var Http = require('Http');

        Http.getRoomList(function(data1){

            me.listInfo = data1;

            Http.getOnline(type, function(data2){

            me.tIdAndOnlineInfo = data2;   

            me.listInfoInType = me.getInfo(me.listInfo, me.tIdAndOnlineInfo);
    
            for(var i = 0; i < me.listInfoInType.length; i++) {
                    var c = cc.instantiate(me.roomItemPrefab);
                    c.getComponent('RoomItem').setData(me.listInfoInType[i][0], me.listInfoInType[i][1], me.listInfoInType[i][2], me.listInfoInType[i][3]);
                    me.scrollView.content.addChild(c);
                }
            });
        });
    },

    /**
     * @param  listInfo 所有房间信息 //桌号、房间场次(1:初级场, 2:中级场, 3:高级场)、底分、进房下限
     * @param  tIdAndOnlineInfo 特定场次下的房间id与在线人数信息
     * @return listInfoInType 特定场次下完整的房间信息  //桌号、进房下限、底分、在线人数
     */
    getInfo: function (listInfo, tIdAndOnlineInfo) {

        var listInfoInType = [];   

        for(var tid1 in tIdAndOnlineInfo){

            var onLineNum = tIdAndOnlineInfo[tid1];

            for(var i = 0; i < listInfo.length; i++){

                var tid2 = listInfo[i][0];

                if(tid1 == tid2){
                    listInfoInType.push([tid1, listInfo[i][3], listInfo[i][2], onLineNum]);
                    break;
                }
            }
        }

        return listInfoInType;
    }
});
