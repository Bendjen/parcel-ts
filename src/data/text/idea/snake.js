


const javaScriptText = `
let ticks$ = interval(SPEED);
let click$ = fromEvent(document, "click");
let keydown$ = fromEvent(document, "keydown");

function createGame(fps$) {

  // 将键盘输入转换为方向输出
  let direcion$ = keydown$
    .map(event => DIRECTIONS[event.keyCode])
    .filter(direcion => !!direcion)
    .scan(nextDirection)
    .startWith(INITIAL_DIRECTION)
    .distinctUntilChanged() //过滤相同的值


  // length作为 BehaviorSubject 既是观察者也可以是被观察到的状态，被传播状态 
  let length$ = new BehaviorSubject(SNAKE_LENGTH);

  let snakeLength$ = length$
    .scan((step, snakeLength) => snakeLength + step)
    .share()

  let score$ = snakeLength$
    .startWith(0)
    .scan((score) => score + POINTS_PER_APPLE)


  let ticks$ = Observable.interval(SPEED);


  // 这里有两种实现模式
  // 这种触发更新的机制合并了时间和方向
  // 结果就是时间和按键触发的频率同时会更新蛇的移动

  // let snake$ = Observable.combineLatest(direcion$, ticks$, (direcion, tick) => direcion)
  //   .withLatestFrom(snakeLength$, (direcion, snakeLength) => [direcion, snakeLength])
  //   .scan(move, generateSnake())
  //   .share()



  // 而这种方式则只把蛇的移动绑定到时间上，每个时间点取按键的最后一次方向
  // 这样能让蛇的移动更加平均，但是会有一个BUG就是当你在时间间隔之中快速操作了↑→↓（假设蛇原来的移动方向是下），这样这个时间点就会检测成发生碰撞结束游戏

  let snake$ = ticks$
    .withLatestFrom(direcion$, snakeLength$, (tick, direcion, snakeLength) => [direcion, snakeLength])
    .scan(move, generateSnake())
    .share()

  let apples$ = snake$
    .scan(eat, generateApples())
    .distinctUntilChanged()
    .share();

  let appleEaten$ = apples$
    .skip(1)
    .do(() => length$.next(POINTS_PER_APPLE))
    .subscribe();

  let scene$ = Observable.combineLatest(snake$, apples$, score$, (snake, apples, score) => ({ snake, apples, score }));

  return fps$.pipe(withLatestFrom(scene$, (_, scene) => scene));
}

let game$ = of('Start Game').pipe(
  map(() => interval(1000 / FPS, animationFrame)),
  switchMap(createGame),
  takeWhile(scene => !isGameOver(scene))
);

const startGame = () => {
  let canvas = createCanvasElement();
  let ctx = canvas.getContext('2d');
  document.getElementById('container').innerHTML = ''
  document.getElementById('container').appendChild(canvas);

  game$.subscribe({
    next: (scene) => renderScene(ctx, scene),
    complete: () => {
      renderGameOver(ctx);

      click$.pipe(first()).subscribe(startGame);
    }
  })
};
`;

export default {  javaScriptText };
