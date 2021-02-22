import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  minColumns: number = 4;
  maxColumns: number = 10;
  minRows: number = 4;
  maxRows: number = 10;
  minDifficulty: number = 0.1;
  maxDifficulty: number = 0.9;
  columns: number = 6;
  rows: number = 8;
  difficulty: number = 0.3;
  cells: Cell[] = [];
  mines: number[];
  history: number[];
  outcome: number = 0;
    constructor() {
        this.reset();
    }

  ngOnInit(): void {
  }

  reset() {
      console.log(this.columns, this.rows);
      this.history = [];
      this.generateCells();
  }
  
  generateCells() {
      let total = this.rows * this.columns;
      this.cells = [...Array(total)].map((v, position) => new Cell({
          position,
          open: false,
          mine: false,
          flag: false,
          count: 0,
      }));
  }

  move(position, i) {
    console.log('move', position, i, this.history.length);
    if (!this.history.length) {
      this.mines = setMines(this.rows * this.columns, this.difficulty, position);
      console.log(this.mines);
      this.mines.forEach(position => this.placeMine(position))
      // this.timer.start();
      // this.timer.disabled = false;
    }
    this.open(position)
  }

  open(position, cell = this.cells[position]) {
    console.log("open", this, { position, cell });
    if (!cell.open) {
      cell.mine ? this.end(false) : this.history.push(position);
      (this.history.length) === (this.cells.length - this.mines.length) && this.end(true);
      cell.open = true;
      if (!cell.count) {
        window.requestAnimationFrame(() => getNeighbours(position, this.rows, this.columns).forEach(position => this.open(position)))
      }
    }

  }

  end(successful) {
    console.log('end', successful)
    this.outcome = successful ? 1 : -1;
    this.cells.forEach(cell => cell.open = true);
  }

  placeMine(position) {
    this.cells[position].mine = true;
    getNeighbours(position, this.rows, this.columns)
      .forEach(position => this.cells[position].count++)
  }
}

class Cell {

    position: number;
    open: boolean;
    mine: boolean;
    flag: boolean;
    count: number;
    constructor({ position, open, mine, flag, count }) {
        this.position = position;
        this.open = open;
        this.mine = mine;
        this.flag = flag;
        this.count = count;
    }
}
function getNeighbours(position, rows, columns, column = position % columns, row = ~~(position / columns)) {
  return [
    [-1, -1], [-1, 0], [-1, 1],
    [ 0, -1], [ 0, 0], [ 0, 1],
    [ 1, -1], [ 1, 0], [ 1, 1],
   ].map(([i, j]) => [row + i, column + j])
   .filter(([i, j]) => i >= 0 && j >= 0 && i < rows && j < columns)
   .map(([row, column]) => row * columns + column)
}   
function setMines(cells, difficulty, position) {
  console.log('setMines', cells, difficulty, position);
  let possibilities = [...new Array(cells).keys()];
  possibilities.splice(possibilities.indexOf(parseInt(position)), 1);
  return shuffle(possibilities).slice(0, difficulty*cells)

  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
}
