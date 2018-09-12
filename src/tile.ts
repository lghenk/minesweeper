import { TileState, TileType } from './enums/tileData'
import { GameSprite } from './gameSprites';
import { Grid } from './grid';

export class Tile {

    public position: {x: number, y: number}
    private _tileState: TileState = TileState.Hidden;
    private _tileType: TileType = TileType.Empty;
    private _spriteSheet: GameSprite = new GameSprite();
    private _gridReference: Grid;

    constructor(pos, grid) {
        this._gridReference = grid;
        this.position = pos;
    }

    get TileState() {
        return this._tileState;
    }

    get TileType() {
        return this._tileType;
    }

    draw(context) {
        if(this._tileState == TileState.Exposed && this._tileType == TileType.Empty) {
            // Get number of bombs around tile
            const numBombs = this._gridReference.GetSurroundingBombs(this);
            // console.log("Number Bombs: "+numBombs);

            if(numBombs > 0) {
                this._spriteSheet.drawNumber(context, this.position.x, this.position.y, numBombs)
            } else {
                this._spriteSheet.drawTile(context, this.position.x, this.position.y, this._tileType, this._tileState)
            }
            // If has bombs around draw number else draw empty square
        } else {
            this._spriteSheet.drawTile(context, this.position.x, this.position.y, this._tileType, this._tileState)

            if(this._tileState == TileState.Exploded)
                this._spriteSheet.drawTile(context, this.position.x, this.position.y, this._tileType, this._tileState, true)
        }

        // if(this._tileType == TileType.Bomb)
        //     this._spriteSheet.drawTile(context, this.position.x, this.position.y, this._tileType, this._tileState)

    }

    Expose(force = false) {
        if(this._tileState == TileState.Exposed && !force) return;
        this._tileState = TileState.Exposed;

        if(this._gridReference.GetSurroundingBombs(this) == 0) {
            let tiles = this._gridReference.GetSurroundingTiles(this);

            for (let i = 0; i < tiles.length; i++) {
                tiles[i].Expose();
            }
        }

        return {state: this._tileState, type: this._tileType}
    }

    Flag() {
        this._tileState = TileState.Flagged;
        return {state: this._tileState, type: this._tileType}
    }

    Explode() {
        console.log("Boooooom!")
        this._tileState = TileState.Exploded;

        this._gridReference.ExposeAllBombs();
    }

    ChangeType(type: TileType) {
        this._tileType = type;
    }
}