import { combineReducers } from 'redux';
import { SET_STOCK_DATA, SET_ERROR } from './actions';

const initialState = {
  stockData: null,
  error: '',
};

const stockReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_STOCK_DATA:
      return { ...state, stockData: action.payload, error: '' };
    case SET_ERROR:
      return { ...state, error: action.payload, stockData: null };
    default:
      return state;
  }
};

export default combineReducers({
  stock: stockReducer,
});
