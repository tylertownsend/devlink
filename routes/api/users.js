const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const config = require('config')
const { check, validationResult } = require('express-validator');

const User = require('../../models/users');

/**
 * @route       POST api/users
 * @description Test route
 * @access      Public
 */
router.post('/', [
  check('name', 'Name is required')
    .not()
    .isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters')
  .isLength({ min: 6 })
],
async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json ({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await _checkIfUserExists(email, res);
    user = _createUser(name, email, password);
    await _encryptPassword(user, password);
    await user.save();
    console.log(user);
    _sendJsonWebToken(user, res);

  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

let _checkIfUserExists = async (email, res) => {
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json( { errors: [ { msg: 'User already exists' }]} );
  }
  return user
}

const _createUser = (name, email, password) => {
  const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    });

  let user = new User({
      name,
      email,
      avatar,
      password
    });
  return user;
}

const _encryptPassword = async (user, password) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
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