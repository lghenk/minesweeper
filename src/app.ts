import {Grid} from './grid'
import { TileType } from './enums/tileData';
import { GameSprite } from './gameSprites';

// NOTE: The tiles are 20x20 pixels

// Num of tiles we want
const NUM_TILES_X = 25;
const NUM_TILES_Y = 25;
const NUM_BOMBS = 100;

let isFirstClick = true;

// Get necessary values 
const canvas: any = document.getElementById('gamecanvas');
const context = canvas.getContext('2d');

// Set height & width of canvas
canvas.height = NUM_TILES_Y * 20; 
canvas.width = NUM_TILES_X * 20;

// Generate base grid
let grid = new Grid(NUM_TILES_X, NUM_TILES_Y);
grid.GenerateBombs(NUM_BOMBS);

// Regsiter Reset
document.getElementById('restartButton').onclick = () => {
    grid = new Grid(NUM_TILES_X, NUM_TILES_Y);
    grid.GenerateBombs(NUM_BOMBS);

    isFirstClick = true;

    draw();
}

// Register Click Handler
canvas.onclick = (evt) => {
    let pos = getMousePos(canvas, evt);

    // Convert pos to array pos
    let x = Math.floor(pos.x / 20);
    let y = Math.floor(pos.y / 20);
    
    if(x >= NUM_TILES_X || y < 0) return; // Invalid
    if(y >= NUM_TILES_Y || y < 0) return; // Invalid

    // Check if first click
    if(evt.shiftKey) {
        let data = grid.GetTile(x, y).Flag();
    } else {
        let tile = grid.GetTile(x, y)
        let data: any = tile.Expose();

        if(isFirstClick) {
            isFirstClick = false;
            if(data.type == TileType.Bomb) {
                let num = grid.ClearSurroundingArea(tile);
                tile.ChangeType(TileType.Empty)
                tile.Expose(true);

                // Readd num + 1 bombs to map
                grid.AddBombs(num + 1);
            } else if(grid.GetSurroundingBombs(tile) > 0) {
                let num = grid.ClearSurroundingArea(tile) 
                tile.Expose(true)

                grid.AddBombs(num);
            } 
        } else {
            if(data.type == TileType.Bomb) {
                // User has clicked on a bomb, Expose all bombs...
                tile.Explode();
            }
        }
    } 

    draw();
}

const gsprt = new GameSprite();
gsprt._spritesheet.onload = () => {
    draw();
}

function draw() {
    context.clearRect(0,0, canvas.width, canvas.height);
    grid.draw(context);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}