import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import { check, validationResult } from 'express-validator';

import { auth } from '../../middleware/auth';
import { UserModel } from '../../models/users';

const router = express.Router();

// TODO: Update any any arguments
/**
 * @route       GET api/auth
 * @description Test route
 * @access      Public
 */
router.get('/', auth, async (req: any, res: any) => {
  try {
    const user = await UserModel.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err: any) {
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
async (req: any, res: any) => {
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
  } catch(err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

let _getUser = async (email: any, res: any) => {
  let user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(400).json( { errors: [ { msg: 'Invalid Credentials.' }]} );
  }
  return user
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
    (err: any, token: any) => {
      if (err) throw err;
      res.json({ token });
    });
}

module.exports = router;