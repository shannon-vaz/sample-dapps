const assert = require('assert');
const ganache = require('ganache');
const Web3 = require('web3');
const { abi, evm } = require('../compile.js');


const web3 = new Web3(ganache.provider());
let accounts;
let inbox;
const DEFAULT_MESSAGE = 'Hello world';

beforeEach(async () => {
  // get a list of all accounts
  accounts = await web3.eth.getAccounts()

  // use one of the accounts to deploy the contract
  inbox = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
      arguments: [DEFAULT_MESSAGE]
    })
    .send({ from: accounts[0], gas: '1000000' })
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });

  it('has a default message', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, DEFAULT_MESSAGE);
  });

  it('can update the message', async () => {
    const newMessage = 'Yo!';
    await inbox.methods.setMessage(newMessage).send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, newMessage);
  });
});