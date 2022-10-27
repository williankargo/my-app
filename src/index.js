import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// controlled components, controlled by Board
// 這是一個 Component，會接收 props (properties) 傳入
// class Square extends React.Component {
//   constructor(props) {
//     super(props);
//     // state is private!!!
//     this.state = {
//       value: null,
//     };
//   }

//   // 透過render回傳 DOM view
//   render() {
//     return (
//       <button
//         className="square"
//         onClick={() => {
//           // 記得用function，不然每次render，console.log()都會被自動觸發
//           this.props.onClick(); // call the Board's handleClick when clicked
//         }}
//       >
//         {this.props.value}
//       </button>
//     );
//   }
// }

// 但其實不用用到上面的class，可以用 function components就好了
// 因為是function，不用加上this了
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    // value, onCLick 為 prop，傳送給 Sqare
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)} // 當React偵測到Game的state改變，會再render一次
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    // 唯一可以指定this.state的地方是constructor
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1); // substring的概念
    const current = history[history.length - 1];
    const squares = current.squares.slice(); // slice(): make a cpoy, 方便比較改變前和改變後
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares: squares }]), // concat doesn't mutate the original array
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // map((element, index) => {/* ... */})
    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        // 列表必須使用key，react才好辨識
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          {/* Component必須是大寫開頭 */}
          <Board
            squares={current.squares}
            //   1. 這樣子處理
            //   2. 在constructor使用 this.handleClick = this.handleClick.bind(this);
            //   3. 定義handleClick時使用 handleClick = () => {...}
            // https://zh-hant.reactjs.org/docs/handling-events.html
            onClick={(i) => this.handleClick(i)}
          />
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
      return squares[a];
    }
  }
  return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
