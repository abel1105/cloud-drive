import { getRemainSpace, getUsageSpace } from '../../plugins/localstorage';
import {
  DELETE_FILE,
  PUSH_FILE,
  TOGGLE_FAVORITE
} from '../actions/rootActions';

const initialState = {
  remainSpace: getRemainSpace(),
  usageSpace: getUsageSpace(),
  files: []
};

const rootReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case PUSH_FILE: {
      return {
        ...state,
        remainSpace: getRemainSpace(),
        usageSpace: getUsageSpace(),
        files: [...state.files, payload.file]
      };
    }
    case DELETE_FILE: {
      return {
        ...state,
        remainSpace: getRemainSpace(),
        usageSpace: getUsageSpace(),
        files: state.files.filter(file => file.key !== payload.key)
      };
    }
    case TOGGLE_FAVORITE: {
      return {
        ...state,
        files: state.files.map(file => {
          if (file.key === payload.key) {
            return {
              ...file,
              isFavorite: !file.isFavorite
            };
          }
          return file;
        })
      };
    }
    default:
      return state;
  }
};

export default rootReducer;
