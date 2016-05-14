cc.Class({
    extends: cc.Component,

    properties: {

        //store title: WinTitle,LoseTitle,DrawTitle
        titles: {
            default: [],
            type: cc.Node
        },

        meIcon: {
            default: null,
            type: cc.Sprite
        },

        meProperty: {
            default: null,
            type: cc.Label
        },

        player1Name: {
            default: null,
            type: cc.Label
        },

        player1Icon: {
            default: null,
            type: cc.Sprite
        },

        player1Property: {
            default: null,
            type: cc.Label
        },

        bankerSprite: {
            default: null,
            type: cc.Sprite
        },

        player2Name: {
            default: null,
            type: cc.Label
        },

        player2Icon: {
            default: null,
            type: cc.Sprite
        },

        player2Property: {
            default: null,
            type: cc.Label
        },

        player3Name: {
            default: null,
            type: cc.Label
        },

        player3Icon: {
            default: null,
            type: cc.Sprite
        },

        player3Property: {
            default: null,
            type: cc.Label
        },

        player4Name: {
            default: null,
            type: cc.Label
        },

        player4Icon: {
            default: null,
            type: cc.Sprite
        },

        player4Property: {
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function () {

        
    },

    start: function () {
        this.showPrompt();
    },

    //according to the result of the round,set the proper title(win,lose,draw)
    //0:win  1: lose  2:draw
    setTitle: function (result) {

        if(result === 0){
            
            this.titles[0].active = true; //WinTitle
            this.titles[1].active = false; //LoseTitle
            this.titles[2].active = false; //DrawTitle

        }else if(result === 1){

            this.titles[0].active = false; //WinTitle
            this.titles[1].active = true; //LoseTitle
            this.titles[2].active = false; //DrawTitle

        }else if(result === 2){

            this.titles[0].active = false; //WinTitle
            this.titles[1].active = false; //LoseTitle
            this.titles[2].active = true; //DrawTitle
        }
    },

    //set player's name
    setPlayerName: function (nameLabel, name) {

        if(nameLabel){

            nameLabel.string = name || '***';
        }
    },

    //set player's property
    setProperty: function (propertyLabel, property) {

        if(property > 0){

            propertyLabel.node.color = new cc.Color(255, 255, 0);
            propertyLabel.string = '+' + property;

        }else{

            propertyLabel.node.color = new cc.Color(255, 0, 0);
            propertyLabel.string = property + '';

        }
    }, 

    //set all player's icon
    //if player1 is banker, set bankerSprite's active with true, else set false
    setIcon: function () {
        
    },

    //show prompt box
    showPrompt: function () {
        this.setTitle(1);
        this.setPlayerName(this.player1Name, 'ackkk');
        this.setPlayerName(this.player2Name, 'qweqw');
        this.setPlayerName(this.player3Name, 'wwer');
        this.setPlayerName(this.player4Name, 'dfre');

        this.setProperty(this.meProperty, -200000);
        this.setProperty(this.player1Property, 200000);
        this.setProperty(this.player2Property, -200000);
        this.setProperty(this.player3Property, 0);
        this.setProperty(this.player4Property, 600000);
    }
});
