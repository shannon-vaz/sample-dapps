import Link from "next/link.js";
import React from "react";
import { Card, Button } from "semantic-ui-react";
import campaignFactory from "../ethereum/campaignFactory.js";

const Homepage = function ({ campaigns = [] }) {

  const renderCampaigns = function () {
    const items = campaigns.map(function (address) {
      return {
        header: address,
        description: (
          <Link href={`/campaigns/${address}`} passHref>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true,
      };
    });
    return <Card.Group items={items} />;
  };

  return (
    <>
      <h3>Open Campaigns</h3>

      <Link href="/campaigns/new" passHref>
        <a>
          <Button
            content="Create Campaign"
            icon="add circle"
            primary
            floated="right"
          />
        </a>
      </Link>
      {renderCampaigns()}
    </>
  );
};

const getCampaigns = async function () {
  const campaigns = await campaignFactory.methods.getCampaigns().call();
  return campaigns;
}

Homepage.getInitialProps = async function () {
  const campaigns = await getCampaigns();
  return {
    campaigns: campaigns
  };
};

export default Homepage;
