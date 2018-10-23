import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { animationFrame } from "rxjs/scheduler/animationFrame";

import { interval } from "rxjs/observable/interval";
import { fromEvent } from "rxjs/observable/fromEvent";
import { combineLatest } from "rxjs/observable/combineLatest";
import { of } from "rxjs/observable/of";

import { nextDirection, move, generateSnake, generateApples, eat, isGameOver } from "./utils"
import {
	map,
	filter,
	scan,
	startWith,
	distinctUntilChanged,
	share,
	withLatestFrom,
	tap,
	skip,
	switchMap,
	takeWhile,
	first
} from "rxjs/operators";

import {
	createCanvasElement,
	renderScene,
	renderApples,
	renderSnake,
	renderScore,
	renderGameOver,
	getRandomPosition,
	checkCollision
} from "./canvas";

import { DIRECTIONS, SPEED, INITIAL_DIRECTION, SNAKE_LENGTH, POINTS_PER_APPLE, FPS } from "./constants";


let ticks$ = interval(SPEED);
let click$ = fromEvent(document, "click");
let keydown$ = fromEvent(document, "keydown");

function createGame (fps$) {

	// 外部源（键盘 => 方向 =>  蛇）
	// 流1：键盘输入源  
	let direcion$ = keydown$
		.map(event => DIRECTIONS[event.keyCode])
		.filter(direcion => !!direcion)
		.scan(nextDirection)
		.startWith(INITIAL_DIRECTION)					//对于非interval这种自然流，需要手动触发的流如keydown$\click$\BehaviorSubject 需要设置初始值才能自动开始第一个动作，否者需要所有动作都触发后才会开始
		.distinctUntilChanged() //过滤相同的值


	// 人为源 (长度 =>  蛇的长度  =>  比分，蛇的位置  )
	// 流2：subject源  
	let length$ = new BehaviorSubject(SNAKE_LENGTH);	//当流是hot的时候，BehaviorSubject的初始值只对第一级订阅的流形成初始值，后面的流需要自己设置初始值才会启动

	let snakeLength$ = length$
		.scan((step, snakeLength) => snakeLength + step)
		.share()


	let score$ = snakeLength$
		.startWith(0) //订阅者snakeLength$将使得 share() 订阅底层的数据源，而底层的数据源会立即发出值，当随后的订阅再发生时，这个值其实是已经存在了的,所以BehaviorSubject 的初始值只出现在 snakeLength$ 中，而并没有出现在 score$ 中
		.scan((score) => score + POINTS_PER_APPLE)


	// 这里有两种实现模式
	// 这种触发更新的机制合并了时间和方向
	// 结果就是时间和按键触发的频率同时会更新蛇的移动

	// let snake$ = Observable.combineLatest(direcion$, ticks$, (direcion, tick) => direcion)
	//   .withLatestFrom(snakeLength$, (direcion, snakeLength) => [direcion, snakeLength])
	//   .scan(move, generateSnake())
	//   .share()



	// 而这种方式则只把蛇的移动绑定到时间上，每个时间点取按键的最后一次方向
	// 这样能让蛇的移动更加平均，但是会有一个BUG就是当你在时间间隔之中快速操作了↑→↓（假设蛇原来的移动方向是下），这样这个时间点就会检测成发生碰撞结束游戏

	// 自然源 （时间 => 蛇的移动 => 触发吃（修改苹果的位置和蛇的长度））
	// 流3： 时间源 => (snake,apple)
	let ticks$ = Observable.interval(SPEED);
	let snake$ = ticks$
		.withLatestFrom(direcion$, snakeLength$, (tick, direcion, snakeLength) => [direcion, snakeLength])
		.scan(move, generateSnake())
		.share()

	let apples$ = snake$
		.scan(eat, generateApples())
		.distinctUntilChanged()  //排除没吃到苹果的事件
		.share();

	let appleEaten$ = apples$
		.skip(1)
		.do(() => length$.next(POINTS_PER_APPLE))     //每次吃到苹果触发length$的更新,相当于再subscribe里面next
		.subscribe();       //applesEaten$只负责通知其他的流，而不会有观察者来订阅它。因此需要手动订阅。

	// combineLatest是当各个流有任何一个流有状态变更的时候就取他们的合并  
	let scene$ = Observable.combineLatest(snake$, apples$, score$, (snake, apples, score) => ({ snake, apples, score }));

	//withLatestFrom是根据当前流(fps$)的每次状态变更合并其他流的最后一次状态
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



export default startGame