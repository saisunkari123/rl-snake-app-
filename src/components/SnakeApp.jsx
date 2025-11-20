import React, { useEffect, useRef, useState, useCallback } from 'react';
import { SnakeGame, ROWS, COLS } from '../game/SnakeGame';
import { QLearningAgent } from '../ai/QLearningAgent';
import './SnakeApp.css';

const CELL_SIZE = 20;
const WIDTH = COLS * CELL_SIZE;
const HEIGHT = ROWS * CELL_SIZE;

export default function SnakeApp() {
    const canvasRef = useRef(null);
    const [game] = useState(() => new SnakeGame());
    const [agent] = useState(() => new QLearningAgent());

    const [mode, setMode] = useState('AI_TRAINING'); // 'HUMAN', 'AI_TRAINING', 'AI_WATCH'
    const [speed, setSpeed] = useState(50); // ms per frame (lower is faster)
    const [stats, setStats] = useState({
        score: 0,
        highScore: 0,
        episode: 0,
        epsilon: agent.epsilon,
        totalReward: 0
    });

    const requestRef = useRef();
    const lastTimeRef = useRef(0);
    const episodeRef = useRef(0);
    const highScoreRef = useRef(0);

    // Handle Human Input
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (mode !== 'HUMAN') return;
            switch (e.key) {
                case 'ArrowUp': game.step(0); break;
                case 'ArrowRight': game.step(1); break;
                case 'ArrowDown': game.step(2); break;
                case 'ArrowLeft': game.step(3); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [mode, game]);

    const draw = (ctx) => {
        // Clear
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        // Draw Food
        ctx.fillStyle = '#ef4444';
        const { food, snake } = game.getState();
        ctx.beginPath();
        ctx.arc(
            food.x * CELL_SIZE + CELL_SIZE / 2,
            food.y * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE / 2 - 2,
            0,
            2 * Math.PI
        );
        ctx.fill();

        // Draw Snake
        snake.forEach((segment, i) => {
            ctx.fillStyle = i === 0 ? '#38bdf8' : '#0ea5e9';
            ctx.fillRect(
                segment.x * CELL_SIZE + 1,
                segment.y * CELL_SIZE + 1,
                CELL_SIZE - 2,
                CELL_SIZE - 2
            );
        });
    };

    const gameLoop = useCallback((time) => {
        const deltaTime = time - lastTimeRef.current;

        let updateInterval = mode === 'AI_TRAINING' ? 0 : speed;

        if (deltaTime >= updateInterval) {
            lastTimeRef.current = time;

            if (mode !== 'HUMAN') {
                // AI Step
                const stateKey = agent.getStateKey(game);
                const action = agent.chooseAction(stateKey);

                const { reward, done, score } = game.step(action);
                const nextStateKey = agent.getStateKey(game);

                agent.learn(stateKey, action, reward, nextStateKey, done);

                if (done) {
                    episodeRef.current += 1;
                    if (score > highScoreRef.current) highScoreRef.current = score;

                    // Decay epsilon
                    if (agent.epsilon > 0.01) agent.epsilon *= 0.995;

                    game.reset();
                }

                // Update stats occasionally to avoid React render lag
                if (episodeRef.current % 10 === 0 || mode === 'AI_WATCH') {
                    setStats({
                        score,
                        highScore: highScoreRef.current,
                        episode: episodeRef.current,
                        epsilon: agent.epsilon,
                        totalReward: reward // Just last reward for now
                    });
                }
            }
        }

        // Draw every frame
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) draw(ctx);

        requestRef.current = requestAnimationFrame(gameLoop);
    }, [mode, speed, game, agent]);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(gameLoop);
        return () => cancelAnimationFrame(requestRef.current);
    }, [gameLoop]);

    return (
        <div className="snake-app-container">
            <div className="header">
                <h1 className="title">
                    RL Snake Agent
                </h1>
                <div className="controls-group">
                    <button
                        onClick={() => setMode('AI_TRAINING')}
                        className={mode === 'AI_TRAINING' ? 'active-mode' : ''}
                    >
                        Train (Fast)
                    </button>
                    <button
                        onClick={() => setMode('AI_WATCH')}
                        className={mode === 'AI_WATCH' ? 'active-mode' : ''}
                    >
                        Watch (Slow)
                    </button>
                </div>
            </div>

            <div className="main-grid">
                <div className="card canvas-container">
                    <canvas
                        ref={canvasRef}
                        width={WIDTH}
                        height={HEIGHT}
                        className="game-canvas"
                    />
                </div>

                <div className="stats-panel">
                    <div className="card">
                        <h2 className="text-xl font-semibold mb-4 text-slate-200">Statistics</h2>
                        <div className="stats-grid">
                            <StatBox label="Episode" value={stats.episode} />
                            <StatBox label="High Score" value={stats.highScore} />
                            <StatBox label="Epsilon" value={stats.epsilon.toFixed(4)} />
                            <StatBox label="Current Score" value={stats.score} />
                        </div>
                    </div>

                    <div className="card">
                        <h2 className="text-xl font-semibold mb-4 text-slate-200">Controls</h2>
                        <div className="control-panel">
                            <label className="slider-label">Simulation Speed ({speed}ms)</label>
                            <input
                                type="range"
                                min="0"
                                max="200"
                                step="10"
                                value={speed}
                                onChange={(e) => setSpeed(Number(e.target.value))}
                                className="speed-slider"
                            />
                        </div>
                    </div>

                    <div className="card info-card">
                        <h3 className="info-title">How it works</h3>
                        <p className="info-text">
                            The agent uses Q-Learning to learn the optimal policy.
                            It explores randomly (Epsilon) and learns from rewards (+10 Food, -10 Death).
                            Watch as it slowly learns to avoid walls and seek food!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const StatBox = ({ label, value }) => (
    <div className="stat-box">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
    </div>
);
