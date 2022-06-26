import { useState, useEffect } from 'react';
import axios from 'axios';

// More info found at https://min-api.cryptocompare.com/documentation
export function useEthPrice() {
  const [ethPrice, setEthPrice] = useState(null);
  const api = `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=${process.env.REACT_APP_CRYPTO_COMPARE}`;

  useEffect(() => {
    axios
      .get(api)
      .then((res) => setEthPrice(res.data.USD))
      .catch((err) => console.log(err));
  }, []);

  return ethPrice;

}
