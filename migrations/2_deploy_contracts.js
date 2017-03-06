var LibChain = artifacts.require("./LibChain.sol");
var fs = require('fs');

module.exports = function(deployer) {
  deployer.deploy(LibChain).then(function(instance) {
    console.log(instance.address)

  });
};
