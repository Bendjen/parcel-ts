webpackJsonp([22],{970:function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.default={javaScriptText:'\nimport qs from "qs";\nimport { Loading, MessageBox } from \'element-ui\';\n// import { Toast, Dialog } from "vant";\nimport axios from "axios";\n\n// import ProxyPolyfill from "./proxyPolyfill"\n\nlet _cache = {};\nlet generatorAxios = axios.create();\nlet _loadingInstance = null;\n\nconst globalConfig = {\n    commonParams: {},\n};\n\nconst defaultConfig = {\n    type: "post",\n    isCache: false,\n    isThrottle: false,\n    throttleTime: 0,\n    axiosConfig: {}\n    // debugData  \u4e0d\u4f20\u5373\u6ca1\u6709\u542f\u7528\u8c03\u8bd5\u6570\u636e\n};\n\n// \u6dfb\u52a0\u8bf7\u6c42\u62e6\u622a\u5668\ngeneratorAxios.interceptors.request.use(\n    function (config) {\n        _loadingInstance = Loading.service({\n            fullscreen: true,\n            lock: true,\n            text: "\u52a0\u8f7d\u4e2d",\n        })\n        // Toast.loading({ mask: false, duration: 0, forbidClick: true, message: "\u52a0\u8f7d\u4e2d" });\n        return config;\n    },\n    function (error) {\n        MessageBox.alert(\'\u8bf7\u6c42\u51fa\u9519\', \'\u9519\u8bef\')\n        // Toast.fail("\u8bf7\u6c42\u51fa\u9519");\n        return Promise.reject({ msg: "\u8bf7\u6c42\u51fa\u9519" });\n    }\n);\n\n// \u6dfb\u52a0\u54cd\u5e94\u62e6\u622a\u5668\ngeneratorAxios.interceptors.response.use(\n    function (response) {\n        if (_loadingInstance) {\n            _loadingInstance.close();\n            _loadingInstance = null\n        }\n        // Toast.clear();\n        if (response.data.code == 200) {\n            let url = response.config.url,\n                params = response.config.data || "0",\n                res = response.request.responseText;\n            _cache[url] ? null : (_cache[url] = []);\n            let existCacheIndex;\n            let _cacheFliter = _cache[url].filter((item, index) => {\n                item.params == params ? (existCacheIndex = index) : null;\n                return item.params == params;\n            });\n\n            _cacheFliter.length > 0\n                ? (_cache[url][existCacheIndex] = { params, res })\n                : _cache[url].push({ params, res });\n            return response.data;\n        } else {\n            MessageBox.alert(response.data.msg || \'\u670d\u52a1\u5668\u9519\u8bef\', \'\u9519\u8bef\')\n            // Toast.fail(response.data.msg || \'\u670d\u52a1\u5668\u9519\u8bef\');\n            // Dialog.alert({\n            //     title: \'\u9519\u8bef\',\n            //     message: response.data.msg || \'\u670d\u52a1\u5668\u9519\u8bef\'\n            // })\n            return Promise.reject(response.data || { msg: "\u670d\u52a1\u5668\u9519\u8bef" });\n        }\n    },\n    function (error) {\n        if (_loadingInstance) {\n            _loadingInstance.close();\n            _loadingInstance = null\n        }\n        // Toast.clear();\n        // Toast.fail("\u54cd\u5e94\u51fa\u9519");\n        MessageBox.alert(\'\u54cd\u5e94\u51fa\u9519\', \'\u9519\u8bef\')\n        return Promise.reject({ msg: "\u54cd\u5e94\u51fa\u9519" });\n    }\n);\n\n//\u622a\u6d41\u5904\u7406\n// const throttleProxy = fn => {\n//   let lastRequest = 0;\n//   return new Proxy(fn, {\n//   // return new ProxyPolyfill(fn, {\n//     apply(target, context, args) {\n//       let _config = Object.assign(defaultConfig, args[1] || {});\n//       let rate = _config.throttleTime !== 0 ? _config.throttleTime : 0;\n//       if (Date.now() - lastRequest >= rate) {\n//         lastRequest = Date.now();\n//         return fn(...args);\n//       } else {\n//         console.warn("\u672c\u6b21\u8bf7\u6c42\u88ab\u622a\u6d41");\n//         return Promise.reject({ msg: "\u672c\u6b21\u8bf7\u6c42\u88ab\u622a\u6d41" });\n//       }\n//     }\n//   });\n// };\n\n//\u751f\u6210\u90e8\u5206\nlet serviceGenerator = (map = {}, globalConfig = {}) => {\n    let ApiMap = {};\n    Object.entries(map).forEach(item => {\n        let key_map = item[0],\n            url_map = \'\', config_map = {};\n\n        // \u5982\u679c\u76f4\u63a5\u4f20url\u5730\u5740\n        if (typeof item[1] == \'string\') {\n            url_map = item[1]\n        } else {\n            // \u5982\u679c\u4f20\u7684\u662f\u5e26\u53c2\u6570\n            url_map = item[1].url;\n            config_map = item[1].config;\n        }\n\n        let outPutApi = (params = {}, config = {}) => {\n\n            //\u5408\u5e76\u9ed8\u8ba4\u53c2\u6570\n            let _config = Object.assign({}, defaultConfig, config_map, config);     //\u5e94\u8be5\u5408\u5e76\u5230\u4e00\u4e2a\u7a7a\u5bf9\u8c61\u800c\u4e0d\u80fd\u662fdefaultConfig\uff0c\u5426\u5219\u63a5\u53e3config\u4f1a\u4e92\u76f8\u5f71\u54cd\n            let _params = Object.assign({}, params, globalConfig.commonParams)\n            //_axiosConfig\u53c2\u6570\u5408\u5e76\n            let _axiosConfig = Object.assign(\n                {\n                    method: "post",\n                    url: url_map,\n                    data: qs.stringify(_params)\n                },\n                _config.axiosConfig || {},\n                { method: _config.type.toLowerCase() || "post" }\n            );\n            ["put", "post", "patch"].every(value => _axiosConfig.method !== value)\n                ? (_axiosConfig.params = _params)\n                : "";\n            let _request = () => generatorAxios(_axiosConfig);\n\n            //\u5904\u7406\u7f13\u5b58\u529f\u80fd\n            if (_config.isCache === true) {\n                if (_cache[url_map]) {\n                    let _cacheFliter = _cache[url_map].filter(\n                        item => item.params == qs.stringify(params)   //\u7f13\u5b58\u5c42\u7684params\u6ca1\u6709\u52a0\u5165commonParams\u56e0\u4e3atoken\u662f\u968f\u673a\u5982\u679c\u52a0\u5165\u5219\u65e0\u6cd5\u7f13\u5b58\n                    );\n                    if (_cacheFliter.length > 0) {\n                        _request = () => {\n                            console.warn(`\u60a8\u672c\u6b21\u8bf7\u6c42\u63a5\u53e3\uff1a${url_map} \u7684\u6570\u636e\u6765\u81ea\u7f13\u5b58\u3002`);\n                            return Promise.resolve(JSON.parse(_cacheFliter[0].res));\n                        };\n                    }\n                }\n            }\n\n            // \u8c03\u8bd5\u6a21\u5f0f\n            if (_config.debugData) {\n                _request = () => {\n                    console.warn(`\u60a8\u672c\u6b21\u8bf7\u6c42\u63a5\u53e3\uff1a${url_map} \u7684\u6570\u636e\u6765\u81ea\u8c03\u8bd5\u6a21\u5f0f\u3002`);\n                    return new Promise((resolve, reject) => {\n                        _loadingInstance = Loading.service({\n                            fullscreen: true,\n                            lock: true,\n                            text: "\u52a0\u8f7d\u4e2d",\n                        })\n                        // Toast.loading({ mask: false, duration: 0, forbidClick: true, message: "\u52a0\u8f7d\u4e2d" });\n                        setTimeout(() => {\n                            // Toast.clear();\n                            if (_loadingInstance) {\n                                _loadingInstance.close();\n                                _loadingInstance = null\n                            }\n                            const res = _config.debugData;\n                            if (res.code == 200) {\n                                resolve(res);\n                            } else {\n                                MessageBox.alert(res.msg || \'\u670d\u52a1\u5668\u9519\u8bef\', \'\u9519\u8bef\')\n                                // Toast.fail(res.msg || \'\u670d\u52a1\u5668\u9519\u8bef\');\n                                // Dialog.alert({\n                                //     title: \'\u9519\u8bef\',\n                                //     message: res.msg || \'\u670d\u52a1\u5668\u9519\u8bef\'\n                                // })\n                                reject(res || { msg: "\u670d\u52a1\u5668\u9519\u8bef" });\n                            }\n\n                        }, 1000);\n                    });\n                };\n            }\n\n            return _request();\n        };\n\n        ApiMap[key_map] = outPutApi;\n        //\u622a\u6d41\u4ee3\u7406\n        // ApiMap[key_map] = throttleProxy(outPutApi);    //\u82f9\u679c6 SE \u4e0d\u652f\u6301proxy\n    });\n    return ApiMap;\n};\n\nexport default serviceGenerator;\n\n',readMeText:"  1\u3001\u6839\u636e\u63a5\u53e3\u5bf9\u8c61\u81ea\u52a8\u5c01\u88c5\u51fa\u5bf9\u5e94\u7684\u670d\u52a1\u5c42<br/>\n    2\u3001\u52a0\u5165\u548c\u7f13\u5b58\u3001\u622a\u6d41\u7684\u53ef\u9009\u529f\u80fd<br/>\n    3\u3001\u81ea\u52a8\u5904\u7406\u8bf7\u6c42\u524d\u7684\u52a0\u8f7d\u4e2d\u52a8\u753b\u4e0e\u8bf7\u6c42\u51fa\u9519\u7684\u63d0\u793a\u52a8\u753b<br/>\n    4\u3001\u53ef\u4ee5\u901a\u8fc7\u4f20\u5165\u6a21\u62df\u6570\u636e\u8131\u79bb\u540e\u7aef\u5f00\u53d1\n",exampleText:[{title:"\u53c2\u6570\u8bf4\u660e",text:"\n@type          : \u8bf7\u6c42\u7c7b\u578b ('post' | String )\n@isCache       : \u662f\u5426\u5f00\u542f\u7f13\u5b58\u529f\u80fd (true | Boolen )\n@throttleTime  : \u622a\u6d41\u95f4\u9694 (0 | Number )\uff08\u5355\u4f4dms,\u4f200\u8868\u793a\u5173\u95ed\uff09\n@axiosConfig   : axios\u914d\u7f6e\u9009\u9879 ({} | Object) (#\u652f\u6301axios\u6587\u6863\u4e2d\u7684\u6240\u6709\u5bf9\u8bf7\u6c42\u7684\u914d\u7f6e\u9009\u9879)\n@debugData     : \u8c03\u8bd5\u6570\u636e\uff0c\u6709\u4f20\u6b64\u9879\u4f1a\u76f4\u63a5\u8fd4\u56de\u6b64\u9879\u4f5c\u4e3a\u63a5\u53e3\u6570\u636e\n  "},{title:"\u63a5\u53e3\u58f0\u660e",text:'\nimport serviceGenerator from "@/utils/serviceGenerator";\n\n#1.\u57fa\u7840\u6a21\u5f0f\nexport default serviceGenerator(\n  {\n    fetchFansList: "/r/Mall_AllDis/getAllDisCenterData/",\n    fetchOrderList: "/r/Mall_AllDis/myOneFansDetail"\n  }\n);\n\n#2.\u4f20\u53c2\u6570\u6a21\u5f0f\nexport default serviceGenerator(\n  {\n    fetchFansList: { url:"/r/Mall_AllDis/getAllDisCenterData/", config:{}},\n    fetchOrderList:  { url:"/r/Mall_AllDis/myOneFansDetail", config:{}}\n  }\n);\n    '},{title:"\u4e1a\u52a1\u8c03\u7528",text:"\nimport API from './service'\n\nAPI.fetchOrderList(\n        // \u63a5\u53e3\u8981\u4f20\u7684\u53c2\u6570\u4e3b\u4f53\n        params,\n        // \u670d\u52a1\u5c42\u7684\u914d\u7f6e\u9009\u9879\uff08\u4e0d\u4f20\u5373\u91c7\u7528\u9ed8\u8ba4\uff09\n        // config\u8986\u76d6\u5173\u7cfb \u8c03\u7528\u5904config > \u58f0\u660e\u5904config > \u9ed8\u8ba4config\n        { type: \"post\", isCache: false }     \n      ).then(res => {   \n        console.log(res)\n      }.catch(err => {\n        consoel.log(err.msg)\n      })\n)\n\n//\u4e0d\u7528\u518d\u5904\u7406beforeSend\u3001complete\u3001catch\u90e8\u5206\uff0c\u4f1a\u81ea\u52a8\u6dfb\u52a0"}]}}});
//# sourceMappingURL=22.df2e13d6.chunk.js.map