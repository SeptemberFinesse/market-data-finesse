import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setStockData, setError, addFavorite, removeFavorite, setFavorites } from './redux/actions';
import './StockSearch.css';

const StockSearch = () => {
  const [symbol, setSymbol] = useState('');
  const [fadeInOutClass, setFadeInOutClass] = useState('');
  const dispatch = useDispatch();
  const stockData = useSelector((state) => state.stock.stockData);
  const error = useSelector((state) => state.stock.error);
  const favorites = useSelector((state) => state.stock.favorites);

  const fetchStockData = async (ticker) => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'APCA-API-KEY-ID': 'PKD29JZU7SWDFPTUPY2Z',
        'APCA-API-SECRET-KEY': 'wNoZ8NWaLuoh7IUfSXSr8Z4YgUlXa2aEJRlnulvf'
      }
    };

    try {
      const response = await axios.get(`https://data.alpaca.markets/v2/stocks/${ticker}/snapshot`, options);
      dispatch(setStockData(response.data));
      setTimeout(() => {
        setFadeInOutClass('fade-in-out'); // Trigger fade effect on table values
        setTimeout(() => {
          setFadeInOutClass(''); // Remove the fade effect class after the transition
        }, 1000);
      }, 100);
    } catch (err) {
      dispatch(setError('Failed to fetch data. Please try again.'));
    }
  };

  const fetchFavoritesData = async () => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'APCA-API-KEY-ID': 'PKD29JZU7SWDFPTUPY2Z',
        'APCA-API-SECRET-KEY': 'wNoZ8NWaLuoh7IUfSXSr8Z4YgUlXa2aEJRlnulvf'
      }
    };

    const updatedFavorites = await Promise.all(
      favorites.map(async (stock) => {
        try {
          const response = await axios.get(`https://data.alpaca.markets/v2/stocks/${stock.symbol}/snapshot`, options);
          return response.data;
        } catch (error) {
          console.error('Error fetching stock data', error);
          return stock;
        }
      })
    );

    dispatch(setFavorites(updatedFavorites));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (stockData) {
        fetchStockData(stockData.symbol);
      }
      if (favorites.length > 0) {
        fetchFavoritesData();
      }
    }, 1900);

    return () => clearInterval(interval);
  }, [stockData, favorites, dispatch]);

  const handleSearch = () => {
    if (symbol) {
      fetchStockData(symbol);
    }
  };

  const handleFavorite = () => {
    if (stockData) {
      if (favorites.some(stock => stock.symbol === stockData.symbol)) {
        dispatch(removeFavorite(stockData.symbol));
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
  const starIcon = isFavorite ? 'https://www.svgrepo.com/show/13695/star.svg' : 'https://www.svgrepo.com/show/172818/star-outline.svg';

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
          <img src={starIcon} alt="Favorite" onClick={handleFavorite} className="favorite-icon" />
          <h2>{stockData.symbol}</h2>
          <h2 className={`last-price ${fadeInOutClass}`} style={{ color: lastPriceColor }}>
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
                <th>Symbol</th>
                <th>Last Trade Price</th>
                <th>Percent Change</th>
                <th>Open Price</th>
                <th>Close Price</th>
                <th>Volume</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{stockData.symbol}</td>
                <td className={fadeInOutClass}>{formatNumber(stockData.latestTrade.p)}</td>
                <td className={fadeInOutClass}>{(percentChange * 100).toFixed(2)}%</td>
                <td className={fadeInOutClass}>{formatNumber(stockData.dailyBar.o)}</td>
                <td className={fadeInOutClass}>{formatNumber(stockData.dailyBar.c)}</td>
                <td className={fadeInOutClass}>{formatNumber(stockData.dailyBar.v)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockSearch;
