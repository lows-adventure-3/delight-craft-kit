import { cn } from "@/lib/utils";
import { TileData } from "@/types/game";

interface TileProps {
  tile: TileData;
}

const getTileColor = (value: number): string => {
  const colors: Record<number, string> = {
    2: "bg-[hsl(34,25%,93%)] text-[hsl(28,20%,40%)]",
    4: "bg-[hsl(34,35%,88%)] text-[hsl(28,20%,40%)]",
    8: "bg-[hsl(25,75%,65%)] text-white",
    16: "bg-[hsl(22,80%,58%)] text-white",
    32: "bg-[hsl(15,80%,55%)] text-white",
    64: "bg-[hsl(12,85%,52%)] text-white",
    128: "bg-[hsl(45,90%,55%)] text-white",
    256: "bg-[hsl(45,92%,52%)] text-white",
    512: "bg-[hsl(45,95%,48%)] text-white",
    1024: "bg-[hsl(45,97%,45%)] text-white",
    2048: "bg-[hsl(45,100%,42%)] text-white",
  };
  return colors[value] || "bg-[hsl(0,0%,20%)] text-white";
};

const getFontSize = (value: number): string => {
  if (value < 100) return "text-4xl md:text-5xl";
  if (value < 1000) return "text-3xl md:text-4xl";
  return "text-2xl md:text-3xl";
};

const Tile = ({ tile }: TileProps) => {
  const cellSize = 100;
  const gap = 12;
  const xPos = tile.position.y * (cellSize + gap);
  const yPos = tile.position.x * (cellSize + gap);

  return (
    <div
      className={cn(
        "absolute w-[70px] h-[70px] md:w-[100px] md:h-[100px] rounded-md flex items-center justify-center font-bold transition-all duration-100",
        getTileColor(tile.value),
        getFontSize(tile.value),
        tile.isNew && "tile-new",
        tile.isMerged && "tile-merged"
      )}
      style={{
        transform: `translate(${tile.position.y * 82}px, ${tile.position.x * 82}px)`,
      }}
    >
      {tile.value}
    </div>
  );
};

export default Tile;
