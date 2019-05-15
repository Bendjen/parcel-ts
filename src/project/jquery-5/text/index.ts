const exampleText = `
var wait = function () {
    var der = $.Deferred();    
    // 1.创建memory队列
    // 2.promise对象的done、fail、progress映射为队列的add方法
    // 3.为队列的第一项add一个变更state的方法(memory的add要在fire触发后才会立即触发add的函数)
    // 4.为deferred的resolve、reject、notify方法映射为 触发 队列的fireWith(context,arguments)
    // 5.将deferred对象promise化,使得通过when方法可以得到deferred对象的promise
    var test = function () {
        console.log("done");
        der.resolve("AAA");     //成功     队列中的处理函数  调用成功这个队列中的处理函数
    }
    setTimeout(test, 2000);
    return der;    //延迟对象 
}

//延迟对象的状态 决定调用那个队列中的处理函数
// 1.when方法返回deferred对象的promise
// 2.promise对象的done、fail对应callbacks的list的add方法，并返回promise形成链式
// 3.所以这里会边传入func会derferred对象resolved的时候边触发fire,从而开始调用这里刚才add的队列
// done/fail方法对应的都是add方法，而add方法内部是返回this的,this对应的就是这里的promise对象，所以可以链式调用
$.when(wait())     //promise对象promise.done()   self.add
    .done(function (name) {
        console.log(name)
        console.log("执行成功");
    }).fail(function () {
        console.log("执行失败");
    });

`

const javaScriptText = [{
    title: 'Deferred源码',
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
        callbacks:function(options){
            ...
        },
        // 异步回调解决方案
		Deferred: function(func) {
            //  [ 0 : deferred的方法, 1 : promise的方法, 2 : 队列 , 3 : 最终状态]
			var tuples = [
					["resolve", "done", jQuery.callbacks("once memory"), "resolved"],
					["reject", "fail", jQuery.callbacks("once memory"), "rejected"],
					["notify", "progress", jQuery.callbacks("memory")]
				],
				state = "pending",
				promise = {
					state: function() {
						return state;
					},
					then: function( /* fnDone, fnFail, fnProgress */ ) {
                    },
                    // 使一个对象变成
					promise: function(obj) {        // 这个obj可以给promise对象扩充方法和属性,如果没有直接返回内部定义的promise
						return obj != null ? jQuery.extend(obj, promise) : promise;
					}
				},
				deferred = {};

			tuples.forEach(function(tuple, i) {
				var list = tuple[2],
					stateString = tuple[3];

                // 为promise的done\fail\progree附加回调处理器 list.add
				// promise[ done | fail | progress ] = list.add
				promise[tuple[1]] = list.add;

                // Handle state
                // 队列fire之后的state，
                // 有memory参数 第一次add不会触发,要fire后才会触发state的变更
				if (stateString) {
					list.add(function() {
						// state = [ resolved | rejected ]
						state = stateString;
					});
				}

                // deferred[ resolve | reject | notify ]
                // 以上方法调用时会触发fireWitch,从而触发队列的进行,即promise的回调
				deferred[tuple[0]] = function() {
					deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
					return this;
				};
				deferred[tuple[0] + "With"] = list.fireWith;
			});

			// Make the deferred a promise
			promise.promise(deferred);

            console.log(deferred)
			return deferred;
		},
		//执行一个或多个对象的延迟对象的回调函数
		when: function(subordinate) {
			return subordinate.promise();
		},
    })
    ...

    jQuery.fn.init.prototype = jQuery.fn 

    root.$ = root.jQuery = jQuery

})(this);
    `
}];

export default { exampleText, javaScriptText };
