// 1.使用location中的query或state传值缺陷：只有从上一页正常跳转来才会有值，直接刷新或后退到这一页值为undefined
// 2.使用match中的params传值缺陷：只有在组件内部才能取到this.props.match，在组件内部动态调取文件会出问题

import { Badge } from "antd";
import QueueAnim from "rc-queue-anim";
import * as React from "react";
import Loadable from "react-loadable";

import menu from "../../menu";
import style from "./index.scss";

import demoErector from "../../components/demoErector";
import textErector from "../../components/textErector";

import DemoLoading from "../../components/demoLoading"
import TextLoading from "../../components/textLoading"


class Detail extends React.Component<any, {}> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    const { id } = this.props.match.params;
    const target = menu.find(item => item.id === id)
    const title = target.title;
    const dependencies = target.dependencies || [];
    const dependenciesText = (dependencies || []).join("、");
    const TextModule = Loadable({
      loader: () =>
        import(`../../project/${id}/text`).then(module =>
          textErector(module.default)
        ),
      loading: TextLoading
    });
    const DemoModule = Loadable({
      loader: () =>
        import(`../../project/${id}/demo`).then(module =>
          demoErector(module.default)
        ),
      loading: DemoLoading
    });

    return (
      <div className={style.container}>
        <QueueAnim type="right" ease="easeInOutQuart">
          <Badge
            className={style.themeName}
            key="title"
            status={dependencies.length === 0 ? "default" : "warning"}
            text={dependenciesText}
          >
            {title}
          </Badge>
          <DemoModule key="demo" />
          <TextModule key="text" />
        </QueueAnim>
      </div>
    );
  }
}

export default Detail;
