[![Stories in Ready](https://badge.waffle.io/libchain/libchain.png?label=ready&title=Ready)](https://waffle.io/libchain/libchain)
# libchain

# Contribution Guide 
 
## Preliminaries

Node (link me) (>= v6) and npm (link me) (>= v3) are required. 

After that, clone this repository and install the Truffle framework (link me) and for development purposes the ethererumjs-testrpc (link me) to run a in-memory blockchain.

```
1. git clone git@github.com:libchain/libchain
2. npm install -g truffle && npm install -g ethereumjs-testrpc
```
## Run
To get the application up and running, you have to first run the build script. 

The build script compiles the java code, runs the Spring booter, compiles all the contracts, makes the migrations needed for the deployment of the contracts, deploys the contracts, and prepares the truffle framework to run external scripts.

```
1. cd library && ./mvnw compile
2. ./mvnw spring-boot:run
```

## Nutrition facts

We generated most of the code with jHipster, which uses angular on the frontend and Java with the Spring framework (link me) on the backend. For Ethereum's contract matters we use the Truffle framework, which helps on the deployment of contracts into the blockchain and the interaction with the contracts.

Takeaways are that our Backend serves as a pipeliner to execute JavaScript files which interact with our contracts.
