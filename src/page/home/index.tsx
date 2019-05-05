import QueueAnim from "rc-queue-anim";
import React from "react";
import { Link } from "react-router-dom";
import menu from "../../menu";
import style from "./index.scss";

// tslint:disable-next-line:no-console

class Home extends React.Component<{ match: any }> {
  constructor(props: { match: any }) {
    super(props);
    // 注：期初想把type定义在这里，在构造中定义只有页面第一次渲染会触发，当路由动态变化时不会自动刷新，所以放到render中
  }
  public render() {
    const type = this.props.match.params.type || "idea";
    const list = menu.filter((item: any) => item.catelog === type)
    let curColIndex: number = 0;
    const cols: any = [[], [], []];
    list.forEach((item: any) => {
      cols[curColIndex].push(item);
      curColIndex === 2 ? curColIndex = 0 : curColIndex++
    })
    return (
      <div className={style.container}>
        <QueueAnim type="bottom" ease="easeInOutQuart" data-flex="main:justify">
          {cols.map((item: any, index: any) => (
            <ul className={style.list} key={index}>
              {item.map((son: any) => (
                <li key={son.id}>
                  <Link
                    to={`/detail/${type}/${son.id}`}
                    data-flex="dir:top main:center cross:center"
                  >
                    {/* <img src={"./dist/" + son.img} /> */}
                    <img src={son.img} />
                    <span>{son.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </QueueAnim>
      </div>
    );
  }
}

export default Home;
