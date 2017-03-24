import contracts from '../helpers/contracts';

var libchainInstance;

function getLibBooks(req, res) {
  let library;
  var books = [];
  contracts.libraryContract.at(/* library address */).then((libraryInstance) => {
    // needs to get the library instance to run through its inventory
    return Object.keys(libraryInstance.libBooks.call()).map((bookAddress) => {
      // maps all the address with the books itselves
      contracts.bookContract.at(bookAddress).then((bookInstance) => {
        books.push(bookInstance)
      })
    })
      .then((result) => {
        // return here the books as json with res.json(books)
      })
  })
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
        publisherAddress: book[4],
        bookAddress: book[5]
      })
    })
  })
  .then((book) => {
    res.json(books)
  })
}


/** helper functions */


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


export default {getLibBooks, getAllPubBooks, getAllPublisherAddresses};
