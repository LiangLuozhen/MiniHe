const express = require('express');
const tagController = require('../controllers/tagController');

const router = express.Router();

// 公开路由
router.get('/', tagController.getTags);

module.exports = router;