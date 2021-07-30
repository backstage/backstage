/*
 * Copyright 2021 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect, useState } from 'react';
import { Button, makeStyles, Grid, Typography, Link } from '@material-ui/core';
import {
  Header,
  Content,
  ContentHeader,
  SupportButton,
  Tabs,
  Progress,
  InfoCard,
} from '@backstage/core';
import { ProjectPreview } from '../ProjectPreview/ProjectPreview';
import { ProjectCatalog } from '../ProjectCatalog';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AddProjectDialog } from '../AddProjectDialog';
import { AlertBanner } from '../AlertBanner';

const useStyles = makeStyles({
  header: {
    display: 'inline-block',
    width: '60%',
    fontSize: '1.7rem',
    margin: '1rem 0',
  },
  link: {
    display: 'inline-block',
    width: '40%',
    textAlign: 'end',
    fontSize: '1.2rem',
  },
  hr: {
    marginBottom: '1.3rem',
  },
  headerDiv: {
    padding: '0 1rem',
  },
  container: {
    marginTop: '2rem',
  },
  subheader: {
    fontWeight: 'bold',
  },
  description: {
    textAlign: 'justify',
  },
});

import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import { usePromiseTracker, trackPromise } from 'react-promise-tracker';

export const HomePage = () => {
  const location = useLocation();
  const classes = useStyles();
  const catalogApi = useApi(catalogApiRef);
  const initValue: Entity[] = [];
  const [value, setValue] = useState(initValue);
  const { promiseInProgress } = usePromiseTracker();
  const [notBazaarEntities, setNotBazaarEntities] = useState(initValue);
  const [openAdd, setOpenAdd] = useState(false);
  const [openNoProjects, setOpenNoProjects] = useState(false);

  const handleCloseNoProjects = () => {
    setOpenNoProjects(false);
  };

  useEffect(() => {
    async function fetchEntities() {
      const components = await catalogApi.getEntities({
        filter: { kind: 'Component' },
      });

      const bazaarEntities = components.items.filter(e => e?.metadata?.bazaar);
      setNotBazaarEntities(
        components.items.filter(
          e =>
            !e?.metadata?.bazaar &&
            e?.metadata?.annotations?.['backstage.io/edit-url'],
        ),
      );
      setValue(bazaarEntities);
    }

    trackPromise(fetchEntities());
  }, [location, catalogApi]);

  const tabContent = [
    {
      label: 'Home',
      component: (
        <Content noPadding>
          <ContentHeader title="Latest projects">
            <SupportButton />
          </ContentHeader>
          <ProjectPreview entities={value || []} />
          <Content noPadding className={classes.container}>
            <ContentHeader title="All projects">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (notBazaarEntities.length !== 0) {
                    setOpenAdd(true);
                  } else {
                    setOpenNoProjects(true);
                  }
                }}
              >
                Add project
              </Button>
              <AddProjectDialog
                entities={notBazaarEntities}
                handleClose={() => {
                  setOpenAdd(false);
                }}
                openAdd={openAdd}
              />
            </ContentHeader>
            <ProjectCatalog entities={value || []} />
          </Content>
        </Content>
      ),
    },
    {
      label: 'About',
      component: (
        <Grid container spacing={4}>
          <Grid item xs={5}>
            <InfoCard title="About Bazaar">
              <Typography className={classes.subheader} variant="body1">
                What is the Bazaar?
              </Typography>
              <Typography paragraph>
                The Bazaar is a place where teams can propose projects for
                cross-functional team development. Essentially a marketplace for
                internal projects suitable for{' '}
                <Link
                  target="_blank"
                  href="https://en.wikipedia.org/wiki/Inner_source"
                >
                  Inner Sourcing
                </Link>
                . With "Inner Sourcing", we mean projects that are developed
                internally within a company, but with Open Source best
                practices.
              </Typography>
              <Typography className={classes.subheader} variant="body1">
                Why?
              </Typography>
              <Typography paragraph>
                Many companies today are of high need to increase the ease of
                cross-team cooperation. In large organizations, engineers often
                have limited ways of discovering or announcing the projects
                which could benefit from a wider development effort in terms of
                different expertise, experiences, and teams spread across the
                organization. With no good way to find these existing internal
                projects to join, the possibility of working with Inner Sourcing
                practices suffers.
              </Typography>
              <Typography className={classes.subheader} variant="body1">
                How?
              </Typography>
              <Typography paragraph>
                The Bazaar allows engineers and teams to open up and announce
                their new and exciting projects for transparent cooperation in
                other parts of larger organizations. The Bazaar ensures that new
                Inner Sourcing friendly projects gain visibility through
                Backstage and a way for interested engineers to show their
                interest and in the future contribute with their specific skill
                set. The Bazaar also provides an easy way to manage, catalog,
                and browse these Inner Sourcing friendly projects and
                components.
              </Typography>
            </InfoCard>
          </Grid>
        </Grid>
      ),
    },
  ];

  if (promiseInProgress) {
    return <Progress />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <AlertBanner
              open={openNoProjects}
              message={
                <div>
                  No project available. Please{' '}
                  <Link
                    style={{ color: 'inherit', fontWeight: 'bold' }}
                    href="/create"
                  >
                    create a project
                  </Link>{' '}
                  from a template first.
                </div>
              }
              handleClose={handleCloseNoProjects}
            />
            <Header
              data-testid="bazaar-header"
              title="Bazaar"
              subtitle="Marketplace for innersource projects"
            />
            <Tabs
              tabs={tabContent.map(tab => ({
                label: tab.label,
                content: tab.component,
              }))}
            />
          </div>
        }
      />
      <Route path="/all" element={<ProjectCatalog entities={value || []} />} />
    </Routes>
  );
};
