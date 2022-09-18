import express, { Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import gravatar from 'gravatar';
import jwt from 'jsonwebtoken';
import config from 'config';
import { check, validationResult } from 'express-validator';

import { User, UserModel } from '../../models/users';
import { UserFormData } from '../data/users';

const router = express.Router();

/**
 * @route       POST api/users
 * @description Test route
 * @access      Public
 */
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
],
async (req: Request<any, any, UserFormData>, res: Response) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return res.status(400).json ({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    const userExists = await checkIfUserExists(email, res);
    if (userExists) {
      return;
    }

    const user = createUser(name, email, password);
    await encryptPassword(user, password);
    await user.save();
    sendJsonWebToken(user, res);

  } catch(err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

async function checkIfUserExists(email: string, res: Response): Promise<boolean> {
  let user = await UserModel.findOne({ email });
  if (user) {
    const errors = { errors: [ { msg: 'User already exists' }]};
    res.status(400).json(errors);
    return true;
  }
  return false;
  // return user
}

function createUser(name: string, email: string, password: string) {
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

async function encryptPassword(user: any, password: string) {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
}

function sendJsonWebToken(user: any, res: Response) {
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