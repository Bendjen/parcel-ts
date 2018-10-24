// 1.使用location中的query或state传值缺陷：只有从上一页正常跳转来才会有值，直接刷新或后退到这一页值为undefined
// 2.使用match中的params传值缺陷：只有在组件内部才能取到this.props.match，在组件内部动态调取文件会出问题
// 3.demo不能使用异步加载，因为代码路径一开始是不确定的，如果需要异步加载得把所有demo编译成单独的js才可以异步引入

import React from "react";
import Loadable from 'react-loadable';
// import { menuList } from "../../data/map";
import style from "./index.scss";

// 对应当前路由的数据
const Loading = () => <div>Loading...</div>;

let Demo

class Detail extends React.Component<{ match: any }> {
  constructor(props: { match: any }) {
    super(props);
  }

  public ifRender(content: any) {
    if (content) {
      return {};
    } else {
      return { display: "none" };
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
    // const routeParams = this.props.match.params;
    const param = 'detail'
    import('./text').then((page) => {
      // tslint:disable-next-line:no-console
      console.log(page)
    })

    Demo = Loadable({
      // loader: () => import(`../../demo/${param}`),
      loader: () => import(`../../demo/${param}`),
      loading: Loading,
    })
    return (
      <div className={style.container}>

        {this.demoRender(Demo)}

      </div>
    );
  }
}

export default Detail;
