const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config')
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const User = require('../../models/users');

/**
 * @route       GET api/auth
 * @description Test route
 * @access      Public
 */
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.send(500).send('Server error: ' + err.message);
  }
});

/**
 * @route       POST api/auth
 * @description Authenticate User and Get Token
 * @access      Public
 */
router.post('/', 
[
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a valid password').isLength({ min: 6 })
],
async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json ({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await _getUser(email, res);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json( { errors: [ { msg: 'Invalid Credentials.' }]} );
    }
    _sendJsonWebToken(user, res);
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

let _getUser = async (email, res) => {
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json( { errors: [ { msg: 'Invalid Credentials.' }]} );
  }
  return user
}

const _sendJsonWebToken = (user, res) => {
  const payload = {
    user: {
      id: user.id
    }
  }

  jwt.sign(
    payload,
    config.get('jwtSecret'),
    { expiresIn: 360000 },
    (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
}

module.exports = router;