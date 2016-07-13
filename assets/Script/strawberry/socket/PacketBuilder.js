/*
    封包
*/

var TYPE = require("PACKET_DATA_TYPE")
var Socket = require("Egret")
var $ = require("Zepto");

var PacketBuilder = cc.Class({
    ctor : function (){},
    
    init : function(cmd, config){
        this.cmd_ = cmd    
        this.config_ = config
        this.params_ = {}
        return this 
    },

    setParameter : function (key, value){
        this.params_[key] = value
        return this
    },

    setParameters : function (params){
        $.extend(this.params_, params)
        return this
    },

    writeData : function (buf, dtype, val, fmt, ctx){
        if( dtype == TYPE.UBYTE ){
            if( typeof(val) == "string" && val.length == 1 ){
                buf.writeUByte(val.charCodeAt(0))
            }else{
                buf.writeUByte(Number(val) || 0)
            }
        }else if(dtype == TYPE.BYTE){
            if (typeof (val) == "string" && val.length == 1)
                buf.writeByte(val.charCodeAt(0))
            else{
                var n = Number(val)
                if (n && n < 0){
                    n = n + Math.pow(2, 8)
                }
                buf.writeByte(n || 0)
            }
        }else if (dtype == TYPE.INT) {
            buf.writeInt(Number(val) || 0)
        }else if (dtype == TYPE.UINT) {
            buf.writeUInt(Number(val) || 0)
        }else if (dtype == TYPE.SHORT) {
            buf.writeShort(Number(val) || 0)
        }else if (dtype == TYPE.USHORT) {
            buf.writeUShort(Number(val) || 0)
        }else if (dtype == TYPE.LONG) {
            val = Number(val) || 0
            var absVal = Math.abs(val)
            var low = absVal % Math.pow(2, 31)
            if (val < 0) {
                low = -low
            }
            var high = Math.floor(absVal / Math.pow(2, 31))
            if (val < 0) {
                high = -high
            }
            buf.writeInt(high)
            buf.writeInt(low)
        }else if (dtype == TYPE.ULONG) {
            val = Number(val) || 0
            var low = val % Math.pow(2, 32)
            var high = val / Math.pow(2, 32)
            buf.writeUInt(high)
            buf.writeUInt(low)
        }else if (dtype == TYPE.STRING) {
            val = String(val) || ""
            var tmp = new Socket.ByteArray();
            var strlength = tmp.encodeUTF8(val).length
            buf.writeUInt(strlength + 1)
            buf.writeStringBytes(val)
            buf.writeByte(0)
        }else if (dtype == TYPE.BUF) {
            buf.writeUInt(val.length)
            buf.writeBuf(val)
        }else if (dtype == TYPE.ARRAY) {
            var len = 0
            if (fmt.fixedLength != undefined) {
                len = fmt.fixedLength
                //assert(len == #val, fmt.name + " is fixedLength not is" + #val)
            }else{
                if (val) {
                    len = val.length
                }
                if (fmt.lengthType) {
                    if (fmt.lengthType == TYPE.UBYTE) {
                        buf.writeUByte(len)
                    }else if (fmt.lengthType == TYPE.BYTE) {
                        buf.writeByte(len)
                    }else if (fmt.lengthType == TYPE.INT) {
                        buf.writeInt(len)
                    }else if (fmt.lengthType == TYPE.UINT) {
                        buf.writeUInt(len)
                    }else if (fmt.lengthType == TYPE.LONG) {
                        var low = len % Math.pow(2, 32)
                        var high = len / Math.pow(2, 32)
                        buf.writeUInt(high)
                        buf.writeUInt(low)
                    }else if (fmt.lengthType == TYPE.ULONG) {
                        var low = len % Math.pow(2, 32)
                        var high = len / Math.pow(2, 32)
                        buf.writeUInt(high)
                        buf.writeUInt(low)
                    }
                }else{
                    buf.writeUByte(len)
                }
            }
            if( len > 0 ){
                for (var i1 = 0; i1 < val.length; i1++) {
                    var v1 = val[i1]         
                    if ($.isArray(fmt.fmt) && typeof (fmt.fmt[0]) == "object") {
                        for (var i2 = 0; i2 < fmt.fmt.length; i2++) {
                            var v2 = fmt.fmt[i2]                    
                            var name = v2.name
                            var dtype = v2.type
                            var value = v1[name]
                            var depends = v2.depends
                            if (depends == undefined || depends(ctx, v1)) {
                                cc.info("write [%s] %s.%s = %s", dtype, fmt.name, name, String(value))
                                this.writeData(buf, dtype, value, v2)
                            }
                        }
                    }else{
                        cc.info("write [%s] %s.%d = %s", fmt.fmt.type, fmt.name, i1, String(v1))
                        this.writeData(buf, fmt.fmt.type, v1, fmt.fmt)
                    }
                }
            }
        }
    },

    build : function (){
        var buf = new Socket.ByteArray()
        //写包头，包体长度先写0
        buf.writeStringBytes("PP")                    // PP
        buf.writeUShort(this.cmd_)                    // 命令字
        // 版本号
        if (this.config_ && this.config_.ver) {
            buf.writeUShort(this.config_.ver)
        }else{
            buf.writeUShort(1)
        }
        buf.writeUShort(0)                            // 包体长度
    
        if (this.config_ && this.config_.fmt && this.config_.fmt.length > 0) {
            // 写包体
            for (var i = 0; i < this.config_.fmt.length; i++) {
                var v = this.config_.fmt[i]
                var name = v.name
                var dtype = v.type
                var depends = v.depends
                var value = this.params_[name]
                if (depends == undefined || depends(this.params_, undefined)) {
                    cc.info("write [%s] %s = %s", dtype, name, String(value))
                    this.writeData(buf, dtype, value, v, this.params_)
                }
            }
            //修改包体长度
            buf.setPos(6)
            buf.writeUShort(buf.getLen() - 8)
            buf.setPos(buf.getLen())
        }  
        cc.info("BUILD PACKET ==> %d(%s)", this.cmd_, buf.getLen(), this.cmd_.toString(16))
        buf.cmd = this.cmd_
        return buf
    }
});

module.exports = PacketBuilder;