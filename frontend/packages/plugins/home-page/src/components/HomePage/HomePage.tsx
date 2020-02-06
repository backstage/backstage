import React, { FC } from 'react';

import { EntityLink, InfoCard } from '@backstage/core';
import SquadTechHealth from './SquadTechHealth';
import { Grid, Typography } from '@material-ui/core';

const HomePage: FC<{}> = () => {
  return (
    <Grid container direction="column" spacing={6}>
      <Grid item>
        <SquadTechHealth />
      </Grid>
      <Grid item>
        <InfoCard title="Home">
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
      </Grid>
    </Grid>
  );
};

export default HomePage;
