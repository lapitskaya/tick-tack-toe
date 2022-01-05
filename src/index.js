import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    let className = 'square';
    if (props.isActive) {
        className += ' active';
    }

    return (
        <button className={className}
                onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                isActive={this.props.isMoveActive[i]}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderRow(boardSize, rowNum) {
        let rowSquares = [];
        for (let columnNum = 0; columnNum < boardSize; columnNum++) {
            rowSquares.push(this.renderSquare( boardSize * rowNum + columnNum));
        }
        return (
            <div className="board-row">
                {rowSquares}
            </div>
        );
    }

    render() {
        const boardSize = 3;
        let boardRows = [];
        for (let rowNum = 0; rowNum < boardSize; rowNum++) {
            boardRows.push(this.renderRow(boardSize, rowNum));
        }
        return (
            <div>
                {boardRows}
            </div>
        );
    }
}

class MovesOrderToggle extends React.Component {
    render() {
        let btnActionText = 'Show moves ';
        btnActionText += this.props.isMovesOrderAsc ? 'DESCENDING' : 'ASCENDING';
        return (
            <button
                onClick={() => this.props.onClick()}
            >{btnActionText}</button>
        );
    }
}

class Moves extends React.Component {
    render() {
        let moves = this.props.moves.slice();
        if (!this.props.isMovesOrderAsc) {
            moves.reverse();
        }
        return (
            <ol reversed={!this.props.isMovesOrderAsc}>{moves}</ol>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                movePosition: [],
                isMoveActive: Array(9).fill(false),
            }],
            stepNumber: 0,
            xIsNext: true,
            isMovesOrderAsc: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const isActive = Array(9).fill(false);
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const movePosition = calculatePosition(i);
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        isActive[i] = true;

        this.setState({
            history: history.concat([{
                squares: squares,
                movePosition: movePosition,
                isMoveActive: isActive,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    toggleOrder() {
        this.setState({
            isMovesOrderAsc: !this.state.isMovesOrderAsc,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to start of the game';
            const movePosition = history[move].movePosition;
            let className;
            if (this.state.stepNumber === move) {
                className = 'active';
            }

            return (
                <li className={className}
                    key={move}>
                    <p>{movePosition}</p>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winn ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        isMoveActive={current.isMoveActive}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <MovesOrderToggle
                        onClick={() => this.toggleOrder()}
                        isMovesOrderAsc={this.state.isMovesOrderAsc}
                    />
                    <Moves
                        moves={moves}
                        isMovesOrderAsc={this.state.isMovesOrderAsc}
                    />
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function calculatePosition(i) {
    let column;
    let row;

    function divisibleByThree(number) {
        return (number % 3 === 0);
    }

    if (i === 0 || divisibleByThree(i)) {
        column = 1;
    } else if (i === 1 || divisibleByThree(i - 1)) {
        column = 2;
    } else if (i === 2 || divisibleByThree(i + 1)) {
        column = 3;
    }

    if (i < 3) {
        row = 1;
    } else if (i < 6) {
        row = 2;
    } else {
        row = 3
    }

    return ('Position: column ' + column + ', row ' + row);
}
