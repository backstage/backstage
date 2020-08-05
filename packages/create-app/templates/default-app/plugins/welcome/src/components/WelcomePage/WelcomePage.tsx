import React, { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Link,
} from '@material-ui/core';
import Timer from '../Timer';
import {
  Content,
  InfoCard,
  Header,
  Page,
  pageTheme,
  ContentHeader,
  SupportButton,
} from '@backstage/core';

const WelcomePage: FC<{}> = () => {
  const profile = { givenName: '' };

  return (
    <Page theme={pageTheme.home}>
      <Header
        title={`Welcome ${profile.givenName || 'to Backstage'}`}
        subtitle="Some quick intro and links."
      >
        <Timer />
      </Header>
      <Content>
        <ContentHeader title="Getting Started">
          <SupportButton />
        </ContentHeader>
        <Grid container>
          <Grid item xs={12} md={6}>
            <InfoCard>
              <Typography variant="body1" gutterBottom>
                You now have a running instance of Backstage!
                <span role="img" aria-label="confetti">
                  🎉
                </span>
                Let's make sure you get the most out of this platform by walking
                you through the basics.
              </Typography>
              <Typography variant="h6" gutterBottom>
                The Setup
              </Typography>
              <Typography variant="body1" paragraph>
                Backstage is put together from three base concepts: the core,
                the app and the plugins.
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="The core is responsible for base functionality." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="The app provides the base UI and connects the plugins." />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="The plugins make Backstage useful for the end users with
                  specific views and functionality."
                  />
                </ListItem>
              </List>
              <Typography variant="h6" gutterBottom>
                Try It Out
              </Typography>
              <Typography variant="body1" paragraph>
                We suggest you either check out the documentation for{' '}
                <Link href="https://github.com/spotify/backstage/blob/master/docs/getting-started/create-a-plugin.md">
                  creating a plugin
                </Link>{' '}
                or have a look in the code for the{' '}
                <Link component={RouterLink} to="/home">
                  Home Page
                </Link>{' '}
                in the directory "plugins/home-page/src".
              </Typography>
            </InfoCard>
          </Grid>
          <Grid item>
            <InfoCard>
              <Typography variant="h5">Quick Links</Typography>
              <List>
                <ListItem>
                  <Link href="https://backstage.io">backstage.io</Link>
                </ListItem>
                <ListItem>
                  <Link href="https://github.com/spotify/backstage/blob/master/docs/getting-started/create-a-plugin.md">
                    Create a plugin
                  </Link>
                </ListItem>
              </List>
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};

export default WelcomePage;
