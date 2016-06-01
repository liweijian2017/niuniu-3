/*
    server 协议
*/
var T = require('PACKET_DATA_TYPE');
var PROTOCOL = {};
PROTOCOL.CONFIG = {};
var P = PROTOCOL;
var CONFIG = PROTOCOL.CONFIG;

P.KEEP_ALIVE = 0x1;
CONFIG[P.KEEP_ALIVE] = null;

P.CLI_LOGIN         = 0x2001      // 登录
CONFIG[P.CLI_LOGIN] = {
    ver : 1,
    fmt : [
        {name : "uid", type : T.UINT},        //uid
        {name : "mtkey", type : T.STRING}     //mtkey
    ]
}

P.SVR_LOGIN_RET    = 0x2002
CONFIG[P.SVR_LOGIN_RET] = {
    ver : 1,
    fmt : [
        {name : "ret", type : T.UINT},
        {name : "tid", type : T.UINT}
    ]
}

P.SVR_DOUBLE_LOGIN = 0x2003
CONFIG[P.SVR_DOUBLE_LOGIN] = {
    ver : 1,
    fmt : [
        {name : "ret", type : T.UINT}        
    ]
}

// 获取房间
P.GET_ROOM = 0x3010
CONFIG[P.GET_ROOM] = {
    ver : 1,
    fmt : [
        {name : "uid", type : T.UINT},
        {name : "blind", type : T.ULONG},
        {name : "num", type : T.BYTE},
        {name : "roomType", type : T.BYTE},
        {name : "tid", type : T.UINT} //房间id
    ]    
}

// 快速进入某个房间 
P.ENTER_ROOM = 0x3011
CONFIG[P.ENTER_ROOM] = {
    ver : 1,
    fmt : [
        {name : "uid", type : T.UINT},
        {name : "tid", type : T.UINT} //房间id       
    ]    
}

P.QUICK_START = 0x3012 
CONFIG[P.QUICK_START] = {
    ver : 1,
    fmt : [
        {name : "uid", type : T.UINT},
        {name : "money", type : T.ULONG}
    ]
}

// 获取房间返回
P.GET_ROOM_RET = 0x3020
CONFIG[P.GET_ROOM_RET] = {
    ver : 1,
    fmt : [
        {name : "tid", type : T.UINT},
        {name : "svid", type : T.UINT}
    ]
}


// 进入房间
P.CLI_JOIN = 0x4003
CONFIG[P.CLI_JOIN] = {
    ver : 1,
    fmt : [
        {name : "uid", type : T.UINT},
        {name : "tid", type : T.UINT},   //房间号
        {name : "userinfo", type : T.STRING}
    ]
}

// 离开房间
P.CLI_LEAVE = 0x4005
CONFIG[P.CLI_LEAVE] = {
    ver : 1,
    fmt : [
        {name : "uid", type : T.UINT}
    ]
}

// 坐下
P.CLI_SIT_DOWN = 0x4007
CONFIG[P.CLI_SIT_DOWN] = {
    ver : 1,
    fmt : [
        {name:"uid", type:T.UINT},
        {name:"seatId", type:T.BYTE}       //座位ID    
    ]
}

// 站起
P.CLI_STAND_UP  = 0x4002   //站起
CONFIG[P.CLI_STAND_UP] = {
    ver : 1,
    fmt : [
        {name:"uid", type:T.UINT}
    ]
}

// 操作
P.CLI_DO = 0x4008 
CONFIG[P.CLI_DO] = {
    ver : 1,
    fmt : [
        {name:"uid", type:T.UINT},
        {name:"betX", type:T.BYTE}
    ]
}

P.CLI_SEND_ROOM_BROADCAST = 0x4009
CONFIG[P.CLI_SEND_ROOM_BROADCAST] = {
    ver : 1,
    fmt : [
        {name:"uid", type:T.UINT},
        {name:"tid"     , type:T.INT}    , //tid  typeId （0 发表情 1 发文字）  
        {name:"param"   , type:T.INT}    , // expressionId 表情id
        {name:"content" , type:T.STRING} , //内容 content: 聊天文字内容
    ]
}

/*
gameStatus   游戏状态   
     0   -- 等待游戏开始
     1   -- 发牌进入抢庄
     2   -- 抢庄结束
     3   -- 叫倍结束
     100 -- 游戏结束等待下一局开始  

state     座位状态
    Seat.WAIT  = 0   -- 等待开始
    Seat.START = 1   -- 发牌进入抢庄
    Seat.DEND  = 2   -- 抢庄结束
    Seat.BEND  = 3   -- 叫倍结束
    Seat.NIUEND   = 4   -- 看牛结束

cardType 牌型
    HandPoker.TYPE_NO_NIU       = 0
    HandPoker.TYPE_NIU_1        = 1 
    HandPoker.TYPE_NIU_2        = 2
    HandPoker.TYPE_NIU_3        = 3 
    HandPoker.TYPE_NIU_4        = 4
    HandPoker.TYPE_NIU_5        = 5 
    HandPoker.TYPE_NIU_6        = 6 
    HandPoker.TYPE_NIU_7        = 7
    HandPoker.TYPE_NIU_8        = 8
    HandPoker.TYPE_NIU_9        = 9
    HandPoker.TYPE_NIU_NIU      = 10 牛牛
    HandPoker.TYPE_SHUN         = 11 顺
    HandPoker.TYPE_SDD          = 12 三带一对
    HandPoker.TYPE_ALL_SMALL    = 13 全小
    HandPoker.TYPE_ALL_BIG      = 14 全大
    HandPoker.TYPE_BOM          = 15 炸弹

cardTypeX 牌型赔率
    

*/


// 服务器包
P.SVR_JOIN_SUCCESS             = 0x4101    //登录成功
CONFIG[P.SVR_JOIN_SUCCESS] = {
    ver : 1,
    fmt : [
        {name : "blind"        , type : T.ULONG } , //盲注
        {name : "minBuyIn"     , type : T.ULONG}  , //最小携带      
        {name : "roomName"     , type : T.STRING} , //房间名字
        {name : "roomType"     , type : T.UINT}   , //房间场别      
        {name : "seatChips"    , type : T.ULONG}  , //用户带入筹码数      
        {name : "gameStatus"   , type : T.BYTE}   , //游戏状态
        {name : "seatNum"      , type : T.BYTE}   , //座位数
        {name : "roundCount"   , type : T.UINT}   , //牌局数id
        {name : "dealerSeatId" , type : T.BYTE}   , //前一局庄家座位ID
        {name : "venue"        , type : T.USHORT}   , //台费比例       
        {    //每个用户的信息(已经坐下的)
            name:"playerList",
            type:T.ARRAY,
            fmt : [
                {name : "seatId"    , type : T.BYTE}   , //座位ID
                {name : "uid"       , type : T.UINT}   , //用户id
                {name : "seatChips" , type : T.ULONG}  , //用户钱数
                {name : "point"     , type : T.ULONG}   , //用户经验
                {name : "vip"       , type : T.BYTE}   , //VIP标识
                {name : "nick"      , type : T.STRING} , //用户昵称
                {name : "gender"    , type : T.STRING} , //用户性别
                {name : "img"       , type : T.STRING} , //用户头像
                {name : "win"       , type : T.UINT}   , //用户赢局数
                {name : "lose"      , type : T.UINT}   , //用户输局数            
                {name : "extInfo"   , type : T.STRING},    //用户扩展信息            
                {name : "state"     , type : T.BYTE}  , //座位的总下注数
                {name : "betX"      , type : T.BYTE}   , //下注类型(座位状态)
            ]
        },
        {name:"handCardFlag", type:T.BYTE},        //是否有手牌
        {    //手牌
            name:"handCards",
            type:T.ARRAY,
            depends:function(ctx){ return ctx.handCardFlag == 1 },
            fixedLength:5,
            fmt:{ type:T.USHORT}
        },
        {name:"cardType", type:T.BYTE, depends:function(ctx){ return ctx.handCardFlag == 1 }},     //牌型
        {name:"cardTypeX", type:T.BYTE, depends:function(ctx){ return ctx.handCardFlag == 1 }}     //牌点
    ]
}

P.SVR_JOIN_FAIL                = 0x4202    //登录失败
CONFIG[P.SVR_JOIN_FAIL] = {
    ver : 1,
    fmt : [
        {name:"errorCode", type:T.USHORT}    //失败原因代码
    ]
}


P.SVR_LEAVE_SUCCESS            = 0x4229    //登出成功
CONFIG[P.SVR_LEAVE_SUCCESS] = { ver : 1}


P.SVR_GAME_START               = 0x4207    //游戏开始
CONFIG[P.SVR_GAME_START] = {
    ver : 1,
    fmt : [
        {name:"roundCount", type:T.UINT},    //牌局数id
        {name:"timeout", type:T.BYTE},      //超时时间秒       
        {    //每个用户的信息(在玩)
            name:"playerList",
            type:T.ARRAY,
            fmt : [
                {name:"seatId", type:T.BYTE},    //座位ID
                {name:"uid", type:T.UINT},        //用户id
                {name:"seatChips", type:T.ULONG},    //座位用户钱数
            ]
        },
        {name:"handCard1", type:T.USHORT},        //手牌1
        {name:"handCard2", type:T.USHORT},        //手牌2
        {name:"handCard3", type:T.USHORT},        //手牌3
        {name:"handCard4", type:T.USHORT},        //手牌4     
        {name:"seatChips", type:T.ULONG},        //用户钱数
    ]
}

P.SVR_GAME_OVER                 = 0x420E    //游戏结束
CONFIG[P.SVR_GAME_OVER] = {
    ver : 1,
    fmt : [
        {    //座位筹码经验变化信息
            name:"seatChangeList",
            type:T.ARRAY,        
            fmt : [
                {name:"seatId", type:T.BYTE},
                {name:"seatChips", type:T.LONG},        //金币变化
                {name:"point", type:T.LONG},//积分变化
            ]
        },
        {    //座位牌型信息
            name:"playerCardsList",
            type:T.ARRAY,
            fmt : [
                {name:"seatId", type:T.BYTE},        //座位ID
                {name:"handCard1", type:T.USHORT},    //手牌1
                {name:"handCard2", type:T.USHORT},    //手牌2
                {name:"handCard3", type:T.USHORT},    //手牌3
                {name:"handCard4", type:T.USHORT},    //手牌4
                {name:"handCard5", type:T.USHORT},    //手牌5
                {name:"cardType", type:T.BYTE},     //牌型
                {name:"cardTypeX", type:T.BYTE},     //倍数
            ]
        }
    ]
}

P.SVR_SIT_DOWN                  = 0x4205    //坐下
CONFIG[P.SVR_SIT_DOWN] = {
    ver : 1,
    fmt : [
            {name : "seatId"    , type : T.BYTE}   , //座位ID
            {name : "uid"       , type : T.UINT}   , //用户id
            {name : "seatChips" , type : T.ULONG}  , //用户钱数
            {name : "point"      , type : T.ULONG}   , //用户经验
            {name : "vip"       , type : T.BYTE}   , //VIP标识
            {name : "nick"      , type : T.STRING} , //用户昵称
            {name : "gender"    , type : T.STRING} , //用户性别
            {name : "img"       , type : T.STRING} , //用户头像
            {name : "win"       , type : T.UINT}   , //用户赢局数
            {name : "lose"      , type : T.UINT}   , //用户输局数               
            {name : "extInfo"   , type : T.STRING} , //用户所在地
    ],
}

P.SVR_SIT_DOWN_FAIL             = 0x4204    //坐下失败
CONFIG[P.SVR_SIT_DOWN_FAIL] = {
    ver : 1,
    fmt : [
        {name:"errorCode", type:T.USHORT}    //失败原因代码
    ],
}

P.SVR_STAND_UP                  = 0x4206    //站起
CONFIG[P.SVR_STAND_UP] = {
    ver : 1,
    fmt : [
        {name:"seatId", type:T.BYTE},        //座位ID
        {name:"seatChips", type:T.ULONG},        //用户筹码
    ],
}

P.SVR_DO_SUCCESS               = 0x4208    //下注成功
CONFIG[P.SVR_DO_SUCCESS] = {
    ver : 1,
    fmt : [
        {name:"seatId", type:T.BYTE},        //座位ID
        {name:"state", type:T.BYTE},        //下注类型
        {name:"betX", type:T.BYTE},    //下注筹码数
    ],
}


P.SVR_DEAL_ONE_CARD            = 0x4209    //发第五张牌
CONFIG[P.SVR_DEAL_ONE_CARD] = {
    ver : 1,
    fmt : [
        {name:"handCard5", type:T.USHORT},    //发第五张牌
        {name:"cardType", type:T.BYTE},     //牌型
        {name:"cardTypeX", type:T.BYTE},     //倍数
    ],
}

P.SVR_TURN_TO             = 0x420C    //轮到座位下注
CONFIG[P.SVR_TURN_TO] = {
    ver : 1,
    fmt : [
        {name:"gameStatus", type:T.ULONG},        //轮到下注的座位ID
        {name:"timeout", type:T.BYTE},    //跟注需要的金额
        {name:"bankerSeatId", type:T.BYTE}//最小加注金额      
    ],
}

P.SVR_CMD_USER_CRASH            = 0x4213    //SVR返回破产包
CONFIG[P.SVR_CMD_USER_CRASH] = {
    ver : 1,
    fmt : [
        {name:"times", type:T.BYTE},        //破产次数
        {name:"subsidizeChips", type:T.LONG},//破产之后额外加的钱数
    ],
}

P.SVR_SEND_ROOM_BROADCAST       = 0x4211    //发送牌桌广播
CONFIG[P.SVR_SEND_ROOM_BROADCAST] = CONFIG[P.CLI_SEND_ROOM_BROADCAST]

P.SVR_CMD_SERVER_UPGRADE        = 0x4501    // 服务器升级
CONFIG[P.SVR_CMD_SERVER_UPGRADE] = null

P.SVR_KICK_USER = 0x4503    // 踢单个玩家
CONFIG[P.SVR_KICK_USER] = null

// 发送金币变化消息
P.BROADCAST_MONEY_CHANGE_RET = 0x7011
CONFIG[P.BROADCAST_MONEY_CHANGE_RET] = {
    ver : 1,
    fmt : [
        {name : "money", type : T.ULONG}, //更新后的金币数
        {name : "remark", type : T.UINT} //金币来源
    ]
}

// 发送经验变化消息
P.BROADCAST_EXP_CHANGE_RET = 0x7021
CONFIG[P.BROADCAST_EXP_CHANGE_RET] = {
    ver : 1,
    fmt : [
        {name : "exp", type : T.ULONG}, //更新后的经验数
        {name : "remark", type : T.UINT} //经验来源
    ]
}

// 接收钻石变化消息
P.BROADCAST_DIAMOND_CHANGE_RET = 0x7013
CONFIG[P.BROADCAST_DIAMOND_CHANGE_RET] = {
    ver : 1,
    fmt : [
        {name : "diamond", type : T.ULONG}, //更新后的钻石数
        {name : "remark", type : T.UINT} //金币来源
    ]
}

// 转发自定义消息
P.BROADCAST_USER_MESSAGE_RET = 0x7015
CONFIG[P.BROADCAST_USER_MESSAGE_RET] = {
    ver : 1,
    fmt : [
        {name : "message", type : T.STRING}
    ]
}

// 转发全服消息
P.BROADCAST_ALL_MESSAGE_RET = 0x7017
CONFIG[P.BROADCAST_ALL_MESSAGE_RET] = {
    ver : 1,
    fmt : [
        // message={"type":"broadcast","senderUid":6,"content":"Sat 3fffkl","username":"aleo","time":1449481851}
        {name : "message", type : T.STRING}
    ]
}

module.exports = PROTOCOL;

