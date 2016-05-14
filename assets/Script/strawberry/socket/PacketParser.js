/*
    解包
*/
var TYPE = require("PACKET_DATA_TYPE")
var Socket = require("Egret")
var HEAD_LEN = 8     // 包头长度
/*
    校验包头，并返回包体长度与命令字, 校验不通过则都返回-1
*/
function verifyHeadAndGetBodyLenAndCmd(buf){
    var cmd = -1
    var len = -1

    var pos = buf.getPos()
    buf.setPos(0)

    if (buf.readStringBytes(2) == "PP"){       
        cmd = buf.readUShort()
        buf.setPos(6)
        len = buf.readUShort()
    }

    buf.setPos(pos)
    return [cmd, len]
}

var PacketParser = cc.Class({
    ctor : function (){},

    init : function(protocol){
        this.config_ = protocol.CONFIG
        this.protocol_ = protocol
        return this      
    },

    reset:function(){
        this.buf_ = null
    },

    read:function(buf){
        var ret = []
        var success = true
        while (true) {
            if (!this.buf_){
                this.buf_ = new Socket.ByteArray()
            }else{ 
                this.buf_.setPos(this.buf_.getLen())
            }

            var available = buf.getAvailable()
            var buffLen = this.buf_.getLen()
            if (available <= 0) {
                break
            }else{
                var headCompleted = (buffLen >= HEAD_LEN)
                //先收包头
                if (!headCompleted) {
                    if (available + buffLen >= HEAD_LEN) {
                        //收到完整包头，按包头长度写入缓冲区
                        for (var i = 0; i < HEAD_LEN - buffLen; i++) {
                            this.buf_.writeRawByte(buf.readRawByte())
                        };                       
                        headCompleted = true
                    }else{
                        //不够完整包头，把全部内容写入缓冲区
                        for (var i = 0; i < available; i++) {
                            this.buf_.writeRawByte(buf.readRawByte())
                        }
                        break
                    }
                }
                if (headCompleted) {
                    //包头已经完整，取包体长度并校验包头
                    var cmd_len = verifyHeadAndGetBodyLenAndCmd(this.buf_)
                    var command = cmd_len[0]
                    var bodyLen = cmd_len[1]
                    cc.info("headCompleted command %d bodylen %d", command, bodyLen)

                    if (bodyLen == 0) {
                        //无包体，直接返回一个只有cmd字段的table，并重置缓冲区
                        ret[ret.length] = { cmd : command }
                        this.reset()
                    }else if (bodyLen > 0) {
                        //有包体
                        available = buf.getAvailable()
                        buffLen = this.buf_.getLen()
                        if (available <= 0) {
                            break
                        }else if(available + buffLen >= HEAD_LEN + bodyLen) {
                            // 收到完整包，向缓冲区补齐当前包剩余字节
                            for (var i = 0; i < HEAD_LEN + bodyLen - buffLen; i++)
                                this.buf_.writeRawByte(buf.readRawByte())                            
                            // 开始解析
                            var packet = this.parsePacket_(this.buf_)
                            if (packet)
                                ret[ret.length] = packet
                            
                            //重置缓冲区
                            this.reset()
                        }else{
                            //不够包体长度，全部内容写入缓冲区
                            for (var i = 0; i < available; i++)
                                this.buf_.writeRawByte(buf.readRawByte())
                            break
                        }
                    }else{
                        // 包头校验失败
                        return false//, "PKG HEAD VERIFY ERROR, " + cc.utils.ByteArray.toString(this.buf_, 16)
                    }
                }
            }
        }
        return ret
    },

    readData_:function(ctx, buf, dtype, thisFmt){
        var ret
        if (buf.getAvailable() <= 0 && thisFmt.optional == true) {
            return null
        }
        if (dtype == TYPE.UBYTE) {
            ret = buf.readUByte()
            if (ret < 0) {
                ret = ret + Math.pow(2, 8)
            }
        }else if (dtype == TYPE.BYTE) {
            ret = buf.readByte()
            if (ret > Math.pow(2, 7) -1) {
                ret = ret - Math.pow(2, 8)
            }
        }else if (dtype == TYPE.INT){
            ret = buf.readInt()
        }else if (dtype == TYPE.UINT){
            ret = buf.readUInt()
        }else if (dtype == TYPE.SHORT){
            ret = buf.readShort()
        }else if (dtype == TYPE.USHORT){
            ret = buf.readUShort()
        }else if (dtype == TYPE.LONG){
            var high = buf.readInt()
            var low = buf.readInt()
            ret = high * Math.pow(2, 32) + low
        }else if (dtype == TYPE.ULONG){
            var high = buf.readUInt()
            var low = buf.readUInt()
            ret = high * Math.pow(2, 32) + low
        }else if (dtype == TYPE.STRING){
            var len = buf.readUInt()
            // 防止server出尔反尔，个别协议中出现字符串不以\0结尾的情况，这里做个判断
            var pos = buf.getPos()
            buf.setPos(pos + len -1)
            var lastByte = buf.readByte()
            buf.setPos(pos)
            if (lastByte == 0) {
                ret = buf.readStringBytes(len - 1)
                buf.readByte() // 消费掉最后一个字节
            }else{               
                ret = buf.readStringBytes(len)
            }
        }else if (dtype == TYPE.BUF){
            var len = buf.readUInt()
            ret = buf.readBuf(len)
        }else if (dtype == TYPE.ARRAY){
            ret = []
            var contentFmt = thisFmt.fmt
            if (!thisFmt.fixedLength){
                //配置文件中未指定长度，从包体中得到
                if (thisFmt.lengthType){
                    // 配置文件中指定了长度字段的类型
                    if (thisFmt.lengthType == TYPE.UBYTE){
                        len = buf.readUByte()
                        cc.info("read ubyte length")
                    }else if (thisFmt.lengthType == TYPE.BYTE){
                        cc.info("read byte length")
                        len = buf.readByte()
                    }else if (thisFmt.lengthType == TYPE.INT){
                        cc.info("read int length")
                        len = buf.readInt()
                    }else if (thisFmt.lengthType == TYPE.UINT){
                        cc.info("read uint length")
                        len = buf.readUInt()
                    }else if (thisFmt.lengthType == TYPE.LONG){
                        cc.info("read long length")
                        var high = buf.readInt()
                        var low = buf.readUInt()
                        len = high * Math.pow(2, 32) + low
                    }else if (thisFmt.lengthType == TYPE.ULONG){
                        cc.info("read ulong length")
                        var high = buf.readInt()
                        var low = buf.readUInt()
                        len = high * Math.pow(2, 32) + low
                    }
                }else{
                    // 未指定长度字段类型，默认按照无符号byte类型读
                    len = buf.readUByte()
                }
            }else{
                // 配置文件中直接指定了长度
                len = thisFmt.fixedLength
            }
            if (len > 0) {
                if (contentFmt.length == 1) {
                    var dtype = contentFmt[0].type
                    for (var i = 0; i < len; i++) {
                        if (typeof(contentFmt[1].depends) == 'function')
                            if (contentFmt[1].depends(ctx)) 
                                ret[ret.length] = this.readData_(ctx, buf, dtype, contentFmt[0])                            
                        else            
                            ret[ret.length] = this.readData_(ctx, buf, dtype, contentFmt[0])                        
                    };
                }else if (contentFmt.length == 0 && contentFmt.type){                    
                    for (var i = 0; i < len; i++) {
                        if (typeof(contentFmt.depends) == 'function')
                            if (contentFmt.depends(ctx))
                                ret[ret.length] = this.readData_(ctx, buf, contentFmt.type, contentFmt)                            
                        else
                            ret[ret.length] = this.readData_(ctx, buf, contentFmt.type, contentFmt)                        
                    }
                }else{
                    for (var i = 0; i < len; i++) {
                        var ele = {}
                        ret[ret.length] = ele
                        for (var j = 0; j < contentFmt.length; j++) {
                            var v = contentFmt[j]
                            var name = v.name
                            var dtype = v.type
                            if (v && typeof(v.depends) == 'function'){
                                if (v.depends(ctx, ele)){
                                    ele[name] = this.readData_(ctx, buf, dtype, v)
                                }
                            }else{
                                ele[name] = this.readData_(ctx, buf, dtype, v)
                            }
                        }
                    }
                }
            }
        }
        return ret
    },

    parsePacket_:function(buf){
        cc.info("#[PACK_PARSE] len:" + buf.getLen())
        var ret = {}
        var cmd = buf.setPos(2).readUShort()
        var ver = buf.readUShort()
        var config = this.config_[cmd]
        if (config != undefined){
            var fmt = config.fmt
            if (ver != 1) {
                fmt = config["fmt" + ver]
            }
            buf.setPos(HEAD_LEN)
            if (typeof(fmt) == "function"){
                fmt(ret, buf)
            } else if (fmt) {
                for (var i = 0; i < fmt.length; i++) {
                    var v = fmt[i]               
                    var name = v.name
                    var dtype = v.type
                    var depends = v.depends
                    if (typeof(depends) == 'function'){
                        if (depends(ret)){
                            var fpos = buf.getPos()
                            ret[name] = this.readData_(ret, buf, dtype, v)
                            var epos = buf.getPos()

                            if (typeof(ret[name]) != "string")
                                cc.info("[%03d-%03d][%03d]%s=%s", fpos, epos-1, epos - fpos, name, JSON.stringify(ret[name]))
                            else
                                cc.info("[%03d-%03d][%03d]%s=%s", fpos, epos-1, epos - fpos, name, ret[name])                            
                            buf.setPos(epos)
                        }
                    }else{
                        var fpos = buf.getPos()
                        ret[name] = this.readData_(ret, buf, dtype, v)
                        var epos = buf.getPos()

                        if (typeof(ret[name]) != "string")
                            cc.info("[%03d-%03d][%03d]%s=%s", fpos, epos-1, epos - fpos, name, JSON.stringify(ret[name]))
                        else
                            cc.info("[%03d-%03d][%03d]%s=%s", fpos, epos-1, epos - fpos, name, ret[name])
                        
                        buf.setPos(epos)
                    }
                }
            }
            // if buf.getLen() != buf.getPos() - 1 && DEBUG > 0 
            //     //print("buf len: " + buf.getLen() + " pos:" + buf.getPos())
            //     error(string.format("PROTOCOL ERROR !!!!! %x bufLen:%s pos:%s [%s]", cmd,buf.getLen(), buf.getPos(), cc.utils.ByteArray.toString(buf, 16)))
            
            ret.cmd = cmd
            return ret
        }else{
            cc.info("========> [NOT_PROCESSED_PKG] ========> %d", cmd)
            return null
        }
    }
});

module.exports = PacketParser;
