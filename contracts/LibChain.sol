pragma solidity ^0.4.4;

contract Book {

	address public _owner;
	string public _publisher;
	uint public _year;
	string public _gateway;
	string public _isbn;
	
	mapping (address => uint) public _balances;
	uint sumOfSoldInstances;
	uint sumOfLoans;
  
	function Book(string pub, uint year, string id, string gate) {
  	    _owner = msg.sender;
		_publisher = pub;
		_year = year;
		_gateway = gate;
		_isbn = id;
	}

	function getPublisher() constant returns (string) {
        return _publisher;
	}

	function getYear() constant returns (uint) {
		return _year;
	}

	function getGateway() constant returns (string) {
	 	return _gateway;
	}

	function getIsbn() constant returns (string) {
	    return _isbn;
	}

	function getBookInfo() constant returns (uint, string, string, string, uint, address, address) {
	 	return (_year, _isbn, _gateway, _publisher, _balances[msg.sender], _owner, this);
	}

	function buy(address buyer, uint amount) {
		_balances[buyer] += amount;
		sumOfSoldInstances++;
	}

	function borrow(address libAddress){
        sumOfLoans++;
	}

	function transfer(address receiver, uint amount) returns (bool) {
		if (_balances[msg.sender] >= amount) {
			_balances[msg.sender] -= amount;
			_balances[receiver] += amount;
			return true;
		}
		return false;
	}

	function getSumOfSoldInstances() constant returns(uint) {
	    return sumOfSoldInstances;
	}

	function getSumOfLoans() constant returns(uint){
	    return sumOfLoans;
	}
}


contract Publisher{
	Book[] publishedBooks;
	mapping(address => mapping(address => uint)) public bills;
	uint sumOfSoldInstances;
    uint sumOfPublications;

	uint public bookNum;
	string public name;
	string public location;
	event PublishBook(address newBook);

	function Publisher(string n, string l) {
		name = n;
		location = l;
	}

	function getName() constant returns(string) {
        return name;
	}

	function getLocation() constant returns(string) {
		return location;
	}
	
	function publishBook(uint year, string id, string gate) returns (address bookContract) {
		publishedBooks.push(new Book(name, year, id, gate));
		bookNum++;
		sumOfPublications;
		// Event for publishing a book
		PublishBook(publishedBooks[bookNum-1]);
		return publishedBooks[bookNum-1];
	}

	function buyBook(address bookContract, uint amount) constant {
		Book book = Book(bookContract);
		book.buy(msg.sender, amount);	
		bills[msg.sender][bookContract] += amount;

		sumOfSoldInstances += amount;
	}

	function getBooks() constant returns (Book[]) {
		return publishedBooks;
	}

	function getBook(uint num) constant returns (address) {
        return publishedBooks[num];
	}

	function getSumOfSoldInstances() constant returns(uint){
	    return sumOfSoldInstances;
	}

	function getSumOfPublications() constant returns(uint){
	    return sumOfPublications;
	}
}


contract Library {

    struct UserData{
        address[] loanedBooks;
        mapping(address => string) pubkeys; //book address to pubKey mapping
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
	uint sumOfBoughtInstances;
	uint sumOfLoans;
	uint sumOfReturns;

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

	function getBooks() constant returns (Book[]) {
		return _libBooks;
	}

	function getAvailableInstances(address book) constant returns (uint) {
        return inventory[book].availableInstances;
	}

	function getNumberOfInstances(address book) constant returns (uint) {
	    return inventory[book].amount;
	}

	function getNumberOfBooks() constant returns (uint) {
	    return _libBooks.length;
	}

	function getName() constant returns (string) {
		return name;
	}

	// onlyOwner modifier was removed because of the strange behavior of msg.sender 
	function buy(address bookContract, address publisherContract, uint amount) returns (bool) {
		Publisher pub = Publisher(publisherContract);
		pub.buyBook(bookContract, amount);
        Book book = Book(bookContract);
        if (inventory[book].amount == 0) {
            inventory[book] = BookMeta(book, amount, amount);
		    _libBooks.push(book);
		} else {
            inventory[book].amount += amount;
            inventory[book].availableInstances += amount;
		}

		sumOfBoughtInstances += amount;
		return true;
	}

    function hasAccessToInstance(string userId, string pubkey, address bookAddress) constant returns (uint) {
        if (sha3(pubkey) == sha3("")) return 0;

        if (sha3(users[userId].pubkeys[bookAddress]) == sha3(pubkey)) {
            // has access
            return 1;
        }

        // no access
        return 0;
    }

	function borrow(address bookContract, string publicKey, string userId) returns (bool) {

		if (inventory[bookContract].availableInstances <= 0) return false;

		//check if this book already loaned to user
        if (sha3(users[userId].pubkeys[bookContract]) != sha3("")) {
            return false;
        }


		Book book = Book(bookContract);
        for (var i = 0; i < inventory[bookContract].amount; i++) {
            if (sha3(inventory[bookContract].pubkeys[i]) == sha3("")) {
                inventory[bookContract].pubkeys[i] = publicKey;
                inventory[bookContract].availableInstances--;

                // store loan to user object
                users[userId].loanedBooks.push(bookContract);
                users[userId].pubkeys[bookContract] = publicKey;

                book.borrow(msg.sender);
                sumOfLoans++;

                return true;
            }
        }

        return false;
	}

	function returnBook(address bookContract, string publicKey, string userId) returns (bool) {
    	if (inventory[bookContract].amount <= 0) return false;

		Book book = Book(bookContract);
        for (var i = 0; i < inventory[bookContract].amount; i++) {
            if (sha3(inventory[bookContract].pubkeys[i]) == sha3(publicKey)) {
                inventory[bookContract].pubkeys[i] = "";
                inventory[bookContract].availableInstances++;


                // remove book from user object
                for (var j = 0; j < users[userId].loanedBooks.length; j++) {
                    if (users[userId].loanedBooks[i] == bookContract) {
                        delete users[userId].loanedBooks[j];
                        break;
                    }
                    users[userId].pubkeys[bookContract] = "";
                    sumOfReturns;
                    return true;
                }
                users[userId].pubkeys[bookContract] = "";
                metrics.addReturn();
                return true;
            }
        }

        return false;
    }

    function getSumOfBoughtInstances() constant returns(uint){
        return sumOfBoughtInstances;
    }

    function getSumOfLoans() constant returns(uint){
        return sumOfLoans;
    }

    function getSumOfReturns() constant returns(uint){
        return sumOfReturns;
    }
}

contract LibChain {
	
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

	function getLibrary(uint number) constant returns (address) {
		return libraries[number];
	}

	function getPublisher(uint number) constant returns (address) {
	    return publishers[number];
	}

	function getNumPublisher() constant returns (uint c) {
	    return pubNum;
	}

	function getNumLibraries() constant returns (uint c) {
	    return libNum;
	}
}
