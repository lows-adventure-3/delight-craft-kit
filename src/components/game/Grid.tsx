import { GridCell } from "@/types/game";
import { getTilesFromGrid } from "@/lib/gameLogic";
import Tile from "./Tile";

interface GridProps {
  grid: GridCell[][];
}

const Grid = ({ grid }: GridProps) => {
  const tiles = getTilesFromGrid(grid);

  return (
    <div className="relative bg-[hsl(var(--grid-bg))] p-3 rounded-lg">
      {/* Background cells */}
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            key={i}
            className="w-[70px] h-[70px] md:w-[100px] md:h-[100px] bg-[hsl(var(--cell-bg))] rounded-md"
          />
        ))}
      </div>

      {/* Tiles layer */}
      <div className="absolute top-3 left-3">
        {tiles.map((tile) => (
          <Tile key={tile.id} tile={tile} />
        ))}
      </div>
    </div>
  );
};

export default Grid;
