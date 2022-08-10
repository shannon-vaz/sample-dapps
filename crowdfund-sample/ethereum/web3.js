import Web3 from "web3";

const runningInBrowser = function () {
  return (
    typeof window === 'object' &&
    typeof window.ethereum === 'object'
  );
};

let web3;

if (runningInBrowser()) {
  window.ethereum.request({ method: 'eth_requestAccounts' });
  web3 = new Web3(window.ethereum);
} else {
  const provider = new Web3
    .providers
    .HttpProvider(
      '<Network URL>'
    );
  web3 = new Web3(provider);
}

export default web3;
