import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setStockData, setError, addFavorite, removeFavorite } from './redux/actions';
import './StockSearch.css';

const StockSearch = () => {
  const [symbol, setSymbol] = useState('');
  const dispatch = useDispatch();
  const stockData = useSelector((state) => state.stock.stockData);
  const error = useSelector((state) => state.stock.error);
  const favorites = useSelector((state) => state.stock.favorites);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const fetchStockData = async (ticker) => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'APCA-API-KEY-ID': 'AK0WIW77OAZ5YHWA12OV',
        'APCA-API-SECRET-KEY': '76Wc63zbHbmDdzeDSBErhFNfbOB9F2SWUd7QjhC4'
      }
    };

    try {
      const response = await axios.get(`https://data.alpaca.markets/v2/stocks/${ticker}/snapshot`, options);
      dispatch(setStockData(response.data));
    } catch (err) {
      dispatch(setError('Failed to fetch data. Please try again.'));
    }
  };

  const handleSearch = () => {
    if (symbol) {
      fetchStockData(symbol);
    }
  };

  const handleFavorite = () => {
    if (stockData) {
      if (favorites.some(stock => stock.symbol === stockData.symbol)) {
        dispatch(removeFavorite(stockData.symbol));
        setIsFadingOut(true);
        setTimeout(() => {
          setIsFadingOut(false);
        }, 1000); // Match the duration of the fade-out animation
      } else {
        dispatch(addFavorite(stockData));
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const isFavorite = stockData && favorites.some(stock => stock.symbol === stockData.symbol);
  const starIcon = isFavorite && !isFadingOut ? 'https://www.svgrepo.com/show/13695/star.svg' : 'https://www.svgrepo.com/show/172818/star-outline.svg';

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '-';
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getLastPriceColor = (percentChange) => {
    if (percentChange > 0) return 'green';
    if (percentChange < 0) return 'red';
    return 'grey';
  };

  const percentChange = stockData ? ((stockData.latestTrade.p - stockData.dailyBar.o) / stockData.dailyBar.o) : 0;
  const lastPriceColor = getLastPriceColor(percentChange);

  useEffect(() => {
    const input = document.getElementById('stock-input');
    input.addEventListener('keypress', handleKeyPress);
    return () => {
      input.removeEventListener('keypress', handleKeyPress);
    };
  }, [symbol]);

  return (
    <div className="container">
      <h1>Stock Search</h1>
      <div className="search-container">
        <input
          id="stock-input"
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Enter stock symbol"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {stockData && (
        <div className="stock-info">
          <img src={starIcon} alt="Favorite" onClick={handleFavorite} className={`favorite-icon ${isFadingOut ? 'fade-out' : ''}`} />
          <h2>{stockData.symbol}</h2>
          <h2 className="last-price" style={{ color: lastPriceColor }}>
            {formatNumber(stockData.latestTrade.p)}
          </h2>
        </div>
      )}
      {error && <p className="error">{error}</p>}
      {stockData && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Symbol</td>
                <td>{stockData.symbol}</td>
              </tr>
              <tr>
                <td>Last Trade Price</td>
                <td>{formatNumber(stockData.latestTrade.p)}</td>
              </tr>
              <tr>
                <td>Open Price</td>
                <td>{formatNumber(stockData.dailyBar.o)}</td>
              </tr>
              <tr>
                <td>High Price</td>
                <td>{formatNumber(stockData.dailyBar.h)}</td>
              </tr>
              <tr>
                <td>Low Price</td>
                <td>{formatNumber(stockData.dailyBar.l)}</td>
              </tr>
              <tr>
                <td>Close Price</td>
                <td>{formatNumber(stockData.dailyBar.c)}</td>
              </tr>
              <tr>
                <td>Volume</td>
                <td>{formatNumber(stockData.dailyBar.v)}</td>
              </tr>
              <tr>
                <td>VWAP</td>
                <td>{formatNumber(stockData.dailyBar.vw)}</td>
              </tr>
              <tr>
                <td>Percent Change</td>
                <td>{(percentChange * 100).toFixed(2)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockSearch;
