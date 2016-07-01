var Util = {
  /*
   * formatMoney(s,type)
   * 功能：金额按千位逗号分割
   * 参数：s，需要格式化的金额数值.
   * 参数：type,判断格式化后的金额是否需要小数位，默认没有小数
   * 返回：返回格式化后的数值字符串.
   */
  formatMoney: function(s, type) {
    if (typeof(type) == 'undefined')
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
    if (type == 0) { // 不带小数位(默认是有小数位)
      var a = s.split(".");
      if (a[1] == "00") {
        s = a[0];
      }
    }
    return s;
  },

  /*
    12000 = 1.20 w 9,999
  */
  bigNumToStr: function(num) {
    var str = num;
    if (num >= 100000000) {
      str = (num / 100000000).toFixed(3) + "亿";
    } else if (num >= 100000) {
      str = (num / 10000).toFixed(2) + "万";
    } else {
      str = this.formatMoney(num);
    }
    return str;
  },
  //12000 = 1.2w
  bigNumToStr2: function(num) {
    var str = num;
    if (num >= 10000) {
      str = (num / 10000) + "万";
    } else if (num <= -10000) {
      str = (num / 10000) + "万";
    }
    return str;
  },


  //格式化名字
  formatName: function(str, num) {
    var len = 0;
    var newStr = str;
    var count = 0;
    for (var i = 0; i < str.length; i++) {
      if (str[i].match(/[^x00-xff]/ig) != null) { //全角 
        len += 2;
        count++; //记录中文字符个数
      } else {
        len += 1;
      }
      if (len > num) { //超出长度
        newStr = str.substring(0, num - count+1) + "...";
        break;
      }else if(len == num){
        newStr = str.substring(0, num - count);
      }
    }
    return newStr;
  },
  //指定区域获得随机点
  randomPos:function(width, height){
      var pos = {x:0, y:0};
      var puls = Math.random() > 0.5 ? 1 : -1;
      var puls2 = Math.random() > 0.5 ? 1 : -1;
      pos.x = Math.random()*width/2 * puls;
      pos.y = Math.random()*height/2 * puls2;
      return pos;
  },

  base64_decode: function(encodedData) {
    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    var o1
    var o2
    var o3
    var h1
    var h2
    var h3
    var h4
    var bits
    var i = 0
    var ac = 0
    var dec = ''
    var tmpArr = []

    if (!encodedData) {
      return encodedData
    }

    encodedData += ''

    do {
      // unpack four hexets into three octets using index points in b64
      h1 = b64.indexOf(encodedData.charAt(i++))
      h2 = b64.indexOf(encodedData.charAt(i++))
      h3 = b64.indexOf(encodedData.charAt(i++))
      h4 = b64.indexOf(encodedData.charAt(i++))

      bits = h1 << 18 | h2 << 12 | h3 << 6 | h4

      o1 = bits >> 16 & 0xff
      o2 = bits >> 8 & 0xff
      o3 = bits & 0xff

      if (h3 === 64) {
        tmpArr[ac++] = String.fromCharCode(o1)
      } else if (h4 === 64) {
        tmpArr[ac++] = String.fromCharCode(o1, o2)
      } else {
        tmpArr[ac++] = String.fromCharCode(o1, o2, o3)
      }
    } while (i < encodedData.length)

    dec = tmpArr.join('')

    return decodeURIComponent(escape(dec.replace(/\0+$/, '')))
  },

  base64_encode: function(data) {
    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
      ac = 0,
      enc = '',
      tmp_arr = []

    if (!data) {
      return data
    }

    data = unescape(encodeURIComponent(data))

    do {
      // pack three octets into four hexets
      o1 = data.charCodeAt(i++)
      o2 = data.charCodeAt(i++)
      o3 = data.charCodeAt(i++)

      bits = o1 << 16 | o2 << 8 | o3

      h1 = bits >> 18 & 0x3f
      h2 = bits >> 12 & 0x3f
      h3 = bits >> 6 & 0x3f
      h4 = bits & 0x3f

      // use hexets to index into b64, and append result to encoded string
      tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4)
    } while (i < data.length)

    enc = tmp_arr.join('')

    var r = data.length % 3

    return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3)
  }
};

module.exports = Util;