import Joi from 'joi';

export default {
  // POST /api/users
  createUser: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  },

  // UPDATE /api/users/publicKey
  publicKey: {
    body: {
      publicKey: Joi.string().required()
    }
  },

  // POST /api/users/lend
  lend: {
    body: {
      bookAddress: Joi.string().required()
    }
  },

  // POST /api/users/admin/buy
  buy: {
    body: {
      bookAddress: Joi.string().required(),
      publisherAddress: Joi.string().required() 
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  }
};
