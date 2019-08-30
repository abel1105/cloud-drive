import { INITIAL_EXAMPLE } from '../actions/exampleActions';

const initialState = {
  isInitial: false
};

const exampleReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case INITIAL_EXAMPLE: {
      return {
        ...state,
        isInitial: payload.isInitial
      };
    }
    default:
      return state;
  }
};

export default exampleReducer;
