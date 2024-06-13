import { useEffect, useState } from 'react';
import './App.css';

const API_KEY = '7863582315064d2578bfa079';  // api key
const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState(1);
  const [exchangeRate, setExchangeRate] = useState();
  const [convertedAmount, setConvertedAmount] = useState();

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        let currencyList = Object.keys(data.conversion_rates);
        setCurrencies(currencyList);
        setExchangeRate(data.conversion_rates[toCurrency]);
      })
      .catch((error) => console.error('Error fetching exchange rates:', error));
  }, [toCurrency]);

  useEffect(() => {
    if (fromCurrency === toCurrency) {
      setExchangeRate(1);
    } else {
      fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`)
        .then((response) => response.json())
        .then((data) => setExchangeRate(data.conversion_rates[toCurrency]))
        .catch((error) => console.error('Error fetching exchange rate:', error));
    }
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (exchangeRate !== undefined) {
      setConvertedAmount((amount * exchangeRate).toFixed(2));
    }
  }, [amount, exchangeRate]);

  const handleFromCurrencyChange = (event) => {
    setFromCurrency(event.target.value);
  };

  const handleToCurrencyChange = (event) => {
    setToCurrency(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  return (
    <div className="App">
      <h1>Currency Converter</h1>
      <div>
        <label>From Currency:</label>
        <select value={fromCurrency} onChange={handleFromCurrencyChange}>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>To Currency:</label>
        <select value={toCurrency} onChange={handleToCurrencyChange}>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Amount:</label>
        <input type="number" value={amount} onChange={handleAmountChange} />
      </div>
      <div>
        <h2>Converted Amount: {convertedAmount}</h2>
      </div>
    </div>
  );
}

export default App;
