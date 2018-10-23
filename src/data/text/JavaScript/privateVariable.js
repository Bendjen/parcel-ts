const javaScriptText = [
  {
    title: "命名约定",
    text: `//使用特定的命名约定来表示属性应该被视为私有
//外部没有实际上限制访问的措施

class Shape{
  constructor(width, height) {
    this._width = width;
    this._height = height;
  }
  get area() {
    return this._width * this._height;
  }
}

const square = new Shape(10, 10);

console.log(square); // Shape {_width:10,_height:10}
console.log(JSON.stringify(square)) // {"_width":10,"_height":10}
    `
  },
  {
    title: "WeakMap",

    text: `//使用 WeakMap 来存储所有私有值
//可以起到限制私有属性访问的作用，但它依赖于一个放在类外面的可以访问和操作的 WeakMap 变量

const map = new WeakMap();
const internal = obj => {
    if (!map.has(obj)) {
        map.set(obj, {});
    }
    return map.get(obj);
}

class Shape{
    constructor(width, height) {
      internal(this).width = width;
      internal(this).height = height;
    }
    get area() {
      return internal(this).width * internal(this).height;
    }
  }

const square = new Shape(10, 10);

console.log(square);  // Shape {}  
console.log(JSON.stringify(square)) // {}      
    `
  },
  {
    title: "Symbol",
    text: `//Symbol 值作为属性名时，外部无法获取内部Symbol()生成的key才无法取到，但该属性仍是公开属性，不是私有属性
//Symbol 作为属性名，该属性不会被遍历到；但是外部可以通过Object.getOwnPropertySymbols方法，可以获取指定对象的所有 Symbol 属性名

const widthSymbol = Symbol('width');
const heightSymbol = Symbol('height');

class Shape {
    constructor(width, height) {
        this[widthSymbol] = width;
        this[heightSymbol] = height;
    }
    get area() {
        returnthis[widthSymbol] * this[heightSymbol];
    }
}

const square = new Shape(10, 10);

console.log(square);   // Shape { [Symbol(width)]: 10, [Symbol(height)]: 10 }
console.log(JSON.stringify(square)) // {}`
  },
  {
    title: "闭包",
    text: `//外部访问不到内部的私有变量，但闭包需要手动连接原型链

function Shape() {
    // 私有变量集
    const this$ = {};

    class Shape {
        constructor(width, height) {
            this$.width = width;
            this$.height = height;
        }

        get area() {
            return this$.width * this$.height;
        }
    }

    return Object.setPrototypeOf(new Shape(...arguments), this);   //手动连接 square instanceof Shape
}

const square = new Shape(10, 10);   //这里new是为了保持类的使用形式

console.log(square);  // Shape {}
console.log(JSON.stringfy(square));  // {}
    `
  },
  {
    title: "Proxy",
    text: `//用原型代理本质是在约定命名基础添加了外部访问的拦截器，丢出错误来终止外部访问的效果

class Shape {
    constructor(width, height) {
        this._width = width;
        this._height = height;
    }
    get area() {
        return this._width * this._height;
    }
}

const handler = {
    get: function (target, key) {
        if (key[0] === '_') {
            throw new Error('Attempt to access private property');
        } else if (key === 'toJSON') {
            //JSON.stringfy会访问到私有属性报错，用内部新定义的方法覆盖默认的JSON.stringfy
            const obj = {};
            for (const key in target) {
                if (key[0] !== '_') {           // 只复制公共属性
                    obj[key] = target[key];
                }
            }
            return () => obj;
        }

        return target[key];
    },
    set: function (target, key, value) {
        if (key[0] === '_') {
            throw new Error('Attempt to access private property');
        }
        target[key] = value;
    },
    //遍历仍会访问到私有属性，通过拦截器拦截对私有属性的遍历
    getOwnPropertyDescriptor(target, key) {
        const desc = Object.getOwnPropertyDescriptor(target, key);
        if (key[0] === '_') {
            desc.enumerable = false;
        }
        return desc;
    }
}

const square = new Proxy(new Shape(10, 10), handler);

console.log(square);             // Shape { _width: 10, _height: 10 }
console.log(square._width)       // Error: Attempt to access private property
console.log(JSON.stringify(square))  // {}    
    `
  },{
      title:'未来',
      text:`//新提案
class Shape {

    #height;
    #width;
    
    constructor(width, height) {
        this.#width = width;
        this.#height = height;
    }
    
    get area() {
        return this.#width * this.#height;
    }
}
const square = new Shape(10, 10);

console.log(square);                 // Shape {}
console.log(square.#width);          // Error: Attempt to access private property
console.log(JSON.stringfy(square))   // {}
      `
  }
];

export default { javaScriptText };
