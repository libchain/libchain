import Web3 from 'web3';
import contract from 'truffle-contract';

import LibChainContractSchema from '../../contracts/LibChain';
import PublisherContractSchema from '../../contracts/Publisher';
import LibraryContractSchema from '../../contracts/Library';
import BookContractSchema from '../../contracts/Book';

const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545')) // GET ME FROM ENV FILE
web3.eth.defaultAccount = web3.eth.accounts[0]
const libChainContract = contract(LibChainContractSchema);
const libraryContract = contract(LibraryContractSchema);
const publisherContract = contract(PublisherContractSchema);
const bookContract = contract(BookContractSchema);

libChainContract.setProvider(web3.currentProvider)
libraryContract.setProvider(web3.currentProvider)
publisherContract.setProvider(web3.currentProvider)
bookContract.setProvider(web3.currentProvider)

export default { web3, libChainContract, libraryContract, publisherContract, bookContract }