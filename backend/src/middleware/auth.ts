import jwt from 'jsonwebtoken';
// import { Request, Response, NextFunction } from 'express';
import * as config from 'config';

// TODO update arguments
export function auth(req: any, res: any, next: any) {
  const token = req.header('x-auth-token');

  if(!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    if (typeof decoded == 'string') {
      console.warn('decoded token is string');
    } else {
      req.user = decoded.user;
    }
    next();
  } catch(err) {
    res.status(401).json({ msg: 'Token is not valid'})
  }
}