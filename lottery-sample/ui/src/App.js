import "./App.css";
import React, { useState, useEffect } from "react";
import lottery from "./lottery.js";
import web3 from "./web3";

const App = function () {
  const [manager, setManager] = useState(''),
    [players, setPlayers] = useState([]),
    [balance, setBalance] = useState(''),
    [value, setValue] = useState(''),
    [message, setMessage] = useState('');

  async function loadData() {
    const manager = await lottery.methods.manager().call();
    setManager(manager);
    const players = await lottery.methods.getPlayers().call();
    setPlayers(players);
    const balance = await web3.eth.getBalance(lottery.options.address);
    setBalance(balance);
  }

  useEffect(function () {
    loadData();
  }, [])

  async function onEnterLottery(event) {
    event.preventDefault();
    try {
      const [account] = await web3.eth.getAccounts();
      setMessage('Waiting for transaction to complete...');
      await lottery.methods.enter().send({
        from: account,
        value: web3.utils.toWei(value, 'ether'),
      })
      setMessage('You have been entered!');
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  }

  async function onPickWinner() {
    try {
      const [account] = await web3.eth.getAccounts();
      setMessage('Waiting for transaction to complete...');
      await lottery.methods.pickWinner().send({ from: account });
      setMessage('A winner has been picked!');
    }
    catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  }

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>
        this contract is managed by {manager}.
        There are currently {players.length} people entered,
        competing to win {web3.utils.fromWei(balance, 'ether')} ether!
      </p>
      <hr />

      <form onSubmit={onEnterLottery}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input
            value={value}
            onChange={event => setValue(event.target.value)}
          />
        </div>
        <button>Enter</button>
      </form>
      <hr />

      <h4>Ready to pick a winner?</h4>
      <button onClick={onPickWinner}>Pick a winner!</button>
      <hr />

      <h1>{message}</h1>
    </div>
  );

}

export default App;