import { combineReducers } from 'redux';
import { SET_STOCK_DATA, SET_ERROR, ADD_FAVORITE, REMOVE_FAVORITE, SET_FAVORITES } from './actions';

const initialState = {
  stockData: null,
  error: '',
  favorites: [],
};

const stockReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_STOCK_DATA:
      return { ...state, stockData: action.payload, error: '' };
    case SET_ERROR:
      return { ...state, error: action.payload, stockData: null };
    case ADD_FAVORITE:
      return { ...state, favorites: [...state.favorites, action.payload] };
    case REMOVE_FAVORITE:
      return { ...state, favorites: state.favorites.filter(stock => stock.symbol !== action.payload) };
    case SET_FAVORITES:
      return { ...state, favorites: action.payload };
    default:
      return state;
  }
};

export default combineReducers({
  stock: stockReducer,
});
