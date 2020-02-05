import React, { FC } from 'react';
import { InfoCard, EntityLink } from '@backstage/core';
import { Link } from 'react-router-dom';
import { Typography } from '@material-ui/core';

const HomePage: FC<{}> = () => {
  return (
    <InfoCard title="Home Page">
      <Typography variant="body1">Welcome to Backstage!</Typography>
      <div>
        <Link to="/login">Go to Login</Link>
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
