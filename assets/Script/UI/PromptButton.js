cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    onLoad: function () {

    },

    //confirm button which in the prompt box was pressed
    confirmPressed: function () {

        cc.info('confirm button has been pressed');
    },

    //cancel button which in the prompt box was pressed
    cancelPressed: function () {
        
        cc.info('cancel button was pressed');
    }
});
