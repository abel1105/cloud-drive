import React from 'react';
import s from './index.module.scss';

function Folder() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="22.862"
      viewBox="0 0 26 22.862"
    >
      <path
        className={s.path}
        d="M25.095,35.741H.905A.905.905,0,0,1,0,34.836V20.5H26V34.836A.905.905,0,0,1,25.095,35.741Z"
        transform="translate(0 -9.379)"
      />
      <path
        className={s.path}
        d="M11.664,7.086V4.405a.905.905,0,0,0-.905-.905H.905A.905.905,0,0,0,0,4.405v6.716H26V7.991a.905.905,0,0,0-.905-.905Z"
        transform="translate(0)"
      />
    </svg>
  );
}

export default Folder;
