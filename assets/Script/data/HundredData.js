//百人场数据
var HundredData = { //百人场数据
    _handleList:[], 
    'banker':{ //庄家信息
        name:'庄家',
        point:'10000',
        img:'',
    },
    'seats':{ //座位信息
        '1':{
            name:'',
            point:'',
            img:'',
            uid:'',
        },
        '2':{
            name:'',
            point:'',
            img:'',
            uid:'',
        },
        '3':{
            name:'',
            point:'',
            img:'',
            uid:'',
        },
        '4':{
            name:'',
            point:'',
            img:'',
            uid:'',
        },
    },
    'handlePanel':{ //操控面板
        preType:-2, //上一个状态
        type:0, //-1:隐藏 0:没有坐下 1:坐下后 2:庄家收益
        name:'测试',
        point:0,
        score:0,
        '0':[100, 1000, 5000, 10000, 100000], //type==0时候的数据
        '1':[1000, 10000, 50000, 100000, 1000000],
        '2':{
            gain:9999999, //赚
            lose:-9999998, //输
            total:1, //总计
        },
        selectValue:100, //当前选择的按钮数值
    },
    //绑定数据句柄
    bindCallF:function(name, handle){
        if(!name)return null;
        var data = HundredData[name];
        handle(data); //初始化显示
        Object.defineProperty(HundredData, name, {
            get: function(){
                return data;
            },
            set: function(data){
                handle(data);
            }
        });
        HundredData._handleList[name] = function(cb){
            HundredData[name] = cb(data); //调用set方法
        };
        return HundredData._handleList[name];
    },
    //获得对应的数据句柄
    getDataHandle:function(name){
        var handle = HundredData._handleList[name];
        if(!handle){
            throw new error("该数据没有注册:" + name);
        }
        return HundredData._handleList[name];
    },

    _findData:function(name){
        var arr = name.split(':');
        var data = HundredData;
        if(arr.length == 1)return HundredData; //只有一层
        var count = 0;
        while(count < arr.length){
            data = HundredData[arr[count]];
            count ++;
        }
        return data; //2层以上,返回目标上层数据
    },

};

// HundredData

module.exports = HundredData;