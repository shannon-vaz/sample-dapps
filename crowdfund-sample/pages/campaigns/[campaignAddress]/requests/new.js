import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Form, Button, Message, Input } from "semantic-ui-react";

import getCampaignInstance from "../../../../ethereum/campaign";
import web3 from "../../../../ethereum/web3";

const CreateRequest = function () {
  const router = useRouter();
  const { campaignAddress } = router.query;
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [recipient, setRecipient] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [creatingRequest, setCreatingRequest] = useState(false);

  const onCreateRequest = async function (event) {
    event.preventDefault();
    setCreatingRequest(true);
    setErrorMessage("");
    const campaign = getCampaignInstance(campaignAddress);
    try {
      const [account] = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(recipient, web3.utils.toWei(value, "ether"), description)
        .send({ from: account });
      router.push(`/campaigns/${campaignAddress}/requests`);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
    setCreatingRequest(false);
  };

  return (
    <>
      <Link href={`/campaigns/${campaignAddress}/requests`} passHref>
        <a>Back</a>
      </Link>
      <h3>Create a request</h3>
      <Form error={errorMessage !== ""} onSubmit={onCreateRequest}>
        <Form.Field>
          <label>Description</label>
          <Input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </Form.Field>

        <Form.Field>
          <label>Value in Ether</label>
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </Form.Field>

        <Form.Field>
          <label>Recipient</label>
          <Input
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
          />
        </Form.Field>

        <Message error header="Oops!" content={errorMessage} />
        <Button
          disabled={creatingRequest}
          loading={creatingRequest}
          primary
          content="Submit"
        />
      </Form>
    </>
  );
};

export default CreateRequest;
