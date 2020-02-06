import { EntityLink, InfoCard } from '@backstage/core';
import { Typography } from '@material-ui/core';
import React, { FC } from 'react';

const HomePage: FC<{}> = () => {
  return (
    <InfoCard title="Home Page">
      <Typography variant="body1">Welcome to Backstage!</Typography>
      <div>
        <EntityLink kind="service" id="backstage-backend">
          Backstage Backend
        </EntityLink>
        <EntityLink uri="entity:service:backstage-lb" subPath="ci-cd">
          Backstage LB CI/CD
        </EntityLink>
      </div>
    </InfoCard>
  );
};

export default HomePage;
