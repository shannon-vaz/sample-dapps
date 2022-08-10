# Lottery Sample DApp

Sample lottery DApp built using solidity and react.  
DApp can be run on EVM chain like ethereum, polygon.

## Setup

Install `node.js` dependencies by running `npm i` in `ethereum` and `ui` folders.

## Contracts

Contracts of the DApp are in the `ethereum` folder.  

### Test

Run `npm test` in `ethereum` folder to run contract tests.

### Deploy

Change the network URL and mnemonic in [`deploy.js`](./ethereum/deploy.js) and run `node deploy.js` in `ethereum` folder.

## UI

UI for the DApp is in the `ui` folder.  
To run the UI, and interact with the DApp, deploy the contract and copy the deployed  
contract address to [`lottery.js`](./ui/src/lottery.js).

Then run the UI by running `npm start` in `ui` folder.
