const exampleText = `
var cb = $.callbacks("once unique stopOnFalse memory ");
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

    jQuery.extend({
        ...
        callbacks: function (options) {
            options = typeof options === "string" ? (optionsCache[options] || createOptions(options)) : {};
            var list = [];
            var index, testing, memory, starts, start;
            var fire = function (data) {
                memory = options.memory && data;    // 当fire过一次之后 memory才会变成上次fire的data: [context, arguments]
                index = starts || 0;                // 如果有memory为true，则下次fire从新的任务index开始
                starts = 0;                         // 每次fire后重置starts（包括fire和memory的add）
                testing = true;
                length = list.length;
                for (; index < length; index++) {
                    if (list[index].apply(data[0], data[1]) === false && options.stopOnFalse) {
                        break;
                    }
                }
            }
            var self = {
                add: function () {
                    var args = Array.prototype.slice.call(arguments) // 类数组转数组；
                    start = list.length;    // 这里的start要用来记录下一次add前list的长度，memory任务从下一次新增加的第一项开始fire
                    args.forEach(function (fn) {
                        if (toString.call(fn) === '[object Function]') {
                            if (!options.unique || !self.has(fn, list)) {
                                list.push(fn)
                            }

                        }
                    })
                    if (memory) {               // 如果有memory为true，则下次fire从新的任务index开始
                        starts = start
                        fire(memory)
                    }

                },
                fireWith: function (context, arguments) {
                    var args = [context, arguments];
                    if (!options.once || !testing) {
                        fire(args)
                    }

                },
                fire: function () {
                    self.fireWith(this, arguments)  // this指向self
                },
                has: function (fn, list) {
                    var result = list === null ? -1 : [].indexOf.call(list, fn)
                    return result > -1
                },
            }
            return self
        }
    })
    ...

    jQuery.fn.init.prototype = jQuery.fn 

    root.$ = root.jQuery = jQuery

})(this);
    `
}];

export default { exampleText, javaScriptText };
