const express = require('express');
const favoriteController = require('../controllers/favoriteController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// 需要认证的路由
router.get('/me', authenticate, favoriteController.getUserFavorites);
router.post('/posts/:id', authenticate, favoriteController.addFavorite);
router.delete('/posts/:id', authenticate, favoriteController.removeFavorite);

module.exports = router;