/**
 * GET / - Get a list of random stock prices
 * Query Parameters:
 * - limit - Maximum number of stocks to return (default 20)
 *
 * POST /update/:symbol - Update stock price for given symbol
 * Parameters:
 * - symbol - Stock symbol to update
 * Body:
 * - Updated stock price data
 */
const express = require("express");
const router = express.Router();
const { Stock } = require("../models");

// Route to get stocks with random prices
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit || 20;
    const stocks = await Stock.findAll({ limit: parseInt(limit, 10) });
    res.json(stocks);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/update/:symbol", async (req, res) => {
  const sym = req.params.symbol;
  console.log(req.body, sym);
  const stocks = await Stock.update(req.body, {
    where: {
      symbol: sym,
    },
  });
  res.json(stocks);
});

module.exports = router;
