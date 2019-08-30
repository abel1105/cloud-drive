import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import Analytics from 'react-router-ga';
import Homepage from '../Homepage';

const App = () => {
  return (
    <HashRouter>
      <Analytics id={process.env.REACT_APP_GOOGLE_ANALYTICS_ID}>
        <Route path="/" exact component={Homepage} />
      </Analytics>
    </HashRouter>
  );
};

export default App;
