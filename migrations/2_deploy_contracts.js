var LibChain = artifacts.require("./LibChain.sol");

module.exports = function(deployer) {
  deployer.deploy(LibChain,  {gas: 8000000});
};  
