import React, { FC, Fragment } from 'react';
import { InfoCard } from '@backstage/core';
import { IdentityClient, GetUserRequest } from "@backstage/protocol-definitions/generated/identity/v1/identity_pb_service";

const client = new IdentityClient("http://localhost:8080");
const req = new GetUserRequest();
req.setUsername("johndoe");
client.getUser(req, (err, user) => {
  console.log(err);
  console.log(user);
});

const CreateEntityPage: FC<{}> = () => {
  return (
    <Fragment>
      <InfoCard title="Create New ..."></InfoCard>
    </Fragment>
  );
};

export default CreateEntityPage;
