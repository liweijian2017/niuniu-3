/**
 egret 提取的WebSocket、Event、EventDispatcher、 ByteArray 相关代码
*/
var egret = {};
var __define = function (o, p, g, s) { Object.defineProperty(o, p, { configurable: true, enumerable: true, get: g, set: s }); };
var __extends = function (d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    __.prototype = b.prototype;
    d.prototype = new __();
};

egret.__define = __define;
egret.__extends = __extends;
 
// Event
var egret;
(function (egret) {
    /**
     * @language zh_CN
     * Event 类作为创建事件实例的基类，当发生事件时，Event 实例将作为参数传递给事件侦听器。Event 类的属性包含有关事件的基本信息，例如事件
     * 的类型或者是否可以取消事件的默认行为。对于许多事件（如由 Event 类常量表示的事件），此基本信息就足够了。但其他事件可能需要更详细的信息。
     * 例如，与触摸关联的事件需要包括有关触摸事件的位置信息。您可以通过扩展 Event 类（TouchEvent 类执行的操作）将此类其他信息传递给事件侦听器。
     * Egret API 为需要其他信息的常见事件定义多个 Event 子类。与每个 Event 子类关联的事件将在每个类的文档中加以介绍。Event 类的方法可以在
     * 事件侦听器函数中使用以影响事件对象的行为。某些事件有关联的默认行为，通过调用 preventDefault() 方法，您的事件侦听器可以取消此行为。
     * 可以通过调用 stopPropagation() 或 stopImmediatePropagation() 方法，将当前事件侦听器作为处理事件的最后一个事件侦听器。
     * @see egret.EventDispatcher
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/Event.ts
     */
    var Event = (function () {      

        /**
         * @language zh_CN
         * 创建一个作为参数传递给事件侦听器的 Event 对象。
         * @param type  事件的类型，可以作为 Event.type 访问。
         * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @param data 与此事件对象关联的可选数据。
         * @version Egret 2.4
         * @platform Web,Native
         */
        function Event(type, bubbles, cancelable, data) {
            /**
             * @private
             */
            this.$eventPhase = 2;
            /**
             * @private
             */
            this.$currentTarget = null;
            /**
             * @private
             */
            this.$target = null;
            /**
             * @private
             */
            this.$isDefaultPrevented = false;
            /**
             * @private
             */
            this.$isPropagationStopped = false;
            /**
             * @private
             */
            this.$isPropagationImmediateStopped = false;
            this.$type = type;
            this.$bubbles = !!bubbles;
            this.$cancelable = !!cancelable;
            this.data = data;
        }
        var d = __define,c=Event,p=c.prototype;
        d(p, "type"

            /**
             * @language zh_CN
             * 事件的类型。类型区分大小写。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$type;
            }
        );
        d(p, "bubbles"

            /**
             * @language zh_CN
             * 表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$bubbles;
            }
        );
        d(p, "cancelable"

            /**
             * @language zh_CN
             * 表示是否可以阻止与事件相关联的行为。如果可以取消该行为，则此值为 true；否则为 false。
             * @see #preventDefault()
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$cancelable;
            }
        );
        d(p, "eventPhase"

            /**
             * @language zh_CN
             * 事件流中的当前阶段。此属性可以包含以下数值：
             * 捕获阶段 (EventPhase.CAPTURING_PHASE)。
             * 目标阶段 (EventPhase.AT_TARGET)。
             * 冒泡阶段 (EventPhase.BUBBLING_PHASE)。
             * @see egret.EventPhase
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$eventPhase;
            }
        );
        d(p, "currentTarget"

            /**
             * @language zh_CN
             * 当前正在使用某个事件侦听器处理 Event 对象的对象。例如，如果用户单击“确定”按钮，
             * 则当前目标可以是包含该按钮的节点，也可以是它的已为该事件注册了事件侦听器的始祖之一。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$currentTarget;
            }
        );
        d(p, "target"

            /**
             * @language zh_CN
             * 事件目标。此属性包含目标节点。例如，如果用户单击“确定”按钮，则目标节点就是包含该按钮的显示列表节点。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$target;
            }
        );
        p.$setTarget = function (target) {
            this.$target = target;
            return true;
        };

        /**
         * @language zh_CN
         * 检查是否已对事件调用 preventDefault() 方法。
         * @returns 如果已调用 preventDefault() 方法，则返回 true；否则返回 false。
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.isDefaultPrevented = function () {
            return this.$isDefaultPrevented;
        };

        /**
         * @language zh_CN
         * 如果可以取消事件的默认行为，则取消该行为。
         * 许多事件都有默认执行的关联行为。例如，如果用户在文本字段中键入一个字符，则默认行为就是在文本字段中显示该字符。
         * 由于可以取消 TextEvent.TEXT_INPUT 事件的默认行为，因此您可以使用 preventDefault() 方法来防止显示该字符。
         * 您可以使用 Event.cancelable 属性来检查是否可以防止与特定事件关联的默认行为。如果 Event.cancelable 的值为 true，
         * 则可以使用 preventDefault() 来取消事件；否则，preventDefault() 无效。
         * @see #cancelable
         * @see #isDefaultPrevented
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.preventDefault = function () {
            if (this.$cancelable)
                this.$isDefaultPrevented = true;
        };

        /**
         * @language zh_CN
         * 防止对事件流中当前节点的后续节点中的所有事件侦听器进行处理。此方法不会影响当前节点 currentTarget 中的任何事件侦听器。
         * 相比之下，stopImmediatePropagation() 方法可以防止对当前节点中和后续节点中的事件侦听器进行处理。
         * 对此方法的其它调用没有任何效果。可以在事件流的任何阶段中调用此方法。<br/>
         * 注意：此方法不会取消与此事件相关联的行为；有关此功能的信息，请参阅 preventDefault()。
         * @see #stopImmediatePropagation()
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.stopPropagation = function () {
            if (this.$bubbles)
                this.$isPropagationStopped = true;
        };
        /**
         * @language zh_CN
         * 防止对事件流中当前节点中和所有后续节点中的事件侦听器进行处理。此方法会立即生效，并且会影响当前节点中的事件侦听器。
         * 相比之下，在当前节点中的所有事件侦听器都完成处理之前，stopPropagation() 方法不会生效。<br/>
         * 注意：此方法不会取消与此事件相关联的行为；有关此功能的信息，请参阅 preventDefault()。
         * @see #stopPropagation()
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.stopImmediatePropagation = function () {
            if (this.$bubbles)
                this.$isPropagationImmediateStopped = true;
        };
        /**
         * @language zh_CN
         * 当事件实例传递给Event.release()静态方法时，实例上的clean()方法将会被自动调用。
         * 若此自定义事件的实例设计为可以循环复用的，为了避免引起内存泄露，自定义事件需要覆盖此方法来确保实例被缓存前断开对外部对象的一切引用。
         * @see egret.Event.create()
         * @see egret.Event.release()
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.clean = function () {
            this.data = this.$currentTarget = null;
            this.$setTarget(null);
        };
        /**
         * @language zh_CN
         * 使用指定的 EventDispatcher 对象来抛出 Event 事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @param target {egret.IEventDispatcher} 派发事件目标
         * @param type {string} 事件类型
         * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param data {any} 事件data
         * @method egret.Event.dispatchEvent
         * @version Egret 2.4
         * @platform Web,Native
         */
        Event.dispatchEvent = function (target, type, bubbles, data) {
            if (bubbles === void 0) { bubbles = false; }
            var event = Event.create(Event, type, bubbles);
            var props = Event._getPropertyData(Event);
            if (data != undefined) {
                props.data = data;
            }
            var result = target.dispatchEvent(event);
            Event.release(event);
            return result;
        };
        /**
         * @private
         *
         * @param EventClass
         * @returns
         */
        Event._getPropertyData = function (EventClass) {
            var props = EventClass._props;
            if (!props)
                props = EventClass._props = {};
            return props;
        };
        /**
         * @language zh_CN
         * 从对象池中取出或创建一个新的事件实例。我们建议您尽可能使用Event.create()和Event.release() 这一对方法来创建和释放事件对象，
         * 这一对方法会将事件实例在内部缓存下来供下次循环使用，减少对象的创建次数,从而获得更高的代码运行性能。<br/>
         * 注意：若使用此方法来创建自定义事件的实例，自定义的构造函数参数列表必须跟Event类一致。
         * @param EventClass Event类名。
         * @param type  事件的类型，可以作为 Event.type 访问。
         * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @example
         * <pre>
         *    var event = Event.create(Event,type, bubbles);
         *    event.data = data;  //可选，若指定义事件上需要附加其他参数，可以在获取实例后在此处设置。
         *    this.dispatchEvent(event);
         *    Event.release(event);
         * </pre>
         * @see #clean()
         * @version Egret 2.4
         * @platform Web,Native
         */
        Event.create = function (EventClass, type, bubbles, cancelable) {
            var eventPool = EventClass.eventPool;
            if (!eventPool) {
                eventPool = EventClass.eventPool = [];
            }
            if (eventPool.length) {
                var event = eventPool.pop();
                event.$type = type;
                event.$bubbles = !!bubbles;
                event.$cancelable = !!cancelable;
                event.$isDefaultPrevented = false;
                event.$isPropagationStopped = false;
                event.$isPropagationImmediateStopped = false;
                event.$eventPhase = 2 /* AT_TARGET */;
                return event;
            }
            return new EventClass(type, bubbles, cancelable);
        };
        /**
         * @language zh_CN
         * 释放一个事件对象，并缓存到对象池。我们建议您尽可能使用Event.create()和Event.release() 这一对方法来创建和释放事件对象，
         * 这一对方法会将事件实例在内部缓存下来供下次循环使用，减少对象的创建次数,从而获得更高的代码运行性能。<br/>
         * 注意：此方法只能传入由Event.create()创建的事件实例，传入非法对象实例可能会导致报错。
         * @example
         * <pre>
         *    var event = Event.create(Event,type, bubbles);
         *    event.data = data;   //可选，若指定义事件上需要附加其他参数，可以在获取实例后在此处设置。
         *    this.dispatchEvent(event);
         *    Event.release(event);
         * </pre>
         * @see #clean()
         * @version Egret 2.4
         * @platform Web,Native
         */
        Event.release = function (event) {
            event.clean();
            var EventClass = Object.getPrototypeOf(event).constructor;
            EventClass.eventPool.push(event);
        };      
       
        return Event;
    }());
    egret.Event = Event;   
})(egret || (egret = {}));


// EventDispatcher
var egret;
(function (egret) {
    var ONCE_EVENT_LIST = [];
    /**
     * @language zh_CN
     * EventDispatcher 是 Egret 的事件派发器类，负责进行事件的发送和侦听。
     * 事件目标是事件如何通过显示列表层次结构这一问题的焦点。当发生鼠标单击、触摸或按键等事件时，
     * 框架会将事件对象调度到从显示列表根开始的事件流中。然后该事件对象在显示列表中前进，直到到达事件目标，
     * 然后从这一点开始其在显示列表中的回程。在概念上，到事件目标的此往返行程被划分为三个阶段：
     * 捕获阶段包括从根到事件目标节点之前的最后一个节点的行程，目标阶段仅包括事件目标节点，冒泡阶段包括回程上遇到的任何后续节点到显示列表的根。
     * 通常，使用户定义的类能够调度事件的最简单方法是扩展 EventDispatcher。如果无法扩展（即，如果该类已经扩展了另一个类），则可以实现
     * IEventDispatcher 接口，创建 EventDispatcher 成员，并编写一些简单的映射，将调用连接到聚合的 EventDispatcher 中。
     * @see egret.IEventDispatcher
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/EventDispatcher.ts
     */
    var EventDispatcher = (function () {
        /**
         * @language zh_CN
         * 创建一个 EventDispatcher 类的实例
         * @param target 此 EventDispatcher 所抛出事件对象的 target 指向。此参数主要用于一个实现了 IEventDispatcher 接口的自定义类，
         * 以便抛出的事件对象的 target 属性可以指向自定义类自身。请勿在直接继承 EventDispatcher 的情况下使用此参数。
         * @version Egret 2.4
         * @platform Web,Native
         */
        function EventDispatcher(target) {
            if (target === void 0) { target = null; }
            this.$EventDispatcher = {
                0: target ? target : this,
                1: {},
                2: {},
                3: 0
            };
        }
        var d = __define,c=EventDispatcher,p=c.prototype;
        /**
         * @private
         *
         * @param useCapture
         */
        p.$getEventMap = function (useCapture) {
            var values = this.$EventDispatcher;
            var eventMap = useCapture ? values[2 /* captureEventsMap */] : values[1 /* eventsMap */];
            return eventMap;
        };
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.addEventListener = function (type, listener, thisObject, useCapture, priority) {
            this.$addListener(type, listener, thisObject, useCapture, priority);
        };
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.once = function (type, listener, thisObject, useCapture, priority) {
            this.$addListener(type, listener, thisObject, useCapture, priority, true);
        };
        /**
         * @private
         */
        p.$addListener = function (type, listener, thisObject, useCapture, priority, dispatchOnce) {
            if (!listener) {
                egret.$error(1003, "listener");
            }
            var values = this.$EventDispatcher;
            var eventMap = useCapture ? values[2 /* captureEventsMap */] : values[1 /* eventsMap */];
            var list = eventMap[type];
            if (!list) {
                list = eventMap[type] = [];
            }
            else if (values[3 /* notifyLevel */] !== 0) {
                eventMap[type] = list = list.concat();
            }
            this.$insertEventBin(list, type, listener, thisObject, useCapture, priority, dispatchOnce);
        };
        p.$insertEventBin = function (list, type, listener, thisObject, useCapture, priority, dispatchOnce) {
            priority = +priority | 0;
            var insertIndex = -1;
            var length = list.length;
            for (var i = 0; i < length; i++) {
                var bin = list[i];
                if (bin.listener == listener && bin.thisObject == thisObject && bin.target == this) {
                    return false;
                }
                if (insertIndex == -1 && bin.priority < priority) {
                    insertIndex = i;
                }
            }
            var eventBin = {
                type: type, listener: listener, thisObject: thisObject, priority: priority,
                target: this, useCapture: useCapture, dispatchOnce: !!dispatchOnce
            };
            if (insertIndex !== -1) {
                list.splice(insertIndex, 0, eventBin);
            }
            else {
                list.push(eventBin);
            }
            return true;
        };
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.removeEventListener = function (type, listener, thisObject, useCapture) {
            var values = this.$EventDispatcher;
            var eventMap = useCapture ? values[2 /* captureEventsMap */] : values[1 /* eventsMap */];
            var list = eventMap[type];
            if (!list) {
                return;
            }
            if (values[3 /* notifyLevel */] !== 0) {
                eventMap[type] = list = list.concat();
            }
            this.$removeEventBin(list, listener, thisObject);
            if (list.length == 0) {
                eventMap[type] = null;
            }
        };

        //ipalmplay 
        //移除所有事件监听
        p.removeAllEventListeners = function(){            
            this.$EventDispatcher[1] = {};
            this.$EventDispatcher[2] = {};
        };
        //end ipalmplay

        p.$removeEventBin = function (list, listener, thisObject) {
            var length = list.length;
            for (var i = 0; i < length; i++) {
                var bin = list[i];
                if (bin.listener == listener && bin.thisObject == thisObject && bin.target == this) {
                    list.splice(i, 1);
                    return true;
                }
            }
            return false;
        };
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.hasEventListener = function (type) {
            var values = this.$EventDispatcher;
            return !!(values[1 /* eventsMap */][type] || values[2 /* captureEventsMap */][type]);
        };
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.willTrigger = function (type) {
            return this.hasEventListener(type);
        };
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.dispatchEvent = function (event) {
            event.$currentTarget = this.$EventDispatcher[0 /* eventTarget */];
            event.$setTarget(event.$currentTarget);
            return this.$notifyListener(event, false);
        };
        /**
         * @private
         */
        p.$notifyListener = function (event, capturePhase) {
            var values = this.$EventDispatcher;
            var eventMap = capturePhase ? values[2 /* captureEventsMap */] : values[1 /* eventsMap */];
            var list = eventMap[event.$type];
            if (!list) {
                return true;
            }
            var length = list.length;
            if (length == 0) {
                return true;
            }
            var onceList = ONCE_EVENT_LIST;
            //做个标记，防止外部修改原始数组导致遍历错误。这里不直接调用list.concat()因为dispatch()方法调用通常比on()等方法频繁。
            values[3 /* notifyLevel */]++;
            for (var i = 0; i < length; i++) {
                var eventBin = list[i];
                eventBin.listener.call(eventBin.thisObject, event);
                if (eventBin.dispatchOnce) {
                    onceList.push(eventBin);
                }
                if (event.$isPropagationImmediateStopped) {
                    break;
                }
            }
            values[3 /* notifyLevel */]--;
            while (onceList.length) {
                eventBin = onceList.pop();
                eventBin.target.removeEventListener(eventBin.type, eventBin.listener, eventBin.thisObject, eventBin.useCapture);
            }
            return !event.$isDefaultPrevented;
        };
        /**
         * @language zh_CN
         * 派发一个指定参数的事件。
         * @param type {string} 事件类型
         * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param data {any} 事件data
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.dispatchEventWith = function (type, bubbles, data) {
            if (bubbles || this.hasEventListener(type)) {
                var event = egret.Event.create(egret.Event, type, bubbles);
                event.data = data;
                var result = this.dispatchEvent(event);
                egret.Event.release(event);
                return result;
            }
            return true;
        };
        return EventDispatcher;
    }());
    egret.EventDispatcher = EventDispatcher;
})(egret || (egret = {}));


//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language zh_CN
     * Endian 类中包含一些值，它们表示用于表示多字节数字的字节顺序。
     * 字节顺序为 bigEndian（最高有效字节位于最前）或 littleEndian（最低有效字节位于最前）。
     * @version Egret 2.4
     * @platform Web,Native
     */
    var Endian = (function () {
        function Endian() {
        }
        var d = __define,c=Endian,p=c.prototype;
        /**
         * @language zh_CN
         * 表示多字节数字的最低有效字节位于字节序列的最前面。
         * 十六进制数字 0x12345678 包含 4 个字节（每个字节包含 2 个十六进制数字）。最高有效字节为 0x12。最低有效字节为 0x78。（对于等效的十进制数字 305419896，最高有效数字是 3，最低有效数字是 6）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        Endian.LITTLE_ENDIAN = "littleEndian";
        /**
         * @language en_US
         * Indicates the most significant byte of the multibyte number appears first in the sequence of bytes.
         * The hexadecimal number 0x12345678 has 4 bytes (2 hexadecimal digits per byte).  The most significant byte is 0x12. The least significant byte is 0x78. (For the equivalent decimal number, 305419896, the most significant digit is 3, and the least significant digit is 6).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示多字节数字的最高有效字节位于字节序列的最前面。
         * 十六进制数字 0x12345678 包含 4 个字节（每个字节包含 2 个十六进制数字）。最高有效字节为 0x12。最低有效字节为 0x78。（对于等效的十进制数字 305419896，最高有效数字是 3，最低有效数字是 6）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        Endian.BIG_ENDIAN = "bigEndian";
        return Endian;
    }());    
    egret.Endian = Endian;

    /**
     * @language en_US
     * The ByteArray class provides methods and attributes for optimized reading and writing as well as dealing with binary data.
     * Note: The ByteArray class is applied to the advanced developers who need to access data at the byte layer.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/ByteArray.ts
     */
    /**
     * @language zh_CN
     * ByteArray 类提供用于优化读取、写入以及处理二进制数据的方法和属性。
     * 注意：ByteArray 类适用于需要在字节层访问数据的高级开发人员。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/ByteArray.ts
     */
    var ByteArray = (function () {
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        function ByteArray(buffer) {
            /**
             * @private
             */
            this.BUFFER_EXT_SIZE = 0; //Buffer expansion size
            /**
             * @private
             */
            this.EOF_byte = -1;
            /**
             * @private
             */
            this.EOF_code_point = -1;
            this._setArrayBuffer(buffer || new ArrayBuffer(this.BUFFER_EXT_SIZE));
            this.endian = Endian.BIG_ENDIAN;
        }
        var d = __define,c=ByteArray,p=c.prototype;
        /**
         * @private
         * @param buffer
         */
        p._setArrayBuffer = function (buffer) {
            this.write_position = buffer.byteLength;
            this.data = new DataView(buffer);
            this._position = 0;
        };
        /**
         * @deprecated
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.setArrayBuffer = function (buffer) {
        };
        d(p, "buffer"
            ,function () {
                return this.data.buffer;
            }
            /**
             * @private
             */
            ,function (value) {
                this.data = new DataView(value);
            }
        );
        d(p, "dataView"
            /**
             * @private
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.data;
            }
            /**
             * @private
             */
            ,function (value) {
                this.data = value;
                this.write_position = value.byteLength;
            }
        );
        d(p, "bufferOffset"
            /**
             * @private
             */
            ,function () {
                return this.data.byteOffset;
            }
        );
        d(p, "position"
            /**
             * @language en_US
             * The current position of the file pointer (in bytes) to move or return to the ByteArray object. The next time you start reading reading method call in this position, or will start writing in this position next time call a write method.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 将文件指针的当前位置（以字节为单位）移动或返回到 ByteArray 对象中。下一次调用读取方法时将在此位置开始读取，或者下一次调用写入方法时将在此位置开始写入。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this._position;
            }
            ,function (value) {
                //if (this._position < value) {
                //    if (!this.validate(value - this._position)) {
                //        return;
                //    }
                //}
                this._position = value;
                this.write_position = value > this.write_position ? value : this.write_position;
            }
        );
        d(p, "length"
            /**
             * @language en_US
             * The length of the ByteArray object (in bytes).
                      * If the length is set to be larger than the current length, the right-side zero padding byte array.
                      * If the length is set smaller than the current length, the byte array is truncated.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * ByteArray 对象的长度（以字节为单位）。
             * 如果将长度设置为大于当前长度的值，则用零填充字节数组的右侧。
             * 如果将长度设置为小于当前长度的值，将会截断该字节数组。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.write_position;
            }
            ,function (value) {
                this.write_position = value;
                var tmp = new Uint8Array(new ArrayBuffer(value));
                var byteLength = this.data.buffer.byteLength;
                if (byteLength > value) {
                    this._position = value;
                }
                var length = Math.min(byteLength, value);
                tmp.set(new Uint8Array(this.data.buffer, 0, length));
                this.buffer = tmp.buffer;
            }
        );
        d(p, "bytesAvailable"
            /**
             * @language en_US
             * The number of bytes that can be read from the current position of the byte array to the end of the array data.
             * When you access a ByteArray object, the bytesAvailable property in conjunction with the read methods each use to make sure you are reading valid data.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 可从字节数组的当前位置到数组末尾读取的数据的字节数。
             * 每次访问 ByteArray 对象时，将 bytesAvailable 属性与读取方法结合使用，以确保读取有效的数据。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.data.byteLength - this._position;
            }
        );
        /**
         * @language en_US
         * Clears the contents of the byte array and resets the length and position properties to 0.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 清除字节数组的内容，并将 length 和 position 属性重置为 0。

         * @version Egret 2.4
         * @platform Web,Native
         */
        p.clear = function () {
            this._setArrayBuffer(new ArrayBuffer(this.BUFFER_EXT_SIZE));
        };
        /**
         * @language en_US
         * Read a Boolean value from the byte stream. Read a simple byte. If the byte is non-zero, it returns true; otherwise, it returns false.
         * @return If the byte is non-zero, it returns true; otherwise, it returns false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取布尔值。读取单个字节，如果字节非零，则返回 true，否则返回 false
         * @return 如果字节不为零，则返回 true，否则返回 false
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.readBoolean = function () {
            if (!this.validate(ByteArray.SIZE_OF_BOOLEAN))
                return null;
            return this.data.getUint8(this.position++) != 0;
        };
        /**
         * @language en_US
         * Read signed bytes from the byte stream.
         * @return An integer ranging from -128 to 127
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取带符号的字节
         * @return 介于 -128 和 127 之间的整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.readByte = function () {
            if (!this.validate(ByteArray.SIZE_OF_INT8))
                return null;
            return this.data.getInt8(this.position++);
        };
        /**
         * @language en_US
         * Read data byte number specified by the length parameter from the byte stream. Starting from the position specified by offset, read bytes into the ByteArray object specified by the bytes parameter, and write bytes into the target ByteArray
         * @param bytes ByteArray object that data is read into
         * @param offset Offset (position) in bytes. Read data should be written from this position
         * @param length Byte number to be read Default value 0 indicates reading all available data
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取 length 参数指定的数据字节数。从 offset 指定的位置开始，将字节读入 bytes 参数指定的 ByteArray 对象中，并将字节写入目标 ByteArray 中
         * @param bytes 要将数据读入的 ByteArray 对象
         * @param offset bytes 中的偏移（位置），应从该位置写入读取的数据
         * @param length 要读取的字节数。默认值 0 导致读取所有可用的数据
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.readBytes = function (bytes, offset, length) {
            if (offset === void 0) { offset = 0; }
            if (length === void 0) { length = 0; }
            if (length == 0) {
                length = this.bytesAvailable;
            }
            else if (!this.validate(length)) {
                return null;
            }
            if (bytes) {
                bytes.validateBuffer(offset + length);
            }
            else {
                bytes = new ByteArray(new ArrayBuffer(offset + length));
            }
            //This method is expensive
            for (var i = 0; i < length; i++) {
                bytes.data.setUint8(i + offset, this.data.getUint8(this.position++));
            }
        };
        /**
         * @language en_US
         * Read an IEEE 754 double-precision (64 bit) floating point number from the byte stream
         * @return Double-precision (64 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个 IEEE 754 双精度（64 位）浮点数
         * @return 双精度（64 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.readDouble = function () {
            if (!this.validate(ByteArray.SIZE_OF_FLOAT64))
                return null;
            var value = this.data.getFloat64(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_FLOAT64;
            return value;
        };
        /**
         * @language en_US
         * Read an IEEE 754 single-precision (32 bit) floating point number from the byte stream
         * @return Single-precision (32 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个 IEEE 754 单精度（32 位）浮点数
         * @return 单精度（32 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.readFloat = function () {
            if (!this.validate(ByteArray.SIZE_OF_FLOAT32))
                return null;
            var value = this.data.getFloat32(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_FLOAT32;
            return value;
        };
        /**
         * @language en_US
         * Read a 32-bit signed integer from the byte stream.
         * @return A 32-bit signed integer ranging from -2147483648 to 2147483647
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个带符号的 32 位整数
         * @return 介于 -2147483648 和 2147483647 之间的 32 位带符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.readInt = function () {
            if (!this.validate(ByteArray.SIZE_OF_INT32))
                return null;
            var value = this.data.getInt32(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_INT32;
            return value;
        };
        ///**
        // * 使用指定的字符集从字节流中读取指定长度的多字节字符串
        // * @param length 要从字节流中读取的字节数
        // * @param charSet 表示用于解释字节的字符集的字符串。可能的字符集字符串包括 "shift-jis"、"cn-gb"、"iso-8859-1"”等
        // * @return UTF-8 编码的字符串
        // * @method egret.ByteArray#readMultiByte
        // */
        //public readMultiByte(length:number, charSet?:string):string {
        //    if (!this.validate(length)) return null;
        //
        //    return "";
        //}
        /**
         * @language en_US
         * Read a 16-bit signed integer from the byte stream.
         * @return A 16-bit signed integer ranging from -32768 to 32767
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个带符号的 16 位整数
         * @return 介于 -32768 和 32767 之间的 16 位带符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.readShort = function () {
            if (!this.validate(ByteArray.SIZE_OF_INT16))
                return null;
            var value = this.data.getInt16(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_INT16;
            return value;
        };
        /**
         * @language en_US
         * Read unsigned bytes from the byte stream.
         * @return A 32-bit unsigned integer ranging from 0 to 255
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取无符号的字节
         * @return 介于 0 和 255 之间的 32 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.readUnsignedByte = function () {
            if (!this.validate(ByteArray.SIZE_OF_UINT8))
                return null;
            return this.data.getUint8(this.position++);
        };
        /**
         * @language en_US
         * Read a 32-bit unsigned integer from the byte stream.
         * @return A 32-bit unsigned integer ranging from 0 to 4294967295
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个无符号的 32 位整数
         * @return 介于 0 和 4294967295 之间的 32 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.readUnsignedInt = function () {
            if (!this.validate(ByteArray.SIZE_OF_UINT32))
                return null;
            var value = this.data.getUint32(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_UINT32;
            return value;
        };
        /**
         * @language en_US
         * Read a 16-bit unsigned integer from the byte stream.
         * @return A 16-bit unsigned integer ranging from 0 to 65535
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个无符号的 16 位整数
         * @return 介于 0 和 65535 之间的 16 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.readUnsignedShort = function () {
            if (!this.validate(ByteArray.SIZE_OF_UINT16))
                return null;
            var value = this.data.getUint16(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_UINT16;
            return value;
        };
        /**
         * @language en_US
         * Read a UTF-8 character string from the byte stream Assume that the prefix of the character string is a short unsigned integer (use byte to express length)
         * @return UTF-8 character string
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个 UTF-8 字符串。假定字符串的前缀是无符号的短整型（以字节表示长度）
         * @return UTF-8 编码的字符串
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.readUTF = function () {
            if (!this.validate(ByteArray.SIZE_OF_UINT16))
                return null;
            var length = this.data.getUint16(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_UINT16;
            if (length > 0) {
                return this.readUTFBytes(length);
            }
            else {
                return "";
            }
        };
        /**
         * @language en_US
         * Read a UTF-8 byte sequence specified by the length parameter from the byte stream, and then return a character string
         * @param Specify a short unsigned integer of the UTF-8 byte length
         * @return A character string consists of UTF-8 bytes of the specified length
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个由 length 参数指定的 UTF-8 字节序列，并返回一个字符串
         * @param length 指明 UTF-8 字节长度的无符号短整型数
         * @return 由指定长度的 UTF-8 字节组成的字符串
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.readUTFBytes = function (length) {
            if (!this.validate(length))
                return null;
            var bytes = new Uint8Array(this.buffer, this.bufferOffset + this.position, length);
            this.position += length;
            /*var bytes: Uint8Array = new Uint8Array(new ArrayBuffer(length));
             for (var i = 0; i < length; i++) {
             bytes[i] = this.data.getUint8(this.position++);
             }*/
            return this.decodeUTF8(bytes);
        };
        /**
         * @language en_US
         * Write a Boolean value. A single byte is written according to the value parameter. If the value is true, write 1; if the value is false, write 0.
         * @param value A Boolean value determining which byte is written. If the value is true, write 1; if the value is false, write 0.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 写入布尔值。根据 value 参数写入单个字节。如果为 true，则写入 1，如果为 false，则写入 0
         * @param value 确定写入哪个字节的布尔值。如果该参数为 true，则该方法写入 1；如果该参数为 false，则该方法写入 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.writeBoolean = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_BOOLEAN);
            this.data.setUint8(this.position++, value ? 1 : 0);
        };
        /**
         * @language en_US
         * Write a byte into the byte stream
         * The low 8 bits of the parameter are used. The high 24 bits are ignored.
         * @param value A 32-bit integer. The low 8 bits will be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个字节
         * 使用参数的低 8 位。忽略高 24 位
         * @param value 一个 32 位整数。低 8 位将被写入字节流
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.writeByte = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_INT8);
            this.data.setInt8(this.position++, value);
        };
        /**
         * @language en_US
         * Write the byte sequence that includes length bytes in the specified byte array, bytes, (starting at the byte specified by offset, using a zero-based index), into the byte stream
         * If the length parameter is omitted, the default length value 0 is used and the entire buffer starting at offset is written. If the offset parameter is also omitted, the entire buffer is written
         * If the offset or length parameter is out of range, they are clamped to the beginning and end of the bytes array.
         * @param bytes ByteArray Object
         * @param offset A zero-based index specifying the position into the array to begin writing
         * @param length An unsigned integer specifying how far into the buffer to write
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将指定字节数组 bytes（起始偏移量为 offset，从零开始的索引）中包含 length 个字节的字节序列写入字节流
         * 如果省略 length 参数，则使用默认长度 0；该方法将从 offset 开始写入整个缓冲区。如果还省略了 offset 参数，则写入整个缓冲区
         * 如果 offset 或 length 超出范围，它们将被锁定到 bytes 数组的开头和结尾
         * @param bytes ByteArray 对象
         * @param offset 从 0 开始的索引，表示在数组中开始写入的位置
         * @param length 一个无符号整数，表示在缓冲区中的写入范围
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.writeBytes = function (bytes, offset, length) {
            if (offset === void 0) { offset = 0; }
            if (length === void 0) { length = 0; }
            var writeLength;
            if (offset < 0) {
                return;
            }
            if (length < 0) {
                return;
            }
            else if (length == 0) {
                writeLength = bytes.length - offset;
            }
            else {
                writeLength = Math.min(bytes.length - offset, length);
            }
            if (writeLength > 0) {
                this.validateBuffer(writeLength);
                var tmp_data = new DataView(bytes.buffer);
                var length = writeLength;
                var BYTES_OF_UINT32 = 4;
                for (; length > BYTES_OF_UINT32; length -= BYTES_OF_UINT32) {
                    this.data.setUint32(this._position, tmp_data.getUint32(offset));
                    this.position += BYTES_OF_UINT32;
                    offset += BYTES_OF_UINT32;
                }
                for (; length > 0; length--) {
                    this.data.setUint8(this.position++, tmp_data.getUint8(offset++));
                }
            }
        };
        /**
         * @language en_US
         * Write an IEEE 754 double-precision (64 bit) floating point number into the byte stream
         * @param value Double-precision (64 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个 IEEE 754 双精度（64 位）浮点数
         * @param value 双精度（64 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.writeDouble = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_FLOAT64);
            this.data.setFloat64(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_FLOAT64;
        };
        /**
         * @language en_US
         * Write an IEEE 754 single-precision (32 bit) floating point number into the byte stream
         * @param value Single-precision (32 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个 IEEE 754 单精度（32 位）浮点数
         * @param value 单精度（32 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.writeFloat = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_FLOAT32);
            this.data.setFloat32(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_FLOAT32;
        };
        /**
         * @language en_US
         * Write a 32-bit signed integer into the byte stream
         * @param value An integer to be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个带符号的 32 位整数
         * @param value 要写入字节流的整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.writeInt = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_INT32);
            this.data.setInt32(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_INT32;
        };
        /**
         * @language en_US
         * Write a 16-bit integer into the byte stream. The low 16 bits of the parameter are used. The high 16 bits are ignored.
         * @param value A 32-bit integer. Its low 16 bits will be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个 16 位整数。使用参数的低 16 位。忽略高 16 位
         * @param value 32 位整数，该整数的低 16 位将被写入字节流
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.writeShort = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_INT16);
            this.data.setInt16(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_INT16;
        };
        /**
         * @language en_US
         * Write a 32-bit unsigned integer into the byte stream
         * @param value An unsigned integer to be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个无符号的 32 位整数
         * @param value 要写入字节流的无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.writeUnsignedInt = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_UINT32);
            this.data.setUint32(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_UINT32;
        };
        /**
         * @language en_US
         * Write a 16-bit unsigned integer into the byte stream
         * @param value An unsigned integer to be written into the byte stream
         * @version Egret 2.5
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个无符号的 16 位整数
         * @param value 要写入字节流的无符号整数
         * @version Egret 2.5
         * @platform Web,Native
         */
        p.writeUnsignedShort = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_UINT16);
            this.data.setUint16(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_UINT16;
        };
        /**
         * @language en_US
         * Write a UTF-8 string into the byte stream. The length of the UTF-8 string in bytes is written first, as a 16-bit integer, followed by the bytes representing the characters of the string
         * @param value Character string value to be written
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 UTF-8 字符串写入字节流。先写入以字节表示的 UTF-8 字符串长度（作为 16 位整数），然后写入表示字符串字符的字节
         * @param value 要写入的字符串值
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.writeUTF = function (value) {
            var utf8bytes = this.encodeUTF8(value);
            var length = utf8bytes.length;
            this.validateBuffer(ByteArray.SIZE_OF_UINT16 + length);
            this.data.setUint16(this.position, length, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_UINT16;
            this._writeUint8Array(utf8bytes, false);
        };
        /**
         * @language en_US
         * Write a UTF-8 string into the byte stream. Similar to the writeUTF() method, but the writeUTFBytes() method does not prefix the string with a 16-bit length word
         * @param value Character string value to be written
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 UTF-8 字符串写入字节流。类似于 writeUTF() 方法，但 writeUTFBytes() 不使用 16 位长度的词为字符串添加前缀
         * @param value 要写入的字符串值
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.writeUTFBytes = function (value) {
            this._writeUint8Array(this.encodeUTF8(value));
        };


        //ipalmplay code
        p.writeStringBytes = function(value){
            this.writeUTFBytes(value);
        };

        p.writeUShort = function(value){
            this.writeUnsignedShort(value);
        };

        p.writeUInt = function(value){
            this.writeUnsignedInt(value);
        };

        p.writeUByte = function(value){
            this.validateBuffer(ByteArray.SIZE_OF_BOOLEAN);
            this.data.setUint8(this.position++, value);
        };

        p.writeBuf = function(bytes){
            this.writeBytes(bytes);
        };

        p.readStringBytes = function(len){
            return this.readUTFBytes(len);
        };

        p.readUShort = function(){
            return this.readUnsignedShort();
        };

        p.readUInt = function(){
            return this.readUnsignedInt();
        };

        p.readUByte = function(){
            if (!this.validate(ByteArray.SIZE_OF_BOOLEAN))
                return null;
            return this.data.getUint8(this.position++);
        };

        //fix string
        p.readBuf = function(len){
            return this.readUTFBytes(len);
        };

        p.setPos = function(pos){
            this.position = pos;
            return this;
        };

        p.getPos = function(){
            return this.position;
        };

        p.getLen = function(){
            return this.length;
        };

        p.getAvailable = function(){
            return this.bytesAvailable;
        };

        p.readRawByte = function(){
            return this.readByte();
        };

        p.writeRawByte = function(value){
            this.writeByte(value);
            return this;
        };
        //end -- ipalmplay code

        /**
         *
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.toString = function () {
            return "[ByteArray] length:" + this.length + ", bytesAvailable:" + this.bytesAvailable;
        };
        /**
         * @private
         * 将 Uint8Array 写入字节流
         * @param bytes 要写入的Uint8Array
         * @param validateBuffer
         */
        p._writeUint8Array = function (bytes, validateBuffer) {
            if (validateBuffer === void 0) { validateBuffer = true; }
            if (validateBuffer) {
                this.validateBuffer(this.position + bytes.length);
            }
            for (var i = 0; i < bytes.length; i++) {
                this.data.setUint8(this.position++, bytes[i]);
            }
        };
        /**
         * @param len
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         * @private
         */
        p.validate = function (len) {
            //len += this.data.byteOffset;
            if (this.data.byteLength > 0 && this._position + len <= this.data.byteLength) {
                return true;
            }
            else {
                egret.$error(1025);
            }
        };
        /**********************/
        /*  PRIVATE METHODS   */
        /**********************/
        /**
         * @private
         * @param len
         * @param needReplace
         */
        p.validateBuffer = function (len, needReplace) {
            if (needReplace === void 0) { needReplace = false; }
            this.write_position = len > this.write_position ? len : this.write_position;
            len += this._position;
            if (this.data.byteLength < len || needReplace) {
                var tmp = new Uint8Array(new ArrayBuffer(len + this.BUFFER_EXT_SIZE));
                var length = Math.min(this.data.buffer.byteLength, len + this.BUFFER_EXT_SIZE);
                tmp.set(new Uint8Array(this.data.buffer, 0, length));
                this.buffer = tmp.buffer;
            }
        };
        /**
         * @private
         * UTF-8 Encoding/Decoding
         */
        p.encodeUTF8 = function (str) {
            var pos = 0;
            var codePoints = this.stringToCodePoints(str);
            var outputBytes = [];
            while (codePoints.length > pos) {
                var code_point = codePoints[pos++];
                if (this.inRange(code_point, 0xD800, 0xDFFF)) {
                    this.encoderError(code_point);
                }
                else if (this.inRange(code_point, 0x0000, 0x007f)) {
                    outputBytes.push(code_point);
                }
                else {
                    var count, offset;
                    if (this.inRange(code_point, 0x0080, 0x07FF)) {
                        count = 1;
                        offset = 0xC0;
                    }
                    else if (this.inRange(code_point, 0x0800, 0xFFFF)) {
                        count = 2;
                        offset = 0xE0;
                    }
                    else if (this.inRange(code_point, 0x10000, 0x10FFFF)) {
                        count = 3;
                        offset = 0xF0;
                    }
                    outputBytes.push(this.div(code_point, Math.pow(64, count)) + offset);
                    while (count > 0) {
                        var temp = this.div(code_point, Math.pow(64, count - 1));
                        outputBytes.push(0x80 + (temp % 64));
                        count -= 1;
                    }
                }
            }
            return new Uint8Array(outputBytes);
        };
        /**
         * @private
         *
         * @param data
         * @returns
         */
        p.decodeUTF8 = function (data) {
            var fatal = false;
            var pos = 0;
            var result = "";
            var code_point;
            var utf8_code_point = 0;
            var utf8_bytes_needed = 0;
            var utf8_bytes_seen = 0;
            var utf8_lower_boundary = 0;
            while (data.length > pos) {
                var _byte = data[pos++];
                if (_byte == this.EOF_byte) {
                    if (utf8_bytes_needed != 0) {
                        code_point = this.decoderError(fatal);
                    }
                    else {
                        code_point = this.EOF_code_point;
                    }
                }
                else {
                    if (utf8_bytes_needed == 0) {
                        if (this.inRange(_byte, 0x00, 0x7F)) {
                            code_point = _byte;
                        }
                        else {
                            if (this.inRange(_byte, 0xC2, 0xDF)) {
                                utf8_bytes_needed = 1;
                                utf8_lower_boundary = 0x80;
                                utf8_code_point = _byte - 0xC0;
                            }
                            else if (this.inRange(_byte, 0xE0, 0xEF)) {
                                utf8_bytes_needed = 2;
                                utf8_lower_boundary = 0x800;
                                utf8_code_point = _byte - 0xE0;
                            }
                            else if (this.inRange(_byte, 0xF0, 0xF4)) {
                                utf8_bytes_needed = 3;
                                utf8_lower_boundary = 0x10000;
                                utf8_code_point = _byte - 0xF0;
                            }
                            else {
                                this.decoderError(fatal);
                            }
                            utf8_code_point = utf8_code_point * Math.pow(64, utf8_bytes_needed);
                            code_point = null;
                        }
                    }
                    else if (!this.inRange(_byte, 0x80, 0xBF)) {
                        utf8_code_point = 0;
                        utf8_bytes_needed = 0;
                        utf8_bytes_seen = 0;
                        utf8_lower_boundary = 0;
                        pos--;
                        code_point = this.decoderError(fatal, _byte);
                    }
                    else {
                        utf8_bytes_seen += 1;
                        utf8_code_point = utf8_code_point + (_byte - 0x80) * Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);
                        if (utf8_bytes_seen !== utf8_bytes_needed) {
                            code_point = null;
                        }
                        else {
                            var cp = utf8_code_point;
                            var lower_boundary = utf8_lower_boundary;
                            utf8_code_point = 0;
                            utf8_bytes_needed = 0;
                            utf8_bytes_seen = 0;
                            utf8_lower_boundary = 0;
                            if (this.inRange(cp, lower_boundary, 0x10FFFF) && !this.inRange(cp, 0xD800, 0xDFFF)) {
                                code_point = cp;
                            }
                            else {
                                code_point = this.decoderError(fatal, _byte);
                            }
                        }
                    }
                }
                //Decode string
                if (code_point !== null && code_point !== this.EOF_code_point) {
                    if (code_point <= 0xFFFF) {
                        if (code_point > 0)
                            result += String.fromCharCode(code_point);
                    }
                    else {
                        code_point -= 0x10000;
                        result += String.fromCharCode(0xD800 + ((code_point >> 10) & 0x3ff));
                        result += String.fromCharCode(0xDC00 + (code_point & 0x3ff));
                    }
                }
            }
            return result;
        };
        /**
         * @private
         *
         * @param code_point
         */
        p.encoderError = function (code_point) {
            egret.$error(1026, code_point);
        };
        /**
         * @private
         *
         * @param fatal
         * @param opt_code_point
         * @returns
         */
        p.decoderError = function (fatal, opt_code_point) {
            if (fatal) {
                egret.$error(1027);
            }
            return opt_code_point || 0xFFFD;
        };
        /**
         * @private
         *
         * @param a
         * @param min
         * @param max
         */
        p.inRange = function (a, min, max) {
            return min <= a && a <= max;
        };
        /**
         * @private
         *
         * @param n
         * @param d
         */
        p.div = function (n, d) {
            return Math.floor(n / d);
        };
        /**
         * @private
         *
         * @param string
         */
        p.stringToCodePoints = function (string) {
            /** @type {Array.<number>} */
            var cps = [];
            // Based on http://www.w3.org/TR/WebIDL/#idl-DOMString
            var i = 0, n = string.length;
            while (i < string.length) {
                var c = string.charCodeAt(i);
                if (!this.inRange(c, 0xD800, 0xDFFF)) {
                    cps.push(c);
                }
                else if (this.inRange(c, 0xDC00, 0xDFFF)) {
                    cps.push(0xFFFD);
                }
                else {
                    if (i == n - 1) {
                        cps.push(0xFFFD);
                    }
                    else {
                        var d = string.charCodeAt(i + 1);
                        if (this.inRange(d, 0xDC00, 0xDFFF)) {
                            var a = c & 0x3FF;
                            var b = d & 0x3FF;
                            i += 1;
                            cps.push(0x10000 + (a << 10) + b);
                        }
                        else {
                            cps.push(0xFFFD);
                        }
                    }
                }
                i += 1;
            }
            return cps;
        };
        /**
         * @private
         */
        ByteArray.SIZE_OF_BOOLEAN = 1;
        /**
         * @private
         */
        ByteArray.SIZE_OF_INT8 = 1;
        /**
         * @private
         */
        ByteArray.SIZE_OF_INT16 = 2;
        /**
         * @private
         */
        ByteArray.SIZE_OF_INT32 = 4;
        /**
         * @private
         */
        ByteArray.SIZE_OF_UINT8 = 1;
        /**
         * @private
         */
        ByteArray.SIZE_OF_UINT16 = 2;
        /**
         * @private
         */
        ByteArray.SIZE_OF_UINT32 = 4;
        /**
         * @private
         */
        ByteArray.SIZE_OF_FLOAT32 = 4;
        /**
         * @private
         */
        ByteArray.SIZE_OF_FLOAT64 = 8;
        return ByteArray;
    }());
    
    egret.ByteArray = ByteArray;
})(egret || (egret = {}));


var egret;
(function (egret) {
    /**
     * @language en_US
     * The egret.WebSocket class enables code to establish a TCP socket connection, for sending and receiving character string or binary data.
     * To use the methods of the egret.WebSocket class, first use the constructor function new egret.WebSocket to create an egret.WebSocket object.
     * The socket transmits and receives data in asynchronous mode.
     * @event egret.Event.CONNECT Successfully connect to the server。
     * @event egret.ProgressEvent.SOCKET_DATA Receiving server data。
     * @event egret.Event.CLOSE Dispatched when the server closes the connection.
     * @event egret.ProgressEvent Dispatched when an IO error causes a send or load operation to fail.
     * @see http://edn.egret.com/cn/index.php/article/index/id/164 WebSocket
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/socket/WebSocket.ts
     */
    /**
     * @language zh_CN
     * egret.WebSocket 类启用代码以建立传输控制协议 (TCP) 套接字连接，用于发送和接收字符串或二进制数据。
     * 要使用 egret.WebSocket 类的方法，请先使用构造函数 new egret.WebSocket 创建一个 egret.WebSocket 对象。
     * 套接字以异步方式传输和接收数据。
     * @event egret.Event.CONNECT 连接服务器成功。
     * @event egret.ProgressEvent.SOCKET_DATA 接收服务器数据。
     * @event egret.Event.CLOSE 在服务器关闭连接时调度。
     * @event egret.IOErrorEvent.IO_ERROR 在出现输入/输出错误并导致发送或加载操作失败时调度。。
     * @see http://edn.egret.com/cn/index.php/article/index/id/164 WebSocket
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/socket/WebSocket.ts
     */
    var WebSocket = (function (_super) {
        __extends(WebSocket, _super);
        /**
         * @language en_US
         * Create an egret.WebSocket object
         * This parameter is reserved for later versions. The connection address and port number are imported in the connect function
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.WebSocket 对象
         * 参数为预留参数，现版本暂不处理，连接地址和端口号在 connect 函数中传入
         * @version Egret 2.4
         * @platform Web,Native
         */
        function WebSocket(host, port) {
            if (host === void 0) { host = ""; }
            if (port === void 0) { port = 0; }
             _super.call(this);         
            /**
             * @private
             */
            this._writeMessage = "";
            /**
             * @private
             */
            this._readMessage = "";
            /**
             * @private
             */
            this._connected = false;
            /**
             * @private
             */
            this._isReadySend = false;
            /**
             * @private
             */
            this._bytesWrite = false;
            /**
             * @private
             */
            this._type = WebSocket.TYPE_STRING;
            this._connected = false;
            this._writeMessage = "";
            this._readMessage = "";
            this.socket = new egret.ISocket();
            this.socket.addCallBacks(this.onConnect, this.onClose, this.onSocketData, this.onError, this);
        }
        var d = __define,c=WebSocket,p=c.prototype;
        /**
         * @language en_US
         * Connect the socket to the specified host and port number
         * @param host Name or IP address of the host to be connected
         * @param port Port number to be connected
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将套接字连接到指定的主机和端口
         * @param host 要连接到的主机的名称或 IP 地址
         * @param port 要连接到的端口号
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.connect = function (host, port) {
            this.socket.connect(host, port);
        };
        /**
         * 根据提供的url连接
         * @param url 全地址。如ws://echo.websocket.org:80
         */
        p.connectByUrl = function (url) {
            this.socket.connectByUrl(url);
        };
        /**
         * @language en_US
         * Closesocket
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 关闭套接字
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.close = function () {
            this.socket.close();
        };
        /**
         * @private
         *
         */
        p.onConnect = function () {
            this._connected = true;
            this.dispatchEventWith(WebSocket.Event.CONNECT);
        };
        /**
         * @private
         *
         */
        p.onClose = function () {
            this._connected = false;
            this.dispatchEventWith(WebSocket.Event.CLOSE);
        };
        /**
         * @private
         *
         */
        p.onError = function () {
            this.dispatchEventWith(WebSocket.Event.IO_ERROR);
        };
        /**
         * @private
         *
         * @param message
         */
        p.onSocketData = function (message) {
            if (typeof message == "string") {
                this._readMessage += message;
            }
            else {
                this._readByte._writeUint8Array(new Uint8Array(message));
            }
            this.dispatchEventWith(WebSocket.Event.SOCKET_DATA);
            //egret.ProgressEvent.dispatchProgressEvent(this, egret.ProgressEvent.SOCKET_DATA);
        };
        /**
         * @language en_US
         * Refresh all data accumulated in the output buffer area of the socket
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 对套接字输出缓冲区中积累的所有数据进行刷新
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.flush = function () {
            if (!this._connected) {
                egret.$warn(3101);
                return;
            }
            if (this._writeMessage) {
                this.socket.send(this._writeMessage);
                this._writeMessage = "";
            }
            if (this._bytesWrite) {
                this.socket.send(this._writeByte.buffer);
                this._bytesWrite = false;
                this._writeByte.clear();
            }
            this._isReadySend = false;
        };
        /**
         * @language en_US
         * Write data in character string in the socket
         * @param message The character string to be written in the socket
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将字符串数据写入套接字
         * @param message 要写入套接字的字符串
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.writeUTF = function (message) {
            if (!this._connected) {
                egret.$warn(3101);
                return;
            }
            if (this._type == WebSocket.TYPE_BINARY) {
                this._bytesWrite = true;
                this._writeByte.writeUTF(message);
            }
            else {
                this._writeMessage += message;
            }
            this.flush();
            return;           
        };
        /**
         * @language en_US
         * Read a UTF-8 character string from the socket
         * @returns {string}
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从套接字读取一个 UTF-8 字符串
         * @returns {string}
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.readUTF = function () {
            var message;
            if (this._type == WebSocket.TYPE_BINARY) {
                this._readByte.position = 0;
                message = this._readByte.readUTF();
                this._readByte.clear();
            }
            else {
                message = this._readMessage;
                this._readMessage = "";
            }
            return message;
        };
        /**
         * @language en_US
         * Write a series of bytes from the specified byte array. The writing operation starts from the location expressed by offset.
         * If the length parameter is ignored, the default length 0 indicates that data is written from offset in the entire buffer area.
         * If the offset parameter is ignored, data is written in the entire buffer area.
         * @param bytes The ByteArray object where data is read from
         * @param offset Zero-based offset in the ByteArray object. From here start performing data writing
         * @param length Number of bytes to be written Default value 0 indicates data is written in the entire buffer area from the value specified by the offset parameter
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从指定的字节数组写入一系列字节。写入操作从 offset 指定的位置开始。
         * 如果省略了 length 参数，则默认长度 0 将导致该方法从 offset 开始写入整个缓冲区。
         * 如果还省略了 offset 参数，则写入整个缓冲区。
         * @param bytes 要从中读取数据的 ByteArray 对象
         * @param offset ByteArray 对象中从零开始的偏移量，应由此开始执行数据写入
         * @param length 要写入的字节数。默认值 0 导致从 offset 参数指定的值开始写入整个缓冲区
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.writeBytes = function (bytes, offset, length) {
            if (offset === void 0) { offset = 0; }
            if (length === void 0) { length = 0; }
            if (!this._connected) {
                egret.$warn(3101);
                return;
            }
            if (!this._writeByte) {
                egret.$warn(3102);
                return;
            }
            this._bytesWrite = true;
            this._writeByte.writeBytes(bytes, offset, length);
            this.flush();
        };
        /**
         * @language en_US
         * Read data byte number specified by the length parameter from the socket. Read these bytes into the specified byte array starting from the location expressed by offset.
         * @param bytes The ByteArray object that data is read into
         * @param offset The offset for data reading starts from this byte array
         * @param length Byte number to be read Default value 0 indicates reading all available data
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从套接字读取 length 参数指定的数据字节数。从 offset 所表示的位置开始，将这些字节读入指定的字节数组
         * @param bytes 要将数据读入的 ByteArray 对象
         * @param offset 数据读取的偏移量应从该字节数组中开始
         * @param length 要读取的字节数。默认值 0 导致读取所有可用的数据
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.readBytes = function (bytes, offset, length) {
            if (offset === void 0) { offset = 0; }
            if (length === void 0) { length = 0; }
            if (!this._readByte) {
                egret.$warn(3102);
                return;
            }
            this._readByte.position = 0;
            this._readByte.readBytes(bytes, offset, length);
            this._readByte.clear();
        };
        d(p, "connected"
            /**
             * @language en_US
             * Indicates whether the Socket object is connected currently
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 表示此 Socket 对象目前是否已连接
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this._connected;
            }
        );
        d(p, "type"
            /**
             * @language en_US
             * Format for sending and receiving data. The default setting is the character string format
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 发送和接收数据的格式，默认是字符串格式
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this._type;
            }
            ,function (value) {
                this._type = value;
                if (value == WebSocket.TYPE_BINARY && !this._writeByte) {
                    this._readByte = new egret.ByteArray();
                    this._writeByte = new egret.ByteArray();
                }
            }
        );
        /**
         * @language en_US
         * Send and receive data in character string format
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 以字符串格式发送和接收数据
         * @version Egret 2.4
         * @platform Web,Native
         */
        WebSocket.TYPE_STRING = "webSocketTypeString";
        /**
         * @language en_US
         * Send and receive data in binary format
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 以二进制格式发送和接收数据
         * @version Egret 2.4
         * @platform Web,Native
         */
        WebSocket.TYPE_BINARY = "webSocketTypeBinary";


        WebSocket.Event = {
            CONNECT :　"CONNECT",
            CLOSE : "CLOSE",
            IO_ERROR : "IO_ERROR",
            SOCKET_DATA : "SOCKET_DATA"
        }
        return WebSocket;
    }(egret.EventDispatcher));
    egret.WebSocket = WebSocket;   
})(egret || (egret = {}));


var egret;
(function (egret) {
    (function () {
        /**
         * @private
         */
        var HTML5WebSocket = (function () {
            function HTML5WebSocket() {
                this.host = "";
                this.port = 0;
                if (!window["WebSocket"]) {
                    egret.$error(3100);
                }
            }
            var d = __define,c=HTML5WebSocket,p=c.prototype;
            p.addCallBacks = function (onConnect, onClose, onSocketData, onError, thisObject) {
                this.onConnect = onConnect;
                this.onClose = onClose;
                this.onSocketData = onSocketData;
                this.onError = onError;
                this.thisObject = thisObject;
            };
            p.connect = function (host, port) {
                this.host = host;
                this.port = port;
                var socketServerUrl = "ws://" + this.host + ":" + this.port;
                this.socket = new window["WebSocket"](socketServerUrl, ['ipalmplay-PP']);
                this.socket.binaryType = "arraybuffer";
                this._bindEvent();
            };
            p.connectByUrl = function (url) {
                this.socket = new window["WebSocket"](url, ['ipalmplay-PP']);
                this.socket.binaryType = "arraybuffer";
                this._bindEvent();
            };
            p._bindEvent = function () {
                var that = this;
                var socket = this.socket;
                socket.onopen = function () {
                    if (that.onConnect) {
                        that.onConnect.call(that.thisObject);
                    }
                };
                socket.onclose = function (e) {
                    if (that.onClose) {
                        that.onClose.call(that.thisObject);
                    }
                };
                socket.onerror = function (e) {
                    if (that.onError) {
                        that.onError.call(that.thisObject);
                    }
                };
                socket.onmessage = function (e) {
                    if (that.onSocketData) {
                        that.onSocketData.call(that.thisObject, e.data);
                    }
                };
            };
            p.send = function (message) {
                this.socket.send(message);
            };
            p.close = function () {
                this.socket.close();
            };
            return HTML5WebSocket;
        }());      
        egret.ISocket = HTML5WebSocket;  
    })();
})(egret || (egret = {}));





egret.$error = function(code, msg){
    cc.error("error code = " + code + " msg = " + msg);
};

egret.$warn = function(code, msg){
    cc.warn("error code = " + code + " msg = " + msg);
};
module.exports = egret;