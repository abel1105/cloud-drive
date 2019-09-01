export const getUniqueKey = () =>
  Math.random()
    .toString(36)
    .substr(2, 5);

export const saveInLocal = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    return false;
  }
};

export const getInLocal = key => localStorage.getItem(key);

export const getUsageSpace = () => {
  let allStrings = '';
  // eslint-disable-next-line no-unused-vars
  for (const key in window.localStorage) {
    if (window.localStorage.hasOwnProperty(key)) {
      allStrings += window.localStorage[key];
    }
  }
  return allStrings ? allStrings.length * 2 : 0;
};

// lift from https://stackoverflow.com/questions/2989284/what-is-the-max-size-of-localstorage-values/35987784#35987784
export const getRemainSpace = () => {
  let max = 10 * 1024 * 1024,
    i = 64,
    string1024 = '',
    string = '',
    // generate a random key
    testKey = 'size-test-' + Math.random().toString(),
    minimalFound = 0,
    error = 25e4;

  // fill a string with 1024 symbols / bytes
  while (i--) string1024 += 1e16;

  i = max / 1024;

  // fill a string with 'max' amount of symbols / bytes
  while (i--) string += string1024;

  i = max;

  // binary search implementation
  while (i > 1) {
    try {
      localStorage.setItem(testKey, string.substr(0, i));
      localStorage.removeItem(testKey);

      if (minimalFound < i - error) {
        minimalFound = i;
        i = i * 1.5;
      } else break;
    } catch (e) {
      localStorage.removeItem(testKey);
      i = minimalFound + (i - minimalFound) / 2;
    }
  }

  return minimalFound * 2;
};
