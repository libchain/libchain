/**
 * Created by gerrit on 12.03.17.
 */
module.exports = function(callback) {

    var LibChain = artifacts.require("./LibChain.sol");
    var Library = artifacts.require("./Library.sol");
    var Publisher = artifacts.require("./Publisher.sol");
    var Book = artifacts.require("./Book.sol");

    var libChainContractAddress = "0x91a9894d880acc602efd4789144c2844358b99dd";
    //console.log(libChainContractAddress);

    //create a publisher
    LibChain.deployed().then(function(inst){
        //console.log(inst);
        return inst.newPublisher("CIT-Paperfactory", "Berlin");
    })
        .then(function(contract){
            //console.log(contract);
            //console.log(contract.logs[0].args);
            var pubAddress = contract.logs[0].args['newPublisher'];
            //console.log(pubAddress);
            return Publisher.at(pubAddress)
        })
        .then(function (inst) {
            //console.log(inst);
            /*inst.getName.call().then(function(name){console.log(name)});
            inst.getLocation.call().then(function(location){console.log(location)});
            console.log(inst.address);*/

            // publish new book
            return(inst.publishBook.call(2017, "How to create a blockchain application", "gate?"));
        }).then(function(bookAddress){
            console.log("book:\t" + bookAddress);
            return Book.at(bookAddress); //FIXME
        }).then(function (book){
            console.log(book);
        });




    // create a library
    LibChain.deployed().then(function(inst){
        // create a new library
        console.log(inst)
        return inst.newLibrary("TU-Berlin")
    })
        .then(function(contract){
            console.log(contract);
            var libAddress = contract.logs[0].args['newLib'];
            console.log(libAddress);

            return Library.at(libAddress)
        })
        .then(function (inst) {
            console.log(inst);
            inst.getName.call().then(function(name){console.log(name)});
        });
}
