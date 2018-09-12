import { Tile } from "./tile";
import { TileType, TileState } from "./enums/tileData";

export class Grid {
    grid: Tile[][] = [];
    constructor(width, height) {

        for (let i = 0; i < width; i++) {
            this.grid[i] = [];
            for (let j = 0; j < height; j++) {
                this.grid[i][j] = new Tile({x: i * 20, y: j * 20}, this);   
            }
        }
    }

    GenerateBombs(num_bombs) {
        for (let i = 0; i < num_bombs; i++) {
            let x = Math.floor(Math.random() * this.grid.length)
            let y = Math.floor(Math.random() * this.grid[x].length)
            let tile = this.grid[x][y];

            if(tile.TileType == TileType.Empty) {
                tile.ChangeType(TileType.Bomb)
            } else {
                i -= 1;
            }
        }
    }

    draw(context) {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                const tile = this.grid[i][j];

                tile.draw(context);
            }
        }
    }

    GetTile(x, y) {
        if(this.grid[x][y] == null) return null;
        return this.grid[x][y]
    }

    // This function is meant for when someone first clicks and magically hits a bomb on their first click so we replace the bomb to a corner 
    // (as apperantely the real one works)
    AddBombs(amount) {
        // Replace Tile

        for (let i = 0; i < amount; i++) {
            let x = Math.floor(Math.random() * this.grid.length)
            let y = Math.floor(Math.random() * this.grid[x].length)
            let tile = this.grid[x][y];

            if(tile.TileType == TileType.Empty && tile.TileState == TileState.Hidden) {
                tile.ChangeType(TileType.Bomb)
            } else {
                i -= 1;
            }
        }
    }

    GetSurroundingBombs(tile: Tile) {
        let numBombs = 0;

        this.GetSurroundingTiles(tile).forEach((element: Tile) => {
            if(element.TileType == TileType.Bomb)
                numBombs++;
        });

        return numBombs;
    }

    GetSurroundingTiles(tile: Tile) {
        let x = tile.position.x / 20;
        let y = tile.position.y / 20;
        let tiles = [];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if(x + i < 0 || x + i > this.grid.length - 1) continue;
                if(y + j < 0 || y + j > this.grid[x + i].length - 1) continue;

                tiles.push(this.GetTile(x + i, y + j));
            }
        }

        return tiles;
    }

    ExposeAllBombs() {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                const tile = this.grid[i][j];

                if(tile.TileType == TileType.Bomb)
                    tile.Expose();
            }
        }
    }

    ClearSurroundingArea(tile: Tile) {
        let num = 0
        this.GetSurroundingTiles(tile).forEach((element: Tile) => {
            if(element.TileType == TileType.Bomb)
                num++

            element.ChangeType(TileType.Empty);
        });

        return num;
    }

    HasWon() {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                const tile = this.grid[i][j];

                if(tile.TileState == TileState.Hidden && tile.TileType == TileType.Bomb || tile.TileState == TileState.Flagged && tile.TileType == TileType.Empty)
                    return false;
            }
        }

        return true;
    }
}