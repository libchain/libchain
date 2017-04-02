pragma solidity ^0.4.4;

contract Book {

	address public _owner;
	string public _publisher;
	uint public _year;
	string public _gateway;
	string public _isbn;
	
	mapping (address => uint) public _balances;
  
	function Book(string pub, uint year, string id, string gate) {
  	_owner = msg.sender;
		_publisher = pub;
		_year = year;
		_gateway = gate;
		_isbn = id;
	}

	function getPublisher() returns (string) {
    return _publisher;
	}

	function getYear() returns (uint) {
		return _year;
	}

	function getGateway() returns (string) {
	 	return _gateway;
	}

	function getIsbn() returns (string) {
	  return _isbn;
	}

	function getBookInfo() returns (uint, string, string, string, uint, address, address) {
	 	return (_year, _isbn, _gateway, _publisher, _balances[msg.sender], _owner, this);
	}


	function buy(address buyer, uint amount) {
		_balances[buyer] += amount;
	}

	function transfer(address receiver, uint amount) returns(bool){
		if(_balances[msg.sender] >= amount){
			_balances[msg.sender] -= amount;
			_balances[receiver] += amount;
			return true;
		}
		return false;
	}

}


contract Publisher{

	Book[] publishedBooks;
	mapping(address => mapping(address => uint)) public bills;
	uint public bookNum;
	string public name;
	string public location;

	event PublishBook(address newBook);

	function Publisher(string n, string l){
		name = n;
		location = l;
	}

	function getName() returns(string) {
        return name;
	}

	function getLocation() returns(string) {
		return location;
	}
	
	function publishBook(uint year, string id, string gate) returns(address bookContract){
		publishedBooks.push(new Book(name, year, id, gate));
		bookNum++;
		// Event for publishing a book
		PublishBook(publishedBooks[bookNum-1]);
		return publishedBooks[bookNum-1];
	}

	function buyBook(address bookContract, uint amount) constant {
		Book book = Book(bookContract);
		book.buy(msg.sender, amount);	
		bills[msg.sender][bookContract] += amount;
	}

	function getBooks() returns (Book[]) {
		return publishedBooks;
	}

	function getBook(uint num) returns (address) {
    return publishedBooks[num];
	}
}


contract Library {

  struct UserData {
    address[] loanedBooks;
    mapping (address => string) pubkeys; //book address to pubKey mapping
  }

	struct BookMeta {
		Book book;
		uint amount;  // == maxIndex-1
		uint availableInstances;
		mapping(uint => string) pubkeys; //index mapping to key
	}

	mapping(address => BookMeta) public inventory;
	Book[] _libBooks;
	mapping(string => UserData) internal users;

	string public name;
	address public owner;

  event BuyBook(address newBook);

	modifier onlyOwner() {
		if (msg.sender != owner) {
			throw;
		}
		_;
	}

	function Library(string n) {
		owner = msg.sender;	
		name = n;
	}

	function getBooks() returns (Book[]) {
		return _libBooks;
	}

	function getAvailableInstances(address book) returns (uint){
        return inventory[book].availableInstances;
	}

	function getNumberOfInstances(address book) returns (uint){		
	    return inventory[book].amount;
	}

	function getNumberOfBooks() returns (uint) {
	    return _libBooks.length;
	}

	function getName() returns (string) {
		return name;
	}

	// onlyOwner modifier was removed because of the strange behavior of msg.sender 
	function buy(address bookContract, address publisherContract, uint amount) returns (bool) {
		Publisher pub = Publisher(publisherContract);
		pub.buyBook(bookContract, amount);
    Book book = Book(bookContract);	

    if(inventory[book].amount == 0){
      inventory[book] = BookMeta(book, amount, amount);
    	_libBooks.push(book);
		} else {
      inventory[book].amount += amount;
      inventory[book].availableInstances += amount;
		}

		return true;
	}

	function borrow(address bookContract, string publicKey, string userId) returns (bool) {
		if(inventory[bookContract].availableInstances <= 0) return false;
		Book book = Book(bookContract);
        for (var i = 0; i < inventory[bookContract].amount; i++) {
            if (sha3(inventory[bookContract].pubkeys[i]) == sha3("")) {
                inventory[bookContract].pubkeys[i] = publicKey;
                inventory[bookContract].availableInstances--;

                // store loan to user object
                //TODO: check whether this book is already loaned by this user
                users[userId].loanedBooks.push(bookContract);
                users[userId].pubkeys[bookContract] = publicKey;

                return true;
            }
        }

        return false;
	}

	function returnBook(address bookContract, string publicKey, string userId) returns (bool) {
    		if(inventory[bookContract].amount <= 0) return false;
    		Book book = Book(bookContract);
            for (var i = 0; i < inventory[bookContract].amount; i++) {
                if (sha3(inventory[bookContract].pubkeys[i]) == sha3(publicKey)) {
                    //TODO: check if it works
                    inventory[bookContract].pubkeys[i] = "";
                    inventory[bookContract].availableInstances++;


                    // remove book from user object
                    for (var j = 0; j < users[userId].loanedBooks.length; j++) {
                        if(users[userId].loanedBooks[i] == bookContract){
                            delete users[userId].loanedBooks[j];
                            break;
                        }
                    }
                    users[userId].pubkeys[bookContract] = "";
                    return true;
                }
            }

        return false;
    }

}

contract LibChain{
	
	mapping(uint => address) public libraries;
	uint public libNum;
	mapping(uint => address) public publishers;
	uint public pubNum;

	string public version = '0.1';

	event NewLibrary(address newLibrary);
	event NewPublisher(address newPublisher);

	function newLibrary(string name) returns (address) {
		libraries[libNum] = new Library(name);
		libNum++;
		NewLibrary(libraries[libNum-1]);
		return libraries[libNum-1];
	}

	function newPublisher(string name, string location) returns (address) {
		publishers[pubNum] = new Publisher(name, location);
		pubNum++;
		NewPublisher(publishers[pubNum-1]);	
		return publishers[pubNum-1];
	}

	function getLibrary(uint number) returns (address) {
		return libraries[number];
	}

	function getPublisher(uint number) returns(address) {
	    return publishers[number];
	}

	function getNumPublisher() returns (uint c) {
	    return pubNum;
	}

	function getNumLibraries() returns (uint c) {
	    return libNum;
	}
}
