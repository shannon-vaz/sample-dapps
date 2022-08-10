const assert = require('assert'),
  ganache = require('ganache-cli'),
  Web3 = require('web3'),
  { interface, bytecode } = require('../compile.js');


const web3 = new Web3(ganache.provider());
let lottery, accounts, manager;

beforeEach(async function () {
  accounts = await web3.eth.getAccounts();
  manager = accounts[0];
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: manager, gas: '1000000'});
});

describe('Lottery', function () {
  it('deploys a contract', function () {
    assert.ok(lottery.options.address);
  });

  it('allows one account to enter', async function () {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length);
  });

  it('allows multiple accounts to enter', async function () {
    const players = [accounts[0], accounts[1], accounts[2]];
    for (let i = 0; i < players.length; i++) {
      await lottery.methods.enter().send({
        from: players[i],
        value: web3.utils.toWei('0.02', 'ether')
      });
    }
    const enteredPlayers = await lottery.methods.getPlayers().call({
      from: players[0]
    });

    for (let i = 0; i < players.length; i++) {
      assert.equal(players[i], enteredPlayers[i]);
    }
    assert.equal(3, players.length);
  });

  it('requires a minimum amount of ether to enter', async function () {
    await assert.rejects(lottery.methods.enter().send({
      from: accounts[0],
      value: 0
    }));
  });

  it('only manager can pick a winner', async function () {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.02', 'ether')
    });
    await assert.rejects(lottery.methods.pickWinner().send({ from: accounts[1] }));
    await assert.doesNotReject(lottery.methods.pickWinner().send({ from: manager }));
  });

  it('sends money to the winner and resets the players list', async function () {
    const player = accounts[1];
    await lottery.methods.enter().send({
      from: player,
      value: web3.utils.toWei('2', 'ether')
    });
    const balanceBeforeWinning = await web3.eth.getBalance(player);
    await lottery.methods.pickWinner().send({ from: manager });
    const balanceAfterWinning = await web3.eth.getBalance(player);
    const difference = balanceAfterWinning - balanceBeforeWinning;
    assert(difference > web3.utils.toWei('1.8', 'ether'));
    // assert players list is 0
    // assert contract balance is 0
  });
});
