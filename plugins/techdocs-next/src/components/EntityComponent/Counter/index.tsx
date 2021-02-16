import React, { useState } from 'react';

export function Counter({ style }: { style: React.CSSProperties }) {
  const [counter, setCounter] = useState(0);

  return (
    <div style={style}>
      {counter}
      <button
        style={{ fontSize: 'inherit' }}
        onClick={() => setCounter(counter + 1)}
      >
        Add 1
      </button>
    </div>
  );
}
