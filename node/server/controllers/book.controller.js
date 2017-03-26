import contracts from '../helpers/contracts';
import { libAddress, libInstance} from '../../index';
var libchainInstance;

function getLibBooks(req, res) {
  let library;
  var books = [];
  // contracts.libraryContract.at(/* library address */).then((libraryInstance) => {
  //   // needs to get the library instance to run through its inventory
  //   return Object.keys(libraryInstance.libBooks.call()).map((bookAddress) => {
  //     // maps all the address with the books itselves
  //     contracts.bookContract.at(bookAddress).then((bookInstance) => {
  //       books.push(bookInstance)
  //     })
  //   })
  //     .then((result) => {
  //       // return here the books as json with res.json(books)
  //     })
  // })

  //var libBooks = libInstance.getBooks.call();

  contracts.libraryContract.at(libAddress).then((instance) => {
    instance.getBooks.call().then((bookInstances) => {
      console.log("bookInstances " + bookInstances.length);
      return Promise.map(bookInstances, (bookInstance) => {
        return bookInstance.getBookInfo.call()
      }).then((book) => {
        res.json(book);
      });
    });
  });


/*
  Promise.resolve(libBooks).then((bookInstances) => {
    console.log("bookInstances " + bookInstances);
    return Promise.map(bookInstances, (bookInstance) => {
      return bookInstance.getBookInfo.call()
    })
  }).then((allBookAddresses) => {
    return Promise.map(allBookAddresses, (bookAddress) => {
      return contracts.bookContract.at(bookAddress)
    })
  })
    .then((bookInfos) => {
      console.log("bookinfos" + bookInfos);
      return Promise.all(bookInfos)
    })
    .then((result) => {
      result.forEach(book => {
        books.push({
          year: book[0].c[0],
          name: book[1],
          url: book[2],
          publisherName: book[3],
          libraryBalance: book[4],
          publisherAddress: book[5],
          bookAddress: book[6]
        })
      })
    })
    .then((book) => {
      res.json(books)
    })*/
}

function getAllPubBooks(req, res) {
  var publishers = getAllPublishers();
  var books = [];

  Promise.all(publishers).then((publisherInstances) => {
    return Promise.map(publisherInstances, (publisherInstance => {
        return publisherInstance.getBooks.call()
      }))
  })
  .then((publisherBookAddresses) => {
    console.log('before', publisherBookAddresses)
    return Promise.reduce(publisherBookAddresses, (joinedBookAddresses, bookAddressesFromPublisher) => {
        bookAddressesFromPublisher.forEach((bookAddress) => {
          joinedBookAddresses.push(bookAddress)
        })

        return joinedBookAddresses;
      }, [])
  })
  .then((allBookAddresses) => {
    return Promise.map(allBookAddresses, (bookAddress) => {
      return contracts.bookContract.at(bookAddress)
    })
  })
  .then((bookInstances) => {
    return Promise.all(bookInstances)
  })
  .then((bookInstances) => {
    return Promise.map(bookInstances, (bookInstance) => {
      return bookInstance.getBookInfo.call()
    })
  })
  .then((bookInfos) => {
    return Promise.all(bookInfos)
  })
  .then((result) => {
    result.forEach(book => {
      books.push({
        year: book[0].c[0],
        name: book[1],
        url: book[2],
        publisherName: book[3],
        libraryBalance: book[4],
        publisherAddress: book[5],
        bookAddress: book[6]
      })
    })
  })
  .then((book) => {
    res.json(books)
  })
}


/** helper functions */

function buySomeBooksTest(req, res) {
  var publishers = getAllPublishers();
  var publisher;
  var publisherAddress;
  var books = [];
  // buy books

  Promise.all(publishers).then((publisherInstances) => {
    publisher = publisherInstances[0];
    console.log(publisherInstances[0]);
    return publisher.getBooks.call()
  })
    .then((result) => {
      console.log("book " + result[0]+ " publisher : " + publisher.address);
      return libInstance.buy.call(result[0], publisher.address, 5);
    }).then(function (book) {
      console.log("bought a book : " + book);
      return libInstance.getNumberOfBooks.call();
  }).then( number => {
      res.json(number);
  });
}

function getAllPublishers(){
  var publishers = getAllPublisherAddresses();
  console.log(publishers)
  return Promise.map(publishers, (publisherAddresses) =>
    contracts.publisherContract.at(publisherAddresses)
  )
}


function getAllPublisherAddresses() {
  var publisherAddresses = [];

  return getNumberOfPublishers().then(function (numberOfBooks) {
    let numBook = numberOfBooks.c[0]
    console.log(numBook, typeof numBook)
    for (var i = 0; i < numBook; i++) {
      publisherAddresses.push(Promise.resolve(libchainInstance.getPublisher.call(i)).then(function (address) {
          return address
        })
      )
    }

    return publisherAddresses
  })
  .catch(function (error) { console.err('error: ', error) });

}

function getNumberOfPublishers() {
  return getLibChainInstance().then((lcInstance) => {
    libchainInstance = lcInstance
    return libchainInstance.getNumPublisher.call();
  })
  .catch(function (error) { console.err('error: ', error) });
}


function getLibChainInstance() {
  return contracts.libChainContract.deployed();
}


export default {getLibBooks, getAllPubBooks, getAllPublisherAddresses, buySomeBooksTest};
