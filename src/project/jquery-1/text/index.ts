const exampleText = `console.log($)
// ƒ () {
//     // 错误实例化：会造成无限自我调用，形成死循环
//     // return  new jQuery();  
//     return new jQuery.prototype.init()
// }

console.log($())
// init
`

const javaScriptText = [{
    title: '*一、立刻调用的匿名函数',
    text: `
(function(root,factory){
    factory()
})(this,function(){
    return 1
});

// root this是全局对象,浏览器环境为window，node环境为global

`
},{
    title:'*二、一个函数可以有三种理解',
    text:`
function P(){}
P.prototype = {
    name: "bendjen"
}
// 解释这里P可以看成三种类型

// 1.普通函数,可以直接执行函数
P()

// 2.构造函数,通过new对其实例化
// 构造函数是不享有它原型里的属性和方法的,只有它的实例才有
var p1 = new P() 
p1.name; // bendjen
P.name   // undefined

// 3.函数本身也是一种对象,它拥有Function.prototype这里面的东西中的底层原型中的属性和方法
P.prototype  // 对应的是  Function.prototype 的方法和属性

`
},{
    title:'三、无new实例化源码',
    text:`
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

    // *共享原型对象
    // jQuery.prototype中的init方法和jQuery共享了原型对象
    // 所以上面对jQuery原型对象添加的方法(css)也会在jquery的init的原型对象中出现

    // jQuery.prototype.init.prototype = jQuery.prototype
    jQuery.fn.init.prototype = jQuery.fn //上面的简写

    root.$ = root.jQuery = jQuery

})(this);
    `
}];

export default { exampleText,javaScriptText };
