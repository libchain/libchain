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
      something: Joi.string().required() // not sure if needed
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
