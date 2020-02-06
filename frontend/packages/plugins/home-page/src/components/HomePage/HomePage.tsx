import React, { FC } from 'react';

import { EntityLink, InfoCard, SortableTable } from '@backstage/core';
import SquadTechHealth from './SquadTechHealth';
import { Grid, Typography } from '@material-ui/core';

const HomePage: FC<{}> = () => {
  const data = [
    { id: 'service-1', system: 'system' },
    { id: 'service-2', system: 'system' },
  ];

  /*
  const columns = [
    { id: 'idLink', label: 'ID', sortValue: row => row.id },
    { id: 'systemLink', label: 'SYSTEM', sortValue: row => row.system },
  ];

  */
  const columns = [
    { id: 'idLink', label: 'ID' },
    { id: 'systemLink', label: 'SYSTEM' },
  ];

  return (
    <Grid container direction="column" spacing={6}>
      <Grid item>
        <SquadTechHealth />
      </Grid>
      <Grid item>
        <InfoCard title="Stuff you own">
          <SortableTable data={data} columns={columns} orderBy="id" />
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
