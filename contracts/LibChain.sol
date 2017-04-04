pragma solidity ^0.4.4;

contract Book {

	address public _owner;
	string public _publisher;
	uint public _year;
	string public _gateway;
	string public _isbn;
	
	mapping (address => uint) public _balances;

	BookMetrics metrics;
  
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
		metrics.addSoldInstances(amount, buyer);
	}

	function borrow(address libAddress){
        metrics.addLoan(libAddress);
	}



	function transfer(address receiver, uint amount) returns(bool){
		if(_balances[msg.sender] >= amount){
			_balances[msg.sender] -= amount;
			_balances[receiver] += amount;
			return true;
		}
		return false;
	}

    function getMetrics() returns(BookMetrics){
        return metrics;
    }

}


contract Publisher{
    PublisherMetrics metrics;
	Book[] publishedBooks;
	mapping(address => mapping(address => uint)) public bills;
	uint public bookNum;
	string public name;
	string public location;
	event PublishBook(address newBook);

	function Publisher(string n, string l){
		name = n;
		location = l;
		metrics = new PublisherMetrics();
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
		metrics.addPublication();
		// Event for publishing a book
		PublishBook(publishedBooks[bookNum-1]);
		return publishedBooks[bookNum-1];
	}

	function buyBook(address bookContract, uint amount) constant {
		Book book = Book(bookContract);
		book.buy(msg.sender, amount);	
		bills[msg.sender][bookContract] += amount;
		metrics.addSoldBook(amount);
	}

	function getBooks() returns (Book[]) {
		return publishedBooks;
	}

	function getBook(uint num) returns (address) {
        return publishedBooks[num];
	}

	function getMetrics() returns(PublisherMetrics){
	    return metrics;
	}
}

contract PublisherMetrics{
    //overall statistics
    uint sumOfPublications;
    uint sumOfSoldBookInstances;
    mapping(uint=>YearMetrics) yearMetrics;

    //datetime tool
    DateTime datetime;

    function PublisherMetrics(){
        datetime = new DateTime();
    }

    struct YearMetrics{
        uint sumOfPublications;
        uint sumOfSoldBookInstances;
        mapping(uint=>MonthMetrics) months;
    }

    struct MonthMetrics{
        uint month;
        uint sumOfPublications;
        uint sumOfSoldBookInstances;
    }

   function addPublication() {
        sumOfPublications +=1;
        uint year = datetime.getYear(now);
        uint month = datetime.getMonth(now);
        yearMetrics[year].sumOfPublications +=1;
        yearMetrics[year].months[month].sumOfPublications +=1;
    }

   function addSoldBook(uint numberOfInstances) {
        uint year = datetime.getYear(now);
        uint month = datetime.getMonth(now);

        sumOfSoldBookInstances +=numberOfInstances;
        yearMetrics[year].sumOfSoldBookInstances +=numberOfInstances;
        yearMetrics[year].months[month].sumOfSoldBookInstances +=numberOfInstances;
    }

    function getSumOfSoldBooks() returns (uint){
        return sumOfSoldBookInstances;
    }

    function getSumOfSoldBooks(uint year) returns (uint){
        return yearMetrics[year].sumOfSoldBookInstances;
    }

    function getSumOfSoldBooks(uint year, uint month) returns (uint){
        return yearMetrics[year].months[month].sumOfSoldBookInstances;
    }

    function getSumOfPublications() returns (uint){
        return sumOfPublications;
    }

    function getSumOfPublications(uint year) returns (uint){
        return yearMetrics[year].sumOfPublications;
    }

    function getSumOfPublications(uint year, uint month) returns (uint){
        return yearMetrics[year].months[month].sumOfPublications;
    }
}

contract BookMetrics{
    uint sumOfLoans;
    uint sumOfSoldInstances;
    mapping(uint=>YearMetrics) yearMetrics;

    //datetime tool
    DateTime datetime;

    function BookMetrics(){
        datetime = new DateTime();
    }

    struct YearMetrics{
        uint sumOfLoans;
        uint sumOfSoldInstances;
        mapping(uint=>MonthMetrics) months;
    }

    struct MonthMetrics{
        uint month;
        uint sumOfLoans;
        uint sumOfSoldInstances;
        mapping (address=>uint) sumOfLibLoans;
        mapping (address=>uint) sumOfSoldInstancesToLib;
    }

   function addSoldInstances(uint amount, address libAdress) {
        uint year = datetime.getYear(now);
        uint month = datetime.getMonth(now);

        sumOfSoldInstances +=amount;
        yearMetrics[year].sumOfSoldInstances += amount;
        yearMetrics[year].months[month].sumOfSoldInstances += amount;
        yearMetrics[year].months[month].sumOfSoldInstancesToLib[libAdress] += amount;
    }

   function addLoan(address libAddress) {
        uint year = datetime.getYear(now);
        uint month = datetime.getMonth(now);

        sumOfLoans +=1;
        yearMetrics[year].sumOfLoans += 1;
        yearMetrics[year].months[month].sumOfLoans += 1;
        yearMetrics[year].months[month].sumOfLibLoans[libAddress] += 1;
    }

    function getSumOfSoldInstances() returns (uint){
        return sumOfSoldInstances;
    }

    function getSumOfSoldInstances(uint year) returns (uint){
        return yearMetrics[year].sumOfSoldInstances;
    }

    function getSumOfSoldInstances(uint year, uint month) returns (uint){
        return yearMetrics[year].months[month].sumOfSoldInstances;
    }

    function getSumOfLoans() returns (uint){
        return sumOfLoans;
    }

    function getSumOfLoans(uint year) returns (uint){
        return yearMetrics[year].sumOfLoans;
    }

    function getSumOfLoans(uint year, uint month) returns (uint){
        return yearMetrics[year].months[month].sumOfLoans;
    }

    function getSumOfLibLoans(uint year, uint month, address libAddress) returns (uint){
            return yearMetrics[year].months[month].sumOfLibLoans[libAddress];
    }

    function getSumOfSoldInstancesToLib(uint year, uint month, address libAddress) returns (uint){
                return yearMetrics[year].months[month].sumOfSoldInstancesToLib[libAddress];
        }
}


contract LibraryMetrics{
    uint boughtBookInstances;
    uint sumOfLoans;
    uint sumOfReturns;

    mapping(uint=>YearMetrics) yearMetrics;

    //datetime tool
    DateTime datetime;

    function LibraryMetrics(){
        datetime = new DateTime();
    }

    struct YearMetrics{
        uint boughtBookInstances;
        uint sumOfLoans;
        uint sumOfReturns;
        mapping(uint=>MonthMetrics) months;
    }

    struct MonthMetrics{
        uint boughtBookInstances;
        uint sumOfLoans;
        uint sumOfReturns;
    }

   function addBoughtInstances(uint amount) {
        uint year = datetime.getYear(now);
        uint month = datetime.getMonth(now);

        boughtBookInstances +=amount;
        yearMetrics[year].boughtBookInstances += amount;
        yearMetrics[year].months[month].boughtBookInstances += amount;
    }

   function addLoan() {
        uint year = datetime.getYear(now);
        uint month = datetime.getMonth(now);

        sumOfLoans +=1;
        yearMetrics[year].sumOfLoans += 1;
        yearMetrics[year].months[month].sumOfLoans += 1;
    }

    function addReturn() {
            uint year = datetime.getYear(now);
            uint month = datetime.getMonth(now);

            sumOfReturns +=1;
            yearMetrics[year].sumOfReturns += 1;
            yearMetrics[year].months[month].sumOfReturns += 1;
    }

    function getBoughtBookInstances() returns (uint){
        return boughtBookInstances;
    }

    function getBoughtBookInstances(uint year) returns (uint){
        return yearMetrics[year].boughtBookInstances;
    }

    function getBoughtBookInstances(uint year, uint month) returns (uint){
        return yearMetrics[year].months[month].boughtBookInstances;
    }

    function getSumOfLoans() returns (uint){
        return sumOfLoans;
    }

    function getSumOfLoans(uint year) returns (uint){
        return yearMetrics[year].sumOfLoans;
    }

    function getSumOfLoans(uint year, uint month) returns (uint){
        return yearMetrics[year].months[month].sumOfLoans;
    }

    function getSumOfReturns() returns (uint){
        return sumOfReturns;
    }

    function getSumOfReturns(uint year) returns (uint){
        return yearMetrics[year].sumOfReturns;
    }

    function getSumOfReturns(uint year, uint month) returns (uint){
        return yearMetrics[year].months[month].sumOfReturns;
    }

}


contract Library {

    struct UserData{
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
    LibraryMetrics metrics;

	string public name;
	address public owner;
    event BuyBook(address newBook);

	modifier onlyOwner(){
		if (msg.sender != owner) {
			throw;
		}
		_;
	}

	function Library(string n){
		owner = msg.sender;	
		name = n;
		metrics = new LibraryMetrics();
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

	function getNumberOfBooks() returns (uint){
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

		metrics.addBoughtInstances(amount);
		return true;
	}

    function hasAccessToInstance(string userId, string pubkey, address bookAddress) returns (bool) {
        if(sha3(pubkey) == sha3("")) return false;

        if(sha3(users[userId].pubkeys[bookAddress]) == sha3(pubkey)){
            return true;
        }
        return false;
    }

	function borrow(address bookContract, string publicKey, string userId) returns (bool) {

		if(inventory[bookContract].availableInstances <= 0) return false;

		//check if this book already loaned to user
        if (sha3(users[userId].pubkeys[bookContract]) != sha3("")){
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
                metrics.addLoan();

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
                    metrics.addReturn();
                    return true;
                }
            }

        return false;
    }

    function getMetrics() returns(LibraryMetrics){
        return metrics;
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
//DateTime contract from https://github.com/pipermerriam/ethereum-datetime.git
contract DateTime {
        /*
         *  Date and Time utilities for ethereum contracts
         *
         */
        struct DateTime {
                uint16 year;
                uint8 month;
                uint8 day;
                uint8 hour;
                uint8 minute;
                uint8 second;
                uint8 weekday;
        }

        uint constant DAY_IN_SECONDS = 86400;
        uint constant YEAR_IN_SECONDS = 31536000;
        uint constant LEAP_YEAR_IN_SECONDS = 31622400;

        uint constant HOUR_IN_SECONDS = 3600;
        uint constant MINUTE_IN_SECONDS = 60;

        uint16 constant ORIGIN_YEAR = 1970;

        function isLeapYear(uint16 year) constant returns (bool) {
                if (year % 4 != 0) {
                        return false;
                }
                if (year % 100 != 0) {
                        return true;
                }
                if (year % 400 != 0) {
                        return false;
                }
                return true;
        }

        function leapYearsBefore(uint year) constant returns (uint) {
                year -= 1;
                return year / 4 - year / 100 + year / 400;
        }

        function getDaysInMonth(uint8 month, uint16 year) constant returns (uint8) {
                if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
                        return 31;
                }
                else if (month == 4 || month == 6 || month == 9 || month == 11) {
                        return 30;
                }
                else if (isLeapYear(year)) {
                        return 29;
                }
                else {
                        return 28;
                }
        }

        function parseTimestamp(uint timestamp) internal returns (DateTime dt) {
                uint secondsAccountedFor = 0;
                uint buf;
                uint8 i;

                // Year
                dt.year = getYear(timestamp);
                buf = leapYearsBefore(dt.year) - leapYearsBefore(ORIGIN_YEAR);

                secondsAccountedFor += LEAP_YEAR_IN_SECONDS * buf;
                secondsAccountedFor += YEAR_IN_SECONDS * (dt.year - ORIGIN_YEAR - buf);

                // Month
                uint secondsInMonth;
                for (i = 1; i <= 12; i++) {
                        secondsInMonth = DAY_IN_SECONDS * getDaysInMonth(i, dt.year);
                        if (secondsInMonth + secondsAccountedFor > timestamp) {
                                dt.month = i;
                                break;
                        }
                        secondsAccountedFor += secondsInMonth;
                }

                // Day
                for (i = 1; i <= getDaysInMonth(dt.month, dt.year); i++) {
                        if (DAY_IN_SECONDS + secondsAccountedFor > timestamp) {
                                dt.day = i;
                                break;
                        }
                        secondsAccountedFor += DAY_IN_SECONDS;
                }

                // Hour
                dt.hour = getHour(timestamp);

                // Minute
                dt.minute = getMinute(timestamp);

                // Second
                dt.second = getSecond(timestamp);

                // Day of week.
                dt.weekday = getWeekday(timestamp);
        }

        function getYear(uint timestamp) constant returns (uint16) {
                uint secondsAccountedFor = 0;
                uint16 year;
                uint numLeapYears;

                // Year
                year = uint16(ORIGIN_YEAR + timestamp / YEAR_IN_SECONDS);
                numLeapYears = leapYearsBefore(year) - leapYearsBefore(ORIGIN_YEAR);

                secondsAccountedFor += LEAP_YEAR_IN_SECONDS * numLeapYears;
                secondsAccountedFor += YEAR_IN_SECONDS * (year - ORIGIN_YEAR - numLeapYears);

                while (secondsAccountedFor > timestamp) {
                        if (isLeapYear(uint16(year - 1))) {
                                secondsAccountedFor -= LEAP_YEAR_IN_SECONDS;
                        }
                        else {
                                secondsAccountedFor -= YEAR_IN_SECONDS;
                        }
                        year -= 1;
                }
                return year;
        }

        function getMonth(uint timestamp) constant returns (uint8) {
                return parseTimestamp(timestamp).month;
        }

        function getDay(uint timestamp) constant returns (uint8) {
                return parseTimestamp(timestamp).day;
        }

        function getHour(uint timestamp) constant returns (uint8) {
                return uint8((timestamp / 60 / 60) % 24);
        }

        function getMinute(uint timestamp) constant returns (uint8) {
                return uint8((timestamp / 60) % 60);
        }

        function getSecond(uint timestamp) constant returns (uint8) {
                return uint8(timestamp % 60);
        }

        function getWeekday(uint timestamp) constant returns (uint8) {
                return uint8((timestamp / DAY_IN_SECONDS + 4) % 7);
        }

        function toTimestamp(uint16 year, uint8 month, uint8 day) constant returns (uint timestamp) {
                return toTimestamp(year, month, day, 0, 0, 0);
        }

        function toTimestamp(uint16 year, uint8 month, uint8 day, uint8 hour) constant returns (uint timestamp) {
                return toTimestamp(year, month, day, hour, 0, 0);
        }

        function toTimestamp(uint16 year, uint8 month, uint8 day, uint8 hour, uint8 minute) constant returns (uint timestamp) {
                return toTimestamp(year, month, day, hour, minute, 0);
        }

        function toTimestamp(uint16 year, uint8 month, uint8 day, uint8 hour, uint8 minute, uint8 second) constant returns (uint timestamp) {
                uint16 i;

                // Year
                for (i = ORIGIN_YEAR; i < year; i++) {
                        if (isLeapYear(i)) {
                                timestamp += LEAP_YEAR_IN_SECONDS;
                        }
                        else {
                                timestamp += YEAR_IN_SECONDS;
                        }
                }

                // Month
                uint8[12] memory monthDayCounts;
                monthDayCounts[0] = 31;
                if (isLeapYear(year)) {
                        monthDayCounts[1] = 29;
                }
                else {
                        monthDayCounts[1] = 28;
                }
                monthDayCounts[2] = 31;
                monthDayCounts[3] = 30;
                monthDayCounts[4] = 31;
                monthDayCounts[5] = 30;
                monthDayCounts[6] = 31;
                monthDayCounts[7] = 31;
                monthDayCounts[8] = 30;
                monthDayCounts[9] = 31;
                monthDayCounts[10] = 30;
                monthDayCounts[11] = 31;

                for (i = 1; i < month; i++) {
                        timestamp += DAY_IN_SECONDS * monthDayCounts[i - 1];
                }

                // Day
                timestamp += DAY_IN_SECONDS * (day - 1);

                // Hour
                timestamp += HOUR_IN_SECONDS * (hour);

                // Minute
                timestamp += MINUTE_IN_SECONDS * (minute);

                // Second
                timestamp += second;

                return timestamp;
        }
}

