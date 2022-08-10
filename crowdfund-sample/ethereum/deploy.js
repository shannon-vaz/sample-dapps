require("dotenv").config();
const HDWalletProvider = require('@truffle/hdwallet-provider'),
  Web3 = require('web3'),
  compiledCampaignFactory = require('./build/CampaignFactory.json')


const mnemonic = process.env.MNEMONIC,
  networkURL = process.env.NETWORK_URL,
  provider = new HDWalletProvider(mnemonic, networkURL),
  web3 = new Web3(provider);

const deploy = async function () {
  const accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy from account', accounts[0]);
  const result = await new web3.eth.Contract(compiledCampaignFactory.abi)
    .deploy({ data: compiledCampaignFactory.evm.bytecode.object })
    .send({ gas: '1900000', from: accounts[0] });
  return result;
};

deploy()
  .then(function (result) {
    console.log('Contract deployed to', result.options.address);
  })
  .catch(function (error) {
    console.error(error)
  })
  .finally(function () {
    provider.engine.stop();
  });
