/*
 * Copyright 2021 The Backstage Authors
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

import React from 'react';
import { Grid, Typography, Link, makeStyles } from '@material-ui/core';
import { InfoCard } from '@backstage/core';

const useStyles = makeStyles({
  subheader: {
    fontWeight: 'bold',
  },
});

export const About = () => {
  const classes = useStyles();
  return (
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
            internally within a company, but with Open Source best practices.
          </Typography>
          <Typography className={classes.subheader} variant="body1">
            Why?
          </Typography>
          <Typography paragraph>
            Many companies today are of high need to increase the ease of
            cross-team cooperation. In large organizations, engineers often have
            limited ways of discovering or announcing the projects which could
            benefit from a wider development effort in terms of different
            expertise, experiences, and teams spread across the organization.
            With no good way to find these existing internal projects to join,
            the possibility of working with Inner Sourcing practices suffers.
          </Typography>
          <Typography className={classes.subheader} variant="body1">
            How?
          </Typography>
          <Typography paragraph>
            The Bazaar allows engineers and teams to open up and announce their
            new and exciting projects for transparent cooperation in other parts
            of larger organizations. The Bazaar ensures that new Inner Sourcing
            friendly projects gain visibility through Backstage and a way for
            interested engineers to show their interest and in the future
            contribute with their specific skill set. The Bazaar also provides
            an easy way to manage, catalog, and browse these Inner Sourcing
            friendly projects and components.
          </Typography>
        </InfoCard>
      </Grid>
    </Grid>
  );
};
