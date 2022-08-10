const HDWalletProvider = require('@truffle/hdwallet-provider'),
  Web3 = require('web3'),
  { interface, bytecode } = require('./compile');

const mnemonic = 'mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic',
  testnetURL = '<URL>',
  provider = new HDWalletProvider(mnemonic, testnetURL),
  web3 = new Web3(provider);

const deploy = async function () {
  const accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy from account', accounts[0]);
  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  console.log(interface);
  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
deploy();