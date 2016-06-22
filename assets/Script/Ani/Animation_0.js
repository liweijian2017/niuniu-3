cc.Class({
    extends: cc.Component,

    properties: {
        prefab:cc.Prefab,
        total:50,
        size:20, //范围
        hudu:100,// 弧度
        speed:0.3,
    },

    // use this for initialization
    onLoad: function () {
    },
    
    runAni:function(startPos, endPos, cb){
        var arr = [];
        var count = 0;
        for(var i=0; i<this.total; i++){
            var cm = cc.instantiate(this.prefab);
            arr.push(cm);
            var randomX = (Math.random()-0.5)*this.size;
            var randomY = (Math.random()-0.5)*this.size;
            cm.setPosition(startPos.x + randomX, startPos.y + randomY);
            var randomOff = (Math.random()-0.5)*this.hudu;
            var zpoint = cc.p((startPos.x+endPos.x)/2 - randomOff, (startPos.y+endPos.y)/2+randomOff);
            var bezier = [zpoint, zpoint, cc.p(endPos.x + randomX, endPos.y + randomY)];
            var move = cc.bezierTo(this.speed, bezier);
            this.node.addChild(cm);
            var randomTime = Math.random()*0.5;
            cm.runAction(cc.sequence(cc.delayTime(randomTime), move, cc.callFunc(function(){
                count++;
                if(count == this.total){
                    for(var k=0; k<arr.length; k++){
                        arr[k].removeFromParent();
                    }
                    if(cb)cb();
                }
            }, this)));
        }
    },
    
    moreAndMore:function(){
        
    }

});
