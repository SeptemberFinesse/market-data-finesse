import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFavorite } from './redux/actions';
import './FavoriteStocks.css';

const FavoriteStocks = () => {
  const favorites = useSelector((state) => state.stock.favorites);
  const dispatch = useDispatch();

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '-';
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getLastPriceColor = (percentChange) => {
    if (percentChange > 0) return 'green';
    if (percentChange < 0) return 'red';
    return 'grey';
  };

  return (
    favorites.length > 0 && (
      <div className="favorite-stocks">
        {favorites.map(stock => {
          const percentChange = ((stock.latestTrade.p - stock.dailyBar.o) / stock.dailyBar.o);
          const lastPriceColor = getLastPriceColor(percentChange);
          const starIcon = 'https://www.svgrepo.com/show/13695/star.svg';
          return (
            <div key={stock.symbol} className="favorite-stock-item">
              <span>{stock.symbol}</span>
              <img src={starIcon} alt="Favorite" onClick={() => dispatch(removeFavorite(stock.symbol))} className="favorite-icon" />
              <span style={{ color: lastPriceColor }}>{formatNumber(stock.latestTrade.p)}</span>
            </div>
          );
        })}
      </div>
    )
  );
};

export default FavoriteStocks;
