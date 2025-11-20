import { ROWS, COLS, DIRECTIONS } from '../game/SnakeGame';

export class QLearningAgent {
    constructor(epsilon = 1.0, alpha = 0.1, gamma = 0.9) {
        this.qTable = {}; // State string -> [q0, q1, q2, q3]
        this.epsilon = epsilon; // Exploration rate
        this.alpha = alpha;     // Learning rate
        this.gamma = gamma;     // Discount factor
        this.episodes = 0;
    }

    getQValues(state) {
        if (!this.qTable[state]) {
            this.qTable[state] = [0, 0, 0, 0];
        }
        return this.qTable[state];
    }

    chooseAction(state) {
        if (Math.random() < this.epsilon) {
            return Math.floor(Math.random() * 4);
        } else {
            const qValues = this.getQValues(state);
            // Find max Q-value actions
            let maxQ = Math.max(...qValues);
            let bestActions = [];
            qValues.forEach((q, index) => {
                if (q === maxQ) bestActions.push(index);
            });
            // Randomly pick one of the best actions
            return bestActions[Math.floor(Math.random() * bestActions.length)];
        }
    }

    learn(state, action, reward, nextState, done) {
        const currentQ = this.getQValues(state)[action];
        const nextMaxQ = done ? 0 : Math.max(...this.getQValues(nextState));

        const newQ = currentQ + this.alpha * (reward + this.gamma * nextMaxQ - currentQ);
        this.qTable[state][action] = newQ;
    }

    // Helper to extract state from game instance
    getStateKey(game) {
        const head = game.snake[0];
        const food = game.food;
        const dir = game.direction; // 0:Up, 1:Right, 2:Down, 3:Left

        // Helper to check collision at a point
        const isCollision = (x, y) => {
            if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return true;
            for (let segment of game.snake) {
                if (x === segment.x && y === segment.y) return true;
            }
            return false;
        };

        // Danger detection
        // Directions: Up(0), Right(1), Down(2), Left(3)
        // Straight: dir
        // Right: (dir + 1) % 4
        // Left: (dir + 3) % 4

        const straightDir = DIRECTIONS[dir];
        const rightDir = DIRECTIONS[(dir + 1) % 4];
        const leftDir = DIRECTIONS[(dir + 3) % 4];

        const dangerStraight = isCollision(head.x + straightDir.x, head.y + straightDir.y) ? 1 : 0;
        const dangerRight = isCollision(head.x + rightDir.x, head.y + rightDir.y) ? 1 : 0;
        const dangerLeft = isCollision(head.x + leftDir.x, head.y + leftDir.y) ? 1 : 0;

        // Food location relative to head
        const foodLeft = food.x < head.x ? 1 : 0;
        const foodRight = food.x > head.x ? 1 : 0;
        const foodUp = food.y < head.y ? 1 : 0;
        const foodDown = food.y > head.y ? 1 : 0;

        // State key: Danger(3) + Food(4) = 7 bits
        // We could also include current direction, but relative danger might be enough.
        // Let's include current direction to be safe (4 bits -> 2 bits actually).
        // Total: 3 + 4 = 7 bits. 
        // Let's just concat them.
        return [
            dangerStraight,
            dangerRight,
            dangerLeft,
            foodLeft,
            foodRight,
            foodUp,
            foodDown
        ].join('');
    }
}
