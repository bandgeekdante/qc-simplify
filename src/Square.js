import React from 'react'

export default function Square({ children }) {
  return <div className="square"
    // style={{
    //   backgroundColor: 'black',
    //   color: 'white',
    //   width: '100%',
    //   height: '100%',
    //   display: 'flex',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    // }}
  >
    {children}
  </div>
}
