export const ROWS = 20;
export const COLS = 20;

export const DIRECTIONS = [
  { x: 0, y: -1 }, // Up
  { x: 1, y: 0 },  // Right
  { x: 0, y: 1 },  // Down
  { x: -1, y: 0 }, // Left
];

export class SnakeGame {
  constructor() {
    this.reset();
  }

  reset() {
    this.snake = [{ x: 10, y: 10 }];
    this.food = this.spawnFood();
    this.direction = 1; // Start moving Right
    this.score = 0;
    this.steps = 0;
    this.done = false;
    return this.getState();
  }

  spawnFood() {
    let food;
    while (true) {
      food = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS),
      };
      // Check if food is on snake
      let onSnake = false;
      for (let segment of this.snake) {
        if (segment.x === food.x && segment.y === food.y) {
          onSnake = true;
          break;
        }
      }
      if (!onSnake) break;
    }
    return food;
  }

  step(action) {
    // Action: 0=Up, 1=Right, 2=Down, 3=Left
    // Prevent 180 degree turns
    if (
      (action === 0 && this.direction === 2) ||
      (action === 1 && this.direction === 3) ||
      (action === 2 && this.direction === 0) ||
      (action === 3 && this.direction === 1)
    ) {
      // Ignore invalid action, keep current direction
      // Or maybe punish? For now, just ignore.
      action = this.direction;
    }

    this.direction = action;
    const head = this.snake[0];
    const newHead = {
      x: head.x + DIRECTIONS[this.direction].x,
      y: head.y + DIRECTIONS[this.direction].y,
    };

    this.steps++;
    let reward = 0;
    this.done = false;

    // Check collisions
    if (
      newHead.x < 0 ||
      newHead.x >= COLS ||
      newHead.y < 0 ||
      newHead.y >= ROWS ||
      this.isCollision(newHead)
    ) {
      this.done = true;
      reward = -10;
      return { reward, done: this.done, score: this.score };
    }

    // Move snake
    this.snake.unshift(newHead);

    // Check food
    if (newHead.x === this.food.x && newHead.y === this.food.y) {
      this.score++;
      reward = 10;
      this.food = this.spawnFood();
    } else {
      this.snake.pop();
      // Small penalty for living to encourage eating, or 0
      reward = -0.1; 
    }

    // Loop penalty to prevent infinite loops
    if (this.steps > 100 * (this.snake.length + 1)) {
        this.done = true;
        reward = -10; // Starvation
    }

    return { reward, done: this.done, score: this.score };
  }

  isCollision(pt) {
    for (let segment of this.snake) {
      if (pt.x === segment.x && pt.y === segment.y) return true;
    }
    return false;
  }

  getState() {
    return {
      snake: this.snake,
      food: this.food,
      score: this.score,
      done: this.done,
    };
  }
}
