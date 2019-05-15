const exampleText = [
    {
        title: '1.调用_下的静态方法',
        text: `_.unique([1, 2, 3, 4, 5, 4, 5, 6])
// [1,2,3,4,5,6]`
    },
    {
        title: '2.实例化后调用原型链上的方法',
        text: `_([1, 2, 3, 4, 5, 4, 5, 6]).unique()
// [1,2,3,4,5,6]  `
    },
    {
        title: '3.实例化链式调用',
        text: `_([1, 2, 3, 4, 5, 4, 5, 6]).chain().unique().value()
// [1,2,3,4,5,6]  `
    }
]

const javaScriptText = `
(function(root) {
	var push = Array.prototype.push;
	
	var _ = function(obj) {
		// 如果传入的参数已经是 _ 的实例则直接返回该实例
		if (obj instanceof _) {
			return obj;
		}

		// 如果传入的参数不是 _ 的实例则生成一个_wrapped值为传入值的实例
		if (!(this instanceof _)) {
			return new _(obj);
		}
		this._wrapped = obj;
	}

	_.unique = function(arr, callback) {
		var ret = [];
		var target, i = 0;
		for (; i < arr.length; i++) {
			var target = callback ? callback(arr[i]) : arr[i];
			if (ret.indexOf(target) === -1) {
				ret.push(target);
			}
		}

		return ret;
	}

	//开启链接式的调用
	_.chain = function(obj) {
		var instance = _(obj);
		instance._chain = true;
		return instance;
	}

	//辅助函数    obj   数据结果
	var result = function(instance, obj) {
		return instance._chain ? _(obj).chain() : obj;
	}

	_.prototype.value = function() {
		return this._wrapped;
	}

	_.functions = function(obj) {
		var result = [];
		var key;
		for (key in obj) {
			result.push(key);
		}
		return result;
	}

	_.map = function(args,callback) {
      return args;
	}

	//类型检测
	_.isArray = function(array) {
		return toString.call(array) === "[object Array]";
	}

	_.each = function(target, callback) {
		// console.log(target)
		var key, i = 0;
		if (_.isArray(target)) {
			var length = target.length;
			for (; i < length; i++) {
				callback.call(target, target[i], i);
			}
		} else {
			for (key in target) {
				callback.call(target, key, target[key]);
			}
		}

	}

	//mixin：为_的实例对象添加方法
	_.mixin = function(obj) {
		// _.functions(obj) : 返回传入obj的key形成的数组
		_.each(_.functions(obj), function(name) {
			var func = obj[name];

			// 为_.的实例添加同名方法，可以链式调用，且_wrapped作为第一个参数
			_.prototype[name] = function() {
				var args = [this._wrapped];
				push.apply(args, arguments);
				// result : 如果实例对象的_chain属性为true，则返回_wrapped为数据结果的实例对象
				//          如果实例对象的_chain属性为false，则直接返回数据结果
				return result(this, func.apply(this, args));
			}
		});
	}

	// 为_的原型赋予定义在_的方法，并使用wrapped作为第一个参数
	_.mixin(_);
	root._ = _;
})(this);


`;

export default { exampleText,javaScriptText };
