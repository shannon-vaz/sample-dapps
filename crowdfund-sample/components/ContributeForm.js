import { useRouter } from "next/router";
import React, { useState } from "react";
import { Form, Input, Message, Button } from "semantic-ui-react";
import getCampaignInstance from "../ethereum/campaign";
import web3 from "../ethereum/web3";

const ContributeForm = function ({ campaignAddress }) {
  const [contribution, setContribution] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [sendingContribution, setSendingContribution] = useState(false);
  const router = useRouter();

  const onContribute = async function (event) {
    event.preventDefault();
    setSendingContribution(true);
    setErrorMessage('');
    try {
      const campaign = getCampaignInstance(campaignAddress);
      const [account] = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: account,
        value: web3.utils.toWei(contribution, 'ether')
      });
      router.reload();
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
    setSendingContribution(false);
  };

  return (
    <Form error={errorMessage !== ""} onSubmit={onContribute}>
      <Form.Field>
        <label>Amount to contribute</label>
        <Input
          value={contribution}
          onChange={(event) => setContribution(event.target.value)}
          label="ether"
          labelPosition="right"
        />
      </Form.Field>
      <Message error header="Oops!" content={errorMessage} />
      <Button
        disabled={sendingContribution}
        loading={sendingContribution}
        primary
        content="Contribute"
      />
    </Form>
  );
};

export default ContributeForm;
