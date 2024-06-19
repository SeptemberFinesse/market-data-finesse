// src/App.js
import React from 'react';
import { Provider } from 'react-redux';
import StockSearch from './StockSearch';
import store from './redux/store';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <StockSearch />
        </header>
      </div>
    </Provider>
  );
}

export default App;
