export type Position = {
  x: number;
  y: number;
};

export type TileData = {
  id: number;
  position: Position;
  value: number;
  previousPosition?: Position | null;
  mergedFrom?: TileData[] | null;
  isNew?: boolean;
  isMerged?: boolean;
};

export type GridCell = TileData | null;

export type GameState = {
  grid: GridCell[][];
  score: number;
  bestScore: number;
  over: boolean;
  won: boolean;
};

export type Direction = 'up' | 'down' | 'left' | 'right';
