pragma solidity ^0.4.4;

contract Book {

	address public owner;
	string public publisher;
	int public year;
	string public gateway;
	string public isbn;
	
	mapping (address => uint) public balances;
  
	function Book(string pub, uint year, string id, string gate) {
  		owner = msg.sender;
		publisher = 'Springer';
		year = ;
		gateway = gate;
		isbn = id;
  	}

	function buy(address buyer, uint amount) onlyOwner{	
		balances[buyer] += amount;
		
	}

	function transfer(address receiver, uint amount) returns(bool success){
		if(balances[msg.sender] >= amount){
			balances[msg.sender] -= amount;
			balances[receiver] += amount;
			return true;
		}
		return false;
	}

}


contract Publisher{

	mapping(uint => Book) public publishedBooks;
	mapping(address => mapping(address => uint)) public bills;
	uint public bookNum;
	string public name;
	string public location;

	function Publisher(string n, string l){
		name = n;
		location = l;	
	}
	
	function publishBook(uint year, string id, string gate) returns(address bookContract){
		publishedBooks[bookNum] = new Book(this.name, year, id, gate);
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

}


contract Library {

	mapping(address => uint) public inventory;
	mapping(address => mapping(address => uint)) internal users;

	string public name;

	function Library(string n){
		name = n;
	}

	function buy(address bookContract, uint amount) {
		Book book = Book(bookContract);
		book.buy(amount);
		inventory[bookContract] += amount;
	}

	function borrow(address bookContract) returns (bool success){
		if(inventory[bookContract] == 0)return false;
		Book book = Book(bookContract);
		if(book.transfer(msg.sender, 1)){
			inventoryContract[boookContract]--;
			users[msg.sender][bookContract]++;
			return true;
		}	
		return false;
	}

}

contract LibChain{
	
	mapping(uint => address) public libraries
	uint public libNum;
	mapping(uint => address) public publishers
	uint public pubNum;

	string public version = '0.1';

	function newLibrary(string name) returns (address libraryContract) {
		libraries[libNum] = new Library(name);
		libNum++;
		NewLibrary(publishedBooks[libNum-1]);
		return libraries[libNum-1];
	}

	function newPublisher(string name, string location) returns (address publisherContract) {
		publishers[pubNum] = new Publisher(name, location);
		pubNum++;
		NewPublisher(publishers[pubNum-1]);	
		return publishers[pubNum-1];
	}

}