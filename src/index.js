import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    render() {
        console.log(this.props.color);
        return (
            <td
                id={this.props.id}
                className={this.props.color ? 'board-field-red' : 'board-field'}
                onClick={() => this.props.onClick()}
            >
                {this.props.value}
            </td>
        );
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            xMoves: true,
            squares: Array(9).fill(null),
            history: [],
            winner: null,
            winningSet: [],
        };
    }

    blink(id, time, msize, esize) {
        let elem = document.getElementById(id);
        let size = 0;
        let big = false;
        let end = false;
        let int = setInterval(frame, time);
        function frame() {
            if (end) {
                clearInterval(int);
            } else {
                size += (big ? -1 : 1);
                elem.style.fontSize = size + 'px';
                if (size === msize) big = true;
                if (big & size === esize) end = true;
            }
        }
    }

    turnBackTime(i) {
        let timePoint = this.state.history[i];
        this.setState({ squares: timePoint });
    }

    renderHistory() {
        let timePoints = [];
        for (let i = 0; i < this.state.history.length; i++) {
            timePoints.push(
                <li key={i}>
                    <button onClick={() => this.turnBackTime(i)}>Go back to move {i}</button>
                </li>
            )
        }
        return (
            <ol>{timePoints}</ol>
        );
    }

    handleClick(i) {
        let newSquares = this.state.squares.slice();
        if (newSquares[i] == null & this.state.winner == null) {
            newSquares[i] = this.state.xMoves ? 'X' : 'O';
            let newHistory = this.state.history;
            newHistory.push(newSquares);
            this.checkWinner(newSquares);
            this.setState({
                xMoves: !this.state.xMoves,
                squares: newSquares,
                history: newHistory,
            });
            const id = 's' + i;
            this.blink(id, 1, 60, 40);
        }
    }

    renderSquare(i) {
        const id = 's' + i;
        let c = false;
        if (this.state.winner != null) {
            for (let n = 0; n < this.state.winningSet.length; n++) {
                if (this.state.winningSet[n] === i) {
                    c = true;
                    break;
                }
            }
        }
        return (
            <Square
                color={c}
                id={id}
                value={this.state.squares[i]}
                onClick={() => this.handleClick(i)}
            />
        );
    }

    checkWinner(squares) {
        let checks = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let i = 0; i < checks.length; i++) {
            let a = checks[i][0];
            let b = checks[i][1];
            let c = checks[i][2];
            if (squares[a] === squares[b] &
                squares[a] === squares[c] &
                squares[b] === squares[c] &
                squares[a] != null) {
                this.setState(
                    {
                        winner: squares[a],
                        winningSet: checks[i],
                    });
                this.blink("info", 10, 35, 30);
                break;
            }
        }
    }

    renderInfo() {
        return (
            <td id="info">
                {
                    this.state.winner === null ?
                    ('Now moves: ' + (this.state.xMoves ? 'X' : 'O')) :
                    ('Winner is: ' + this.state.winner + '!')
                }
            </td>
            );
    }

    render() {
        return (
            <div id='board-container'>
                <div id="left">
                    <table className='board-header'>
                        <tbody>
                            <tr>
                                {this.renderInfo()}
                            </tr>
                        </tbody>
                    </table>
                    <table className="board-table">
                        <tbody>
                            <tr>
                                {this.renderSquare(0)}
                                {this.renderSquare(1)}
                                {this.renderSquare(2)}
                            </tr>
                            <tr>
                                {this.renderSquare(3)}
                                {this.renderSquare(4)}
                                {this.renderSquare(5)}
                            </tr>
                            <tr>
                                {this.renderSquare(6)}
                                {this.renderSquare(7)}
                                {this.renderSquare(8)}
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div id="right">
                    <table className="history-header">
                        <tbody>
                            <tr>
                                <td>
                                    History:
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {this.renderHistory()}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Board />, document.getElementById('root'));
