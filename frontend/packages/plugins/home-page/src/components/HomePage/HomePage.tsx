import { EntityLink, InfoCard, Header, Page, theme } from '@backstage/core';
import { Typography, makeStyles, Theme } from '@material-ui/core';
import React, { FC } from 'react';
import HomePageTimer from '../HomepageTimer';

const useStyles = makeStyles<Theme>(theme => ({
  mainContentArea: {
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  pageBody: {
    padding: theme.spacing(2),
  },
  avatarButton: {
    padding: theme.spacing(2),
  },
}));

const HomePage: FC<{}> = () => {
  const classes = useStyles();

  return (
    <Page theme={theme.home}>
      <div className={classes.mainContentArea}>
        <Header title="This is Backstage!">
          <HomePageTimer />
        </Header>
        <div className={classes.pageBody}>
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
        </div>
      </div>
    </Page>
  );
};

export default HomePage;
