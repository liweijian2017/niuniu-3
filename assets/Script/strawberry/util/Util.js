var Util = {
    /*
     * formatMoney(s,type)
     * 功能：金额按千位逗号分割
     * 参数：s，需要格式化的金额数值.
     * 参数：type,判断格式化后的金额是否需要小数位，默认没有小数
     * 返回：返回格式化后的数值字符串.
     */
    formatMoney:function(s, type) {
        if(typeof(type) == 'undefined')
            type = 0;
    	if (/[^0-9\.]/.test(s))
    		return "0";
    	if (s == null || s == "")
    		return "0";
    	s = s.toString().replace(/^(\d*)$/, "$1.");
    	s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
    	s = s.replace(".", ",");
    	var re = /(\d)(\d{3},)/;
    	while (re.test(s))
    		s = s.replace(re, "$1,$2");
    	s = s.replace(/,(\d\d)$/, ".$1");
    	if (type == 0) {// 不带小数位(默认是有小数位)
    		var a = s.split(".");
    		if (a[1] == "00") {
    			s = a[0];
    		}
    	}
    	return s;
    },

    /*
      12000 = 1.20 w 
    */
    bigNumToStr:function(num){
        var str = num;
        if(num >= 100000){
            str = (num/10000).toFixed(2) + "万";
        }else {
            str = this.formatMoney(num);
        }
        return str;
    },
    //12000 = 1.2w
    bigNumToStr2:function(num){
        var str = num;
        if(num >= 10000){
            str = (num/10000) + "万";
        }else if(num <= -10000){
            str = (num/10000) + "万";
        }
        return str;
    },


    //格式化名字
    formatName:function(str, num){
        var len = 0;
        var newStr = str;
        var count = 0;
        for (var i = 0; i < str.length; i++) { 
            if (str[i].match(/[^x00-xff]/ig) != null){ //全角 
                len += 2;
                count++; //记录中文字符个数
            } else {
                len += 1;
            }
            if (len >= num) { 
                newStr = str.substring(0, num - count) + "...";
                break;
            }
        }
        return newStr;
    }
};

module.exports = Util;