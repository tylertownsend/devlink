const express = require('express');
const router = express.Router();

/**
 * @route       GET api/users
 * @description Test route
 * @access      Public
 */
router.get('/', (req, res) => {
  console.log(req.body);
  res.send('User router');
});

module.exports = router;