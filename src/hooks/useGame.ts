import { useState, useEffect, useCallback } from "react";
import { GridCell, Direction } from "@/types/game";
import { initializeGrid, move, addRandomTile, canMove, hasWon } from "@/lib/gameLogic";

const STORAGE_KEY = "2048-game-state";
const BEST_SCORE_KEY = "2048-best-score";

export const useGame = () => {
  const [grid, setGrid] = useState<GridCell[][]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).grid;
      } catch {
        return initializeGrid();
      }
    }
    return initializeGrid();
  });

  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).score;
      } catch {
        return 0;
      }
    }
    return 0;
  });

  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem(BEST_SCORE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  });

  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [keepPlaying, setKeepPlaying] = useState(false);

  // Save game state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ grid, score }));
  }, [grid, score]);

  // Save best score
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem(BEST_SCORE_KEY, score.toString());
    }
  }, [score, bestScore]);

  const handleMove = useCallback(
    (direction: Direction) => {
      if (gameOver && !keepPlaying) return;
      if (won && !keepPlaying) return;

      const result = move(grid, direction);

      if (result.moved) {
        const newGrid = addRandomTile(result.grid);
        setGrid(newGrid);
        setScore((prev) => prev + result.score);

        // Check win condition
        if (!won && hasWon(newGrid)) {
          setWon(true);
        }

        // Check game over
        if (!canMove(newGrid)) {
          setGameOver(true);
        }
      }
    },
    [grid, gameOver, won, keepPlaying]
  );

  const restart = useCallback(() => {
    setGrid(initializeGrid());
    setScore(0);
    setGameOver(false);
    setWon(false);
    setKeepPlaying(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const continueGame = useCallback(() => {
    setKeepPlaying(true);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMap: Record<string, Direction> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
      };

      const direction = keyMap[e.key];
      if (direction) {
        e.preventDefault();
        handleMove(direction);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleMove]);

  return {
    grid,
    score,
    bestScore,
    gameOver,
    won,
    keepPlaying,
    handleMove,
    restart,
    continueGame,
  };
};
