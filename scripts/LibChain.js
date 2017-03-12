/**
 * Created by gerrit on 12.03.17.
 */
module.exports = function(callback) {

    var LibChain = artifacts.require("./LibChain.sol");
    var Library = artifacts.require("./Library.sol");
    var libChainContractAddress = "0x91a9894d880acc602efd4789144c2844358b99dd";

    LibChain.at(libChainContractAddress).then(function(inst){
        // create a new library
        inst.newLibrary("TU-Berlin").then(function(contract){
            console.log(contract);
            var libAddress = contract.logs[0].args['newLib'];
            console.log(libAddress);

            /*inst.getLibrary.call(0).then(function (address){
                console.log(address);
            });*/

            Library.at(address).then(function (inst) {
                console.log(inst);
                inst.getName.call().then(function(name){console.log(name)});
             });
        });
    });
}
