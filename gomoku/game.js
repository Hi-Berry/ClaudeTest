class Gomoku {
    constructor() {
        this.boardSize = 15;
        this.board = [];
        this.currentPlayer = 'black';
        this.gameOver = false;
        this.history = [];
        this.blackWins = 0;
        this.whiteWins = 0;

        this.initBoard();
        this.render();
        this.addEventListeners();
    }

    initBoard() {
        this.board = [];
        for (let i = 0; i < this.boardSize; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.boardSize; j++) {
                this.board[i][j] = null;
            }
        }
        this.currentPlayer = 'black';
        this.gameOver = false;
        this.history = [];
        this.updateTurnIndicator();
        this.clearMessage();
    }

    render() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';

        const starPoints = [
            [3, 3], [3, 7], [3, 11],
            [7, 3], [7, 7], [7, 11],
            [11, 3], [11, 7], [11, 11]
        ];

        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;

                if (starPoints.some(([r, c]) => r === i && c === j)) {
                    cell.classList.add('star-point');
                }

                if (this.board[i][j]) {
                    const stone = document.createElement('div');
                    stone.className = `stone ${this.board[i][j]}`;
                    cell.appendChild(stone);
                    cell.classList.add('occupied');
                }

                cell.addEventListener('click', () => this.placeStone(i, j));
                boardElement.appendChild(cell);
            }
        }
    }

    placeStone(row, col) {
        if (this.gameOver || this.board[row][col]) {
            return;
        }

        this.board[row][col] = this.currentPlayer;
        this.history.push({ row, col, player: this.currentPlayer });

        this.renderCell(row, col);

        if (this.checkWin(row, col)) {
            this.gameOver = true;
            this.showWinner();
            this.highlightWinningStones(row, col);
            return;
        }

        if (this.checkDraw()) {
            this.gameOver = true;
            this.showMessage('무승부입니다!');
            return;
        }

        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        this.updateTurnIndicator();
    }

    renderCell(row, col) {
        const cellIndex = row * this.boardSize + col;
        const cell = document.getElementById('board').children[cellIndex];

        if (this.board[row][col]) {
            if (!cell.querySelector('.stone')) {
                const stone = document.createElement('div');
                stone.className = `stone ${this.board[row][col]}`;
                cell.appendChild(stone);
                cell.classList.add('occupied');
            }
        } else {
            const stone = cell.querySelector('.stone');
            if (stone) {
                stone.remove();
            }
            cell.classList.remove('occupied');
        }
    }

    checkWin(row, col) {
        const player = this.board[row][col];
        const directions = [
            [0, 1],
            [1, 0],
            [1, 1],
            [1, -1]
        ];

        for (const [dr, dc] of directions) {
            let count = 1;

            for (let i = 1; i < 5; i++) {
                const r = row + dr * i;
                const c = col + dc * i;
                if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize &&
                    this.board[r][c] === player) {
                    count++;
                } else {
                    break;
                }
            }

            for (let i = 1; i < 5; i++) {
                const r = row - dr * i;
                const c = col - dc * i;
                if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize &&
                    this.board[r][c] === player) {
                    count++;
                } else {
                    break;
                }
            }

            if (count >= 5) {
                return true;
            }
        }

        return false;
    }

    getWinningStones(row, col) {
        const player = this.board[row][col];
        const directions = [
            [0, 1],
            [1, 0],
            [1, 1],
            [1, -1]
        ];

        for (const [dr, dc] of directions) {
            const stones = [[row, col]];

            for (let i = 1; i < 5; i++) {
                const r = row + dr * i;
                const c = col + dc * i;
                if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize &&
                    this.board[r][c] === player) {
                    stones.push([r, c]);
                } else {
                    break;
                }
            }

            for (let i = 1; i < 5; i++) {
                const r = row - dr * i;
                const c = col - dc * i;
                if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize &&
                    this.board[r][c] === player) {
                    stones.push([r, c]);
                } else {
                    break;
                }
            }

            if (stones.length >= 5) {
                return stones;
            }
        }

        return [];
    }

    highlightWinningStones(row, col) {
        const winningStones = this.getWinningStones(row, col);
        const boardElement = document.getElementById('board');

        for (const [r, c] of winningStones) {
            const cellIndex = r * this.boardSize + c;
            const cell = boardElement.children[cellIndex];
            const stone = cell.querySelector('.stone');
            if (stone) {
                stone.classList.add('winning');
            }
        }
    }

    checkDraw() {
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (!this.board[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    showWinner() {
        const winner = this.currentPlayer === 'black' ? '흑돌' : '백돌';
        this.showMessage(`${winner} 승리!`);

        if (this.currentPlayer === 'black') {
            this.blackWins++;
            document.getElementById('black-wins').textContent = this.blackWins;
        } else {
            this.whiteWins++;
            document.getElementById('white-wins').textContent = this.whiteWins;
        }
    }

    showMessage(text) {
        document.getElementById('message').textContent = text;
    }

    clearMessage() {
        document.getElementById('message').textContent = '';
    }

    updateTurnIndicator() {
        const indicator = document.getElementById('current-player');
        indicator.textContent = this.currentPlayer === 'black' ? '흑돌' : '백돌';
        indicator.className = this.currentPlayer;
    }

    undo() {
        if (this.history.length === 0 || this.gameOver) {
            return;
        }

        const lastMove = this.history.pop();
        this.board[lastMove.row][lastMove.col] = null;
        this.currentPlayer = lastMove.player;

        this.renderCell(lastMove.row, lastMove.col);
        this.updateTurnIndicator();
    }

    restart() {
        this.initBoard();
        this.render();
    }

    addEventListeners() {
        document.getElementById('restart-btn').addEventListener('click', () => this.restart());
        document.getElementById('undo-btn').addEventListener('click', () => this.undo());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Gomoku();
});
