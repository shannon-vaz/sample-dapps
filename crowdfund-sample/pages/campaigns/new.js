import { useRouter } from "next/router.js";
import React, { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import campaignFactory from "../../ethereum/campaignFactory.js";
import web3 from "../../ethereum/web3.js";

const NewCampaign = function () {

  const [minimumContribution, setMinimumContribution] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [creatingCampaign, setCreatingCampaign] = useState(false);
  const router = useRouter();

  const onCreateCampaign = async function (event) {
    event.preventDefault();
    setCreatingCampaign(true);
    setErrorMessage('');
    try {
      const [account] = await web3.eth.getAccounts();
      await campaignFactory.methods
        .createCampaign(minimumContribution)
        .send({ from: account });
      router.push("/");
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
    setCreatingCampaign(false);
  };

  return (
    <>
      <h1>Create a Campaign</h1>
      <Form error={errorMessage !== ''} onSubmit={onCreateCampaign}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            label="wei"
            labelPosition="right"
            value={minimumContribution}
            onChange={(event) => setMinimumContribution(event.target.value)}
          />
        </Form.Field>
        <Message error header="Oops!" content={errorMessage} />
        <Button
          disabled={creatingCampaign}
          loading={creatingCampaign}
          primary
          content="Create"
        />
      </Form>
    </>
  );
};

export default NewCampaign;
