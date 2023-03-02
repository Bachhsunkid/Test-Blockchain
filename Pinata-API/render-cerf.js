const axios = require('axios');
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK('3db7404898c7f0400623', 'c6ea51a4f4f1604793cfe305d32b9ecbef4e3e53167ec623de33bc2eea680b8f');

// 1. Upload the image file to Pinata
const uploadFile = async (file) => {
  const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS/', file, {
    maxContentLength: 'Infinity',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${file._boundary}`,
      pinata_api_key: pinata.apiKey,
      pinata_secret_api_key: pinata.apiSecret,
    },
  });

  return response.data.IpfsHash;
};

// 2. Pin the file by IPFS hash and get the Pinata CID
const pinByHash = async (hash) => {
  const response = await pinata.pinByHash(hash, {
    pinataOptions: {
      cidVersion: 1,
    },
  });

  return response.IpfsHash;
};

// Usage example
const file = new FormData();
file.append('file', imageFile);

uploadFile(file)
  .then((ipfsHash) => pinByHash(ipfsHash))
  .then((pinataCID) => console.log(pinataCID))
  .catch((error) => console.error(error));