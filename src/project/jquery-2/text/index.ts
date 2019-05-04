const exampleText = [
    {
        title: '1.任意对象扩展',
        text: `var obj = $.extend({}, { name: 'bendjen', age: '25' })`
    },
    {
        title: '2.jQuery本身扩展  this指向jQuery本身',
        text: `$.extend({ work: function () { return 1 }})`
    },
    {
        title: '3.jQuery的实例对象扩展  this指向jQuery实例的原型对象 （.fn相当于对.prototype的简写）',
        text: `$.fn.extend({sex: '男'})`
    },
]

const javaScriptText = [{
    title: '一、this',
    text: `
// this:指向函数运行时所在的环境
// 作用场景:1作为函数调用 2.对象方法中调用 3.构造函数中使用 4.call apply

// 为什么会有this
// JS是一门面向对象的函数,一切都是在对象上

// 全局对象:抽象的说法(顶层函数+顶层属性+window)
// 包括顶层函数(如String) 顶层属性(NaN undefined) 
// window::JS有一个全局作用域 window.fn window.alert,没有指明时默认从window中查找

// 例子1

var obj = {
    name: "max",
    add: function () {
        console.log(this)  // obj
    }
}

// 例子2

function Person() {
    this.name = 'max' // new Person() 实例
}

new Person.name;

// 例子3

function fn() {
    console.log(this) // window
}

`
}, {
    title: '二、call、apply与bind',
    text: `
// apply call bind 都是作为函数对象的一个方法,所
// 以都是Function构造函数的实例对象
//  Function.propotype.call 
//  Function.propotype.apply
//  Function.propotype.bind

// 案例 1
// call流程解读
// 实例slice实现
Array.prototype.slice = function (start, end) {
    var result = new Array;
    start = start || 0;
    end = end || this.length
    for (var i = start; i < end; i++) {
        result.push(this[i])
    }
    return result
}

[1, 2, 3].slice();  // this => [1,2,3]的数组对象

function fn(a, b, c, d) {
    return [].slice.call(arguments)  // this => arguments
}

// 案例 2
// call与apply,bind区别
var obj = {}
function fn(a, b, c, d) {
    console.log(a);
    console.log(b);
    console.log(c);
    console.log(d);
}
fn.call(obj, 1, 2, 3, 4)        // 1 2 3 4
fn.apply(obj, [1, 2, 3, 4])     // 1 2 3 4

var bindFn = fn.bind(obj, 1, 2) //生成的是fn的副本而不是直接调用
bindFn(3, 4)    // 1 2 3 4

`
}, {
    title: '三、Extend源码',
    text: `
(function (root) {
    var jQuery = function () {
        // 错误实例化：会造成无限自我调用，形成死循环
        // return  new jQuery();  
        return new jQuery.prototype.init()
    }
    // 为jQuery.prototype起别名jQuery.fn
    jQuery.fn = jQuery.prototype = {
        init: function () {
            ...
        },
        css: function () {
            ...
        }
    }

    jQuery.fn.extend = jQuery.extend = function () {
        var target = arguments[0] || {};  // 确保第一个参数有值
        var length = arguments.length;
        var i = 1;  // i 设置为 1 而不是 0 是因为第一个参数不用被遍历，直接被后面的参数扩展
        var deep = false;
        var option, name, copy, src, copyIsArray, clone;

        if (typeof target === 'boolean') {
            deep = target;           // 如果第一个传入为布尔值，传入是否深拷贝的变量
            target = arguments[1];   // 被扩展对象从第一个变成第二个
            i = 2;
        }

        if (typeof target !== 'object') {
            target = {};    // 确保被扩展的一定是object
        }


        if (length === i) {
            target = this;
            i--;    // 被修改的target是jQuery或jQuery.fn自身，传入的第一个参数是用来给自身扩展的，所以从第一个算起
            // 当以$.extend()的方式调用时 $ => this => target ;当以 $.fn.extend()的方式调用 $.fn => this => target
        }

        // 拷贝
        for (; i < length; i++) {
            // 确保参数不是null和undefind
            if ((option = arguments[i]) != null) {
                for (name in option) {
                    copy = option[name];    // 要扩展的属性
                    src = target[name];     // 被扩展的属性所在的位置

                    // var obj1 = {list:[1,2,3,4]}
                    // var obj2 = {list:[5,6,7,8]}
                    // $.extend(true,{},obj1,obj2)

                    // 深拷贝且是copy值是对象或数组
                    if (deep && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;    // 用于下一个参数的默认值（比如第三个参数也要默认不是数组开始）
                            clone = src && jQuery.isArray(src) ? src : []; // 如果被拷贝的位置原来就已经是数组则用原来的值，否则初始化[]
                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {}; // 如果被拷贝的位置原来就已经是对象则用原来的值，否则初始化{}
                        }
                        target[name] = jQuery.extend(deep, clone, copy)     // 核心算法：自我遍历进行下一个参数的深拷贝
                    } else {    // 浅拷贝
                        // 不拷贝undefined
                        if (copy != undefined) {
                            target[name] = copy
                        }
                    }
                }
            }
        }

        return target

    }

    // *共享原型对象
    // jQuery.prototype中的init方法和jQuery共享了原型对象
    // 所以上面对jQuery原型对象添加的方法(css)也会在jquery的init的原型对象中出现

    // jQuery.prototype.init.prototype = jQuery.prototype
    jQuery.fn.init.prototype = jQuery.fn //上面的简写

    root.$ = root.jQuery = jQuery

})(this);
    `
}];

export default { exampleText, javaScriptText };
