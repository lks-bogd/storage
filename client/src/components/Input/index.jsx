import React from 'react';

import './index.css';

const Input = (props) => {
  return (
    <div>
      <input className='input'
        type={props.type}
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => props.setValue(e.target.value)}
      />
    </div>
  )
}

export default Input
