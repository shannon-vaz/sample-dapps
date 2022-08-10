const assert = require('assert'),
  ganache = require('ganache'),
  Web3 = require('web3');


const web3 = new Web3(ganache.provider()),
  compiledCampaignFactory = require('../ethereum/build/CampaignFactory.json'),
  compiledCampaign = require('../ethereum/build/Campaign.json'),
  minimumContribution = '100';
let accounts, campaignFactory, campaignAddress, campaign;

beforeEach(async function () {
  accounts = await web3.eth.getAccounts();

  campaignFactory = await new web3.eth.Contract(compiledCampaignFactory.abi)
    .deploy({ data: compiledCampaignFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: '2000000'});

  await campaignFactory.methods.createCampaign(minimumContribution).send({
    from: accounts[0], gas: '2000000'
  });

  [campaignAddress] = await campaignFactory.methods.getCampaigns().call();
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe('Campaigns', function () {
  it('deploys a factory and a campaign', function () {
    assert.ok(campaignFactory.options.address);
    assert.ok(campaign.options.address);
  });

  it('makes the campaign creator as the campaign manager', async function () {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });

  it('allows people to contribute', async function () {
    const contributor = accounts[1];
    await campaign.methods.contribute().send({
      value: '200',
      from: contributor
    });
    assert(await campaign.methods.contributor(contributor).call());
  });

  it('requires contribution to be above minimum value', async function () {
    const contributor = accounts[1];
    await assert.rejects(campaign.methods.contribute().send({
      value: '50',
      from: contributor
    }));
  });

  it('allows a manager to make a payment request', async function () {
    await campaign.methods
      .createRequest(accounts[1], '100', 'Test description')
      .send({ from: accounts[0], gas: '1000000' });
    const request = await campaign.methods.requests(0).call();
    assert.equal('Test description', request.description);
  });

  it('processes requests', async function () {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether')
    });

    await campaign.methods
      .createRequest(accounts[1], web3.utils.toWei('5', 'ether'), 'Test')
      .send({ from: accounts[0], gas: '1000000' });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);
    assert(balance > 103);
  });
});
