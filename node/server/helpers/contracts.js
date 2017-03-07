import Web3 from 'web3';
import contract from 'truffle-contract';

import LibChainContractSchema from '../../../build/contracts/LibChain';
import PublisherContractSchema from '../../../build/contracts/Publisher';
import LibraryContractSchema from '../../../build/contracts/Library';
import BookContractSchema from '../../../build/contracts/Book';

const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545')) // GET ME FROM ENV FILE

const libChainContract = contract(LibChainContractSchema);
const libraryContract = contract(LibraryContractSchema);
const publisherContract = contract(PublisherContractSchema);
const bookContract = contract(BookContractSchema);

libChainContract.setProvider(web3.currentProvider)
libraryContract.setProvider(web3.currentProvider)
publisherContract.setProvider(web3.currentProvider)
bookContract.setProvider(web3.currentProvider)

export default { web3, libChainContract, libraryContract, publisherContract, bookContract }