//百人场数据

var HundredData = require('DataMonitoring').extend({
    'dataName':'HundredData',
    'isAttend':false, //是否参加下注
    'acceptChips':0, //玩家最高下注值
    'currentSeatId':-1, //默认-1, 0:庄家; 1-4:有座; 99:无座
    'minSitdownBuyin':1000000000, //默认坐下最小值  10亿 
    'minDealerBuyin':1000000000, //默认上庄最小值  10亿 
    'userPoint':-1, //用户筹码
    'requestBankerChips':-1, //请求坐庄的筹码数
    'recordArr':[], //比赛记录
    'seatChangeList':[], //当局结束,所有座位金币变动
    'winnersList':[], //当局结束,赢取筹码最多的4位
    'syncBetData':{//下注同步数据
        seatId:-1,
        bets:[]
    }, 
    'banker':{ //庄家信息
        uid:-1, //默认是系统
        name:'庄家',
        point:'10000',
        img:'',
        pokers:{
            '0':774,
            '1':774,
            '2':774,
            '3':774,
            '4':774,
        }, //五张牌
        cardType:0, //没牛
        isShowPokerType:false,//是否显示牌型
    },
    'seats':{ //座位信息
        '1':{
            isHold:false,
            name:'1号座位',
            point:0,
            img:'',
            uid:0,
        },
        '2':{
            isHold:false,
            name:'2号座位',
            point:0,
            img:'',
            uid:0,
        },
        '3':{
            isHold:false,
            name:'3号座位',
            point:0,
            img:'',
            uid:0,
        },
        '4':{
            isHold:false,
            name:'4号座位',
            point:0,
            img:'',
            uid:0,
        },
    },
    'betAreas':{ //下注筹码区
        point:'193991',
        '1':{
            point:0, //下注区筹码数
            isActive:false, //下注区是否打激活中
            isWin:false, //是否显示胜利框
            resultText:'',//结果显示
            pokerType:0, //牌型
            isShowPokerType:false,//是否显示牌型
            selfPoint:0, //玩家下注的point
            pokers:{
                '0':774,
                '1':774,
                '2':774,
                '3':774,
                '4':774,
            }, //五张牌 
            cardType:0, //没牛
            multiple:0, //闲家倍数
            participators:[], //下注的座位号
        },
        '2':{
            point:0, //下注区筹码数
            isActive:false, //下注区是否打激活中
            isWin:false, //是否胜利
            resultText:'',//结果显示
            pokerType:0, //牌型
            isShowPokerType:false,//是否显示牌型
            selfPoint:0, //玩家下注的point
            pokers:{
              '0':774,
                '1':774,
                '2':774,
                '3':774,
                '4':774,
            }, //五张牌 
            cardType:0, //没牛
            multiple:0, //闲家倍数
            participators:[], //下注的座位号
        },
        '3':{
            point:0, //下注区筹码数
            isActive:false, //下注区是否打激活中
            isWin:false, //是否胜利
            resultText:'',//结果显示
            pokerType:0, //牌型
            isShowPokerType:false,//是否显示牌型
            selfPoint:0, //玩家下注的point
            pokers:{
                '0':774,
                '1':774,
                '2':774,
                '3':774,
                '4':774,
            }, //五张牌 
            cardType:0, //没牛
            multiple:0, //闲家倍数
            participators:[], //下注的座位号
        },
        '4':{
            point:0, //下注区筹码数
            isActive:false, //下注区是否打激活中
            isWin:false, //是否胜利
            resultText:'',//结果显示
            pokerType:0, //牌型
            isShowPokerType:false,//是否显示牌型
            selfPoint:0, //玩家下注的point
            pokers:{
                '0':774,
                '1':774,
                '2':774,
                '3':774,
                '4':774,
            }, //五张牌
            cardType:0, //没牛
            multiple:0, //闲家倍数
            participators:[], //下注的座位号
        },
    },
    'handlePanel':{ //操控面板
        preType:-2, //上一个状态
        type:-1, //-1:隐藏 0:没有坐下 1:坐下后 2:庄家收益
        // currentSeatId:-1, //默认-1, 0:庄家; 1-4:座位; 100:无座玩家
        name:'',
        point:0,
        score:0,
        '0':[100, 1000, 5000, 10000, 100000], //type==0时候的数据
        '1':[1000, 10000, 50000, 100000, 1000000],
        '2':{ //庄家收益
            gain:0, //赚
            lose:0, //输
            total:1, //总计
        },
        selectValue:100, //当前选择的按钮数值
    },
    'luckPound':{ //奖池信息
        luckChips:0, //分得的幸运奖池金币数
        luckPokers:[], //最新的幸运奖池数
    },
});
module.exports = HundredData;