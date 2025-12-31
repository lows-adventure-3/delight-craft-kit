import { Button } from "@/components/ui/button";
import { RotateCcw, ArrowRight } from "lucide-react";

interface GameOverlayProps {
  type: "won" | "over";
  onRestart: () => void;
  onContinue?: () => void;
}

const GameOverlay = ({ type, onRestart, onContinue }: GameOverlayProps) => {
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center gap-4 z-10">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground">
        {type === "won" ? "You Win! 🎉" : "Game Over!"}
      </h2>
      <p className="text-muted-foreground text-center px-4">
        {type === "won"
          ? "Congratulations! You reached 2048!"
          : "No more moves available."}
      </p>
      <div className="flex gap-3">
        <Button onClick={onRestart} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Try Again
        </Button>
        {type === "won" && onContinue && (
          <Button onClick={onContinue} className="gap-2 bg-primary text-primary-foreground">
            Keep Playing
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default GameOverlay;
