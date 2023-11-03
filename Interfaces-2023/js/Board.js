class Board {
    constructor(img, ctx, canvasWidth, canvasHeight) {
        this.ctx = ctx;
        this.img = img;
        this.rows = 6; // Filas
        this.cols = 7; // Columnas
        this.cell_size =60; // Tamaño de las celdas
        this.token_radius = 25; // Radio de los círculos
        this.board_width = this.cols*this.cell_size; // Ancho del tablero
        this.board_height = this.rows*this.cell_size; // Alto del tablero
        this.player_colors = ['mario', 'luigi'];
        this.board = Array.from(Array(this.cols), () => Array(this.rows).fill(-1)); // Crear un array para representar el tablero
        this.currentPlayer = 0;
    }

    startNewGame() {
        this.board = Array.from(Array(this.cols), () => Array(this.rows).fill(-1));
        this.currentPlayer = 0;
        this.draw();
    }

    handleCanvasClick(event) {
        const columnIndex = Math.floor(event.offsetX / this.cell_size);

        if (this.isValidMove(columnIndex)) {
            const rowIndex = this.getEmptyRow(columnIndex);
            this.board[columnIndex][rowIndex] = this.currentPlayer;
            this.drawToken(columnIndex, rowIndex, this.player_colors[this.currentPlayer]);
            if (this.checkWin(columnIndex, rowIndex)) {
                this.endGame(this.currentPlayer);
            } else if (this.isBoardFull()) {
                this.endGame(-1); // Empate
            } else {
                this.currentPlayer = (this.currentPlayer + 1) % 2;
            }
        }
    }

    isValidMove(column) {
        return column >= 0 && column < this.cols && this.board[column][0] === -1;
    }

    getEmptyRow(column) {
        for (let row = this.rows - 1; row >= 0; row--) {
            if (this.board[column][row] === -1) {
                return row;
            }
        }
        return -1;
    }

    draw() {
        this.ctx.fillStyle = 'yellow';
        this.ctx.fillRect(0, 0, this.board_width, this.board_height);

        for (let col = 0; col < this.cols; col++) {
            for (let row = 0; row < this.rows; row++) {
                this.ctx.beginPath();
                this.ctx.arc(
                    col * this.cell_size + this.cell_size / 2,
                    row * this.cell_size + this.cell_size / 2,
                    this.token_radius,
                    0,
                    Math.PI * 2
                );
                this.ctx.fillStyle = this.board[col][row] === -1 ? 'white' : this.player_colors[this.board[col][row]];
                this.ctx.fill();
                this.ctx.closePath();
            }
        }

        this.drawGrid();
    }

    drawGrid() {
        this.ctx.strokeStyle = 'yellow';
        for (let col = 0; col < this.cols; col++) {
            for (let row = 0; row < this.rows; row++) {
                this.ctx.strokeRect(col * this.cell_size, row * this.cell_size, this.cell_size, this.cell_size);
            }
        }
    }

    checkWin(lastCol, lastRow) {
        return (
            this.checkDirection(lastCol, lastRow, 0, 1) ||
            this.checkDirection(lastCol, lastRow, 1, 0) ||
            this.checkDirection(lastCol, lastRow, 1, 1) ||
            this.checkDirection(lastCol, lastRow, -1, 1)
        );
    }

    checkDirection(col, row, dirX, dirY) {
        const player = this.board[col][row];
        let count = 1;

        for (let i = 1; i <= 3; i++) {
            const nextCol = col + dirX * i;
            const nextRow = row + dirY * i;

            if (
                nextCol >= 0 &&
                nextCol < this.COLUMNS &&
                nextRow >= 0 &&
                nextRow < this.ROWS &&
                this.board[nextCol][nextRow] === player
            ) {
                count++;
            } else {
                break;
            }
        }

        for (let i = 1; i <= 3; i++) {
            const nextCol = col - dirX * i;
            const nextRow = row - dirY * i;

            if (
                nextCol >= 0 &&
                nextCol < this.COLUMNS &&
                nextRow >= 0 &&
                nextRow < this.ROWS &&
                this.board[nextCol][nextRow] === player
            ) {
                count++;
            } else {
                break;
            }
        }

        return count >= 4;
    }

    isBoardFull() {
        return this.board.every((col) => col.every((cell) => cell !== -1));
    }

    endGame(winner) {
        if (winner === -1) {
            alert('Han empatado...');
        } else {
            alert(`${this.player_colors[winner].toUpperCase()}: Felicitaciones!!! Has ganado!!!`);
        }
        this.startNewGame();
    }
}
