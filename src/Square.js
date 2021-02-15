import React from 'react'

export default function Square({ y, children }) {
  return <div className={`square ${y === 1 ? "wire" : ""}`}
  >
    {children}
  </div>
}
