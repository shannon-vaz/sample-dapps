import React from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import getCampaignInstance from "../ethereum/campaign";

const RequestRow = function ({
  id,
  request,
  totalContributions,
  campaignAddress,
}) {
  const { Row, Cell } = Table;
  const readyToFinalize = request.votes > totalContributions / 2;

  const onVote = async function () {
    const [account] = await web3.eth.getAccounts();
    const campaign = getCampaignInstance(campaignAddress);
    await campaign.methods.approveRequest(id).send({
      from: account,
    });
  };

  const onFinalize = async function () {
    const [account] = await web3.eth.getAccounts();
    const campaign = getCampaignInstance(campaignAddress);
    await campaign.methods.finalizeRequest(id).send({
      from: account,
    });
  };

  return (
    <Row
      positive={readyToFinalize && !request.complete}
      disabled={request.complete}
    >
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
      <Cell>{request.recipient}</Cell>
      <Cell>
        {request.votes}/{totalContributions}
      </Cell>
      <Cell>
        {request.complete ? null : (
          <Button content="Vote" color="green" basic onClick={onVote} />
        )}
      </Cell>
      <Cell>
        {request.complete ? null : (
          <Button color="teal" basic content="Finalize" onClick={onFinalize} />
        )}
      </Cell>
    </Row>
  );
};

export default RequestRow;
