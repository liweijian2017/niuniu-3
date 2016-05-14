/*
定时器封装
@example
~~~~
var SchedulerPool = require('SchedulerPool');
var sp = new SchedulerPool();
//2s后执行
sp.delayCall(function(){cc.info("delayCall!!!!!");}, this, 2);
//7s后执行
sp.delayCall(function(){cc.info("delayCall!5555!"); sp.clear(this.h)}, this, 7);
//间隔3执行一次，如果function return false; 停止执行
this.h = sp.loopCall(function(){cc.info("test~!!@~!@!"); return true}, this, 3);
~~~~
*/
var SchedulerPool = cc.Class({
    ctor: function(){
        this.pool_ = {};
        this.id = 0;
    },

    clearAll: function(){
        for (var id in this.pool_)
            this.clear(id);
        this.pool_ = {};
    },

    clear: function(id){
        if (id != null){
            if (this.pool_[id]){
                if(this.pool_[id][0] === 0)
                    clearTimeout(this.pool_[id][1]);
                else
                    clearInterval(this.pool_[id][1]);
                this.pool_[id] = null;
            }
        }
    },

    delayCall: function(callback, thisObject, delay, data){
        this.id = this.id + 1;
        var id = this.id;
        var self = this;
        var handle = setTimeout(function(){            
            self.pool_[id] = null;
            if (typeof(callback) == "function")
                callback.call(thisObject, data);
        }, delay*1000);
        this.pool_[id] = [0, handle];
        return id;
    },

    loopCall: function(callback, thisObject, interval, data){
        this.id = this.id + 1;
        var id = this.id;
        var self = this;
        var handle = setInterval(function(){
            if (typeof(callback) == "function") {
                if (!callback.call(thisObject, data)){
                    clearInterval(self.pool_[id][1]);
                    self.pool_[id] = null;
                }
            }
        }, interval * 1000);
        this.pool_[id] = [1, handle];
        return id;
    }
});

module.exports = SchedulerPool;
