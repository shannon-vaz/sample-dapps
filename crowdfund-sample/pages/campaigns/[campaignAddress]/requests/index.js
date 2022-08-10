import React from "react";
import Link from "next/link";
import { Button, Table } from "semantic-ui-react";
import { useRouter } from "next/router";
import getCampaignInstance from "../../../../ethereum/campaign";
import RequestRow from "../../../../components/RequestRow";

const CampaignRequests = function ({ requests = [], totalContributions }) {
  const requestCount = requests.length;
  const { campaignAddress } = useRouter().query;
  const { Header, Row, HeaderCell, Body } = Table;

  const renderRows = function () {
    return requests.map((r, i) => {
      return (
        <RequestRow
          key={i}
          id={i}
          request={r}
          totalContributions={totalContributions}
          campaignAddress={campaignAddress}
        />
      );
    });
  };

  return (
    <>
      <h3>Requests</h3>
      <Link href={`/campaigns/${campaignAddress}/requests/new`} passHref>
        <a>
          <Button
            floated="right"
            style={{ marginBottom: 10 }}
            primary
            content="Add Request"
          />
        </a>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount (Ether)</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Votes</HeaderCell>
            <HeaderCell>Vote</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{renderRows()}</Body>
      </Table>
      <div>Found {requestCount} requests</div>
    </>
  );
};

const getCampaignRequests = async function (campaignAddress) {
  const campaign = getCampaignInstance(campaignAddress);
  const requestCount = await campaign.methods.getRequestCount().call();
  console.log("request count", requestCount);
  const requests = await Promise.all(
    Array(requestCount)
      .fill()
      .map(function (_, i) {
        return campaign.methods.requests(i).call();
      })
  );
  return requests.map(function (r) {
    return {
      recipient: r.recipient,
      value: r.value,
      description: r.description,
      votes: r.votes,
      complete: r.complete,
    };
  });
};

const getCampaignContributions = async function (campaignAddress) {
  const campaign = getCampaignInstance(campaignAddress);
  const totalContributions = await campaign.methods.contributions().call();
  return totalContributions;
};

CampaignRequests.getInitialProps = async function (ctx) {
  const { campaignAddress } = ctx.query;
  const requests = await getCampaignRequests(campaignAddress);
  const totalContributions = await getCampaignContributions(campaignAddress);
  console.log(requests);
  console.log(totalContributions);
  return { requests, totalContributions };
};

export default CampaignRequests;
