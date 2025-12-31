import { useRef, useCallback } from "react";
import { useGame } from "@/hooks/useGame";
import Grid from "@/components/game/Grid";
import ScoreDisplay from "@/components/game/ScoreDisplay";
import GameOverlay from "@/components/game/GameOverlay";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { Direction } from "@/types/game";

const Index = () => {
  const {
    grid,
    score,
    bestScore,
    gameOver,
    won,
    keepPlaying,
    handleMove,
    restart,
    continueGame,
  } = useGame();

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;

      const minSwipeDistance = 30;

      if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
        return;
      }

      let direction: Direction;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? "right" : "left";
      } else {
        direction = deltaY > 0 ? "down" : "up";
      }

      handleMove(direction);
      touchStartRef.current = null;
    },
    [handleMove]
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground">2048</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Join the tiles, get to <strong>2048!</strong>
            </p>
          </div>
          <ScoreDisplay score={score} bestScore={bestScore} />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Use <strong>arrow keys</strong> or <strong>swipe</strong> to play
          </p>
          <Button onClick={restart} variant="default" size="sm" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            New Game
          </Button>
        </div>

        {/* Game Grid */}
        <div
          className="relative touch-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Grid grid={grid} />

          {/* Game Over Overlay */}
          {gameOver && <GameOverlay type="over" onRestart={restart} />}

          {/* Win Overlay */}
          {won && !keepPlaying && (
            <GameOverlay type="won" onRestart={restart} onContinue={continueGame} />
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-sm text-muted-foreground">
          <p className="font-semibold mb-2">How to play:</p>
          <p>
            Use your <strong>arrow keys</strong> or <strong>WASD</strong> to move
            the tiles. When two tiles with the same number touch, they{" "}
            <strong>merge into one!</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
