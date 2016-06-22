var Http = require('Http');
var CoursePackData = {
    'JOIN': {
        "blind": 50,
        "minBuyIn": 1500,
        "roomName": "斗牛1号房",
        "roomType": 1,
        "seatChips": 0,
        "gameStatus": 0,
        "seatNum": 5,
        "roundCount": 0,
        "dealerSeatId": -1,
        "venue": 480,
        "xs": 3,
        "score": 168,
        "playerList": [{
            "seatId": 0,
            "uid": 15,
            "seatChips": 996831,
            "point": 645500,
            "vip": 0,
            "nick": "青蛙",
            "gender": "f",
            "img": "http://192.168.1.100/assets/photo/n15.jpg",
            "win": 0,
            "lose": 0,
            "extInfo": "",
            "state": 0,
            "betX": 0
        }],
        "handCardFlag": 0,
        "cmd": 16641
    },
    'SITDOWM': {
        "seatId": 1,
        "uid": Http.userData.uid,
        "seatChips": Http.userData.point,
        "point": Http.userData.score,
        "vip": 0,
        "nick": Http.userData.name,
        "gender": "f",
        "img": Http.userData.image,
        "win": 0,
        "lose": 0,
        "extInfo": "",
        "cmd": 16901
    },
    'GAMESTART': {
        "roundCount": 1,
        "timeout": 10,
        "playerList": [{
            "seatId": 0,
            "uid": 15,
            "seatChips": 996831
        }, {
            "seatId": 1,
            "uid": 27,
            "seatChips": 10000
        }],
        "handCard1": 259,
        "handCard2": 260,
        "handCard3": 514,
        "handCard4": 1029,
        "seatChips": 796040,
        "cmd": 16903
    },
    'BANKER': {
        "gameStatus": 2,
        "timeout": 6,
        "bankerSeatId": 1,
        "cmd": 16908
    },
    'PLAYERBEI': {
        "seatId": 0,
        "state": 2,
        "betX": 2,
        "cmd": 16904
    },
    'PLAYERBEI2': {
        "seatId": 0,
        "state": 3,
        "betX": 25,
        "cmd": 16904
    },
    'FIVEPOKER': {
        "handCard5": 772,
        "cardType": 8,
        "cardTypeX": 1,
        "cmd": 16905
    },
    'OK': {
        "seatId": 0,
        "state": 4,
        "betX": 15,
        "cmd": 16904
    },
    'GAMEOVER': {
        "seatChangeList": [{
            "seatId": 0,
            "seatChips": -10000,
            "point": 0
        }, {
            "seatId": 1,
            "seatChips": 10000,
            "point": 0
        }],
        "playerCardsList": [{
            "seatId": 0,
            "handCard1": 773,
            "handCard2": 263,
            "handCard3": 771,
            "handCard4": 777,
            "handCard5": 775,
            "cardType": 0,
            "cardTypeX": 1
        }, {
            "seatId": 1,
            "handCard1": 259,
            "handCard2": 260,
            "handCard3": 514,
            "handCard4": 1029,
            "handCard5": 772,
            "cardType": 8,
            "cardTypeX": 1
        }],
        "cmd": 16910
    }
};
module.exports = CoursePackData;