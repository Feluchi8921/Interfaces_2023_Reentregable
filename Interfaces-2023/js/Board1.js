"use strict";
class Board {

    constructor(img, ctx){
        this.ctx = ctx;
        this.img = img;
        this.x = 100;
        this.y = 100;
        this.rows = document.getElementById('n_juego').value;
        this.cols = document.getElementById('n_juego').value; //revisar creo q estan al reves
        this.boardPositions = this.generatePositions();
        this.dropZones = this.generateDropZones();
        this.chips = [];
        this.aWinner = null;
    }

    startNewGame() {
        board = Array.from(Array(COLUMNS), () => Array(ROWS).fill(-1));
        currentPlayer = 0;
        drawBoard();
    }
    draw() {
        this.drawDropZones();
        this.drawChips();
        this.ctx.drawImage(this.img, 150,100,500,500);
    }

    addChip(chip, col, row) {
        this.chips.push(chip);
        chip.setDraggable(false);
        let x = this.boardPositions[col][row].x;
        let y = this.boardPositions[col][row].y;
        chip.updateXY(x,y);
        chip.startX = x;
        chip.startY = y;
        this.boardPositions[col][row].taked = true;
        this.boardPositions[col][row].color = chip.color;
    }
    
//----------variables

    generatePositions() {

        let positions=[[],[],[],[],[],[],[]];
        let pos1_1=[191.5, 137];
        let pos_x = pos1_1[0];
        let pos_y = pos1_1[1];

        let diff_x = 361.5 - 291.5;
        let diff_y = 207 - 137;
        for(let x = 0; x < this.cols; x++) {
            for(let y = 0; y < this.rows; y++) {
                positions[x][y] = {x:pos_x, y:pos_y, color:'', taked:false};
                pos_y += diff_y;
            }
            pos_x += diff_x;
            pos_y = pos1_1[1];
        }        
        return positions;
    }

    generateDropZones() {
        let ww = 60;

        let pos_x = 157;
        let diff_x = 70;
        
        let positions = [];
        
        for(let i = 0; i < this.cols; i++){
            console.log();
            positions[i] = {x1:pos_x, y1:10, x2:pos_x+ww, y2:161, col:i, width:ww, height:151};
            pos_x += diff_x;
        }
        return positions;
    }

    drawDropZones() {
        this.ctx.beginPath();
        let degrade = this.ctx.createLinearGradient(157, 10, 157, 161);
        degrade.addColorStop(0, 'rgba(188,61,194,255)');
        degrade.addColorStop(0.60, 'rgba(245,210,33,0)');
        this.ctx.fillStyle = degrade;

        for(let i = 0; i < this.dropZones.length; i++){
            this.ctx.fillRect(this.dropZones[i].x1, this.dropZones[i].y1, 68, 161);
        }

        this.ctx.closePath();
    }

    drawChips() {
        this.chips.forEach(c => {
            c.draw();
        });
    }

    //chequeo de ficha dentro de una dropZone
    checkChip(chip) {
        // debugger;
        //x,y el centro de la ficha
        let x = chip.getX();
        let y = chip.getY();
        let dropColumn = this.getDropColumn(x,y);
        // console.log(dropColumn);
        if(dropColumn !== false) {
            let dropRow = this.getDropRow(dropColumn);
            // console.log('fila retornada',dropRow);
            // debugger;
            if(dropRow !== false) {
                // console.log('al menos un lugar');
                // console.log('ficha lista para posicionar en ', dropColumn, dropRow);
                this.addChip(chip, dropColumn, dropRow);
                if(this.boardPositions[0][9] != undefined) {
                    console.log('indefinido');
                    console.log(this.boardPositions[0][9]);
                } else {
                    // console.log(this.boardPositions[this.rows][0]);
                }
                //chequear ganador
                if(this.InConditionOfWin()){
                    // debugger;
                    // console.log('InConditionOfWin');
                    if(this.checkWinner(chip, dropColumn, dropRow)) // retorna true si hay algun ganador
                        this.aWinner = chip.color;
                }
                return true;
            } else {
                // console.log('columna llena');
                return false;
            }
        }
        return false;
    }

    checkInDropZone(zone,x,y) {
        if( (x - zone.x1 > 0) && (x - zone.x1 < zone.width) ) {
            if( (y - zone.y1 > 0) && (y - zone.y1 < zone.height) ) {
                return true;
            }
        }
        return false;
    }

    getDropColumn(x, y) {
        for(let i = 0; i < this.dropZones.length; i++) {
            if( this.checkInDropZone(this.dropZones[i],x,y) ) {
                return this.dropZones[i].col;
            }
        }
        return false;
    }

    getDropRow(col) {
        // debugger;
        /**
         * buscar en la columna col un lugar libre
         * de abajo para arriba
         */
        for(let r = this.rows-1; r >= 0; r--) {
            if(!this.boardPositions[col][r].taked) {
                // console.log('col',col+1,'fila', r+1, 'libre');
                return r;
            } /*else{
                // console.log('col',col+1,' fila ', r+1, ' ocupado');
            }*/
        }
        return false;
    }

    InConditionOfWin() {
        return this.chips.length >= this.cols ? true : false;
    }

    checkWinner(chip, col, row) {
        return (
            this.checkHor(chip.color, col, row) ||
            this.checkVer(chip.color, col, row) ||
            this.checkDiagR(chip.color, col, row) ||
            this.checkDiagL(chip.color, col, row)
        )

    }

    checkHor(color, col, row) {
        let count = 1// 1 ficha, sobre la que se arranca a chequear
        for(let i = 1; i < 4; i++) {
            let c = col + i; //columna hacia la derecha
            if(c < this.cols) {
                if(this.boardPositions[c][row].color == color) { //si hay una ficha de igual color, sumo
                    // console.log('algo');
                    count++;
                } else //si no, corto for
                    break;
            } else
                break;
        }

        if(count >= 4) return true;

        for(let i = 1; i < 4; i++) {
            let c = col - i; //columna hacia la izquierda
            if(c > -1) {
                if(this.boardPositions[c][row].color == color) { //si hay una ficha de igual color, sumo
                    // console.log('algo');
                    count++;
                } else //si no, corto for
                    break;
            } else
                break;
        }
        if(count < 4)
            return false;
        else
            return true;
    }

    checkVer(color, col, row) {
        let count = 1// 1 ficha, sobre la que se arranca a chequear
        for(let i = 1; i < 4; i++) {
            let r = row + i; // fila hacia abajo
            if(r < this.rows) {
                if(this.boardPositions[col][r].color == color) { //si hay una ficha de igual color, sumo
                    // console.log('algo');
                    count++;
                } else //si no, corto for
                    break;
            } else
                break;
        }

        if(count >= 4) return true;

        for(let i = 1; i < 4; i++) {
            let r = row - i; // fila hacia la arriba
            if(r > -1) {
                if(this.boardPositions[col][r].color == color) { //si hay una ficha de igual color, sumo
                    // console.log('algo');
                    count++;
                } else //si no, corto for
                    break;
            } else
                break;
        }
        if(count < 4)
            return false;
        else
            return true;
    }

    checkDiagR(color, col, row) {
        let count = 1// 1 ficha, sobre la que se arranca a chequear
        for(let i = 1; i < 4; i++) {
            let c = col + i; // columna hacia derecha
            let r = row + i; // fila hacia abajo
            if(r < this.rows && c < this.cols) {
                if(this.boardPositions[c][r].color == color) { //si hay una ficha de igual color, sumo
                    // console.log('algo');
                    count++;
                } else //si no, corto for
                    break;
            } else
                break;
        }

        if(count >= 4) return true;

        for(let i = 1; i < 4; i++) {
            let c = col - i; // columna hacia izquierda
            let r = row - i; // fila hacia la arriba
            if(r > -1 && c > -1) {
                if(this.boardPositions[c][r].color == color) { //si hay una ficha de igual color, sumo
                    // console.log('algo');
                    count++;
                } else //si no, corto for
                    break;
            } else
                break;
        }
        if(count < 4)
            return false;
        else
            return true;
    }

    checkDiagL(color, col, row) {
        let count = 1// 1 ficha, sobre la que se arranca a chequear
        for(let i = 1; i < 4; i++) {
            let c = col - i; // columna hacia izquierda
            let r = row + i; // fila hacia abajo
            if(c > -1 && r < this.rows) {
                if(this.boardPositions[c][r].color == color) { //si hay una ficha de igual color, sumo
                    // console.log('algo');
                    count++;
                } else //si no, corto for
                    break;
            } else
                break;
        }

        if(count >= 4) return true;

        for(let i = 1; i < 4; i++) {
            let c = col + i; // columna hacia derecha
            let r = row - i; // fila hacia la arriba
            if(r > -1 && r < this.rows) {
                if(this.boardPositions[c][r].color == color) { //si hay una ficha de igual color, sumo
                    // console.log('algo');
                    count++;
                } else //si no, corto for
                    break;
            } else
                break;
        }
        if(count < 4)
            return false;
        else
            return true;
    }

    getWinner() {
        return this.aWinner;
    }

    reset() {
        this.chips = [];
        this.aWinner = null;
    }

}
