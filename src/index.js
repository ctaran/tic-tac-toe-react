import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  let button;

  if (props.winner) {
    button = <button className="square" style={{ background: "orange" }} onClick={props.onClick}>{props.value}</button>
  }
  else {
    button = <button className="square" onClick={props.onClick}>{props.value}</button>
  }

  return (
    <>{button}</>
  );
}

class Board extends React.Component {

  renderSquare(i, winner) {
      return (
        <Square 
          value={this.props.squares[i]}
          winner={winner}
          onClick={() => this.props.onClick(i)}
        />
      );
  }

  render() {
    let table = []

    for (let i = 0; i < 3; i++){
      let children = []

      for (let j = 0; j < 3; j++){
        const idx = i*3+j
        const winner = this.props.winner_line && this.props.winner_line.includes(idx)
        children.push(<>{this.renderSquare(idx, winner)}</>)
      }

      table.push(<div className="board-row">
        {children}
      </div>)
    }

    return (
    <div>
        {table}
    </div>
    );
  }

}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        col: 0,
        row: 0,
      }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        col: (i % 3) + 1,
        row: Math.floor(i/3) + 1,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }  

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner_line = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move #${move} (${step.col},${step.row})`:
        'Go to game start';
      let button;
      if (step == current) {
        button = <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>;
      }
      else {
        button = <button onClick={() => this.jumpTo(move)}>{desc}</button>;
      }

      return (
        <li key={move}>
          {button}
        </li>
      );
    });

    let status;
    if (winner_line) {
      status = 'Winner: ' + current.squares[winner_line[0]];
    }
    else if (this.state.stepNumber == 9) {
      status = 'It\'s a tie!';
    } 
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
    <div className="game">
        <div className="game-board">
        <Board squares={current.squares} winner_line={winner_line} onClick={(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
        </div>
    </div>
    );
  }
}
  
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
      return lines[i]
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
<Game />,
document.getElementById('root')
);
  