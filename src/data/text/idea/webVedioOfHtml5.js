const htmlText = `<svg
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
`;


const javaScriptText = `//启动部分：
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

//核心部分：
    // @angleBetweenCenters : 两圆心夹角极坐标
    // @spread : 两圆切点与大圆圆心成角
    // @u1,u2: 两圆交点到圆心连线与两圆心连线的夹角
    // v：粘度系数，0-1，越大越趋于直线
  
    // 1.利用两圆切线求出四个切点的极坐标
    const angle1 = angleBetweenCenters + u1 + (spread - u1) * v;
    const angle2 = angleBetweenCenters - u1 - (spread - u1) * v;
    const angle3 =
      angleBetweenCenters + Math.PI - u2 - (Math.PI - u2 - spread) * v;
    const angle4 =
      angleBetweenCenters - Math.PI + u2 + (Math.PI - u2 - spread) * v;
    // 2.转换极坐标为笛卡尔坐标系
    const p1 = getVector(center1, angle1, radius1);
    const p2 = getVector(center1, angle2, radius1);
    const p3 = getVector(center2, angle3, radius2);
    const p4 = getVector(center2, angle4, radius2);
    // 3.利用四个切点再对自身圆坐切线，求得四个手柄的点
    const totalRadius = radius1 + radius2;
    const d2Base = Math.min(v * handleLenRate, dist(p1, p3) / totalRadius);
  
    const d2 = d2Base * Math.min(1, d * 2 / (radius1 + radius2));
  
    const r1 = radius1 * d2;  //手柄长度
    const r2 = radius2 * d2;  //手柄长度
  
    const h1 = getVector(p1, angle1 - HALF_PI, r1);
    const h2 = getVector(p2, angle2 + HALF_PI, r1);
    const h3 = getVector(p3, angle3 + HALF_PI, r2);
    const h4 = getVector(p4, angle4 - HALF_PI, r2);
  
    // 4.根据切点坐标、手柄坐标、圆半径绘制出path的路线系数
    const path = metaballToPath(p1,p2,p3,p4,h1,h2,h3,h4,d > radius1, radius2);

    return path;
`;

export default { htmlText, javaScriptText };
