import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFavorite } from './redux/actions';
import './FavoriteStocks.css';

const FavoriteStocks = () => {
  const favorites = useSelector((state) => state.stock.favorites);
  const dispatch = useDispatch();
  const [fadingOut, setFadingOut] = useState({});
  const [sectionFadingOut, setSectionFadingOut] = useState(false);

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '-';
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getLastPriceColor = (percentChange) => {
    if (percentChange > 0) return 'green';
    if (percentChange < 0) return 'red';
    return 'grey';
  };

  const handleRemoveFavorite = (symbol) => {
    setFadingOut((prev) => ({ ...prev, [symbol]: true }));
    if (favorites.length === 1) {
      setSectionFadingOut(true);
    }
  };

  useEffect(() => {
    const handleAnimationEnd = (symbol) => {
      dispatch(removeFavorite(symbol));
      setFadingOut((prev) => {
        const newState = { ...prev };
        delete newState[symbol];
        return newState;
      });
    };

    Object.keys(fadingOut).forEach((symbol) => {
      const element = document.getElementById(`favorite-stock-${symbol}`);
      if (element) {
        element.addEventListener('animationend', () => handleAnimationEnd(symbol));
      }
    });
  }, [fadingOut, dispatch]);

  useEffect(() => {
    if (sectionFadingOut && favorites.length === 0) {
      const sectionElement = document.getElementById('favorite-stocks-section');
      if (sectionElement) {
        sectionElement.addEventListener('animationend', () => setSectionFadingOut(false));
      }
    }
  }, [sectionFadingOut, favorites.length]);

  return (
    favorites.length > 0 && (
      <div id="favorite-stocks-section" className={`favorite-stocks ${sectionFadingOut ? 'fade-out' : 'fade-in'}`}>
        <h2>Favorite Stocks</h2>
        {favorites.map(stock => {
          const percentChange = ((stock.latestTrade.p - stock.dailyBar.o) / stock.dailyBar.o);
          const lastPriceColor = getLastPriceColor(percentChange);
          const starIcon = 'https://www.svgrepo.com/show/13695/star.svg';
          const isFadingOut = fadingOut[stock.symbol];
          return (
            <div
              key={stock.symbol}
              id={`favorite-stock-${stock.symbol}`}
              className={`favorite-stock-item ${isFadingOut ? 'fade-out' : 'fade-in'}`}
            >
              <span className="stock-symbol">{stock.symbol}</span>
              <img src={starIcon} alt="Favorite" onClick={() => handleRemoveFavorite(stock.symbol)} className="favorite-icon" />
              <span className="stock-price" style={{ color: lastPriceColor }}>{formatNumber(stock.latestTrade.p)}</span>
            </div>
          );
        })}
      </div>
    )
  );
};

export default FavoriteStocks;
