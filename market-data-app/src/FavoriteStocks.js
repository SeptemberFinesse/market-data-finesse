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
        <h2>Favorite Stocks</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Star</th>
                <th>Symbol</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map(stock => {
                const percentChange = ((stock.latestTrade.p - stock.dailyBar.o) / stock.dailyBar.o);
                const lastPriceColor = getLastPriceColor(percentChange);
                const starIcon = 'https://www.svgrepo.com/show/13695/star.svg';
                return (
                  <tr key={stock.symbol}>
                    <td>
                      <img src={starIcon} alt="Favorite" onClick={() => dispatch(removeFavorite(stock.symbol))} className="favorite-icon" />
                    </td>
                    <td>{stock.symbol}</td>
                    <td style={{ color: lastPriceColor }}>
                      {formatNumber(stock.latestTrade.p)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  );
};

export default FavoriteStocks;
