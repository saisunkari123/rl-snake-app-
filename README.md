# RL Snake App

This is a React-based web application that demonstrates a Reinforcement Learning (RL) agent learning to play the Snake game in real-time using the Q-Learning algorithm.

## Features

- **Real-time Training**: Watch the agent learn from scratch.
- **Interactive Controls**: Toggle between "Train (Fast)" and "Watch (Slow)" modes.
- **Live Statistics**: Track episodes, high score, epsilon (exploration rate), and current score.
- **Adjustable Speed**: Control the simulation speed in "Watch" mode.

## Getting Started

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Start the development server:
    ```bash
    npm run dev
    ```

3.  Open your browser at `http://localhost:5173`.

## Code Structure

- `src/game/SnakeGame.js`: Core game logic (grid, movement, collisions).
- `src/ai/QLearningAgent.js`: Q-Learning implementation (Q-table, epsilon-greedy policy, Bellman update).
- `src/components/SnakeApp.jsx`: Main UI component handling the game loop and rendering.
- `src/components/SnakeApp.css`: Styling for the application.

## Algorithm Details

The agent uses **Q-Learning** with the following state representation:
- **Danger**: Is there an obstacle Straight, Right, or Left? (3 bits)
- **Food Direction**: Is the food Left, Right, Up, or Down relative to the head? (4 bits)

This simplified state space allows the agent to learn a decent policy relatively quickly.
