import web3 from "./web3.js";
import Campaign from "./build/Campaign.json";

const getCampaignInstance = function (campaignAddress) {
  return new web3.eth.Contract(Campaign.abi, campaignAddress);
};

export default getCampaignInstance;
