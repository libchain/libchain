import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../../config/config';
import User from '../models/user.model';

// sample user, used for authentication
// const user = {
//   email: 'react',
//   password: 'express'
// };

/**
 * Returns jwt token if valid email and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  // Ideally you'll fetch this from the db
  // Idea here was to show how jwt works with simplicity
  const hashedPassword = User.getPasswordHash(req.body.password)
  User.get(req.body.email).then((user) => {
    if (req.body.email === user.email && hashedPassword === user.password) {
      const token = jwt.sign({
        email: user.email
      }, config.jwtSecret);
  
      return res.json({
        token,
        email: user.email
      });    
    }

    const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true)
    
    return next(err)
  })
  .catch((err) => next(new APIError('Authentication error', httpStatus.UNAUTHORIZED, true)))
 
}

export default { login };
