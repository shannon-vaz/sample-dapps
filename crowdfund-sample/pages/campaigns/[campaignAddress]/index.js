import React from "react";
import { Card, Grid, Button } from "semantic-ui-react";

import getCampaignInstance from "../../../ethereum/campaign.js";
import web3 from "../../../ethereum/web3.js";
import ContributeForm from "../../../components/ContributeForm.js";
import Link from "next/link.js";

const CampaignDetails = function ({ campaignSummary }) {
  const { campaignAddress } = campaignSummary;

  const renderCards = function () {
    const { 
      minimumContribution,
      balance,
      requests,
      contributions,
      manager 
    } = campaignSummary;
    const items = [
      {
        header: manager,
        meta: 'Address of Manager',
        description: 'The manager created this campaign and can create requests to withdraw money.',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: minimumContribution,
        meta: 'Minimum Contribution (wei)',
        description: 'Minimum contribution accepted by the campaign.',
      },
      {
        header: requests,
        meta: 'Number of requests',
        description: 'A request tries to withdraw money from the contract. Request must be approved by the contributors.'
      },
      {
        header: contributions,
        meta: 'Number of contributions',
        description: 'Number of contributions received by this campaign.'
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Campaign balance (ether)',
        description: 'Amount of money this campaign has left to spend.'
      }
    ];

    return <Card.Group items={items} />;
  };

  return (
    <>
      <h3>Details for campaign {campaignAddress}</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            {renderCards()}
          </Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm campaignAddress={campaignAddress} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${campaignAddress}/requests`} passHref>
              <a>
                <Button primary content="View Requests" />
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};

const getCampaignSummary = async function (campaignAddress) {
  const campaign = getCampaignInstance(campaignAddress);
  const summary = await campaign.methods.getSummary().call();
  return {
    campaignAddress: campaignAddress,
    minimumContribution: summary[0],
    balance: summary[1],
    requests: summary[2],
    contributions: summary[3],
    manager: summary[4],
  };
};

CampaignDetails.getInitialProps = async function (ctx) {
  const { campaignAddress } = ctx.query;
  const campaignSummary = await getCampaignSummary(campaignAddress);
  return { campaignSummary };
};

export default CampaignDetails;
