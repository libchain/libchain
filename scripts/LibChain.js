/**
 * Created by gerrit on 12.03.17.
 */
module.exports = function(callback) {

    var LibChain = artifacts.require("./LibChain.sol");
    var Library = artifacts.require("./Library.sol");
    var Publisher = artifacts.require("./Publisher.sol");
    var Book = artifacts.require("./Book.sol");

    //create a publisher
    LibChain.deployed().then(function (inst) {
        console.log("*** create a new publisher *** ");
        return inst.newPublisher("CIT-Paperfactory", "Berlin");
    })
        .then(function (contract) {
            var pubAddress = contract.logs[0].args['newPublisher'];
            //console.log(pubAddress);
            return Publisher.at(pubAddress)
        })
        .then(function (inst) {
            inst.getName.call().then(function (name) {
                console.log("publisher:\t" + name)
            });
            inst.getLocation.call().then(function (location) {
                console.log("location:\t" + location)
            });
            console.log("address:\t" + inst.address);


            // publish new book
            return inst.publishBook(2017, "How to create a blockchain application", "gate?")
        }).then(function (bookContract) {
        var bookAddress = bookContract.logs[0].args['newBook'];
        //console.log(bookAddress);
        return Book.at(bookAddress);
    }).then(function (book) {
        console.log("*** publish a new book *** ");
        book.getPublisher.call().then(function (data) {
            console.log("Publisher:\t" + data);
        });

        book.getYear.call().then(function (data) {
            console.log("Year:\t" + data);
        });

        book.getIsbn.call().then(function (data) {
            console.log("ISBN:\t" + data);
        });

        book.getGateway.call().then(function (data) {
            console.log("Gateway:\t" + data);
        });

    });


    // create a library
    /*LibChain.deployed().then(function (inst) {
        // create a new library
        console.log("*** create a new library ***");
        return inst.newLibrary("TU-Berlin")
        })
        .then(function (contract) {
            //console.log(contract);
            var libAddress = contract.logs[0].args['newLib'];
            //console.log(libAddress);

            return Library.at(libAddress)
        })
        .then(function (inst) {
            console.log("address:\t" + inst.address);
            inst.getName.call().then(function (name) {
                console.log("Name:\t" + name)
            });
        });*/
};
