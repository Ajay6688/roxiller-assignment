const transactionService = require("../services/transactionService");

const initializeDatabase = async (req, res) => {
  try {
    await transactionService.initializeDatabase();
    return res
      .status(200)
      .json({ message: "Database initialized successfully." });
  } catch (error) {
    console.error("Error initializing database:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const listTransactions = async (req, res) => {
  try {
    const { month, page = 1, perPage = 10, search } = req.query;

    if (!month) {
      return res.status(400).json({ message: 'Missing required parameter: month.' });
    }

    const transactions = await transactionService.listTransactions(month , page , perPage , search);

    return res.status(200).json(transactions);

  } catch (error) {
    console.error("Error listing transactions:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getStatistics = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: 'Missing required parameter: month.' });
    }

    const statistics = await transactionService.getStatistics(month);

    return res.status(200).json(statistics);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getBarChartData = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: 'Missing required parameter: month.' });
    }

    const barChartData = await transactionService.getBarChartData(month);

    return res.status(200).json(barChartData);
  } catch (error) {
    console.error("Error fetching bar chart data:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getPieChartData = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: 'Missing required parameter: month.' });
    }

    const pieChartData = await transactionService.getPieChartData(month);

    return res.status(200).json(pieChartData);
  } catch (error) {
    console.error("Error fetching pie chart data:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getCombinedData = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ message: 'Missing required parameter: month.' });
    }

    const statistics = await transactionService.getStatistics(month);

    const barChartData = await transactionService.getBarChartData(month);

    const pieChartData = await transactionService.getPieChartData(month);

    const combinedData = {
      statistics,
      barChartData,
      pieChartData
    };

    return res.status(200).json(combinedData);
  } catch (error) {
    console.error("Error fetching combined data:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { listTransactions , initializeDatabase , getStatistics , getBarChartData , getPieChartData  , getCombinedData};
