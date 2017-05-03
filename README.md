[![Stories in Ready](https://badge.waffle.io/libchain/libchain.png?label=ready&title=Ready)](https://waffle.io/libchain/libchain)

![alt text][logo]

[logo]: https://github.com/libchain/libchain/raw/master/webapp/public/libchain_logo.png "LibChain Logo"

## Preliminaries

[Node](https://nodejs.org/) (>= v6) and [npm](https://www.npmjs.com/) (>= v3) are required. If you don't have [nvm](https://github.com/creationix/nvm
) or [n](https://github.com/tj/n) we encourage you to take a look to make your node versions much easier to switch or to maintain at the latest update.

After that, clone this repository and install the [Truffle framework](truffleframework.com/) and for development purposes the [ethererumjs-testrpc](https://github.com/ethereumjs/testrpc
) to run a in-memory blockchain.

```
1. git clone git@github.com:libchain/libchain
2. npm install -g truffle ethereumjs-testrpc
```

In the folders `node` and `webapp` are further `json` packages, inside of each folder run:

```
1. npm install
```

## Run
To run the application you need to open 3 terminal sessions. 

In one and first of all, the test blockchain must be up and running. To do that run 

```
testrpc --gasLimit 0x98967F
```

As a side note, the `gasLimit` flag set the gasLimit to 9999 which varies from the default value.

After the blockchain is up and running the rest of the modules of the application can be started. However the blockchain must be populated and the smart contracts have to be deployed as a next step followed by the start of the node server. 

In another terminal session and inside the `root` directory, run: 

```
truffle compile && truffle migrate && truffle exec scripts/init.js
```

After that's done, then start the node server in the same session:

Inside the `node` directory, run: 

```
npm start
```

At last, in the third open terminal session and inside the `webapp` directory, run:

```
npm start
```

## Getting started

After you have the application up and running, then you need to create an account. 

### Features

At the moment you can do: 

1. Buy books as an admin. 
2. Borrow books as a user.
3. Return books as a user.
4. View the borrowed books as a user.
5. See statistics of books.
6. See statistics of libraries and publishers.

## Application components and general architecture.

We use for the frontend [React](https://facebook.github.io/react/) and [Redux](redux.js.org/) with [Material UI](www.material-ui.com/). We have Redux actions that communicate directly with our backend server which is used mainly as a pipeline for the blockchain. 

Server-side a RESTful API is exposed running on a NodeJS environment with the Express server framework. The server uses the [`web3`](https://github.com/ethereum/web3.js/
) to consume the JSON API of Ethereum. 

We designed our contracts with help of the Truffle framework and the deployment and compilation is also made with help of that framework. 

For further information aplease visit the linked links to feel comfortable around the used technologies.