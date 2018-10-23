import React from "react";
import { Link } from "react-router-dom";
// import QueueAnim from "rc-queue-anim";
import style from "./index.scss";
import QueueAnim from "rc-queue-anim";

class About extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={style.container}>
        {/* <QueueAnim
          type={["bottom", "top"]}
          ease={["easeOutQuart", "easeInOutQuart"]}
        > */}
          <section key="AboutMe">
            <h1 className={style.title}>关于我</h1>
            <div className={style.content}>
              <div>
                姓名：郑家燊
              </div>
              <div>
                毕业学校：福建农林大学本科（2017年毕业）
              </div>
              <div>
                英语水平：英语六级
              </div>
              <div>兴趣爱好：游泳、钢琴</div>
              <div>工作经历：有近一年前端开发经验，目前就职于票付通</div>
              <div>能力水平：
              <ol>
                  <li>
                    可以独立使用Vue生态(vue/vue-router/vuex/elementUI)/React生态(react/react-router/redux/antd)进行业务开发
                  </li>
                  <li>
                    有参与小程序和基于Electron开发桌面APP的经验；熟悉ES6、移动端自适应开发
                  </li>
                  <li>可以独立使用Webpack或parcel进行打包与架构</li>
                  <li>熟悉Git协作模式</li>
                  <li>具有较强的学习能力与对新技术的热情</li>
                </ol>
              </div>
            </div>
          </section>

          <section key="ContactMe">
            <h1 className={style.title}>联系我</h1>
            <div className={style.content}>
              <p>
                <i className="iconfont icon-qq" />
                <span>122760248</span>
              </p>
              <p>
                <i className="iconfont icon-weixin" />
                <span>unbolibobo</span>
              </p>
              <p>
                <i className="iconfont icon-github" />
                <span>https://github.com/Bendjen</span>
              </p>
              <p>
                <i className="iconfont icon-email" />
                <span>unbolibobo@foxmail.com</span>
              </p>
            </div>
          </section>

          <section key="aboutSite">
            <h1 className={style.title}>关于本站</h1>
            <div className={style.content}>
              <div>
                历史版本：
                <a target="_blank" href="https://bendjen.github.io/parcel-old/">
                  https://bendjen.github.io/parcel-old/
                </a>
              </div>
              <div>所用架构： react、react-router、parcel</div>

              <div>
                相比旧版：
                <ol>
                  <li>
                    弃用了Redux、Webpack，重新设计了界面，由内至外轻量化。
                  </li>
                  <li>
                    结构优化，由原来的 n(data) -> 1(store) -> n(component) ->
                    n(view) 转为 n(data) ->1
                    (view)；大大降低了后续维护的复杂度。
                  </li>
                  <li>
                    直接将demo注入页面，同时增强了页面的生动性与体验感。
                  </li>
                  <li>
                    不过旧版是针对移动端和PC端设计了两版布局来自适应，新版只适配了PC端（同时适配两端调试的时候太花时间了）。
                  </li>
                </ol>
              </div>

              <div>
                其他：
                本页用于收录在各开源网站上有趣的小玩意或自己工作中整理的内容，有任何无意侵犯到您权益的部分请联系我进行删除。
              </div>
            </div>
          </section>
        {/* </QueueAnim> */}
      </div>
    );
  }
}

export default About;
