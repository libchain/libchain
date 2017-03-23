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

	 function getBookInfo() returns (uint, string, string, string, address, address) {
	 	return (_year, _isbn, _gateway, _publisher, _owner, this);
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

	function buyBook(address bookContract, uint amount){
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

	mapping(address => uint) public inventory;
	Book[] libBooks;
	mapping(address => mapping(address => uint)) internal users;

	string public name;
	address public owner;

	modifier onlyOwner(){
		if (msg.sender != owner) {
			throw;
		}
		_;
	}

	modifier onlyCustomer(){
		if (users[msg.sender][0] == 0) {
      throw;	
		}

		_;
	}

	function Library(string n){
		owner = msg.sender;	
		name = n;
	}

	function getBooks() returns (Book[]) {
		return libBooks;
	}

	function getName() returns (string) {
		return name;
	}

	function buy(address bookContract, address publisherContract, uint amount) onlyOwner{
		Publisher pub = Publisher(publisherContract);
		// Book book = Book(bookContract);
		pub.buyBook(bookContract, amount);
		inventory[bookContract] += amount;
		Book libBook = Book(bookContract);
		libBooks.push(libBook);
	}

	function borrow(address bookContract) onlyCustomer returns (bool success) {
		if(inventory[bookContract] == 0)return false;
		Book book = Book(bookContract);
		if(book.transfer(msg.sender, 1)){
			inventory[bookContract]--;
			users[msg.sender][bookContract]++;
			return true;
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
