// src/utils/pagination.js
const paginate = (query, { page = 1, perPage = 10 }) => {
    const offset = (page - 1) * perPage;
    const limit = perPage;
  
    query = query.skip(offset).limit(limit);
  
    return query;
  };
  
  module.exports = paginate;
  