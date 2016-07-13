var WebSocket = require("Egret").WebSocket;
var EventDispatcher = require("Egret").EventDispatcher;
var ByteArray = require("Egret").ByteArray;
var PacketBuilder = require("PacketBuilder");
var PacketParser = require("PacketParser");
var SchedulerPool = require("SchedulerPool");

var SocketService = cc.Class({
    extends: EventDispatcher,
	ctor : function(){},

    init : function(protocol){
        this.protocol_ = protocol
        this.parser_   = (new PacketParser).init(protocol)

        this.shouldConnect_  = false
        this.isConnected_    = false
        this.isConnecting_   = false
        this.isPaused_       = false
        this.delayPackCache_ = null
        this.retryLimit_     = 10
        this.heartBeatSchedulerPool_ = new SchedulerPool();

        return this
    },

    createPacketBuilder: function(cmd){
        return (new PacketBuilder).init(cmd, this.protocol_.CONFIG[cmd])
    },

    connect: function(ip, port, retryConnectWhenFailure){
        cc.info("connect to %s:%s", ip, port);
        this.shouldConnect_ = true;
        this.ip_ = ip;
        this.port_ = port;
        if (this.isConnected())
            cc.info("isConnected true");
        else if (this.isConnecting_)
            cc.info("isConnecting true");
        else{
            this.isConnecting_ = true;     
            cc.info("direct connect to %s:%s", this.ip_, this.port_);                   
            if (!this.socket_){
                this.socket_ = new WebSocket();            
                this.socket_.type = WebSocket.TYPE_BINARY;         
                this.socket_.addEventListener(WebSocket.Event.CONNECT, this.onConnected, this);
                this.socket_.addEventListener(WebSocket.Event.SOCKET_DATA, this.onData, this);            
                this.socket_.addEventListener(WebSocket.Event.CLOSE, this.onClose, this);
                this.socket_.addEventListener(WebSocket.Event.IO_ERROR, this.onConnectFailure, this);
            }
            this.socket_.connectByUrl("ws://" + ip + ":" + port);            
        }
        this.retryConnectWhenFailure_ = retryConnectWhenFailure || false;
    },

    isConnected: function(){
        return this.isConnected_;
    },

    disconnect: function(noEvent){
        cc.info('disconnect', noEvent);
        this.shouldConnect_ = false;
        this.isConnecting_ = false;
        this.isConnected_ = false;
        this.unscheduleHeartBeat();

        if(this.socket_){
            var socket = this.socket_;
            this.socket_ = null;
            if(noEvent){
                socket.removeAllEventListeners();
                socket.close();
            }else{
                socket.close();
                socket.removeAllEventListeners();
            }
        }
    },

    scheduleHeartBeat: function(command, interval, timeout){
        this.heartBeatCommand_ = command
        this.heartBeatTimeout_ = timeout
        this.heartBeatTimeoutCount_ = 0
        this.heartBeatSchedulerPool_.clearAll()
        this.heartBeatSchedulerPool_.loopCall(this.onHeartBeat_, this, interval)
    },

    unscheduleHeartBeat: function(){
        this.heartBeatTimeoutCount_ = 0;
        this.heartBeatSchedulerPool_.clearAll();
    },

    sendCmd:function(cmd, data){
        this.send(this.createPacketBuilder(cmd).setParameters(data).build());
    },

    send: function(data){
        if(this.socket_){
            if(typeof(data) == "string")
                this.socket_.writeUTF(data);
            else
                this.socket_.writeBytes(data);
        }
    },

    onConnected: function(evt){
        cc.info("onConnected");
        this.parser_.reset();
        this.isConnected_ = true;
        this.isConnecting_ = false;
        this.heartBeatTimeoutCount_ = 0;
        this.onAfterConnected();
        this.retryLimit_ = 10;
        this.dispatchEventWith(SocketService.EVT_CONN_SUCCESS);
    },

    onClose: function(evt){        
        this.isConnected_ = false;
        this.unscheduleHeartBeat();
        if (this.shouldConnect_) {
            if (!this.reconnect_()) {
                this.onAfterConnectFailure();
                this.dispatchEventWith(SocketService.EVT_CONNECT_FAIL);
                cc.info("closed and reconnect fail");
            }else{
                cc.info("closed and reconnecting");
            }
        }else{
            cc.info("closed and do not reconnect");
            this.dispatchEventWith(SocketService.EVT_CLOSE);
        }
    },

    onData: function(evt){
        var bytes = new ByteArray();
        evt.currentTarget.readBytes(bytes);       
        var packets = this.parser_.read(bytes);
        if (packets === false){
            this.onError();
        }else{
            for (var i = 0; i < packets.length; i++) {
                var v = packets[i];
                cc.info("[====PACK====][%d]\n==>%s", v.cmd, JSON.stringify(v), v.cmd.toString(16));
                this.onPacketReceived(v);
            }
        }
    },

    onConnectFailure: function(evt){
        this.isConnected_ = false;
        this.isConnecting_ = false;
        
        cc.info("connect failure ...");
        if(!this.reconnect_()){       
            this.onAfterConnectFailure();
            this.dispatchEventWith(SocketService.EVT_CONN_FAIL);
        }
    },

    pause: function(){
        this.isPaused_ = true;
    },

    resume: function(){
        this.isPaused_ = false;
        cc.info("resume event dispatching");
        if (this.delayPackCache_ && this.delayPackCache_.length > 0){
            for (var i = 0; i < this.delayPackCache_.length; i++) {
                var v = this.delayPackCache_[i];
                this.dispatchEventWith(SocketService.EVT_PACKET_RECEIVED, false, v);
            }
            this.delayPackCache_ = null;
        }
    },

    buildHeartBeatPack: function(){
        cc.warn("not implemented method buildHeartBeatPack");
        return null;
    },

    onHeartBeatTimeout: function(){
        cc.warn("not implemented method onHeartBeatTimeout");
    },

    onHeartBeatReceived: function(delaySeconds){
        cc.warn("not implemented method onHeartBeatReceived");
    },

    onHeartBeat_: function(){
        var heartBeatPack = this.buildHeartBeatPack();
        if (heartBeatPack){
            this.heartBeatPackSendTime_ = (new Date()).getTime();
            this.send(heartBeatPack);
            this.heartBeatTimeoutId_ = this.heartBeatSchedulerPool_.delayCall(this.onHeartBeatTimeout_, this, this.heartBeatTimeout_);
            cc.info("send heart beat packet");
        }
        return true;
    },

    onHeartBeatTimeout_: function(){
        this.heartBeatTimeoutId_ = null;
        this.heartBeatTimeoutCount_ = (this.heartBeatTimeoutCount_ || 0) + 1;
        this.onHeartBeatTimeout(this.heartBeatTimeoutCount_);
        cc.info("heart beat timeout", this.heartBeatTimeoutCount_);
    },

    onHeartBeatReceived_: function(){
        var delaySeconds = ((new Date).getTime() - this.heartBeatPackSendTime_) / 1000
        if (this.heartBeatTimeoutId_) {
            this.heartBeatSchedulerPool_.clear(this.heartBeatTimeoutId_)
            this.heartBeatTimeoutId_ = null
            this.heartBeatTimeoutCount_ = 0
            this.onHeartBeatReceived(delaySeconds)
            cc.info("heart beat received", delaySeconds)
        }else{
            cc.info("timeout heart beat received", delaySeconds)
        }
    },

    onPacketReceived: function(data){
        var pack = data
        if (pack.cmd == this.heartBeatCommand_){
            if (this.heartBeatTimeoutId_) 
                this.onHeartBeatReceived_()
        }else{
            this.onProcessPacket(pack)
            if (this.isPaused_){
                if (!this.delayPackCache_) {
                    this.delayPackCache_ = []
                }
                this.delayPackCache_[this.delayPackCache_.length] = pack
                cc.info("paused cmd:%", pack.cmd, pack.cmd.toString(16))
            }else{
                cc.info("dispatching cmd:%", pack.cmd, pack.cmd.toString(16))
                this.dispatchEventWith(SocketService.EVT_PACKET_RECEIVED, false, data);
            }
        }
    },

    reconnect_: function(){
        cc.info('try reconnect_')
        if(this.isConnected_)
            this.disconnect(true);
        this.retryLimit_ = this.retryLimit_ - 1;
        var isRetrying = true; 
        if (this.retryLimit_ > 0 || this.retryConnectWhenFailure_){            
            this.connect(this.ip_, this.port_, this.retryConnectWhenFailure_);
        }else{
            isRetrying = false;            
        }    
        return isRetrying;
    },

    onProcessPacket: function(pack){
        cc.warn("not implemented method onProcessPacket");
    },

    onAfterConnected: function(){
        cc.warn("not implemented method onAfterConnected");
    },

    onAfterConnectFailure: function(){
        cc.warn("not implemented method onAfterConnectFailure");
    },

    onAfterDataError: function(){
        this.onAfterConnectFailure();
    },

    onError: function(){
        this.isConnected_ = false;
        this.disconnect(true);
        cc.info("data error ...");  
        if(!this.reconnect_()){       
            this.onAfterDataError();
            this.dispatchEventWith(SocketService.EVT_ERROR);
        }
    },

});

SocketService.EVT_PACKET_RECEIVED = "SocketService.EVT_PACKET_RECEIVED"
SocketService.EVT_CONN_SUCCESS    = "SocketService.EVT_CONN_SUCCESS"
SocketService.EVT_CONN_FAIL       = "SocketService.EVT_CONN_FAIL"
SocketService.EVT_ERROR           = "SocketService.EVT_ERROR"
SocketService.EVT_CLOSE           = "SocketService.EVT_CLOSE"

module.exports = SocketService;
