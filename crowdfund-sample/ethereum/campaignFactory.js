import web3 from './web3.js';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  '0xfb4Feeda86eFe4a5cBa5b54cC976E49a62f5A5d6'
);

export default instance;
