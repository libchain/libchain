/**
 * Created by gerrit on 12.03.17.
 */
module.exports = function (callback) {

    var LibChain = artifacts.require("./LibChain.sol");
    var Library = artifacts.require("./Library.sol");
    var Publisher = artifacts.require("./Publisher.sol");
    
    var pubAddress;
    //create a publisher
    LibChain.deployed().then(function (inst) {
        return inst.newPublisher("arXiv - Cornell University", "New York");
    })
    .then(function (contract) {
        pubAddress = contract.logs[0].args['newPublisher'];
        return Publisher.at(pubAddress)
    })
    .then(function (inst) {
        console.log("address:\t" + inst.address);
        console.log("publish some books");
        // publish some books
        inst.publishBook(2017, "Smart Contract SLAs for Dense Small-Cell-as-a-Service", "https://arxiv.org/pdf/1703.04502");
        inst.publishBook(2017, "Application of Bitcoin Data-Structures & Design Principles to Supply Chain Management", "https://arxiv.org/pdf/1703.04206");
        inst.publishBook(2017, "Conditions of Full Disclosure:The Blockchain Remuneration Model", "https://arxiv.org/pdf/1703.04196");
        inst.publishBook(2017, "BLOCKBENCH: A Framework for Analyzing Private Blockchains", "https://arxiv.org/pdf/1703.04057");
        inst.publishBook(2017, "Under-Optimized Smart Contracts Devour Your Money", "https://arxiv.org/pdf/1703.03994");
        inst.publishBook(2017, "Blockchains and Distributed Ledgers in Retrospective and Perspective", "https://arxiv.org/pdf/1703.01505");
        inst.publishBook(2017, "Multi-agent systems and decentralized artificial superintelligence", "https://arxiv.org/pdf/1702.08529")
        
        return Publisher.at(pubAddress);
    })
    .then(function (pubInst) {
        console.log(' i make it until here', pubInst.address)
        return pubInst.getBooks.call()
    })
    .then(function (result) {
        console.log(result)
    });
 
    LibChain.deployed().then(function (inst) {
        return inst.newPublisher("Wikimedia", "Internet");
    })
    .then(function (contract) {
        pubAddress = contract.logs[0].args['newPublisher'];
        return Publisher.at(pubAddress)
    })
    .then(function (inst) {
        console.log("address:\t" + inst.address);
        console.log("publish some books");
        inst.publishBook(2001, "LaTex", "https://upload.wikimedia.org/wikipedia/commons/2/2d/LaTeX.pdf");
        inst.publishBook(2002, "Learning Theories", "https://upload.wikimedia.org/wikipedia/commons/5/5a/Learning_Theories.pdf");
        inst.publishBook(2003, "Learning the vi editor", "https://upload.wikimedia.org/wikipedia/commons/d/d2/Learning_the_vi_Editor.pdf");
        inst.publishBook(2004, "Muggles' Guide to Harry Potter", "https://upload.wikimedia.org/wikipedia/commons/a/ab/Muggles%27_Guide.pdf");
        inst.publishBook(2005, "Python Programming", "https://upload.wikimedia.org/wikipedia/commons/9/91/Python_Programming.pdf");
        inst.publishBook(2006, "US History", "https://upload.wikimedia.org/wikipedia/commons/7/7c/US_History.pdf");
        inst.publishBook(2007, "Write Yourself a Scheme in 48 Hours", "https://upload.wikimedia.org/wikipedia/commons/a/aa/Write_Yourself_a_Scheme_in_48_Hours.pdf")
        
        return Publisher.at(pubAddress);
    })
    .then(function (pubInst) {
        return pubInst.getBooks.call()
    })
    .then(function (result) {
        console.log(result)
    });


    // create a library
    LibChain.deployed().then(function (inst) {
        // create a libraries
        inst.newLibrary("TU-Berlin");
        inst.newLibrary("HU-Berlin");
    })
    .then(function (inst) {
        inst.getLibrary.call(0)
    })
    .then(function (libAddress) {
        Library.at(libAddress)
    })
    .then(function (libInst) {
        return libInst.getBooks.call()
    })
    .then(function (result) {
        console.log(result)
    });

    // LibChain.deployed().then(function (inst) {
    //     inst.getPublisher.call(0)
    // }).
    // then(function (pubInst) {
    //     pubInst.getBooks.call()
    // }).
    // then(function (result) {
    //     console.log(result)
    // })
};
