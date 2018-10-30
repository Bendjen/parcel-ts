import { SNAKE_LENGTH,APPLE_COUNT } from './constants'
import { checkCollision,getRandomPosition } from './canvas';

export function nextDirection (previous, next) {
    // 如果方向和原来相反，继续向原来的方向前进
    // 如何方向和原来方向不冲突，采用新的方向
    if (previous.x === next.x * -1 || next.y === previous.y * -1) {
        return previous;
    } else {
        return next
    }
}

// 蛇的移动
// 1.每次触发朝当前方向移动一个
export function move (snake, [direction, snakeLength]) {
    // 蛇头
    let nx = snake[0].x;
    let ny = snake[0].y;

    // 转向
    nx += 1 * direction.x;
    ny += 1 * direction.y;

    let tail;

    if (snakeLength > snake.length) {
        tail = { x: nx, y: ny };
    } else {
        tail = snake.pop();
        tail.x = nx;
        tail.y = ny;
    }

    snake.unshift(tail);

    return snake;
}

// 初始蛇的图像坐标
export function generateSnake () {
    let snake = [];

    for (let i = SNAKE_LENGTH - 1; i >= 0; i--) {
        snake.push({ x: i, y: 0 });
    }

    return snake;
}

export function generateApples () {
    let apples = [];

    for (let i = 0; i < APPLE_COUNT; i++) {
        apples.push(getRandomPosition());
    }

    return apples;
}

export function eat (apples, snake) {
    let head = snake[0];

    for (let i = 0; i < apples.length; i++) {
        if (checkCollision(apples[i], head)) {
            apples.splice(i, 1);
            return [...apples, getRandomPosition(snake)];
        }
    }

    return apples;
}

export function isGameOver(scene) {
    let snake = scene.snake;
    let head = snake[0];
    let body = snake.slice(1, snake.length);
  
    return body.some(segment => checkCollision(segment, head));
  }
  