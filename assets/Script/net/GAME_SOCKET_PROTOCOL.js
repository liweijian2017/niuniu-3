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
        {name : "venue"        , type : T.USHORT} , //台费比例       
        {name : "xs"           , type : T.BYTE}   , //叫倍系数
        {name : "score"        , type : T.USHORT} , //积分
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
        {name:"times", type:T.BYTE},        
        {name:"remark", type:T.LONG},//破产原因
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

// ---------------------------百人场--------------------------------


P.HUNDRED_CLI_JOIN = 0xa001
CONFIG[P.HUNDRED_CLI_JOIN] = {
    ver: 1,
    fmt:[
        {
            name: "uid",
            type: T.UINT
        },
        {
            name: "tid",
            type: T.UINT
        },
        {
            name: "userinfo",
            type: T.STRING
        },
    ]
}

// 服务端通知客户端加入房间成功
P.HUNDRED_SVR_JOIN_SUCCESS = 0xa002
CONFIG[P.HUNDRED_SVR_JOIN_SUCCESS] = {
    ver: 1,
    fmt:[
        {
            name: "seatId",
            type: T.UINT
        }, //分配的座位ID
        {
            name: "blind",
            type: T.ULONG
        }, //盲注
        {
            name: "minBuyIn",
            type: T.ULONG
        }, //最小携带
        {
            name: "maxBuyIn",
            type: T.ULONG
        }, //最大携带
        {
            name: "roomName",
            type: T.STRING
        }, //房间名字
        {
            name: "roomType",
            type: T.UINT
        }, //房间场别
        {
            name: "roomField",
            type: T.UINT
        }, //房间级别
        {
            name: "seatNum",
            type: T.BYTE
        }, //座位数
        {
            name: "gameStatus",
            type: T.BYTE
        }, //游戏状态
        {
            name: "betExpire",
            type: T.INT
        }, //下注最大时间
        {
            name: "minDealerBuyin",
            type: T.ULONG
        }, //庄家最小携带
        {
            name: "minSitdownBuyin",
            type: T.ULONG
        }, //坐下最小携带
        {
            name: "inApplyDealer",
            type: T.UINT
        }, //0:不在申请庄列表 1:反之
        { // 投注池信息
            name: "pots",
            type: T.ARRAY,
            fmt:[
                {
                    name: "potId",
                    type: T.UINT
                }, //投注池ID
                {
                    name: "totalChips",
                    type: T.ULONG
                }, //已投注的总金额
                {
                    name: "meBetChips",
                    type: T.ULONG
                }, //我的投注金额
            ]
        },
        { // 玩家的信息(前九个座位 + 自己的信息)
            name: "playerList",
            type: T.ARRAY,
            fmt:[
                {
                    name: "seatId",
                    type: T.UINT
                }, //座位ID
                {
                    name: "uid",
                    type: T.UINT
                }, //用户id
                {
                    name: "nick",
                    type: T.STRING
                }, //用户昵称
                {
                    name: "vip",
                    type: T.BYTE
                }, //VIP标识
                {
                    name: "img",
                    type: T.STRING
                }, //用户头像
                {
                    name: "gender",
                    type: T.STRING
                }, //用户性别
                {
                    name: "buyinChips",
                    type: T.ULONG
                }, //买入筹码数
                {
                    name: "platFlag",
                    type: T.INT
                }, //平台标识
                {
                    name: "giftId",
                    type: T.INT
                }, //礼物ID
                {
                    name: "exp",
                    type: T.UINT
                }, //用户经验
                {
                    name: "win",
                    type: T.UINT
                }, //用户赢局数
                {
                    name: "lose",
                    type: T.UINT
                }, //用户输局数
                {
                    name: "diamondCount",
                    type: T.ULONG
                }, //钻石
                {
                    name: "extInfo",
                    type: T.STRING
                }, //用户所在地
                {
                    name: "homeTown",
                    type: T.STRING
                }, //用户家乡
                {
                    name: "totalWinChips",
                    type: T.ULONG
                }, //游戏期间总赢取
                {
                    name: "totalLoseChips",
                    type: T.LONG
                }, //游戏期间总输钱
                {
                    name: "otherChips",
                    type: T.ULONG
                }, //未带入庄位的筹码
                {
                    name: "totalAddBuyin",
                    type: T.ULONG
                }, //追加带入的筹码
            ]
        },
        {
            name: "luckPotChips",
            type: T.ULONG
        }, //最新的幸运奖池数
    ]
}

// 加入房间失败
P.HUNDRED_SVR_JOIN_FAIL = 0xa003
CONFIG[P.HUNDRED_SVR_JOIN_FAIL] = {
    ver: 1,
    fmt:[
        {
            name: "errorCode",
            type: T.USHORT
        }
    ]
}

// 坐下
P.HUNDRED_CLI_SIT_DOWN = 0xa004
CONFIG[P.HUNDRED_CLI_SIT_DOWN] = {
    ver: 1,
    fmt:[
        {name: "uid",type: T.UINT},
        {name: "seatId",type: T.UINT}
    ]
}

// 坐下成功
P.HUNDRED_SVR_SIT_DOWN = 0xa005
CONFIG[P.HUNDRED_SVR_SIT_DOWN] = {
    ver: 1,
    fmt:[
        {
            name: "seatId",
            type: T.UINT
        }, //座位ID
        {
            name: "uid",
            type: T.UINT
        }, //用户id
        {
            name: "nick",
            type: T.STRING
        }, //用户昵称
        {
            name: "vip",
            type: T.BYTE
        }, //VIP标识
        {
            name: "img",
            type: T.STRING
        }, //用户头像
        {
            name: "gender",
            type: T.STRING
        }, //用户性别
        {
            name: "buyinChips",
            type: T.ULONG
        }, //买入筹码数
        {
            name: "platFlag",
            type: T.INT
        }, //平台标识
        {
            name: "giftId",
            type: T.INT
        }, //礼物ID
        {
            name: "exp",
            type: T.UINT
        }, //用户经验
        {
            name: "win",
            type: T.UINT
        }, //用户赢局数
        {
            name: "lose",
            type: T.UINT
        }, //用户输局数
        {
            name: "diamondCount",
            type: T.ULONG
        }, //钻石
        {
            name: "extInfo",
            type: T.STRING
        }, //用户所在地
        {
            name: "homeTown",
            type: T.STRING
        }, //用户家乡
    ],
}

P.HUNDRED_SVR_SIT_DOWN_FAIL = 0xa006 //坐下失败
CONFIG[P.HUNDRED_SVR_SIT_DOWN_FAIL] = {
    ver: 1,
    fmt:[
        {
            name: "errorCode",
            type: T.USHORT
        } //失败原因代码
    ],
}

// 站起
P.HUNDRED_CLI_STAND_UP = 0xa007
CONFIG[P.HUNDRED_CLI_STAND_UP] = {
    ver: 1,
    fmt:[
        {
            name: "uid",
            type: T.UINT
        }
    ]
}

// 站起成功
P.HUNDRED_SVR_STAND_UP = 0xa008
CONFIG[P.HUNDRED_SVR_STAND_UP] = {
    ver: 1,
    fmt:[
        {
            name: "seatId",
            type: T.UINT
        }, //座位ID
    ],
}

// 站起失败
P.HUNDRED_SVR_STAND_UP_FAIL = 0xa009
CONFIG[P.HUNDRED_SVR_STAND_UP_FAIL] = {
    ver: 1,
    fmt:[
        {
            name: "errorCode",
            type: T.USHORT
        },
    ],
}

// 离开房间
P.HUNDRED_CLI_LEAVE = 0xa010
CONFIG[P.HUNDRED_CLI_LEAVE] = {
    ver: 1,
    fmt:[
        {
            name: "uid",
            type: T.UINT
        }
    ]
}

// 中途离开房间
P.HUNDRED_SVR_HALFWAY_LEAVE = 0xa011
CONFIG[P.HUNDRED_SVR_HALFWAY_LEAVE] = {
    ver: 1
}

// 离开房间
P.HUNDRED_SVR_LEAVE_RET = 0xa012
CONFIG[P.HUNDRED_SVR_LEAVE_RET] = {
    ver: 1,
    fmt:[
        {
            name: "code",
            type: T.UINT
        },
    ]
}

// 下注
P.HUNDRED_CLI_BET = 0xa013
CONFIG[P.HUNDRED_CLI_BET] = {
    ver: 1,
    fmt:[
        {
            name: "uid",
            type: T.UINT
        },
        {
            name: "bets",
            type: T.ARRAY,
            fmt:[
                {
                    name: "potId",
                    type: T.UINT
                }, //下注奖池ID
                {
                    name: "betChips",
                    type: T.ULONG
                }, //下注额度
            ]
        },
    ]
}

// 下注成功
P.HUNDRED_SVR_BET_SUCCESS = 0xa014
CONFIG[P.HUNDRED_SVR_BET_SUCCESS] = {
    ver: 1,
    fmt:[
        {
            name: "buyinChips",
            type: T.ULONG
        }, //我剩余的buyin
        {
            name: "meAcceptChips",
            type: T.ULONG
        }, //我可接受的下注额
        {
            name: "dealerAcceptChips",
            type: T.ULONG
        }, //庄家可接受的下注额
        {
            name: "betsResult",
            type: T.ARRAY,
            fmt:[
                {
                    name: "potId",
                    type: T.UINT
                }, //下注池ID
                {
                    name: "betChips",
                    type: T.ULONG
                }, //我下注的筹码数
                {
                    name: "totalChips",
                    type: T.ULONG
                }, //pot总筹码数
            ]
        },
    ]
}

// 同步下注信息
P.HUNDRED_SVR_SYNC_BET_INFO = 0xa023
CONFIG[P.HUNDRED_SVR_SYNC_BET_INFO] = {
    ver: 1,
    fmt:[
        {name: "seatId",type: T.UINT}, //座位ID
        {
            name: "bets",
            type: T.ARRAY,
            fmt:[
                {name: "potId",type: T.UINT}, //下注奖池ID
                {name: "seatId",type: T.UINT}, //座位号(1-8号是坐下玩家下注信息, 99是自己的下注信息, 100是其他旁观人员的下注信息)
                {name: "betChips",type: T.ULONG}, //下注额度
            ]
        },
        // {
        // name : "maxbet",
        // type : T.ARRAY,
        // fmt :[
        // {name : "potId",   type : T.UINT},  //下注奖池ID
        // {name : "uid",     type : T.UINT},  //下注最大玩家的uid
        // }
        // },
        {
            name: "isEnd",
            type: T.USHORT
        } //0:未结束 1:结束
    ]
}

// 下注失败
P.HUNDRED_SVR_BET_FAIL = 0xa015
CONFIG[P.HUNDRED_SVR_BET_FAIL] = {
    ver: 1,
    fmt:[
        {
            name: "errorCode",
            type: T.USHORT
        }, //错误代码
        {
            name: "buyinChips",
            type: T.ULONG
        }, //用户实时筹码数
        {
            name: "acceptChips",
            type: T.ULONG
        } //闲家或庄家可接受的最大下注
    ],
}

// 游戏开始
P.HUNDRED_SVR_GAME_START = 0xa016
CONFIG[P.HUNDRED_SVR_GAME_START] = {
    ver: 1,
    fmt:[
        {name: "seatId",type: T.UINT}, //座位ID
        {name: "uid",type: T.UINT}, //用户id
        {name: "nick",type: T.STRING}, //用户昵称
        {name: "vip",type: T.BYTE}, //VIP标识
        {name: "img",type: T.STRING}, //用户头像
        {name: "gender",type: T.STRING}, //用户性别
        {name: "buyinChips",type: T.ULONG}, //买入筹码数
        {name: "otherChips",type: T.ULONG}, //未携带上庄的筹码数
        {name: "platFlag",type: T.INT}, //平台标识
        {name: "giftId",type: T.INT}, //礼物ID
        {name: "exp",type: T.UINT}, //用户经验
        {name: "win",type: T.UINT}, //用户赢局数
        {name: "lose",type: T.UINT}, //用户输局数
        {name: "diamondCount",type: T.ULONG}, //钻石
        {name: "extInfo",type: T.STRING}, //用户所在地
        {name: "homeTown",type: T.STRING}, //用户家乡
        {name: "acceptChips",type: T.ULONG}, //闲家可接受的最大下注(庄家为0)
        { // 每个用户的信息(在玩)
            name: "playerList",
            type: T.ARRAY,
            fmt:[
                {name: "seatId",type: T.UINT}, //座位ID
                {name: "uid",type: T.UINT}, //用户id
                {name: "buyinChips",type: T.ULONG}, //座位用户钱数
            ]
        },
    ]
}

// 游戏结束
P.HUNDRED_SVR_GAME_OVER = 0xa017
CONFIG[P.HUNDRED_SVR_GAME_OVER] = {
    ver: 1,
    fmt:[
        //自己的信息              
        {name: "seatId",type: T.UINT}, //座位ID
        {name: "exp",type: T.UINT}, //EXP
        {name: "buyinChips",type: T.ULONG}, //游戏结束后,我的buyin
        {name: "totalWinChips",type: T.ULONG}, //游戏期间总赢取
        {name: "totalLoseChips",type: T.LONG}, //游戏期间总输钱        
        // 庄家的信息
        {name: "dealerCard1",type: T.USHORT}, //手牌1
        {name: "dealerCard2",type: T.USHORT}, //手牌2
        {name: "dealerCard3",type: T.USHORT}, //手牌3
        {name: "dealerCard4",type: T.USHORT}, //手牌4
        {name: "dealerCard5",type: T.USHORT}, //手牌5
        {name: "dealerCardType",type: T.BYTE}, //牌型
        {name: "dealerCardPoint",type: T.BYTE}, //点数
        { // 闲家的牌信息
            name: "pokers",
            type: T.ARRAY,
            fmt:[
                {name: "potId",type: T.UINT}, //投注池ID
                {name: "multiple",type: T.INT}, //翻倍倍数
                {name: "handCard1",type: T.USHORT}, //手牌1
                {name: "handCard2",type: T.USHORT}, //手牌2
                {name: "handCard3",type: T.USHORT}, //手牌3
                {name: "handCard4",type: T.USHORT}, //手牌4
                {name: "handCard5",type: T.USHORT}, //手牌5
                {name: "cardType",type: T.BYTE}, //牌型
                {name: "cardPoint",type: T.BYTE}, //点数
            ]
        },
        { // 闲家的下注信息
            name: "bets",
            type: T.ARRAY,
            fmt:[
                {name: "potId",type: T.UINT}, //下注奖池ID
                {name: "seatId",type: T.UINT}, //座位ID
                {name: "betChips",type: T.ULONG}, //下注额度
            ]
        },
        { //座位筹码变化信息
            name: "seatChangeList",
            type: T.ARRAY,
            fmt:[
                {name: "seatId",type: T.UINT}, //座位ID
                {name: "uid",type: T.UINT}, //UID
                {name: "chips",type: T.LONG}, //筹码变化
                {name: "buyinChips",type: T.ULONG}, //座位用户钱数
            ]
        },
        { //赢取排行榜
            name: "winners",
            type: T.ARRAY,
            fmt:[
                {name: "uid",type: T.UINT}, //UID
                {name: "img",type: T.STRING}, //头像
                {name: "chips",type: T.LONG}, //筹码变化
            ]
        },
        {name: "luckChips",type: T.ULONG}, //分得的幸运奖池金币数
        {name: "luckPotChips",type: T.ULONG}, //最新的幸运奖池数
        {name: "luckPotId",type: T.ULONG}, //开出的幸运奖池ID(庄potId为10)
    ]
}

// 客户端申请上庄
P.HUNDRED_CLI_APPLY_DEALER = 0xa018
CONFIG[P.HUNDRED_CLI_APPLY_DEALER] = {
    ver: 1,
    fmt:[
        {
            name: "uid",
            type: T.UINT
        },
        {
            name: "buyin",
            type: T.ULONG
        },
    ],
}

// 已加入待上庄列表
P.HUNDRED_SVR_APPLY_DEALER_SUCCESS = 0xa019
CONFIG[P.HUNDRED_SVR_APPLY_DEALER_SUCCESS] = {
    ver: 1,
    fmt:[
        {
            name: "number",
            type: T.UINT
        },
    ],
}

// 申请上庄失败
P.HUNDRED_SVR_APPLY_DEALER_FAIL = 0xa020
CONFIG[P.HUNDRED_SVR_APPLY_DEALER_FAIL] = {
    ver: 1,
    fmt:[
        {
            name: "minDealerBuyin",
            type: T.ULONG
        },
    ],
}

// 客户端申请取消上庄
P.HUNDRED_CLI_CANCEL_DEALER = 0xa021
CONFIG[P.HUNDRED_CLI_CANCEL_DEALER] = {
    ver: 1,
    fmt:[
        {
            name: "uid",
            type: T.UINT
        },
    ],
}

// 服务端取消上庄成功
P.HUNDRED_SVR_CANCEL_DEALER_SUCCESS = 0xa022
CONFIG[P.HUNDRED_SVR_CANCEL_DEALER_SUCCESS] = {
    ver: 1
}

// 服务端取消上庄失败
P.HUNDRED_SVR_CANCEL_DEALER_FAIL = 0xa041
CONFIG[P.HUNDRED_SVR_CANCEL_DEALER_FAIL] = {
    ver: 1
}

// 服务端通知客户端,轮到你上庄，但是你不符合条件
P.HUNDRED_SVR_NOTIFY_WAITING_DEALER = 0xa051
CONFIG[P.HUNDRED_SVR_NOTIFY_WAITING_DEALER] = {
    ver: 1,
    fmt:[
        {
            name: "errorCode",
            type: T.USHORT
        },
    ],
}

// 离线
P.HUNDRED_OFFLINE = 0xa024
CONFIG[P.HUNDRED_OFFLINE] = {
    ver: 1,
    fmt:[
        {
            name: "uid",
            type: T.UINT
        }
    ]
}

// 待上庄的玩家列表
P.HUNDRED_CLI_LIST_DEALER = 0xa025
CONFIG[P.HUNDRED_CLI_LIST_DEALER] = {
    ver: 1,
    fmt:[
        {
            name: "uid",
            type: T.UINT
        },
    ],
}

// 服务端返回上庄玩家列表
P.HUNDRED_SRV_LIST_RET = 0xa027
CONFIG[P.HUNDRED_SRV_LIST_RET] = {
    ver: 1,
    fmt:[
        {
            name: "players",
            type: T.ARRAY,
            fmt:[
                {
                    name: "uid",
                    type: T.UINT
                }, //UID
                {
                    name: "nick",
                    type: T.STRING
                }, //用户昵称
                {
                    name: "vip",
                    type: T.BYTE
                }, //VIP标识
                {
                    name: "img",
                    type: T.STRING
                }, //用户头像
                {
                    name: "gender",
                    type: T.STRING
                }, //用户性别
                {
                    name: "buyinChips",
                    type: T.ULONG
                }, //buyin筹码
                {
                    name: "readyBuyin",
                    type: T.ULONG
                }, //准备携带上庄的筹码
            ]
        },
    ]
}

// 无座的玩家列表
P.HUNDRED_CLI_LIST_NO_SEAT_PLAYER = 0xa026
CONFIG[P.HUNDRED_CLI_LIST_NO_SEAT_PLAYER] = {
    ver: 1,
    fmt:[
        {
            name: "uid",
            type: T.UINT
        },
    ],
}

// 服务端返回无座玩家列表
P.HUNDRED_SRV_LIST_NO_SEAT_PLAYER_RET = 0xa042
CONFIG[P.HUNDRED_SRV_LIST_NO_SEAT_PLAYER_RET] = {
    ver: 1,
    fmt:[
        {
            name: "players",
            type: T.ARRAY,
            fmt:[
                {
                    name: "uid",
                    type: T.UINT
                }, //UID
                {
                    name: "nick",
                    type: T.STRING
                }, //用户昵称
                {
                    name: "vip",
                    type: T.BYTE
                }, //VIP标识
                {
                    name: "img",
                    type: T.STRING
                }, //用户头像
                {
                    name: "gender",
                    type: T.STRING
                }, //用户性别
                {
                    name: "buyinChips",
                    type: T.ULONG
                }, //buyin筹码
            ]
        },
    ]
}

// 请求输赢记录
P.HUNDRED_CLI_LIST_RECORD = 0xa028
CONFIG[P.HUNDRED_CLI_LIST_RECORD] = {
    ver: 1,
    fmt:[
        {
            name: "uid",
            type: T.UINT
        },
    ],
}

// 服务端返回输赢记录
P.HUNDRED_SRV_LIST_RECORD = 0xa029
CONFIG[P.HUNDRED_SRV_LIST_RECORD] = {
    ver: 1,
    fmt:[
        {
            name: "records",
            type: T.ARRAY,
            fmt:[
                {
                    name: 1,
                    type: T.BYTE
                }, // 1:闲家胜 0:闲家输
                {
                    name: 2,
                    type: T.BYTE
                },
                {
                    name: 3,
                    type: T.BYTE
                },
                {
                    name: 4,
                    type: T.BYTE
                },
            ]
        },
    ]
}

// 请求发房间广播
P.HUNDRED_CLI_SEND_ROOM_BROADCAST = 0xa030
CONFIG[P.HUNDRED_CLI_SEND_ROOM_BROADCAST] = {
    ver: 1,
    fmt:[
        {
            name: "uid",
            type: T.UINT
        },
        {
            name: "tid",
            type: T.INT
        }, //tid
        {
            name: "param",
            type: T.INT
        }, //预留int
        {
            name: "content",
            type: T.STRING
        }, //内容
    ]
}

// 服务端返回房间广播
P.HUNDRED_SVR_SEND_ROOM_BROADCAST = 0xa031
CONFIG[P.HUNDRED_SVR_SEND_ROOM_BROADCAST] = CONFIG[P.HUNDRED_CLI_SEND_ROOM_BROADCAST]

// 请求发表情
P.HUNDRED_CLI_SEND_EXPRESSION = 0xa032
CONFIG[P.HUNDRED_CLI_SEND_EXPRESSION] = {
    ver: 1,
    fmt:[
        {
            name: "uid",
            type: T.UINT
        },
        {
            name: "expressionType",
            type: T.INT
        }, //表情类型
        {
            name: "expressionId",
            type: T.UINT
        }, //表情ID
    ]
}

// 服务端发表情
P.HUNDRED_SVR_SEND_EXPRESSION = 0xa033
CONFIG[P.HUNDRED_SVR_SEND_EXPRESSION] = {
    ver: 1,
    fmt:[
        {
            name: "seatId",
            type: T.BYTE
        }, //发送表情的座位ID
        {
            name: "expressionType",
            type: T.INT
        }, //表情类型
        {
            name: "expressionId",
            type: T.UINT
        }, //表情ID
        {
            name: "minusChips",
            type: T.LONG
        }, //表情扣筹码数
        {
            name: "totalChips",
            type: T.LONG
        }, //发送表情之后的筹码数
    ]
}

// // 请求发互动道具
// P.HUNDRED_CLI_SEND_HDDJ  = 0xa034
// CONFIG[P.HUNDRED_CLI_SEND_HDDJ] :[
// ver : 1,
// fmt :[
// {name : "uid",        type : T.UINT},
// {name : "fromSeatId", type : T.BYTE}, //发送人座位ID
// {name : "hddjId",     type : T.UINT}, //互动道具ID
// {name : "toSeatId",   type : T.BYTE}, //接收人座位ID
// }
// }

// // 服务端发送互动道具
// P.HUNDRED_SVR_SEND_HDDJ  = 0xa035
// CONFIG[P.HUNDRED_SVR_SEND_HDDJ] :[
// ver : 1,
// fmt :[
// {name : "fromSeatId", type : T.BYTE}, //发送人座位ID
// {name : "hddjId",     type : T.UINT}, //互动道具ID
// {name : "toSeatId",   type : T.BYTE}, //接收人座位ID
// {name : "uid",        type : T.UINT}, //接收人用户id
// }
// }

// 请求加好友
P.HUNDRED_CLI_ADD_FRIEND = 0xa036
CONFIG[P.HUNDRED_CLI_ADD_FRIEND] = {
    ver: 1,
    fmt:[
        {
            name: "uid",
            type: T.UINT
        },
        {
            name: "fromSeatId",
            type: T.BYTE
        }, //发送人座位ID
        {
            name: "toSeatId",
            type: T.BYTE
        }, //接收人座位ID
    ]
}

// 服务端加好友
P.HUNDRED_SVR_ADD_FRIEND = 0xa037
CONFIG[P.HUNDRED_SVR_ADD_FRIEND] = {
    ver: 1,
    fmt:[
        {
            name: "fromSeatId",
            type: T.BYTE
        }, //发送人座位ID
        {
            name: "toSeatId",
            type: T.BYTE
        }, //接收人座位ID
    ]
}

// 请求上局幸运奖池记录
P.HUNDRED_CLI_LIST_LUCK_RECORD = 0xa038
CONFIG[P.HUNDRED_CLI_LIST_LUCK_RECORD] = {
    ver: 1,
    fmt:[
        {
            name: "uid",
            type: T.UINT
        },
    ]
}

// 服务端返回上局幸运奖池记录
P.HUNDRED_SRV_LIST_LUCK_RECORD = 0xa039
CONFIG[P.HUNDRED_SRV_LIST_LUCK_RECORD] = {
    ver: 1,
    fmt:[
        {
            name: "luckPotChips",
            type: T.ULONG
        },
        {
            name: "handCard1",
            type: T.USHORT
        }, //手牌1
        {
            name: "handCard2",
            type: T.USHORT
        }, //手牌2
        {
            name: "handCard3",
            type: T.USHORT
        }, //手牌3
        {
            name: "cardType",
            type: T.BYTE
        }, //牌型
        {
            name: "cardPoint",
            type: T.BYTE
        }, //点数
        {
            name: "totalChips",
            type: T.ULONG
        },
        {
            name: "createTime",
            type: T.UINT
        },
        {
            name: "players",
            type: T.ARRAY,
            fmt:[
                {
                    name: "uid",
                    type: T.UINT
                }, //UID
                {
                    name: "img",
                    type: T.STRING
                }, //头像
                {
                    name: "winChips",
                    type: T.ULONG
                }, //赢取的筹码
                {
                    name: "vip",
                    type: T.BYTE
                }, //VIP标识
                {
                    name: "nick",
                    type: T.STRING
                }, //用户昵称
                {
                    name: "gender",
                    type: T.STRING
                }, //用户性别
            ]
        },
    ]
}

// 服务端返回上局幸运奖池记录
P.HUNDRED_SRV_LIST_LUCK_RECORD_FAIL = 0xa040
CONFIG[P.HUNDRED_SRV_LIST_LUCK_RECORD_FAIL] = {
    ver: 1,
    fmt:[
        {
            name: "errorCode",
            type: T.USHORT
        },
    ]
}

// 重新加载房间
P.HUNDRED_RELOAD_ROOM = 0xa043
CONFIG[P.HUNDRED_RELOAD_ROOM] = {
    ver: 1,
    fmt:[
        {
            name: "key",
            type: T.STRING
        }, //验证key
    ],
}

// 执行服务器升级命令
P.HUNDRED_SERVER_UPGRADE = 0xa044
CONFIG[P.HUNDRED_SERVER_UPGRADE] = {
    ver: 1,
    fmt:[
        {
            name: "key",
            type: T.STRING
        }, //验证key
    ],
}

// 服务器升级返回,自动踢起玩家
P.HUNDRED_SVR_SERVER_UPGRADE = 0xa045
CONFIG[P.HUNDRED_SVR_SERVER_UPGRADE] = {
    ver: 1
}

// 执行踢单个玩家的命令
P.HUNDRED_KICK_USER = 0xa046
CONFIG[P.HUNDRED_KICK_USER] = {
    ver: 1,
    fmt:[
        {
            name: "uid",
            type: T.INT
        }, //uid
        {
            name: "key",
            type: T.STRING
        }, //通信key
    ],
}

// 踢单个玩家返回
P.GAME_SVR_KICK_USER = 0xa047
CONFIG[P.GAME_SVR_KICK_USER] = {
    ver: 1
}

// 追加携带
P.HUNDRED_CLI_ADD_BUYIN = 0xa048
CONFIG[P.HUNDRED_CLI_ADD_BUYIN] = {
    ver: 1,
    fmt:[
        {
            name: "uid",
            type: T.UINT
        },
        {
            name: "addBuyin",
            type: T.ULONG
        },
    ]
}

// 服务端返回追加携带成功
P.HUNDRED_SRV_ADD_BUYIN_SUCCESS = 0xa049
CONFIG[P.HUNDRED_SRV_ADD_BUYIN_SUCCESS] = {
    ver: 1,
    fmt:[
        {
            name: "totalAddBuyin",
            type: T.ULONG
        },
        {
            name: "otherChips",
            type: T.ULONG
        },
    ]
}

// 服务端返回追加携带失败
P.HUNDRED_SRV_ADD_BUYIN_FAIL = 0xa050
CONFIG[P.HUNDRED_SRV_ADD_BUYIN_FAIL] = {
    ver: 1,
    fmt:[
        {
            name: "errorCode",
            type: T.USHORT
        },
    ]
}



module.exports = PROTOCOL;

