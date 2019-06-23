import QueueAnim from "rc-queue-anim";
import React from "react";
import { IArticleItem, IModule, IState } from "./declare.d";
import style from "./index.scss";

class About extends React.Component<{}, IState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      renderList: [
        {
          type: "WxMicro",
          title: "微信小程序",
          articles: [
            {
              title: "从微信页面到小程序（一）",
              url:
                "https://mp.weixin.qq.com/s?__biz=MzAwODcwODYwMw==&mid=2247484292&idx=1&sn=437ef07bfc4fdedaeefe90a5bf3b644a&chksm=9b6b8b10ac1c020665d95893a1294f98c19a7ced18a44b8001044205e6693f8cf25d65923961&scene=21#wechat_redirect"
            },
            {
              title: "从微信页面到小程序（二）",
              url: "https://mp.weixin.qq.com/s/X2okd-75jbEs6JyHADOJ7A"
            },
            {
              title: "登录鉴权",
              url: "https://segmentfault.com/a/1190000014234141"
            },
            {
              title: "更多开发指南",
              url: "https://mp.weixin.qq.com/s/X75Go2dwevHEuQXSl0pArw"
            }
          ]
        },
        {
          type: "PWA",
          title: "PWA",
          articles: [
            {
              title: "PWA概述",
              url: "https://mp.weixin.qq.com/s/e9I2G2JD-SXfJLLLThyaIg"
            }
          ]
        },
        {
          type: "Vue",
          title: "Vue",
          articles: [
            {
              title: "逐行解读Vue",
              url: "http://hcysun.me/vue-design/art/6vue-init-start.html"
            }
          ]
        },
        {
          type: "React",
          title: "React",
          articles: [
            {
              title: "React Hooks",
              url: "https://mp.weixin.qq.com/s/vHzgNqaRiDF9tq3JgW7LxQ"
            }
          ]
        },
        {
          type: "Webpack",
          title: "Webpack",
          articles: [
            {
              title: "Webpack-dev-server的proxy解决开发环境的跨域问题",
              url: "https://github.com/funnycoderstar/blog/issues/42"
            }
          ]
        },
        {
          type: "Electron",
          title: "Electron",
          articles: [
            {
              title: "electron-builder打包配置",
              url: "https://segmentfault.com/a/1190000016695922?utm_source=tag-newest"
            },
            {
              title: "如何搭建Electron开发环境",
              url: "https://segmentfault.com/a/1190000011008466"
            },
            {
              title: "Electron开发的gulp配置",
              url: "https://segmentfault.com/a/1190000006186553"
            },
            {
              title: "Electron 打包体积优化",
              url: "https://imweb.io/topic/5b9f500cc2ec8e6772f34d79"
            },
            {
              title: "使用electron-builder配合electron-updater实现自动更新",
              url: "https://segmentfault.com/a/1190000012904543"
            },
            {
              title: "electron-vue架构解析-开发环境启动流程分析",
              url: "https://blog.csdn.net/u010961631/article/details/80651349#%E6%B8%B2%E6%9F%93%E8%BF%9B%E7%A8%8B%E7%9A%84webpackrendererconfig%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6"
            },
            {
              title: "用JS开发跨平台桌面应用，从原理到实践",
              url: "https://mp.weixin.qq.com/s/4WaUM8iJoEYgrI_HpC5MOQ"
            },
            
          ]
        },
        {
          type: "NodeJS",
          title: "NodeJS",
          articles: [
            {
              title: "Node在小菜前端团队的技术实践",
              url: "https://juejin.im/post/5ca321f76fb9a05e5d09bb8a#heading-2"
            }
          ]
        },
        {
          type: "AR/VR",
          title: "AR/VR",
          articles: [
            {
              title: "现阶段（2017-2018）AR/VR开发技术概述",
              url: "https://segmentfault.com/a/1190000014891945"
            },
            {
              title: "Three.js中的自定义几何体",
              url: "https://mp.weixin.qq.com/s/7wOHircEX3qUMWtukjRvnw"
            }
          ]
        },
        {
          type: "Animate",
          title: "Animate",
          articles: [
            {
              title: "如何选取合适的前端动效方案？",
              url: "https://juejin.im/post/5cc08848e51d456e7618a6ee"
            }
          ]
        },
        {
          type: "TypeScript",
          title: "TypeScript",
          articles: [
            {
              title: "vue + typescript 新项目起手式",
              url: "https://segmentfault.com/a/1190000011744210#articleHeader12"
            },
            {
              title: "vue + typescript 进阶篇",
              url: "https://segmentfault.com/a/1190000011878086"
            },
            {
              title: "react + typescript  新项目起手式",
              url: "https://ant.design/docs/react/use-in-typescript-cn"
            }
          ]
        },
        {
          type: "developer",
          title: "作为开发者",
          articles: [
            {
              title: "2019前端技术趋势",
              url: "https://mp.weixin.qq.com/s?__biz=MjM5MDE0Mjc4MA==&mid=2651014404&idx=2&sn=7ed7c965c10af5463b0ffadd9661ab61&chksm=bdbebd578ac93441467b1d81bc81141f2cecbee0b35dd625c62156d8f6abd33d1bea8661bea6&xtrack=1&scene=0&subscene=131&clicktime=1552918479&ascene=7&devic"
            },
            {
              title: "W3C in 2018",
              url: "https://mp.weixin.qq.com/s/o0EnLmcCX1FvjIe3NbutJA"
            },
            {
              title: "从张云龙职业生涯启发程序员如何度过中年危机",
              url: "https://mp.weixin.qq.com/s/zWPjfHiYxx0HH9lE99Yijw"
            }
          ]
        }
      ]
    };
  }
  public render() {
    return (
      <div className={style.container}>
        <QueueAnim type="right" ease="easeInOutQuart">
          {this.state.renderList.map((item: IModule) => {
            return (
              <section key={item.type}>
                <h1>{item.title}</h1>
                <ul>
                  {item.articles.map((article: IArticleItem) => {
                    return (
                      <li key={article.title}>
                        <a target="_blank" href={article.url}>
                          {article.title}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </QueueAnim>
      </div>
    );
  }
}

export default About;
