const htmlText = `<input id="inputBox"/>`;


const javaScriptText = [{
    title:'基于Object.defineProperty',
    text:`//1.该方法是基于对象实现（不能用WeckMap），当dom被删除，对象中绑定的属性不会被释放
//2.理想中的双向绑定应该是    operate => dom => value => doms  或  command => value => doms;
//  但是该方法不是真正的双向绑定实现，其本质是讲原本指向对象属性操作通过get与set转为指向对应的dom的值操作; value(get/set) => dom;
//  导致的结果是当有两个dom绑定同一个值时，value会被指向后绑定的dom，后dom => doms这一步更新需要脏检测才能实现; value(get/set) => dom ≠> doms;

function bind(object, key, domElem, attributeName = "value") {
    Object.defineProperty(object, key, {
        //取值从dom中取值
        get: function() {
            return attributeName == "value"
                ? domElem.value
                : domElem.getAttribute("value");
        },
        //通过命令设置值时同时设置所有绑定了dom的值
        set: function(value) {
            attributeName == "value"
                ? (domElem.value = value)
                : domElem.setAttribute(attributeName, value);
            //问题1：这里少了一步将所有绑定同一个值的dom更新的操作(dom => doms)
        },
        configurable: true
    });

    //问题2：而且当通过操作dom进行更新时，并没有事件监听可以触发其他相关dom或value更新(dom操作不会触发对象的set)，
    //      value是只有在进行取(get)操作时才能得到dom更新的数据，也就缺少触发更新的事件
}

let user = { name: "" };
let inputElem = document.getElementById("inputBox");
bind(user, "name", inputElem);`
},{
    title:'基于Object.observe 和 DOM.onChange',
    text:`// value <=>  dom
//这是真正的双向绑定，dom变化时通过事件触发了值的变化，值变化时通过对象监听触发了dom的变化
//但是这种做法的缺陷是当通过代码更改dom的值（不触发dom事件下）不会触发双向绑定
//也没有脏检测可以实现从一个 dom => doms 的一到多扩散
//ES7支持，observe好像没最后弄过
functionbindObjPropToDomElem(obj, property, domElem) { 
    Object.observe(obj, function(changes){    
        changes.forEach(function(change) {
         $(domElem).text(obj[property]);        
        });
    });  
}
functionbindDomElemToObjProp(obj, propertyName, domElem) {  
    $(domElem).change(function() {
        obj[propertyName] = $(domElem).val();
        console.log("obj is", obj);
    });
}
functionbindModelView(obj, property, domElem) {  
    bindObjPropToDomElem(obj, property, domElem)
    bindDomElemToObjProp(obj, propertyName, domElem)
}`
}];

export default {  javaScriptText };
