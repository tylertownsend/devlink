import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import { check, validationResult } from 'express-validator';

import { auth } from '../../middleware/auth';
import { UserDocument, User, UserModel } from '../../models/users';
import { UserCredentialData } from '../data/users';

const router = express.Router();

// TODO: Update any any arguments
/**
 * @route       GET api/auth
 * @description Test route
 * @access      Public
 */
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.body.user.id).select('-password');
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
async (req: Request<any, any, UserCredentialData>, res: Response) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json ({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await getUser(email, res);
    if (!user) {
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json( { errors: [ { msg: 'Invalid Credentials.' }]} );
    }

    sendJsonWebToken(user, res);
  } catch(err: any) {
    console.error("Error Message" + err.message);
    res.status(500).send('Server error');
  }
});

async function getUser(email: string, res: Response) {
  const user = await UserModel.findOne({ email });
  if (!user) {
    res.status(400).json( { errors: [ { msg: 'Invalid Credentials.' }]} );
    return null;
  }
  return user;
}

function sendJsonWebToken(user: UserDocument, res: Response) {
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