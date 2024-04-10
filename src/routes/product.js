const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query, availability } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
    };

    let filter = {};
    if (query) filter.category = query;
    if (availability) filter.availability = availability;

    const products = await Product.paginate(filter, options);

    const totalPages = products.totalPages;
    const prevPage = products.hasPrevPage ? products.prevPage : null;
    const nextPage = products.hasNextPage ? products.nextPage : null;
    const hasPrevPage = products.hasPrevPage;
    const hasNextPage = products.hasNextPage;
    const prevLink = hasPrevPage ? `/api/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}&availability=${availability}` : null;
    const nextLink = hasNextPage ? `/api/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}&availability=${availability}` : null;

    res.json({
      status: 'success',
      payload: products.docs,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink
    });
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener los productos' });
  }
});

module.exports = router;
