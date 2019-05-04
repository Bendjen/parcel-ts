const exampleText = [
    {
        title: '1.dom选择器',
        text: `$("#box")`
    },
    {
        title: '2.新建标签',
        text: `$("<a>")`
    },
    {
        title: '3.原生dom转jquery对象',
        text: `$(document)`
    },
    {
        title: '4.传入函数相当于$(document).ready()',
        text: `$(function(){onsole.log(1)})`
    },
]

const javaScriptText = [{
    title: '一、document.onload与$(document).ready',
    text: `// 页面渲染流程
// 1.解析HTML生成DOM树（DOMContentLoaded）
// 2.解析CSS生成CSS规则树
// 3.遍历DOM树结合CSS规则树，生成渲染树
// 4.遍历渲染树进行布局，计算节点位置大小
// 5.渲染绘制

// onload事件: 所有dom、样式、脚本、图片、flash加载完毕
// DOMContentLoaded事件：当解析HTML完成生成DOM树 等效于 $(document).ready
$(document).ready(function(){
    console.log(1)
})
$(document).ready(function(){
    console.log(2)
})
$(document).ready(function(){
    console.log(3)
})
// 很不一样的一点是,onload绑定事件第二次会覆盖第一次
// 而$(document).ready则会叠加(秘诀就是callback中的回调列表)

`
}, {
    title: '二、Sizzle源码',
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
            context = context || document;
            var match, elem, index = 0;
            // $() $(undefined) $(null) $(false)
            if (!selector) {
                return this     // 返回jQuery,用来链式调用
            }
            // $('')
            if (typeof selector === "string") {
                // $('<div></div>')
                if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
                    match = [selector]
                }
                // 创建DOM
                if (match) {
                    // 合并数组 object [context.createElement(parse[1])]
                    jQuery.merge(this, jQuery.parseHTML(selector, context));

                    // 查询DOM
                } else {
                    elem = document.querySelectorAll(selector);     // 类数组
                    var elems = Array.prototype.slice.call(elem)    // 类数组转数组
                    this.length = elems.length;
                    // 将查询到的DOM节点存储到jQuery的实例对象
                    for (; index < elems.length; index++) {
                        this[index] = elems[index];
                    }
                    this.context = context;
                    this.selector = selector;
                }

                // $(DOM) 如果传入的是一个对象，转换成jquery对象
            } else if (selector.nodeType) {
                this.context = this[0] = selector;
                this.length = 1;
                return this;
            } else if (jQuery.isFunction(selector)) {
                console.log(selector)
                rootjQuery.ready(selector);  // 实例对象上的ready的方法
            }
        },

    }

    ready: function (fn) {
        // 检测DOM是否加载完毕
        document.addEventListener("DOMContentLoaded", jQuery.ready, false)
        // jQuery不同于上面,这里是定义在jQuery中的

        // 在DOMContentLoaded后传入的函数,则直接执行传入的函数
        if (jQuery.isready) {
            fn.call(document)
        } else {
            // 在DOMContentLoaded前传入的函数,则推入readyList,在DOMContentLoaded时遍历list
            jQuery.readylist.push(fn)
        }
    }

    jQuery.fn.extend = jQuery.extend = function () { ... }

    jQuery.extend({
        // 为jQuery自身装填一些类型检测
        isPlainObject: function (obj) {
            return toString.call(obj) === "[object Object]";     //等同于 obj.toString()
        },
        isArray: function (obj) {
            return toString.call(obj) === "[object Array]";
        },
        isFunction: function (fn) {
            return toString.call(fn) === "[object Function]";
        },
        inArray: function (elem, arr) {
            return arr === null ? -1 : [].indexOf.call(arr,elem)
        },
        // 合并数组 first:this second:[DOM节点]
        merge: function (first, second) {
            var l = second.length,  // 1
                i = first.length, // 0 前面定义的
                j = 0;

            if (typeof l === 'number') {
                for (; j < l; j++) {
                    first[i++] = second[j]
                }
            } else {
                while (second[j] !== undefined) {
                    first[i++] = second[j++]
                }
            }

            first.length = i;
            return first;
        },
        // 提取标签
        parseHTML: function (data, context) {
            if (!data || typeof data !== "string") {
                return null
            }
            // ["<a>","a"] 
            var parse = rejectExp.exec(data);
            console.log(parse)
            return [context.createElement(parse[1])]
        },
        isready: false,
        readylist: [],
        // 该方法触发说明,上面的ready(实例对象的ready方法触发)
        ready: function () {
            jQuery.isready = true;
            jQuery.readylist.forEach(function (callback) {
                callback.call(document)
            })
            jQuery.readylist = null;
        }
    })
    var rootjQuery = jQuery(document)

    jQuery.fn.init.prototype = jQuery.fn 

    root.$ = root.jQuery = jQuery

})(this);
    `
}];

export default { exampleText, javaScriptText };
