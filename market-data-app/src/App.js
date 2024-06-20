import React from 'react';
import { Provider, useSelector } from 'react-redux';
import StockSearch from './StockSearch';
import FavoriteStocks from './FavoriteStocks';
import store from './redux/store';
import './App.css';

function AppContent() {
  const favorites = useSelector((state) => state.stock.favorites);

  return (
    <div className="App">
      <header className="App-header">
        <div className="content">
          <div className="search-content">
            <StockSearch />
          </div>
          {favorites.length > 0 && (
            <div className="favorite-content">
              <FavoriteStocks />
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
