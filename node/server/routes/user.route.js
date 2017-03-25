import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import userCtrl from '../controllers/user.controller';
import config from '../../config/config';

const router = express.Router(); // eslint-disable-line new-cap

router.route('/')
  
  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createUser), userCtrl.create);

router.route('/publicKey')
  /** PUT /api/users/:userId - Update user  (sets public key) */
  .put(validate(paramValidation.publicKey), expressJwt({ secret: config.jwtSecret }), userCtrl.setPublicKey)

router.route('/lend')
  /** Not sure whether this is needed */
  /** POST /api/users/:userEmail - Pipes lend request to publisher */
  .post(validate(paramValidation.lend), expressJwt({ secret: config.jwtSecret }), userCtrl.processLendRequest)

router.route('/admin/buy')
  /** Not sure whether this is needed */
  /** POST /api/users/:userEmail - Pipes lend request to publisher */
  // update param validation 
  .post(validate(paramValidation.buy), expressJwt({ secret: config.jwtSecret }), userCtrl.processBuyRequest)

export default router;
