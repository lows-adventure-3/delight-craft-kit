interface ScoreDisplayProps {
  score: number;
  bestScore: number;
}

const ScoreDisplay = ({ score, bestScore }: ScoreDisplayProps) => {
  return (
    <div className="flex gap-3">
      <div className="bg-[hsl(var(--grid-bg))] px-4 py-2 md:px-6 md:py-3 rounded-md text-center min-w-[80px] md:min-w-[100px]">
        <p className="text-xs md:text-sm uppercase text-[hsl(34,25%,80%)] font-medium">Score</p>
        <p className="text-xl md:text-2xl font-bold text-white">{score}</p>
      </div>
      <div className="bg-[hsl(var(--grid-bg))] px-4 py-2 md:px-6 md:py-3 rounded-md text-center min-w-[80px] md:min-w-[100px]">
        <p className="text-xs md:text-sm uppercase text-[hsl(34,25%,80%)] font-medium">Best</p>
        <p className="text-xl md:text-2xl font-bold text-white">{bestScore}</p>
      </div>
    </div>
  );
};

export default ScoreDisplay;
