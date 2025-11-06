import { useState, createElement } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [moveHistory, setMoveHistory] = useState([]);

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);

    // Track moves for replay feature
    setMoveHistory([
      ...moveHistory,
      {
        squares: squares.slice(),
        xIsNext: xIsNext,
      },
    ]);
  }

  function handleReplay() {
    if (moveHistory.length > 0) {
      const previous = moveHistory[moveHistory.length - 1];
      setSquares(previous.squares);
      setXIsNext(previous.xIsNext);
      setMoveHistory(moveHistory.slice(0, -1));
    }
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // Game replay feature - VULNERABLE
  function renderReplay() {
    const urlParams = new URLSearchParams(window.location.search);
    const replayData = urlParams.get("replay");

    if (replayData) {
      try {
        const config = JSON.parse(decodeURIComponent(replayData));
        // VULNERABLE: Directly using user-controlled config to create elements
        return createElement(
          config.type || "div",
          config.props || {},
          config.children || "Replay Mode Active"
        );
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  return (
    <>
      <div className="status">{status}</div>
      <button
        onClick={handleReplay}
        disabled={moveHistory.length === 0}
        style={{ marginBottom: "10px" }}
      >
        ↩️ Replay (Undo Last Move)
      </button>
      {renderReplay()}
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
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
