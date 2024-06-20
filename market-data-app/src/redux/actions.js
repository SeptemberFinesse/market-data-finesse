export const SET_STOCK_DATA = 'SET_STOCK_DATA';
export const SET_ERROR = 'SET_ERROR';
export const ADD_FAVORITE = 'ADD_FAVORITE';
export const REMOVE_FAVORITE = 'REMOVE_FAVORITE';
export const SET_FAVORITES = 'SET_FAVORITES';

export const setStockData = (data) => ({
  type: SET_STOCK_DATA,
  payload: data,
});

export const setError = (error) => ({
  type: SET_ERROR,
  payload: error,
});

export const addFavorite = (stock) => ({
  type: ADD_FAVORITE,
  payload: stock,
});

export const removeFavorite = (symbol) => ({
  type: REMOVE_FAVORITE,
  payload: symbol,
});

export const setFavorites = (favorites) => ({
  type: SET_FAVORITES,
  payload: favorites,
});
