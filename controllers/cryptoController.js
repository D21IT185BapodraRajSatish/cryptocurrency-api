const Crypto = require('../models/cryptoModel');

exports.getLatestStats = async (req, res) => {
  try {
    const { coin } = req.query;
    const coinMap = {
      'bitcoin': 'Bitcoin',
      'ethereum': 'Ethereum',
      'matic-network': 'Polygon'
    };

    const coinName = coinMap[coin];
    if (!coinName) {
      return res.status(400).json({ error: 'Invalid coin provided' });
    }

    const latestData = await Crypto.findOne({ name: coinName }).sort({ timestamp: -1 });
    if (!latestData) {
      return res.status(404).json({ error: 'No data found for the requested coin' });
    }

    res.json({
      price: latestData.price,
      marketCap: latestData.market_cap,
      '24hChange': latestData.change_24h
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getStandardDeviation = async (req, res) => {
  try {
    const { coin } = req.query;
    const coinMap = {
      'bitcoin': 'Bitcoin',
      'ethereum': 'Ethereum',
      'matic-network': 'Polygon'
    };

    const coinName = coinMap[coin];
    if (!coinName) {
      return res.status(400).json({ error: 'Invalid coin provided' });
    }

    const records = await Crypto.find({ name: coinName }).sort({ timestamp: -1 }).limit(100);
    if (records.length === 0) {
      return res.status(404).json({ error: 'No records found for the requested coin' });
    }

    const prices = records.map(record => record.price);
    const mean = prices.reduce((acc, val) => acc + val, 0) / prices.length;
    const variance = prices.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / prices.length;
    const stdDev = Math.sqrt(variance);

    res.json({ deviation: parseFloat(stdDev.toFixed(2)) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
