import React, { FC } from 'react';
import { Grid, Typography } from '@material-ui/core';

import { HorizontalScrollGrid, ProgressCard } from '@spotify-backstage/core';

const SquadTechHealth: FC<{}> = () => {
  return (
    <>
      <Typography variant="h3" style={{ padding: '8px 0 16px 0' }}>
        Team Metrics
      </Typography>
      <HorizontalScrollGrid scrollStep={400} scrollSpeed={100}>
        <Grid item>
          <ProgressCard
            title="Test Certified"
            progress={0.23}
            deepLink={{
              link: '/some-url',
              title: 'About Test Certs',
            }}
          />
        </Grid>
        <Grid item>
          <ProgressCard
            title="k8s Migration"
            progress={0.78}
            deepLink={{
              link: '/some-url',
              title: 'About k8s',
            }}
          />
        </Grid>
      </HorizontalScrollGrid>
    </>
  );
};

export default SquadTechHealth;
