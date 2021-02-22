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
    constructor() {
        this.reset();
    }

  ngOnInit(): void {
  }

  reset() {
      console.log(this.columns, this.rows);
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
