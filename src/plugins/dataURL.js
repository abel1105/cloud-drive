import Base64String from './package/Base64String';
import download from 'downloadjs';

export const compressDataURL = str => {
  return new Promise(resolve => {
    const [header, body] = str.split(',');
    resolve({ header, body: Base64String.compress(body) });
  });
};

export const decompressDataURL = (header, compressedBody) => {
  return new Promise(resolve => {
    resolve(`${header},${Base64String.decompress(compressedBody)}`);
  });
};

export const downloadDataURL = (dataURL, name, type) => {
  download(dataURL, name, type);
};
