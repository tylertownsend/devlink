import express from 'express';
import bcrypt from 'bcryptjs';
import gravatar from 'gravatar';
import jwt from 'jsonwebtoken';
import config from 'config';
const { check, validationResult } = require('express-validator');

import { User, UserModel } from '../../models/users';


const router = express.Router();

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
async (req: any, res: any) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json ({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    await _checkIfUserExists(email, res);

    const user = _createUser(name, email, password);
    await _encryptPassword(user, password);
    await user.save();
    console.log(user);
    _sendJsonWebToken(user, res);

  } catch(err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

let _checkIfUserExists = async (email: string, res: any): Promise<null> => {
  let user = await UserModel.findOne({ email });
  if (user) {
    return res.status(400).json( { errors: [ { msg: 'User already exists' }]} );
  }
  return user
}

const _createUser = (name: string, email: string, password: string) => {
  const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    });

  const user = new UserModel({
      name,
      email,
      avatar,
      password
    });
  return user;
}

const _encryptPassword = async (user: any, password: string) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
}

const _sendJsonWebToken = (user: any, res: any) => {
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