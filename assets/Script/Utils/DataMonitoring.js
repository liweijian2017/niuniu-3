var DataMonitoring = {};

//处理链条对象
var HandleChain = function(handle){
    this.handles = [handle]; //数组存储
    //处理数据
    this.handleData = function(data){
        for(var i=0; i<this.handles.length; i++){
            data = this.handles[i](data);
        }
        return data;
    };
    //添加handle函数
    this.addHandle = function(handle){
        this.handles.push(handle);
    };
    return this;
};
DataMonitoring.extend = function(bindData){
    bindData._handleChainMap = {}; //对应path的处理链条地图
    bindData._handleList = {}; //对应handeName的数据修改句柄
    bindData.bindCallF = function(handleName, path, handle){
        if(arguments.length == 2) {
            path = arguments[0];
            handle = arguments[1];
            handleName = path;
        }
        
        var name = bindData._getDataName(path);//属性name
        var pData = bindData._findData(path);//上层数据
        var data = pData[name];
        
        //存储观察函数
        if(bindData._handleList[handleName]){
            handleName = handleName+ '-' + new Date().getTime();
        }
        bindData._handleList[handleName] = function(cb){
            pData[name] = cb(data); //调用set方法
        };
        console.debug("HANDLE_NAME = "+handleName);
        
        //0.根据path查找处理链条,处理链条存储在bindData中,如果没找到创建一条,加入第一个handle
        if(!bindData._handleChainMap[path]){
            //1.把handle加入一个处理链条
            bindData._handleChainMap[path] = new HandleChain(handle);
        }else {
            bindData._handleChainMap[path].addHandle(handle);
        }
        //2.使用处理链条来处理data
        bindData._handleChainMap[path].handleData(data);
        Object.defineProperty(pData, name, {
            get: function(){
                return data;
            },
            set: function(newData){
                //每一次都得找到对应属性的链条
                data = bindData._handleChainMap[path].handleData(newData);
            }
        });
        return bindData._handleList[path];      
    }
    //获得对应的数据句柄
    bindData.getHandle = function(handleName){
        var handle = bindData._handleList[handleName];
        if(!handle){
            throw new Error("该数据没有注册:" + handleName);
        }
        return handle;
    }
    bindData._findData = function(path){
        var arr = path.split(':');
        var data = bindData;
        if(arr.length == 1)return bindData; //只有一层
        var count = 0;
        while(count < arr.length-1){
            data = data[arr[count]];
            count ++;
        }
        return data; //2层以上,返回目标上层数据
    }
    bindData._getDataName = function(path){
        var arr = path.split(':');
        return arr[arr.length-1];
    }
    return bindData;
}


module.exports = DataMonitoring;