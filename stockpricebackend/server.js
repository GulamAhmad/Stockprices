// all the neccesary  imports
const express = require("express");
require("dotenv").config();
const axios = require("axios");
const db = require("./models");
const cors = require("cors");
const { Stock } = require("./models");
const bodyParser = require("body-parser");

/**
 * Configures the Express app:
 * - Parses request bodies as JSON
 * - Enables CORS for all origins
 * - Sets the port to use based on environment variables, defaulting to 3002
 */
const app = express();
app.use(bodyParser.json());
app.use(cors());
const PORT = process.env.PORT || 3002;

// Fetch 20 stocks from the Polygon API and store them in the database
const fetchStocks = async () => {
  try {
    const response = await axios.get(
      `https://api.polygon.io/v3/reference/tickers?limit=20&apiKey=${process.env.API_KEY}`
    );

    const stocks = response.data.results;

    // Create a new stock for each stock in the database
    for (const stock of stocks) {
      const existingStock = await Stock.findOne({
        where: {
          symbol: stock.ticker,
        },
      });

      // if stocks exists in database do not create again
      if (!existingStock) {
        await Stock.create({
          symbol: stock.ticker,
          openPrice: Math.random() * 500,
          refreshInterval: Math.floor(Math.random() * 5) + 1,
        });
      } else {
        console.log(
          `Stock with symbol ${stock.ticker} already exists. Skipping.`
        );
      }
    }
    console.log("Stocks set up successfully");
  } catch (error) {
    console.error(error);
  }
};

// Expose an API to fetch stock prices
const getStocks = require("./routes/Getstocks");
app.use("/api", getStocks);

/**
 * Connects to the database and starts the Express server.
 * - Calls db.sequelize.sync() to connect to the database.
 * - Calls fetchStocks() to fetch initial stock data.
 * - Starts the Express server listening on the PORT.
 * - Logs a message when the server starts.
 */
db.sequelize.sync().then(async () => {
  await fetchStocks();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
