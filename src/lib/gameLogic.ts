import { TileData, Position, GridCell, Direction } from "@/types/game";

const GRID_SIZE = 4;
let tileIdCounter = 0;

const getNewTileId = (): number => {
  return ++tileIdCounter;
};

export const createEmptyGrid = (): GridCell[][] => {
  const grid: GridCell[][] = [];
  for (let x = 0; x < GRID_SIZE; x++) {
    grid[x] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      grid[x][y] = null;
    }
  }
  return grid;
};

export const getAvailableCells = (grid: GridCell[][]): Position[] => {
  const cells: Position[] = [];
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      if (!grid[x][y]) {
        cells.push({ x, y });
      }
    }
  }
  return cells;
};

export const addRandomTile = (grid: GridCell[][]): GridCell[][] => {
  const available = getAvailableCells(grid);
  if (available.length === 0) return grid;

  const newGrid = grid.map(row => [...row]);
  const randomCell = available[Math.floor(Math.random() * available.length)];
  const value = Math.random() < 0.9 ? 2 : 4;

  newGrid[randomCell.x][randomCell.y] = {
    id: getNewTileId(),
    position: { x: randomCell.x, y: randomCell.y },
    value,
    isNew: true,
    isMerged: false,
  };

  return newGrid;
};

export const initializeGrid = (): GridCell[][] => {
  tileIdCounter = 0;
  let grid = createEmptyGrid();
  grid = addRandomTile(grid);
  grid = addRandomTile(grid);
  return grid;
};

const getVector = (direction: Direction): Position => {
  const vectors: Record<Direction, Position> = {
    up: { x: -1, y: 0 },
    down: { x: 1, y: 0 },
    left: { x: 0, y: -1 },
    right: { x: 0, y: 1 },
  };
  return vectors[direction];
};

const buildTraversals = (direction: Direction): { x: number[]; y: number[] } => {
  const traversals = {
    x: Array.from({ length: GRID_SIZE }, (_, i) => i),
    y: Array.from({ length: GRID_SIZE }, (_, i) => i),
  };

  const vector = getVector(direction);
  if (vector.x === 1) traversals.x.reverse();
  if (vector.y === 1) traversals.y.reverse();

  return traversals;
};

const withinBounds = (position: Position): boolean => {
  return (
    position.x >= 0 &&
    position.x < GRID_SIZE &&
    position.y >= 0 &&
    position.y < GRID_SIZE
  );
};

const findFarthestPosition = (
  grid: GridCell[][],
  cell: Position,
  vector: Position
): { farthest: Position; next: Position } => {
  let previous: Position;
  let current = { ...cell };

  do {
    previous = current;
    current = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (withinBounds(current) && !grid[current.x]?.[current.y]);

  return {
    farthest: previous,
    next: current,
  };
};

export const move = (
  grid: GridCell[][],
  direction: Direction
): { grid: GridCell[][]; score: number; moved: boolean } => {
  const vector = getVector(direction);
  const traversals = buildTraversals(direction);
  let moved = false;
  let scoreIncrease = 0;

  // Create a new grid with cleared flags
  const newGrid: GridCell[][] = createEmptyGrid();
  const mergedPositions = new Set<string>();

  // Clear isNew and isMerged flags and prepare tiles
  const tiles: TileData[] = [];
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      const tile = grid[x][y];
      if (tile) {
        tiles.push({
          ...tile,
          previousPosition: { x, y },
          isNew: false,
          isMerged: false,
        });
      }
    }
  }

  // Process tiles in traversal order
  for (const x of traversals.x) {
    for (const y of traversals.y) {
      const tile = grid[x]?.[y];
      if (!tile) continue;

      const { farthest, next } = findFarthestPosition(newGrid, { x, y }, vector);
      const nextTile = withinBounds(next) ? newGrid[next.x][next.y] : null;
      const posKey = `${next.x},${next.y}`;

      if (nextTile && nextTile.value === tile.value && !mergedPositions.has(posKey)) {
        // Merge tiles
        const mergedValue = tile.value * 2;
        newGrid[next.x][next.y] = {
          id: getNewTileId(),
          position: { x: next.x, y: next.y },
          value: mergedValue,
          previousPosition: { x, y },
          isMerged: true,
          isNew: false,
        };
        mergedPositions.add(posKey);
        scoreIncrease += mergedValue;
        moved = true;
      } else {
        // Move tile
        newGrid[farthest.x][farthest.y] = {
          ...tile,
          id: tile.id,
          position: { x: farthest.x, y: farthest.y },
          previousPosition: { x, y },
          isNew: false,
          isMerged: false,
        };
        if (farthest.x !== x || farthest.y !== y) {
          moved = true;
        }
      }
    }
  }

  return { grid: newGrid, score: scoreIncrease, moved };
};

export const canMove = (grid: GridCell[][]): boolean => {
  // Check for empty cells
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      if (!grid[x][y]) return true;
    }
  }

  // Check for possible merges
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      const tile = grid[x][y];
      if (!tile) continue;

      const directions: Position[] = [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
      ];

      for (const dir of directions) {
        const nextX = x + dir.x;
        const nextY = y + dir.y;
        if (withinBounds({ x: nextX, y: nextY })) {
          const nextTile = grid[nextX][nextY];
          if (nextTile && nextTile.value === tile.value) {
            return true;
          }
        }
      }
    }
  }

  return false;
};

export const hasWon = (grid: GridCell[][]): boolean => {
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      if (grid[x][y]?.value === 2048) {
        return true;
      }
    }
  }
  return false;
};

export const getTilesFromGrid = (grid: GridCell[][]): TileData[] => {
  const tiles: TileData[] = [];
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      const tile = grid[x][y];
      if (tile) {
        tiles.push(tile);
      }
    }
  }
  return tiles;
};
