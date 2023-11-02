"use strict";
class Game {

    constructor(gamers, canvas) {
        this.gamers = gamers;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.radius = 30;
        this.quantityChips = 42;
        this.board;
        this.imgChip1;
        this.imgChip2;
        this.chips = [];
        this.loadChips();
        this.dragging;
        this.chipInMovement;
        this.turn = this.gamers['g1'];
        this.changedchipsG1 = false;
        this.changedchipsG2 = false;
        this.radiusChange = 4;
        this.radiusChanged = false;
        this.shiftTime = 30;
        this.timer = this.shiftTime;
        this.shiftControl = setInterval(() => {
                                if(this.timer < 0) {
                                    this.changeTurn();
                                    this.timer = this.shiftTime;
                                }
                                this.infoTimer("Tiempo restante: ", this.timer, this.turn);
                                this.draw();
                                this.timer--;
                            }, 1000);
    }
    
    
    draw() {
        //borro canvas
        this.canvas.width = this.canvas.width;
        //dibujo el tablero
        this.drawBoard();
        // this.loadChips();
        this.drawChips();
        
        // debugger;
        this.drawTurn(this.turn);

        this.infoTimer("Tiempo restante: ", this.timer, this.turn);
        // this.shiftControl;
    }
    
    loadBoard() {
        var img = new Image();
            img.src = './img/board2.png';
            img.onload = () => {
                this.board = new Board(img, this.ctx);
                this.board.draw();
            }
    }
    drawBoard() {
        if(this.board) {
            this.board.draw();
        } else {
            this.loadBoard();
        }
    }

    loadChips() {
        if( !this.imgChip1 ) {
            this.imgChip1 = new Image();
            this.imgChip1.src = `./img/chips/${this.gamers.g1.name}.svg`;
            this.imgChip1.onload = () => {
                this.changedchipsG1 = true;
                this.loadChipsG1(this.imgChip1);
            }
        } else {
            this.changedchipsG1 = false;
            this.loadChipsG1(this.imgChip1);
        }

        if( !this.imgChip2 ) {
            this.imgChip2 = new Image();
            this.imgChip2.src = `./img/chips/${this.gamers.g2.name}.svg`;
            this.imgChip2.onload = () => {
                this.changedchipsG2 = true;
                this.loadChipsG2(this.imgChip2);
            }
        } else {
            this.changedchipsG2 = false;
            this.loadChipsG2(this.imgChip2);
        }
    }

    loadChipsG1(img) {
        if(!this.changedchips) {
            this.y = 113;
            for(this.i = this.chips.length; this.i < this.quantityChips/2; this.i+=1) {
    
                this.chips.push(new Chip(70, this.y, this.radius, this.gamers.g1.color, img, this.ctx));
                this.y += 22;
            }
        }
        // fichas en mesa listas para jugar
        this.drawChips();
    }
    loadChipsG2(img) {
        if(!this.changedchips) {
            this.y = 113;
            for(this.i = this.chips.length; this.i < this.quantityChips; this.i+=1) {
    
                this.chips.push(new Chip(730, this.y, this.radius, this.gamers.g2.color, img, this.ctx));    
                this.y += 22;
            }
        }
        // this.chips.forEach(c => c.draw());
        this.drawChips();
    }

    drawChips() {
        if(this.board) {
            this.board.draw();
        } else {
            this.loadBoard();
        }

        this.chips.forEach(c => c.draw());
    }

    chipHit(x,y) {
        for(let i = 0; i < this.chips.length; i++) {
            if(this.chips[i].isHit(x,y) && this.chips[i].color == this.turn.color) { //si estoy clickeando alguna ficha y es del color del turno
                this.chipInMovement = this.chips[i];
                return true;
            }
        };
        return false;
    }
    
    getChipInMovement() {
        return this.chipInMovement;
    }

    moveChip(x,y) {
        if(!this.chipInMovement) return;
        if(!this.radiusChanged){
            this.chipInMovement.setRadius(this.chipInMovement.getRadius() + this.radiusChange);
            this.radiusChanged = true;
        }
        this.chipInMovement.updateXY(x, y);
        this.draw();
    }

    chipDropped() {
        // debugger;
        if(this.radiusChanged) {
            this.chipInMovement.setRadius(this.chipInMovement.getRadius() - this.radiusChange);
            this.radiusChanged = false;
        }
        //chequeo si esta en una dropZone y si tiene lugar para posicionarse
        if(this.board.checkChip(this.chipInMovement)){
            //devuelve verdadero si encontro un lugar para la ficha
            //borrar ficha del conjunto en juego
            this.timer = this.shiftTime
            this.changeTurn();
            // console.log(this.turn);
            if(this.delete(this.chipInMovement)) {
                this.draw()
            }
        } else {
            this.chipInMovement.returnToStart();
            this.chipInMovement = null;
        }
        this.draw();
    }

    returnChipToStart() {
        if(this.chipInMovement){
            // console.log(this.chipInMovement.x,this.chipInMovement.y);
            this.chipInMovement.returnToStart();
            this.draw();
            // console.log(this.chipInMovement.x,this.chipInMovement.y);
        }
    }

    delete(chip) {
        let i = this.chips.indexOf(chip);
        if(i !== -1) {
            this.chips.splice(i,1);
            return true;
        }
        return false;
    }

    changeTurn() {
        if(this.gamers['g1'] == this.turn)
            this.turn = this.gamers['g2']
        else
            this.turn = this.gamers['g1']
    }

    drawTurn(gamer) {
        this.ctx.beginPath();
        this.ctx.fillStyle = gamer.color;
        this.ctx.font = "bold 18px Open Sans";
        this.ctx.textAlign='start';
        this.ctx.textBaseline = 'center';
        let text = `Juega ${gamer.name}`;
        
        if(gamer.color == this.gamers['g1'].color)
            this.ctx.fillText(text, 23, 40);
        else
            this.ctx.fillText(text, 680, 40);
        
        this.ctx.closePath();
    }

    infoTimer(txt, timer, gamer) {
        this.ctx.beginPath();
        this.ctx.fillStyle = "#262626";
        this.ctx.font = "bold 28px Open Sans";
        this.ctx.textAlign='center';
        this.ctx.textBaseline = 'center';
        
        let text = `${txt} ${timer}`;
        this.ctx.fillText(text, 400, 580);
        
    }

    getWinner() {
        let winnerColor = this.board.getWinner();
        if(winnerColor) {
            if(this.gamers['g1'].color == winnerColor)
                return this.gamers['g1'];
            else
                return this.gamers['g2'];
        }
        return null;
    }

    gameComplete() {
       clearInterval(this.shiftControl);
    }

    reset() {
        // debugger;
        this.board = null;
        this.chips = [];
        this.loadChips();
        this.chipInMovement = null;
        this.turn = this.gamers['g1'];
        this.changedchipsG1 = false;
        this.changedchipsG2 = false;
        this.radiusChanged = false;
        this.timer = this.shiftTime;
        
        clearInterval(this.shiftControl);
        this.shiftControl = setInterval(() => {
                                if(this.timer < 0) {
                                    this.changeTurn();
                                    this.timer = this.shiftTime;
                                }
                                this.infoTimer("Tiempo restante: ", this.timer, this.turn);
                                this.draw();
                                this.timer--;
                            }, 1000);

        this.draw();
    }

}
