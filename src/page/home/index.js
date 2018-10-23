import React from "react";
import { Link } from "react-router-dom";
import QueueAnim from "rc-queue-anim";
import style from "./index.scss";
import { menuList } from "../../data/map";

// console.log(menuList);

class Home extends React.Component {
  constructor(props) {
    super(props);
    //注：期初想把type定义在这里，在构造中定义只有页面第一次渲染会触发，当路由动态变化时不会自动刷新，所以放到render中
  }
  render() {
    let type = this.props.match.params.type || "idea";
    let list = Object.values(menuList[type] || {});
    let average = Math.floor(list.length / 3);
    let remainder = list.length % 3;
    let cols = [[], [], []];
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
      <div className={style.container} data-flex="main:justify">
        {cols.map((item, index) => (
          <ul className={style.list} key={index}>
            {/* <QueueAnim
			  type={["bottom", "top"]}
			  ease={["easeInQuart"]}
			> */}
            {item.map((son, index) => (
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
            {/* </QueueAnim> */}
          </ul>
        ))}
      </div>
    );
  }
}

export default Home;
