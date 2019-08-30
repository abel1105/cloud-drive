import React from 'react';
import logo from '../../images/logo.svg';
import s from './index.module.scss';

function Homepage() {
  return (
    <div className={s.root}>
      <header className={s.header}>
        <img src={logo} className={s.logo} alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className={s.link}
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default Homepage;
