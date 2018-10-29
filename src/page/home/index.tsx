import QueueAnim from "rc-queue-anim";
import React from "react";
import { Link } from "react-router-dom";
import menu from "../../menu";
import style from "./index.scss";

// tslint:disable-next-line:no-console
console.log(menu);

class Home extends React.Component<{ match: any }> {
  constructor(props: { match: any }) {
    super(props);
    // 注：期初想把type定义在这里，在构造中定义只有页面第一次渲染会触发，当路由动态变化时不会自动刷新，所以放到render中
  }
  public render() {
    const type = this.props.match.params.type || "idea";
    const list = Object.values(menu[type] || {});
    const average = Math.floor(list.length / 3);
    const remainder = list.length % 3;
    const cols: any = [[], [], []];
    switch (remainder) {
      case 1:
        cols[0] = list.slice(0, average + 1);
        cols[1] = list.slice(average + 1, 2 * average + 1);
        cols[2] = list.slice(2 * average + 1);
        break;
      case 2:
        cols[0] = list.slice(0, average + 1);
        cols[1] = list.slice(average + 1, 2 * average + 2);
        cols[2] = list.slice(2 * average + 2);
        break;
      default:
        cols[0] = list.slice(0, average);
        cols[1] = list.slice(average, 2 * average);
        cols[2] = list.slice(2 * average);
        break;
    }
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
