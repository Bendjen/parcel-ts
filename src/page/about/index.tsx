// tslint:disable-next-line:no-var-requires
const FileSaver = require("file-saver");
import QueueAnim from "rc-queue-anim";
import React from "react";
import style from "./index.scss";
class About extends React.Component {
  public render() {
    return (
      <div className={style.container}>
        <QueueAnim
          type="right"
          ease="easeInOutQuart"
        >
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
              <div>工作经历：拥有两年前端开发经验，熟悉前端主流技术栈，可以独立构建开发，目前就职于票付通</div>
              <div data-flex='cross:center'>我的简历：<img className={style.excel} onClick={this.downloadResume} src="img/assets/excel-iocn.png" alt="" /></div>
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

          <section key="MyProject">
            <h1 className={style.title}>我的项目</h1>
            <div className={style.content}>
              <div>
                <p>个人小站：本页</p>
              </div>
            </div>
          </section>

          <section key="AboutSite">
            <h1 className={style.title}>关于本站</h1>
            <div className={style.content}>
              <div>
                历史版本：
                <a target="_blank" href="https://bendjen.github.io/parcel-embryo">
                  https://bendjen.github.io/parcel-embryo
                </a>
              </div>
              <div>所用架构： react、webpack、typescript、antd</div>

              <div>
                相比旧版：
                <ol>
                  <li>
                    弃用了繁重的redux状态管理，改用webpack的require.context()，自动目录寻址配置；改用按需加载提升加载速度。
                  </li>
                  <li>
                    重构了目录结构，旧版采用以项目组件为单位形成页面，会有大量冗余的通用代码；而现在提炼以页面功能组件为单位只剩下home、detai、mark、about四个页面。
                  </li>
                  <li>
                    采用typeScript、react-app-rewired进行了重构。
                  </li>
                </ol>
              </div>

              <div>
                其他：
                本站用于收录在各开源网站上有趣的小玩意或自己工作中整理的内容，有任何无意侵犯到您权益的部分请联系我进行删除。
              </div>
            </div>
          </section>
        </QueueAnim>
      </div>
    );
  }
  private downloadResume() {
    FileSaver.saveAs("/resume/郑家燊.xls", "简历-郑家燊.xls");
  }
}

export default About;
