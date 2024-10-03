const express = require('express');
const { getOrder } = require('../controller/orderController');

const router = express.Router();

router.get("/order", getOrder)

module,exports = router