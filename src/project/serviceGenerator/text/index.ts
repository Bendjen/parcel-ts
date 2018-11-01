const readMeText =
  `  1、根据接口对象自动封装出对应的服务层<br/>
    2、加入和缓存、截流的可选功能<br/>
    3、自动处理请求前的加载中动画与请求出错的提示动画<br/>
    4、可以通过传入模拟数据脱离后端开发
`;

const exampleText = [
  {
    title: '参数说明', text: `
@type          : 请求类型 ('post' | String )
@isCache       : 是否开启缓存功能 (true | Boolen )
@throttleTime  : 截流间隔 (0 | Number )（单位ms,传0表示关闭）
@axiosConfig   : axios配置选项 ({} | Object) (#支持axios文档中的所有对请求的配置选项)
@debugData     : 调试数据，有传此项会直接返回此项作为接口数据
  `}, {
    title: '接口声明', text: `
import serviceGenerator from "@/utils/serviceGenerator";

#1.基础模式
export default serviceGenerator(
  {
    fetchFansList: "/r/Mall_AllDis/getAllDisCenterData/",
    fetchOrderList: "/r/Mall_AllDis/myOneFansDetail"
  }
);

#2.传参数模式
export default serviceGenerator(
  {
    fetchFansList: { url:"/r/Mall_AllDis/getAllDisCenterData/", config:{}},
    fetchOrderList:  { url:"/r/Mall_AllDis/myOneFansDetail", config:{}}
  }
);
    `
  }, {
    title: '业务调用', text: `
import API from './service'

API.fetchOrderList(
        // 接口要传的参数主体
        params,
        // 服务层的配置选项（不传即采用默认）
        // config覆盖关系 调用处config > 声明处config > 默认config
        { type: "post", isCache: false }     
      ).then(res => {   
        console.log(res)
      }.catch(err => {
        consoel.log(err.msg)
      })
)

//不用再处理beforeSend、complete、catch部分，会自动添加`
  }
]
  ;

const javaScriptText = `
import qs from "qs";
import { Loading, MessageBox } from 'element-ui';
// import { Toast, Dialog } from "vant";
import axios from "axios";

// import ProxyPolyfill from "./proxyPolyfill"

let _cache = {};
let generatorAxios = axios.create();
let _loadingInstance = null;

const globalConfig = {
    commonParams: {},
};

const defaultConfig = {
    type: "post",
    isCache: false,
    isThrottle: false,
    throttleTime: 0,
    axiosConfig: {}
    // debugData  不传即没有启用调试数据
};

// 添加请求拦截器
generatorAxios.interceptors.request.use(
    function (config) {
        _loadingInstance = Loading.service({
            fullscreen: true,
            lock: true,
            text: "加载中",
        })
        // Toast.loading({ mask: false, duration: 0, forbidClick: true, message: "加载中" });
        return config;
    },
    function (error) {
        MessageBox.alert('请求出错', '错误')
        // Toast.fail("请求出错");
        return Promise.reject({ msg: "请求出错" });
    }
);

// 添加响应拦截器
generatorAxios.interceptors.response.use(
    function (response) {
        if (_loadingInstance) {
            _loadingInstance.close();
            _loadingInstance = null
        }
        // Toast.clear();
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
            MessageBox.alert(response.data.msg || '服务器错误', '错误')
            // Toast.fail(response.data.msg || '服务器错误');
            // Dialog.alert({
            //     title: '错误',
            //     message: response.data.msg || '服务器错误'
            // })
            return Promise.reject(response.data || { msg: "服务器错误" });
        }
    },
    function (error) {
        if (_loadingInstance) {
            _loadingInstance.close();
            _loadingInstance = null
        }
        // Toast.clear();
        // Toast.fail("响应出错");
        MessageBox.alert('响应出错', '错误')
        return Promise.reject({ msg: "响应出错" });
    }
);

//截流处理
// const throttleProxy = fn => {
//   let lastRequest = 0;
//   return new Proxy(fn, {
//   // return new ProxyPolyfill(fn, {
//     apply(target, context, args) {
//       let _config = Object.assign(defaultConfig, args[1] || {});
//       let rate = _config.throttleTime !== 0 ? _config.throttleTime : 0;
//       if (Date.now() - lastRequest >= rate) {
//         lastRequest = Date.now();
//         return fn(...args);
//       } else {
//         console.warn("本次请求被截流");
//         return Promise.reject({ msg: "本次请求被截流" });
//       }
//     }
//   });
// };

//生成部分
let serviceGenerator = (map = {}, globalConfig = {}) => {
    let ApiMap = {};
    Object.entries(map).forEach(item => {
        let key_map = item[0],
            url_map = '', config_map = {};

        // 如果直接传url地址
        if (typeof item[1] == 'string') {
            url_map = item[1]
        } else {
            // 如果传的是带参数
            url_map = item[1].url;
            config_map = item[1].config;
        }

        let outPutApi = (params = {}, config = {}) => {

            //合并默认参数
            let _config = Object.assign({}, defaultConfig, config_map, config);     //应该合并到一个空对象而不能是defaultConfig，否则接口config会互相影响
            let _params = Object.assign({}, params, globalConfig.commonParams)
            //_axiosConfig参数合并
            let _axiosConfig = Object.assign(
                {
                    method: "post",
                    url: url_map,
                    data: qs.stringify(_params)
                },
                _config.axiosConfig || {},
                { method: _config.type.toLowerCase() || "post" }
            );
            ["put", "post", "patch"].every(value => _axiosConfig.method !== value)
                ? (_axiosConfig.params = _params)
                : "";
            let _request = () => generatorAxios(_axiosConfig);

            //处理缓存功能
            if (_config.isCache === true) {
                if (_cache[url_map]) {
                    let _cacheFliter = _cache[url_map].filter(
                        item => item.params == qs.stringify(params)   //缓存层的params没有加入commonParams因为token是随机如果加入则无法缓存
                    );
                    if (_cacheFliter.length > 0) {
                        _request = () => {
                            console.warn(\`您本次请求接口：\${url_map} 的数据来自缓存。\`);
                            return Promise.resolve(JSON.parse(_cacheFliter[0].res));
                        };
                    }
                }
            }

            // 调试模式
            if (_config.debugData) {
                _request = () => {
                    console.warn(\`您本次请求接口：\${url_map} 的数据来自调试模式。\`);
                    return new Promise((resolve, reject) => {
                        _loadingInstance = Loading.service({
                            fullscreen: true,
                            lock: true,
                            text: "加载中",
                        })
                        // Toast.loading({ mask: false, duration: 0, forbidClick: true, message: "加载中" });
                        setTimeout(() => {
                            // Toast.clear();
                            if (_loadingInstance) {
                                _loadingInstance.close();
                                _loadingInstance = null
                            }
                            const res = _config.debugData;
                            if (res.code == 200) {
                                resolve(res);
                            } else {
                                MessageBox.alert(res.msg || '服务器错误', '错误')
                                // Toast.fail(res.msg || '服务器错误');
                                // Dialog.alert({
                                //     title: '错误',
                                //     message: res.msg || '服务器错误'
                                // })
                                reject(res || { msg: "服务器错误" });
                            }

                        }, 1000);
                    });
                };
            }

            return _request();
        };

        ApiMap[key_map] = outPutApi;
        //截流代理
        // ApiMap[key_map] = throttleProxy(outPutApi);    //苹果6 SE 不支持proxy
    });
    return ApiMap;
};

export default serviceGenerator;

`;

export default { javaScriptText, readMeText, exampleText };
