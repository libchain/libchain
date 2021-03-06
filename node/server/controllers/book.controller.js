import contracts from '../helpers/contracts';
import { libAddress, libInstance, libChainInstance} from '../../index';

function getStatistics(req, res) {
  contracts.bookContract.at(req.body.bookAddress).then(instance => {
    return instance.getMetrics.call();
  })
  .then(result => {
    res.json({
      name: result[2],
      loans: result[1],
      soldInstances: result[0]
    })
  })
}

function getLibBooks(req, res) {
  var books = [];
  var libBooks = libInstance.getBooks.call({ from: contracts.web3.eth.accounts[0], gas: 1000000 });

  libBooks.then((allBookAddresses) =>{
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
    .then((bookInfos) =>{
      return Promise.map(bookInfos, (bookInfo) => {
        bookInfo[7] = libInstance.getAvailableInstances.call(bookInfo[6]);
        return Promise.all(bookInfo);
      })
    })
    .then((result) => {
      result.forEach(book => {
        console.log(book);
        var status;
        if(book[7] > 0) {
          status = "Available"
        } else {
          status = "Booked Out"
        }


        books.push({
          year: book[0].c[0],
          name: book[1],
          url: book[2],
          publisherName: book[3],
          libraryBalance: book[4],
          publisherAddress: book[5],
          bookAddress: book[6],
          availableInstances: book[7],
          status : status
        })
      })
    })
    .then(() => {
      res.json(books)
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
    .then((bookInfos) =>{
      return Promise.map(bookInfos, (bookInfo) => {
        bookInfo[7] = libInstance.getNumberOfInstances.call(bookInfo[6]);
        return Promise.all(bookInfo);
      })
    })
    .then((result) => {
      result.forEach(book => {
        console.log(book);
        books.push({
          year: book[0].c[0],
          name: book[1],
          url: book[2],
          publisherName: book[3],
          libraryBalance: book[4],
          publisherAddress: book[5],
          bookAddress: book[6],
          libraryBalance: book[7]
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
  // buy books

  Promise.all(publishers).then((publisherInstances) => {
    publisher = publisherInstances[0];
    console.log(publisherInstances[0]);
    return publisher.getBooks.call()
  })
    .then((result) => {
      console.log("book " + result[0]+ " publisher : " + publisher.address);
      return libInstance.buy(result[0], publisher.address, 5, { from: contracts.web3.eth.accounts[0] , gas: 3000000});
    }) .then( result => {
      console.log(result);
      return res.json('ok')
  });
}

export function getAllPublishers(){
  var publishers = getAllPublisherAddresses();
  console.log(publishers)
  return Promise.map(publishers, (publisherAddresses) =>
    contracts.publisherContract.at(publisherAddresses)
  )
}


export function getAllPublisherAddresses() {
  var publisherAddresses = [];

  return getNumberOfPublishers().then(function (numberOfBooks) {
    let numBook = numberOfBooks.c[0]
    console.log(numBook, typeof numBook)
    for (var i = 0; i < numBook; i++) {
      publisherAddresses.push(Promise.resolve(libChainInstance.getPublisher.call(i)).then(function (address) {
          return address
        })
      )
    }

    return publisherAddresses
  })
  .catch(function (error) { console.log('error: ', error) });

}

export function getNumberOfPublishers() {
  return libChainInstance.getNumPublisher.call();
}


export default {getStatistics, getLibBooks, getAllPubBooks, getAllPublisherAddresses, buySomeBooksTest};
