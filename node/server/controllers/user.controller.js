import User from '../models/user.model';
import { libAddress } from '../../index';
import contracts from '../helpers/contracts';

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
    // return contracts.libraryContract.at(/* library contract */).then( (instance) => {
    //   return instance.borrow(/*book address*/)
    // })
  })
}

function processBuyRequest(req, res) {
  User.get(req.user.email).then((user) => {
    /* Look if user  has admin rights */
    /*if (!user.admin) {
      res.status(401).send('You need to be admin for this')
    }*/

    return contracts.libraryContract.at(libAddress).then( (instance) => {
      return instance.buy(req.body.bookAddress, req.body.publisherAddress, 1, { from: contracts.web3.eth.accounts[0], gas: 1000000 })
    })
    .then((transactionReceipt) => {
      console.log(transactionReceipt.logs)
      return res.json('ok')
    })

  })
}

export default { create, setPublicKey, processLendRequest, processBuyRequest };
