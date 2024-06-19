export const SET_STOCK_DATA = 'SET_STOCK_DATA';
export const SET_ERROR = 'SET_ERROR';

export const setStockData = (data) => ({
  type: SET_STOCK_DATA,
  payload: data,
});

export const setError = (error) => ({
  type: SET_ERROR,
  payload: error,
});
