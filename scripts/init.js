/**
 * Created by gerrit on 12.03.17.
 */
module.exports = function (callback) {

    var LibChain = artifacts.require("./LibChain.sol");
    var Library = artifacts.require("./Library.sol");
    var Publisher = artifacts.require("./Publisher.sol");

    //create a publisher
    LibChain.deployed().then(function (inst) {
        return inst.newPublisher("arXiv - Cornell University", "New York");
    })
        .then(function (contract) {
            var pubAddress = contract.logs[0].args['newPublisher'];
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
        });


    LibChain.deployed().then(function (inst) {
        return inst.newPublisher("Wikimedia", "Internet");
    })
        .then(function (contract) {
            var pubAddress = contract.logs[0].args['newPublisher'];
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
        });

    LibChain.deployed().then(function (inst) {
        // create some libraries
        inst.newLibrary("TU-Berlin").then(contract => {
            console.log("created library TU-Berlin with address: " + contract.logs[0].args['newLib']);
        }) ;
        inst.newLibrary("HU-Berlin").then(contract => {
            console.log("created library HU-Berlin with address: " + contract.logs[0].args['newLib']);
        }) ;
    });

    LibChain.deployed().then(function (inst){
        console.log("LibChain address: " + inst.address);
    });
};
