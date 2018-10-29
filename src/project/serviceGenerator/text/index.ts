const readMeText = 
`   1.根据接口对象自动封装出对应的服务层<br/>
    2.加入和缓存、截流的可选功能<br/>
    3.自动处理请求前的加载中动画与请求出错的提示动画
`;

const exampleText = 
`import serviceGenerator from "@utils/serviceGenerator";

export default serviceGenerator(
  {
    fetchFansList: "/r/FetchData/getAllDisCenterData",
    fetchOrderList: "/r/FetchData/myOneFansDetail"
  }
);
`;

const javaScriptText = `
import qs from "qs";
import { Toast } from "vant";

let _cache = {};

const defaultConfig = {
  type: "post",
  isCache: false,
  isThrottle: false,
  throttleTime: 0,
  axiosConfig: {}
};

// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    Toast.loading({ mask: false, duration: 0, message: "加载中" });
    return config;
  },
  function(error) {
    Toast.fail("请求出错");
    return Promise.reject({ msg: "请求出错" });
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    Toast.clear();
    if (response.data.code == 200) {
      let url = response.config.url,
        params = response.config.data || "0",
        res = response.request.responseText;
      _cache[url] ? null : (_cache[url] = []);
      let existCacheIndex;
      let _cacheFliter = _cache[url].filter((item, index) => {
        item.params == params ? (existCacheIndex = index) : null;
        return item.params == params;
      });

      _cacheFliter.length > 0
        ? (_cache[url][existCacheIndex] = { params, res })
        : _cache[url].push({ params, res });
      return response.data;
    } else {
      Toast.fail(response.data.msg || "服务器错误");
      return Promise.reject(response.data || { msg: "服务器错误" });
    }
  },
  function(error) {
    Toast.clear();
    Toast.fail("响应出错");
    return Promise.reject({ msg: "响应出错" });
  }
);

//截流处理
const throttleProxy = fn => {
  let lastRequest = 0;
  return new Proxy(fn, {
    apply(target, context, args) {
      let _config = Object.assign(defaultConfig, args[1] || {});
      let rate = _config.throttleTime !== 0 ? _config.throttleTime : 0;
      if (Date.now() - lastRequest >= rate) {
        lastRequest = Date.now();
        return fn(...args);
      } else {
        console.warn("本次请求被截流");
        return Promise.reject({ msg: "本次请求被截流" });
      }
    }
  });
};

//生成部分
let serviceGenerator = (map = {}) => {
  let ApiMap = {};
  Object.entries(map).forEach(item => {
    let key_map = item[0],
      value_map = item[1];
    let outPutApi = (params = {}, config = {}) => {

      //合并默认参数
      let _config = Object.assign(defaultConfig, config);

      //_axiosConfig参数合并
      let _axiosConfig = Object.assign(
        {
          method: "post",
          url: value_map,
          data: qs.stringify(params)
        },
        _config.axiosConfig || {},
        { method: _config.type.toLowerCase() || "post" }
      );
      ["put", "post", "patch"].every(value => _axiosConfig.method !== value)
        ? (_axiosConfig.params = params)
        : "";
      let _request = () => axios(_axiosConfig);

      //处理缓存功能
      if (_config.isCache === true) {
        if (_cache[value_map]) {
          let _cacheFliter = _cache[value_map].filter(
            item => item.params == qs.stringify(params)
          );
          if (_cacheFliter.length > 0) {
            _request = () => {
              console.warn(\`您本次请求接口：\${value_map} 的数据来自缓存。\`);
              return Promise.resolve(JSON.parse(_cacheFliter[0].res));
            };
          }
        }
      }
      return _request();
    };

    //截流代理
    ApiMap[key_map] = throttleProxy(outPutApi);
  });
  return ApiMap;
};

export default serviceGenerator;

`;

export default { javaScriptText, readMeText, exampleText };
