# Project Report: Reinforcement Learning Snake Agent

**Student Name:** [Your Name]
**Course:** Reinforcement Learning (3-1 Semester)
**Project Title:** RL Snake Game Web Application

---

## 1. Abstract
This project demonstrates the application of Reinforcement Learning (RL) algorithms to train an autonomous agent to play the classic Snake game. Using the Q-Learning algorithm, the agent learns optimal strategies through trial and error, interacting with the game environment in real-time within a web-based interface.

## 2. Introduction
Reinforcement Learning is a subfield of machine learning where an agent learns to make decisions by performing actions in an environment and receiving rewards or penalties. The goal of this project is to visualize this learning process in an interactive web application.

The "Snake" game serves as an ideal environment for RL due to its discrete state space and clear reward structure (eat food = good, hit wall/self = bad).

## 3. Methodology

### 3.1 Algorithm: Q-Learning
We utilized **Q-Learning**, a model-free RL algorithm. The agent maintains a Q-Table, which maps **States** and **Actions** to **Q-Values** (expected future rewards).

The Bellman Equation used for updates is:
$$ Q(s, a) \leftarrow Q(s, a) + \alpha [R + \gamma \max Q(s', a') - Q(s, a)] $$

Where:
*   $\alpha$ (Alpha): Learning Rate (0.1)
*   $\gamma$ (Gamma): Discount Factor (0.9)
*   $R$: Reward received
*   $\epsilon$ (Epsilon): Exploration rate (starts at 1.0, decays over time)

### 3.2 State Representation
To keep the state space manageable for the browser, we simplified the state into a 7-bit feature vector:
1.  **Danger Straight** (0/1)
2.  **Danger Right** (0/1)
3.  **Danger Left** (0/1)
4.  **Food Left** (0/1)
5.  **Food Right** (0/1)
6.  **Food Up** (0/1)
7.  **Food Down** (0/1)

This allows the agent to generalize situations (e.g., "Food is to the right, and there is a wall straight ahead") rather than memorizing every specific grid configuration.

### 3.3 Reward System
*   **+10**: Eating Food
*   **-10**: Collision (Wall or Self)
*   **-0.1**: Living penalty (to encourage efficiency)

## 4. System Architecture

### 4.1 Tech Stack
*   **Frontend**: React.js (Vite)
*   **Styling**: CSS3 (Custom Dark Mode UI)
*   **Logic**: JavaScript (ES6+)

### 4.2 Modules
*   **`SnakeGame.js`**: Manages the game grid, snake movement, and collision detection.
*   **`QLearningAgent.js`**: Contains the AI logic, Q-Table, and learning step.
*   **`SnakeApp.jsx`**: The React component that bridges the Game and the Agent, handling the game loop and rendering the canvas.

## 5. Results and Observations
*   **Initial Phase (Episodes 0-50)**: The agent moves randomly due to high Epsilon. It crashes frequently.
*   **Learning Phase (Episodes 50-200)**: The agent begins to associate "Food Direction" with movement and avoids immediate walls.
*   **Trained Phase (Episodes 200+)**: The agent consistently finds food and avoids obstacles, achieving higher scores.

## 6. Conclusion
The project successfully implements a Q-Learning agent in a web browser. It provides an interactive way to observe RL concepts like Exploration vs. Exploitation and convergence.

## 7. How to Run
1.  **Source Code**: [https://github.com/saisunkari123/rl-snake-app-](https://github.com/saisunkari123/rl-snake-app-)
2.  **Installation**:
    ```bash
    git clone https://github.com/saisunkari123/rl-snake-app-.git
    cd rl-snake-app-
    npm install
    npm run dev
    ```
3.  **Access**: Open `http://localhost:5173` in your browser.
