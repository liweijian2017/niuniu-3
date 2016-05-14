/*
图片加载
@example
~~~~
var url = ImageLoader.load('http://game.manyouwei.cn/assets/photo/n544.jpg', function(ret, node){
    if(ret)                   
        node.parent = cc.director.getScene().getChildByName('Canvas');    
});
ImageLoader.cancel(url);
~~~~
*/
var ImageLoader = {};
ImageLoader.load = function(url, callback){
	cc.loader.load(url, function (err, texture) {     
       if(!err){
	        var node = new cc.Node();
	        var sprite = node.addComponent(cc.Sprite);
	        sprite.spriteFrame = new cc.SpriteFrame(texture);
	        callback(true, node);
       }
       else
       {
       		callback(false, null);
       }
    });
	return url;
};

ImageLoader.cancel = function(url){
	cc.loader.release(url);
};

module.exports = ImageLoader;
