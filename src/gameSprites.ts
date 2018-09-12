import { TileType, TileState } from "./enums/tileData";
import './spritesheet.png'

export class GameSprite {
    
    public _spritesheet: any;
    constructor() {
        this._spritesheet = new Image();
        this._spritesheet.src = "./spritesheet.png";
    }

    // Draw the number of the tile
    drawNumber(context, x, y,number) {
        if(number < 1 || number > 8) return;
        context.drawImage(this._spritesheet, 3 + 17 * (number - 1), 71, 15, 15, x, y, 20,20)
    }

    // Draw Tile (bomb, flag, empty etc)
    drawTile(context, x, y, tileType: TileType, tileState: TileState, clicked: boolean = false) {
        if(tileState == TileState.Hidden)
            context.drawImage(this._spritesheet, 3, 53, 15, 16, x, y, 20,20)

        if(tileState == TileState.Flagged)
            context.drawImage(this._spritesheet, 3 + 17 * 2, 53, 15, 16, x, y, 20,20)

        if(tileState == TileState.Exploded && tileType == TileType.Bomb)
            context.drawImage(this._spritesheet, 3 + 17 * 6, 53, 15, 16, x, y, 20,20)

        if(tileState == TileState.Exposed) {
            if(tileType == TileType.Bomb)
                context.drawImage(this._spritesheet, 3 + 17 * 5, 53, 15, 16, x, y, 20,20)

            if(tileType == TileType.Empty)
                context.drawImage(this._spritesheet, 4 + 16, 53, 15, 16, x, y, 20,20)
        }
    }

    // This is the success state if the bomb was flagged
    drawFoundBomb(context, x, y) {
        context.drawImage(this._spritesheet, 3 + 17, 53, 15, 16, x, y, 20,20)
    }
}