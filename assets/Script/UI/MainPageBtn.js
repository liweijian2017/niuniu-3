cc.Class({
    extends: cc.Component,

    properties: {

        menuSprites: {
            default: [],
            type: cc.SpriteFrame
        },

        menuPrefab: {
            default: null,
            type: cc.Prefab
        },
        
        playerInfo: {
            default: null,
            type: cc.Node
        },

        startBtn: {
            default: null,
            type: cc.Node
        },

        menuBtn: {
            default: null,
            type: cc.Node
        },

        roomList: {
            default: null,
            type: cc.Node
        },

        menuState: 0
    },

    // use this for initialization
    onLoad: function () {

    },

    //menu button which in the main page was pressed
    menuPressed: function () {
        if(this.menuState == 1){

            this.menuState = 0;
            this.menuBtn.getComponent(cc.Sprite).spriteFrame = this.menuSprites[0];
            if(this.menu){
                this.playerInfo.removeChild(this.menu);
            }
        }
        else if(this.menuState == 0){
            
            this.menuState = 1;
            this.menuBtn.getComponent(cc.Sprite).spriteFrame = this.menuSprites[1];
            this.menu = cc.instantiate(this.menuPrefab);
            this.menu.parent = this.playerInfo;  

        }else if(this.menuState == 2){
            //todo 

        }
    },

    //start button which in the main page was pressed
    startPressed: function () {

        this.startBtn.active = false;
        this.roomListIn();
    },

    roomListIn: function () {

        // var roomListAni = this.roomList.getComponent(cc.Animation);
        // cc.info(roomListAni);
        // roomListAni.play('roomListInAni');
        this.roomList.active = true;
    }
});
