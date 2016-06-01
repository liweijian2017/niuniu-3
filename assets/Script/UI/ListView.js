cc.Class({
    extends: cc.Component,

    properties: {
        itemTemplate: { // 拿到Item的模板
            default: null,
            type: cc.Node
        },
        scrollView: { //拿到布局
        	default: null,
        	type: cc.ScrollView
        },
        spawnCount: 0, // 复用item的个数
        totalCount: 0, // 总数量
        spacing: 0, // 间距
        bufferZone: 0, // 复用空间(和view组件高度差不多)
    },

    // use this for initialization
    onLoad: function () {
    	this.content = this.scrollView.content;
        this.items = []; // array to store spawned items
        this.updateTimer = 0;
        this.updateInterval = 0.2;//控制每秒刷新时间
        this.lastContentPosY = 0; // use this variable to detect if we are scrolling up or down
    },

    initialize: function () {
        this.content.height = this.totalCount * (this.itemTemplate.height + this.spacing) + this.spacing; // get total content height
    	for (let i = 0; i < this.spawnCount; ++i) { // spawn items, we only need to do this once
    		let item = cc.instantiate(this.itemTemplate);
    		this.content.addChild(item);
    		item.setPosition(0, -item.height * (0.5 + i) - this.spacing * (i + 1));
    		item.getComponent('ListView_Item').updateItem(i, i);
            this.items.push(item);
    	}
    },

    initializeForData:function(list){
        this.items = [];
        this.content.height = 0;
        this.content.removeAllChildren();

        this.content.height = list.length * (this.itemTemplate.height + this.spacing) + this.spacing; // get total content height
        for (let i = 0; i < this.spawnCount; ++i) { // spawn items, we only need to do this once
            if(i >= list.length)return;
            let item = cc.instantiate(this.itemTemplate);
            item.getComponent('ListView_Item').setDataSource(list); //设置数据源
            this.content.addChild(item);
            item.setPosition(0, -item.height * (0.5 + i) - this.spacing * (i + 1));
            item.getComponent('ListView_Item').updateItem(i, i);
            //解析数据
            this.items.push(item);
        };
    },


    getPositionInView: function (item) { // get item position in scrollview's node space
        let worldPos = item.parent.convertToWorldSpaceAR(item.position);
        let viewPos = this.scrollView.node.convertToNodeSpaceAR(worldPos);
        return viewPos;
    },

    update: function(dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) return; //防止刷新过快
        this.updateTimer = 0;
        let items = this.items;
        let buffer = this.bufferZone;
        let isDown = this.scrollView.content.y < this.lastContentPosY; // scrolling direction 是否到底
        let offset = (this.itemTemplate.height + this.spacing) * items.length; //偏移量
        for (let i = 0; i < items.length; ++i) {
            let viewPos = this.getPositionInView(items[i]);
            if (isDown) {
                // if away from buffer zone and not reaching top of content
                if (viewPos.y < -buffer && items[i].y + offset < 0) {
                    items[i].setPositionY(items[i].y + offset );
                    let item = items[i].getComponent('ListView_Item');
                    let itemId = item.itemID - items.length; // update item id
                    item.updateItem(i, itemId);
                }
            } else {
                // if away from buffer zone and not reaching bottom of content
                if (viewPos.y > buffer && items[i].y - offset > -this.content.height) {
                    items[i].setPositionY(items[i].y - offset );
                    let item = items[i].getComponent('ListView_Item');
                    let itemId = item.itemID + items.length;
                    item.updateItem(i, itemId);
                }
            }
        }
        // update lastContentPosY
        this.lastContentPosY = this.scrollView.content.y;
    }
});