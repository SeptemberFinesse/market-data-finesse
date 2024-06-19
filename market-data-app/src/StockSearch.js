// src/StockSearch.js
import React, { useState } from 'react';
import axios from 'axios';

const StockSearch = () => {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState('');

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
      setStockData(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      setStockData(null);
    }
  };

  const handleSearch = () => {
    if (symbol) {
      fetchStockData(symbol);
    }
  };
  console.log(stockData)
  return (
    <div>
      <h1>Stock Search</h1>
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Enter stock symbol"
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p>{error}</p>}
      {stockData && (
        <div>
          <h2>Stock Data</h2>
          <p>Symbol: {stockData.symbol}</p>
          <p>Last Trade Price: {stockData.latestTrade.p}</p>
          <p>Open Price: {stockData.dailyBar.o}</p>
          <p>High Price: {stockData.dailyBar.h}</p>
          <p>Low Price: {stockData.dailyBar.l}</p>
          <p>Close Price: {stockData.dailyBar.c}</p>
          <p>Volume: {stockData.dailyBar.v}</p>
          <p>VWAP: {stockData.dailyBar.vw}</p>
          <p>Percent Change: {(((stockData.latestTrade.p - stockData.dailyBar.o) / stockData.dailyBar.o) * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
};

export default StockSearch;
