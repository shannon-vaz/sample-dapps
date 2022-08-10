# Crowdfund Sample DApp

Sample Crowdfund DApp built using solidity and nextjs.

The DApp allows users to create crowd funding campaigns for their projects and  
gives voting power to the contributors on how the campaign creators spend the  
contributed money.  

Campaign creators can create spending requests with amount and recipient address.  
Contributors can vote on whether they accept the contributions to be sent to the recipient.  
Contributions are made in ether.  

DApp can be run on EVM chain like ethereum, polygon.

## Setup

Install `node.js` dependencies by running `npm i`

## Contracts

Contracts of the DApp are in the `ethereum` folder.  

### Test

Run `npm test` to run contract tests.

### Compile

Run `node compile.js` in `ethereum` folder.

### Deploy

Create a .env file in `ethereum` folder using [.env.example](./ethereum/.env.example) as reference and  
change the network URL and mnemonic. Then run `node deploy.js` in `ethereum` folder.

## UI

UI for the DApp is in the `pages` and `components` folder.  
The UI also uses some files from the `ethereum` folder.

To run the UI, and interact with the DApp, deploy the contract and copy the deployed  
CampaignFactory contract address to [`campaignFactory.js`](./ethereum/campaignFactory.js).

Then set your network URL in [`web3.js`](./ethereum/web3.js) run the UI by running `npm run dev`
