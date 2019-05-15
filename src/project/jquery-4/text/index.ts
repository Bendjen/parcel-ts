const exampleText = `
var cb = $.callbacks("once unique stopOnFalse memory");
// once : 队列只会fire一次
// unique : 提出重复的回调
// stopOnFalse : 有其中一个回调返回false就中断后面的回调执行
// memory : fire后,下一次add会记忆上一次的结束位置,直接执行add的回调

cb.add(function (value) {
    console.log(value)
})
function test(value) {
    console.log(value)
}
cb.add(test, test)
cb.fire('hello');        
cb.add(function (value) {   //这里的value会是上次fire的data hello
    console.log(value)
})

`

const javaScriptText = [ {
    title: 'Callbacks源码',
    text: `
(function (root) {
    var jQuery = function (selector, context) {
        // 错误实例化：会造成无限自我调用，形成死循环
        // return  new jQuery();  
        return new jQuery.prototype.init(selector, context)
    }

    // 为jQuery.prototype起别名jQuery.fn
    jQuery.fn = jQuery.prototype = {
        init: function (selector, context) {
           ...
        },

    }

    jQuery.fn.extend = jQuery.extend = function () { ... }

    // 解析 "once memory" => { once:true,memory:true }
	function createOptions(options) {
		var object = optionsCache[options] = {};
		options.split(/\s+/).forEach(function (value) {
			object[value] = true;
		});
		return object;
    }
    
    jQuery.extend({
        ...
        callbacks: function (options) {
			// 解析options并缓存到optionsCache
			options = typeof options === "string" ? (optionsCache[options] || createOptions(options)) : {};
			var list = [];
			var index, length, haveFired, memoryData, memoryStartIndex, fireStartIndex;
			var fire = function (data) {
				memoryData = options.memory && data;					// 如果有开启memory配置，在fire后缓存data到memory变量
				index = fireStartIndex || 0;									// 当fire时，队列从第几个开始执行，默认为0，当开启memory属性后add从add的这一项开始
				memoryStartIndex = 0;
				haveFired = true;
				length = list.length;
				for (; index < length; index++) {
					// 如果开启了stopOnFalse且返回了false，则break出循环
					if (list[index].apply(data[0], data[1]) === false && options.stopOnfalse) {
						break;
					}
				}
			}
			var self = {
				add: function () {
					// 类数组转数组
					var args = Array.prototype.slice.call(arguments);
					memoryStartIndex = list.length;
					args.forEach(function (fn) {
						if (toString.call(fn) === "[object Function]") {
							// 未开unique 或开启了 unique且list中不包含fn
							if (!options.unique || !self.has(fn, list)) {
								list.push(fn);
							}
						}
					});
					// fire后memoryData才有值，所以fire前即使执行add方法，也不会直接fire到add的方法
					if (memoryData) {
						// 如果开启了memory属性，则设置本次增加的方法的index为add触发的fire的fireStartIndex的值
						fireStartIndex = memoryStartIndex;
						fire(memoryData);
                    }
                    return this;   // 返回this，供链式调用
				},
				fireWith: function (context, arguments) {
					var args = [context, arguments];
					// 没有开启once配置 或 开启了once但是未fire过
					if (!options.once || !haveFired) {
						fire(args);
					}

				},
				fire: function () {
					self.fireWith(this, arguments);	    // this指向self
				},
				has: function (fn, list) {
					var result = list === null ? -1 : [].indexOf.call(list, fn)
					return result > -1
				},
			}
			return self;
		},
    })
    ...

    jQuery.fn.init.prototype = jQuery.fn 

    root.$ = root.jQuery = jQuery

})(this);
    `
}];

export default { exampleText, javaScriptText };
