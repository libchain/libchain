var LibChain = artifacts.require("./LibChain.sol");

module.exports = function(deployer) {
  deployer.deploy(LibChain).then(function(instance) {
    console.log(instance.address)

  });
};
