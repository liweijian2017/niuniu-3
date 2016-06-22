//游戏数据
var GameData = {
	SIGNAL_STRENGTH: 0,   //Server信号
	IN_HALL: 0, // 0 主界面 1选房界面
	IN_GAME: 0,
	// IS_NEW_USER:0,
	BROADCAST_NEWS:[], //喇叭消息列表
};
module.exports = require('DataProxy').extend(GameData);