import mongoose from 'mongoose';
import util from 'util';
import bookCtrl from './server/controllers/book.controller'
import contracts from './server/helpers/contracts';

// config should be imported before importing any other file
import config from './config/config';
import app from './config/express';

const debug = require('debug')('express-mongoose-es6-rest-api:index');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = `${config.mongo.host}:${config.mongo.port}`;
mongoose.connect(mongoUri, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.db}`);
});

// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

var libChainInstance;
var libAddress;
var libInstance;

contracts.libChainContract.deployed().then((instance) => {
    libChainInstance = instance;
    return libChainInstance.newLibrary("CIT", { from: contracts.web3.eth.accounts[0], gas: 3000000 }) //change default of contract's from
  })
  .then((transactionReceipt) => {
    libAddress = transactionReceipt.logs[0].args['newLibrary'];
  }).then(function() {
    libInstance = contracts.libraryContract.at(libAddress);
});

export { libAddress, libInstance, libChainInstance };

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  app.listen(config.port, () => {
    debug(`server started on port ${config.port} (${config.env})`);
  });
}

export default app;
