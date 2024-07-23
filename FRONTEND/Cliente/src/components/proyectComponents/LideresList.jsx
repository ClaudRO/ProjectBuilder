import React from 'react';

const LideresList = ({ lideres }) => (
  <div className='marcoformulario2'>
    <h2>Líderes Asociados</h2>
    <div className='marcoformulario3'>
      <ul>
        {lideres.map((lider, index) => (
          <li key={index}>{lider}</li>
        ))}
      </ul>
    </div>
  </div>
);

export default LideresList;
