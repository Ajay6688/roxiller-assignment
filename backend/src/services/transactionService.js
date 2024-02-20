const axios = require("axios");
const Transaction = require("../models/transactionModel");

const getMonthNumber = (monthName) => {
  const months = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
  };
  return months[monthName.toLowerCase()];
};

const initializeDatabase = async () => {
  try {
    // Check if the database is empty
    const existingTransactionsCount = await Transaction.countDocuments();

    if (existingTransactionsCount === 0) {
      // Database is empty, proceed to add data
      const response = await axios.get(process.env.THIRD_PARTY_API_URL);
      const transactions = response.data;

      await Transaction.insertMany(transactions, { timeout: 30000 });
      console.log(`${transactions.length} transactions added to the database`);
    } else {
      console.log("Database already contains data. Skipping initialization.");
    }

    console.log("Database initialization complete");
  } catch (error) {
    throw error;
  }
};

const listTransactions = async (month, page, perPage, search) => {
  try {
    const monthNumber = getMonthNumber(month);

    const filters = {
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, monthNumber],
      },
    };

    if (search) {
      const searchCriteria = isNaN(parseFloat(search))
        ? {
            $or: [
              { title: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
            ],
          }
        : { price: parseFloat(search) };
      Object.assign(filters, searchCriteria);
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(perPage),
    };

    const transactions = await Transaction.paginate(filters, options);
    return transactions;
  } catch (error) {
    console.error("Error fetching transactions from database:", error);
    throw error;
  }
};

const getStatistics = async (month) => {
  try {
    const monthNumber = getMonthNumber(month);

    const filters = {
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, monthNumber],
      },
    };

    const transactions = await Transaction.find(filters);

    const totalSaleAmount = transactions.reduce((total, transaction) => {
      return total + (transaction.sold ? transaction.price : 0);
    }, 0);

    const totalSoldItems = transactions.filter(
      (transaction) => transaction.sold
    ).length;
    const totalNotSoldItems = transactions.filter(
      (transaction) => !transaction.sold
    ).length;

    return {
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    };
  } catch (error) {
    console.error("Error fetching statistics:", error);
    throw error;
  }
};
const getBarChartData = async (month) => {
  try {
    const monthNumber = getMonthNumber(month);

    const filters = {
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, monthNumber],
      },
    };

    const transactions = await Transaction.find(filters);

    const priceRanges = [
      { range: "0 - 100", min: 0, max: 100 },
      { range: "101 - 200", min: 101, max: 200 },
      { range: "201 - 300", min: 201, max: 300 },
      { range: "301 - 400", min: 301, max: 400 },
      { range: "401 - 500", min: 401, max: 500 },
      { range: "501 - 600", min: 501, max: 600 },
      { range: "601 - 700", min: 601, max: 700 },
      { range: "701 - 800", min: 701, max: 800 },
      { range: "801 - 900", min: 801, max: 900 },
      { range: "901 - above", min: 901, max: Infinity },
    ];

    const counts = {};
    for (const range of priceRanges) {
      counts[range.range] = 0;
    }

    for (const transaction of transactions) {
      for (const range of priceRanges) {
        if (transaction.price >= range.min && transaction.price <= range.max) {
          counts[range.range]++;
          break;
        }
      }
    }

    return counts;
  } catch (error) {
    console.error("Error fetching bar chart data:", error);
    throw error;
  }
};

const getPieChartData = async (month) => {
  try {
    const monthNumber = getMonthNumber(month);

    const filters = {
      $expr: {
        $eq: [{ $month: "$dateOfSale" }, monthNumber],
      },
    };

    const transactions = await Transaction.find(filters);

    const uniqueCategories = new Set();
    for (const transaction of transactions) {
      uniqueCategories.add(transaction.category);
    }

    const categoryCounts = {};
    for (const category of uniqueCategories) {
      categoryCounts[category] = transactions.filter(
        (transaction) => transaction.category === category
      ).length;
    }

    return categoryCounts;
  } catch (error) {
    console.error("Error fetching pie chart data:", error);
    throw error;
  }
};

module.exports = {
  initializeDatabase,
  listTransactions,
  getStatistics,
  getBarChartData,
  getPieChartData
};
