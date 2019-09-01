export const PUSH_FILE = 'PUSH_FILE';

export const DELETE_FILE = 'DELETE_FILE';

export const TOGGLE_FAVORITE = 'TOGGLE_FAVORITE';

export const pushFile = file => ({
  type: PUSH_FILE,
  payload: {
    file
  }
});

export const deleteFile = key => ({
  type: DELETE_FILE,
  payload: {
    key
  }
});

export const toggleFavorite = key => ({
  type: TOGGLE_FAVORITE,
  payload: {
    key
  }
});
