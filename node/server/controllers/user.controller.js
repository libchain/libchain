import User from '../models/user.model';

/**
 * Create new user
 * @property {string} req.body.email - The email of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
function create(req, res, next) {
  const user = new User({
    email: req.body.email,
    password: User.getPasswordHash(req.body.password)
  });

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

function setPublicKey(req, res, next) {
  console.log(req.user)
  User.get(req.user.email).then((user) => {
    console.log(user)
    user.publicKey = req.body.publicKey;
    user.save()
  })
  .then(updatedUser => res.json(updatedUser))
  .catch(e => next(e))
}

function processLendRequest(req, res) {
  User.get(req.user.email).then((user) => {
    /** 
      * Do some stuff
      */ 
    return;
  })
}

export default { create, setPublicKey, processLendRequest };
