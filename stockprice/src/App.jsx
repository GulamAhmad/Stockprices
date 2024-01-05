// src/App.js
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

/**
 * App component that fetches stock data, displays a table of stocks
 * and their prices, and updates stock prices periodically.
 *
 * Allows user to specify number of stocks to display.
 * Fetches initial stock data from API based on number entered.
 * Sets up interval to periodically update stock prices.
 * Displays stock symbol and price in a table.
 * Cleans up intervals on unmount.
 */

function App() {
  //defining state variables
  const [numberOfStocks, setNumberOfStocks] = useState(0);
  const [stocks, setStocks] = useState([]);
  const [updates, setUpdate] = useState([]);

  useEffect(() => {
    //validation for number of inputs
    if (numberOfStocks > 20) {
      alert("please enter amount bwtween 1 to 20");
      setNumberOfStocks(0);
      return;
    }

    //fetching stocks from backend
    axios
      .get(`http://localhost:3002/api?limit=${numberOfStocks}`)
      .then((response) => {
        setStocks(response.data);
        setUpdate(response.data);
      })
      .catch((error) => console.error(error));
  }, [numberOfStocks]);

  useEffect(() => {
    const ids = [];

    // update funtion to update the state and call the update api to change the price
    const updatePrice = (index) => {
      let value = updates[index].openPrice + Math.random() * 10 - 5;
      let newPrice = value < 0 ? value + 5 : value;

      //api call to update the value in database
      axios
        .post(`http://localhost:3002/api/update/${stocks[index].symbol}`, {
          openPrice: newPrice,
        })
        .catch((err) => {
          console.log(err);
        });

      // state update which will get render
      setUpdate((prev) => {
        const newUpdate = [...prev];
        newUpdate[index].openPrice = newPrice;
        return newUpdate;
      });
    };

    // looping over the stocks array to call interval function
    stocks?.forEach((val, index) => {
      const id = setInterval(
        () => updatePrice(index),
        val.refreshInterval * 1000
      );
      ids.push(id);
    });

    //calling clear interval on unmount
    return () => {
      ids.forEach(clearInterval);
    };
  }, [stocks]);

  return (
    <div className="container">
      {/* render the stocked according to the number of input  */}
      <label>
        Number of Stocks:
        <input
          type="number"
          value={numberOfStocks}
          placeholder="Enter the number of stocks"
          onChange={(e) => setNumberOfStocks(e.target.value)}
          required
        />
      </label>
      <table>
        <thead>
          <th>Symbols</th>
          <th>Prices</th>
        </thead>
        <tbody>
          {/* mapping over the stocks to rerender it   */}
          {updates.map((stocks, key) => {
            return (
              <tr key={key}>
                <td>{stocks.symbol}</td>
                <td>${stocks.openPrice.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
