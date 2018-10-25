// 1.使用location中的query或state传值缺陷：只有从上一页正常跳转来才会有值，直接刷新或后退到这一页值为undefined
// 2.使用match中的params传值缺陷：只有在组件内部才能取到this.props.match，在组件内部动态调取文件会出问题
// 3.demo不能使用异步加载，因为代码路径一开始是不确定的，如果需要异步加载得把所有demo编译成单独的js才可以异步引入

import { Badge } from "antd";
// import QueueAnim from "rc-queue-anim";
import * as React from "react";
import Loadable from "react-loadable";
import SyntaxHighlighter from "react-syntax-highlighter/prism";
import { atomDark } from "react-syntax-highlighter/styles/prism";
import menu from "../../menu";
import style from "./index.scss";

let Demo: any;
let Text: any = {
  readMeText: "",
  exampleText: "",
  htmlText: "",
  javaScriptText: "",
  cssText: ""
};

const Loading = () => <div>Loading...</div>;

class Detail extends React.Component<any, {}> {
  constructor(props: any) {
    super(props);
  }

  public ifRender(content: any) {
    if (content) {
      return {};
    } else {
      return { display: "none" };
    }
  }

  public textRender(title: string, language: string, text: any): any {
    const type = typeof text;
    if (title === "功能" && text) {
      return (
        <section key={title}>
          <h2 className={style.title}>{title}</h2>
          <div
            className={style.text}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </section>
      );
    } else if (type === "object" && text.length > 0) {
      return (
        <section key={title}>
          <h2 className={style.title}>{title}:</h2>
          <div className={style.content}>
            {text.map((item: any) => {
              return (
                <div key={item.title} className={style.part}>
                  <h3>{item.title}：</h3>
                  <SyntaxHighlighter language={language} style={atomDark}>
                    {item.text}
                  </SyntaxHighlighter>
                </div>
              );
            })}
          </div>
        </section>
      );
    } else if (type === "string" && text) {
      return (
        <section key={title}>
          <h2 className={style.title}>{title}:</h2>
          <div className={style.content}>
            <SyntaxHighlighter language={language} style={atomDark}>
              {text}
            </SyntaxHighlighter>
          </div>
        </section>
      );
    }
  }

  // tslint:disable-next-line:no-shadowed-variable
  public demoRender(Demo: any): any {
    if (Demo) {
      return (
        <section key="demo">
          <h2 className={style.title}>Demo:</h2>
          <div className={style.content} data-flex="main:center">
            <Demo />
          </div>
        </section>
      );
    }
  }

  public render() {
    const { id, type } = this.props.match.params;
    const { title, dependencies } = menu[type][id];
    const dependenciesText = (dependencies || []).join("、");
    Demo = Loadable({
      loader: () => import(`../../project/${id}/demo`),
      loading: Loading
    });

    import(`../../project/${id}`).then(module => {
      Text = Object.assign(Text, module.text);
    });
    return (
      <div className={style.container}>
        {/* <QueueAnim
          type={["right", "left"]}
          ease={["easeOutQuart", "easeInOutQuart"]}
        > */}
        <Badge
          className={style.themeName}
          key="title"
          status="warning"
          //   status={dependencies.length === 0 ? "" : "warning"}
          text={dependenciesText}
        >
          {title}
        </Badge>
        {this.demoRender(Demo)}
        {this.textRender("功能", "html", Text.readMeText)}
        {this.textRender("使用", "javascript", Text.exampleText)}
        {this.textRender("Html", "html", Text.htmlText)}
        {this.textRender("JavaScript", "jsx", Text.javaScriptText)}
        {this.textRender("CSS", "scss", Text.cssText)}
        {/* </QueueAnim> */}
      </div>
    );
  }
}

export default Detail;
