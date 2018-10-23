// CSS表单美化
import React from "react";
import style from "./index.scss";
import Rx from "rxjs/Rx";
import {
  moveTo,
  line,
  dist,
  angle,
  getVector,
  metaball,
  metaballToPath
} from "./utils";

class Metaballs extends React.Component {
  componentDidMount() {
    const circle1 = document.querySelector("#js-circle1");
    const circle2 = document.querySelector("#js-circle2");
    const connector = document.querySelector("#js-connector");
    const VIEWBOX_SIZE = { W: 1200, H: 400 };
    const SIZES = {
      CIRCLE1: 96,
      CIRCLE2: 64
    };

    // of：创建一个 Observable，它会依次发出由你提供的参数，最后发出完成通知。
    // do：拦截源 Observable 上的每次发送并且运行一个函数，但返回的输出 Observable 与 源 Observable 是相同的。
    const circle1$ = Rx.Observable.of([600, 120]).do(loc => {
      moveTo(loc, circle1);
    });

    // interval：创建一个 Observable ，该 Observable 使用指定的 IScheduler ，并以指定时间间隔发出连续的数字。
    // map ：转化发出的value
    // Rx.Scheduler.animationFrame : 动画帧调度器
    const circle2$ = Rx.Observable.interval(0, Rx.Scheduler.animationFrame)
      .map(frame => 200 * Math.sin(frame / 500)) //利用余弦函数得到变化的x值
      .map(x => [600 + x, 120])
      .do(loc => {
        moveTo(loc, circle2);
      });

    // combineLatest：组合多个 Observables 来创建一个 Observable ，该 Observable 的值根据每个输入 Observable 的最新值计算得出的。
    Rx.Observable.combineLatest(circle1$, circle2$, (circle1Loc, circle2Loc) =>
      metaball(SIZES.CIRCLE1, SIZES.CIRCLE2, circle1Loc, circle2Loc)
    ).subscribe(path => {
      connector.setAttribute("d", path);
    });
  }
  render() {
    return (
      <main className={style.container}>
        <svg
          className={style.svgContainer}
          viewBox="0 0 1200 240"
          preserveAspectRatio="xMidYMid slice"
        >
          <g strokeWidth="6" fill="#fff" stroke="#333">
            <circle id="js-circle1" cx="400" cy="100" r="96" />
            <circle id="js-circle2" cx="400" cy="100" r="64" stroke="none" />
            <path id="js-connector" d="" fill="#333" />
          </g>
        </svg>
      </main>
    );
  }
}

export default Metaballs;
