import contracts from '../helpers/contracts';


function getLibBooks(req, res) {
  let library;
  var books = [];
  contracts.libraryContract.at(/* library address */).then((libraryInstance) => {
    // needs to get the library instance to run through its inventory
    return Object.keys(libraryInstance.inventory.call()).map((bookAddress) => {
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

function getPubBooks(req, res) {
  let library;
  var books = [];
  contracts.publisherContract.at(/* publisher address */).then((publisherInstance) => {
    // needs to get the publisher instance to run through its published Books
    return Object.keys(publisherInstance.publishedBooks.call()).map((bookAddress) => {
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


export default { getLibBooks, getPubBooks };
