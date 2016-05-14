cc.Class({
    extends: cc.Component,

    properties: {

        roomIcon: {
            default: null,
            type: cc.Sprite
        },

        roomId: {
            default: null,
            type: cc.Label
        },

        minBuyin: {
            default: null,
            type: cc.Label
        },

        sblind: {
            default: null,
            type: cc.Label
        },

        renIcon: {
            default: null,
            type: cc.Sprite
        },

        onlineNum: {
            default: null,
            type: cc.Label
        }
    },

    // use this for initialization
    onLoad: function () {

    },

    //设置房间信息（id、下限、底分、人数）
    setData: function (roomId, minBuyin, sblind, onlineNum) {

        this.roomId.string = roomId || '0';
        this.minBuyin.string = minBuyin || '0';
        this.sblind.string = sblind || '0'; 
        this.onlineNum.string = onlineNum || '0';
    }
});
