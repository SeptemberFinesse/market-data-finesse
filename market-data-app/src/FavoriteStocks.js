import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { removeFavorite, setFavorites } from './redux/actions';
import './FavoriteStocks.css';

const FavoriteStockItem = ({ stock, index, moveStock, handleRemoveFavorite, onDrop }) => {
  const ref = React.useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'STOCK',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => {
      onDrop(index);
    },
  });

  const [, drop] = useDrop({
    accept: 'STOCK',
    hover: (item) => {
      if (item.index !== index) {
        moveStock(item.index, index);
        item.index = index;
      }
    },
  });

  drag(drop(ref));

  const percentChange = ((stock.latestTrade.p - stock.dailyBar.o) / stock.dailyBar.o);
  const lastPriceColor = percentChange > 0 ? 'green' : percentChange < 0 ? 'red' : 'grey';
  const starIcon = 'https://www.svgrepo.com/show/13695/star.svg';
  const moveIcon = 'https://www.svgrepo.com/show/532195/menu.svg';

  return (
    <div
      ref={ref}
      className={`favorite-stock-item ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <img src={moveIcon} alt="Move" className="move-icon" />
      <span className="stock-symbol">{stock.symbol}</span>
      <img
        src={starIcon}
        alt="Favorite"
        onClick={() => handleRemoveFavorite(stock.symbol)}
        className="favorite-icon"
      />
      <span className="stock-price" style={{ color: lastPriceColor }}>
        {stock.latestTrade.p.toFixed(2)}
      </span>
    </div>
  );
};

const FavoriteStocks = () => {
  const favorites = useSelector((state) => state.stock.favorites);
  const dispatch = useDispatch();
  const [fadingOut, setFadingOut] = useState({});
  const [sectionFadingOut, setSectionFadingOut] = useState(false);
  const [shakingIndex, setShakingIndex] = useState(null);

  const moveStock = (fromIndex, toIndex) => {
    const updatedFavorites = [...favorites];
    const [movedStock] = updatedFavorites.splice(fromIndex, 1);
    updatedFavorites.splice(toIndex, 0, movedStock);
    dispatch(setFavorites(updatedFavorites));
  };

  const handleRemoveFavorite = (symbol) => {
    setFadingOut((prev) => ({ ...prev, [symbol]: true }));
    if (favorites.length === 1) {
      setSectionFadingOut(true);
    }
    setTimeout(() => {
      dispatch(removeFavorite(symbol));
    }, 1000); // Match the duration of the fade-out animation
  };

  const handleDrop = (index) => {
    setShakingIndex(index);
    setTimeout(() => {
      setShakingIndex(null);
    }, 500); // Duration of the shake animation
  };

  useEffect(() => {
    const handleAnimationEnd = (symbol) => {
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
  }, [fadingOut]);

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
      <DndProvider backend={HTML5Backend}>
        <div id="favorite-stocks-section" className={`favorite-stocks ${sectionFadingOut ? 'fade-out' : 'fade-in'}`}>
          <h2>Favorite Stocks</h2>
          {favorites.map((stock, index) => (
            <FavoriteStockItem
              key={stock.symbol}
              stock={stock}
              index={index}
              moveStock={moveStock}
              handleRemoveFavorite={handleRemoveFavorite}
              onDrop={handleDrop}
              className={shakingIndex === index ? 'shake' : ''}
            />
          ))}
        </div>
      </DndProvider>
    )
  );
};

export default FavoriteStocks;
