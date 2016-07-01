//百人场数据
var DataHandle = function(){

};
var HundredData = { //百人场数据
    _handleList:[], 
    'banker':{ //庄家信息
        name:'庄家',
        point:'10000',
        img:'',
    },
    'seats':{ //座位信息
        '1':{
            isHold:false,
            name:'1号朋友',
            point:100,
            img:'',
            uid:0,
        },
        '2':{
            isHold:false,
            name:'2号兄弟',
            point:220,
            img:'',
            uid:0,
        },
        '3':{
            isHold:false,
            name:'3号SB',
            point:909910,
            img:'',
            uid:0,
        },
        '4':{
            isHold:false,
            name:'4号大神',
            point:128843,
            img:'',
            uid:0,
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
    bindCallF:function(path, handle){
        if(!path)return null;
        var name = HundredData._getDataName(path);
        var pData = HundredData._findData(path);//上层数据
        var data = pData[name];
        handle(data);
        Object.defineProperty(pData, name, {
            get: function(){
                return data;
            },
            set: function(newData){
                data = handle(newData);
            }
        });
        HundredData._handleList[name] = function(cb){
            pData[name] = cb(data); //调用set方法
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
    _findData:function(path){
        var arr = path.split(':');
        var data = HundredData;
        if(arr.length == 1)return HundredData; //只有一层
        var count = 0;
        while(count < arr.length-1){
            data = data[arr[count]];
            count ++;
        }
        return data; //2层以上,返回目标上层数据
    },
    _getDataName:function(path){
        var arr = path.split(':');
        return arr[arr.length-1];
    },
};
module.exports = HundredData;