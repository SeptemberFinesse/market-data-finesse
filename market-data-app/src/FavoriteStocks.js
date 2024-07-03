import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { removeFavorite, setFavorites } from './redux/actions';
import './FavoriteStocks.css';
import axios from 'axios';

const FavoriteStockItem = ({ stock, index, moveStock, handleRemoveFavorite, onDrop, displayMode, toggleDisplayMode, fadeInOutClass }) => {
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

  const displayValue = displayMode === 'lastPrice' ? stock.latestTrade.p.toFixed(2) : (percentChange * 100).toFixed(2) + '%';

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
      <span
        className={`stock-price ${fadeInOutClass}`}
        style={{ color: lastPriceColor, cursor: 'pointer' }}
        onClick={() => toggleDisplayMode(stock.symbol)}
      >
        {displayValue}
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
  const [displayModes, setDisplayModes] = useState({});
  const [fadeInOutClass, setFadeInOutClass] = useState('');

  const fetchData = async (symbol) => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'APCA-API-KEY-ID': 'PKD29JZU7SWDFPTUPY2Z',
        'APCA-API-SECRET-KEY': 'wNoZ8NWaLuoh7IUfSXSr8Z4YgUlXa2aEJRlnulvf'
      }
    };
    try {
      const response = await axios.get(`https://data.alpaca.markets/v2/stocks/${symbol}/snapshot`, options);
      return response.data;
    } catch (error) {
      console.error('Error fetching stock data', error);
      return null;
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      if (favorites.length > 0) {
        setFadeInOutClass('fade-in-out'); // Add the fade-in-out class
        const updatedFavorites = await Promise.all(
          favorites.map(async (stock) => {
            const updatedData = await fetchData(stock.symbol);
            return updatedData ? { ...stock, ...updatedData } : stock;
          })
        );
        dispatch(setFavorites(updatedFavorites));
        setTimeout(() => {
          setFadeInOutClass(''); // Remove the fade-in-out class after animation
        }, 1900);
      }
    }, 1900);

    return () => clearInterval(interval);
  }, [favorites, dispatch]);

  const moveStock = (fromIndex, toIndex) => {
    const updatedFavorites = [...favorites];
    const [movedStock] = updatedFavorites.splice(fromIndex, 1);
    updatedFavorites.splice(toIndex, 0, movedStock);
    dispatch(setFavorites(updatedFavorites));
  };

  const handleRemoveFavorite = (symbol) => {
    setFadingOut((prev) => ({ ...prev, [symbol]: true }));
    setTimeout(() => {
      dispatch(removeFavorite(symbol));
      setFadingOut((prev) => {
        const newState = { ...prev };
        delete newState[symbol];
        return newState;
      });
    }, 300); // Match the duration of the fade-out animation
  };

  const handleDrop = (index) => {
    setShakingIndex(index);
    setTimeout(() => {
      setShakingIndex(null);
    }, 500); // Duration of the shake animation
  };

  const toggleDisplayMode = (symbol) => {
    setDisplayModes((prevModes) => ({
      ...prevModes,
      [symbol]: prevModes[symbol] === 'lastPrice' ? 'percentChange' : 'lastPrice',
    }));
  };

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
        <div id="favorite-stocks-section" className="favorite-stocks">
          <h2>Favorite Stocks</h2>
          {favorites.map((stock, index) => (
            <div key={stock.symbol} id={`favorite-stock-${stock.symbol}`} className={`favorite-stock-item-container ${fadingOut[stock.symbol] ? 'fade-out' : 'fade-in'}`}>
              <FavoriteStockItem
                stock={stock}
                index={index}
                moveStock={moveStock}
                handleRemoveFavorite={handleRemoveFavorite}
                onDrop={handleDrop}
                displayMode={displayModes[stock.symbol] || 'lastPrice'}
                toggleDisplayMode={toggleDisplayMode}
                fadeInOutClass={fadeInOutClass}
                className={shakingIndex === index ? 'shake' : ''}
              />
            </div>
          ))}
        </div>
      </DndProvider>
    )
  );
};

export default FavoriteStocks;
