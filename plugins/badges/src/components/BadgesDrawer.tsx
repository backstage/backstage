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
import React, { useState } from 'react';
import { Button, Drawer, Grid, Typography } from '@material-ui/core';
import { CodeSnippet, Content, InfoCard, useApi } from '@backstage/core';

const BadgeCard = ({ title, badgeUrl, markdownCode }) => (
  <Grid item>
    <InfoCard title={title}>
      <Typography paragraph>
        Paste the following snippet in your <code>README.md</code> or other
        markdown file for this badge:
      </Typography>
      <img src={badgeUrl} alt="Badge preview" />
      <CodeSnippet text={markdownCode} showCopyCodeButton />
    </InfoCard>
  </Grid>
);

const BadgesDrawerContent = ({ badges, toggleDrawer }) => (
  <Content>
    <Grid container direction="column" spacing={4}>
      {badges.map((badge, idx) => (
        <BadgeCard key={idx} {...badge} />
      ))}
      <Grid item>
        <Button color="primary" onClick={() => toggleDrawer(false)}>
          Close
        </Button>
      </Grid>
    </Grid>
  </Content>
);

export const BadgesDrawer = ({ badges }) => {
  const [isOpen, toggleDrawer] = useState(false);

  return (
    <>
      <Button onClick={() => toggleDrawer(!isOpen)}>
        {badges.map(({ badgeUrl, title }, idx) => (
          <img key={idx} src={badgeUrl} alt={title} />
        ))}
      </Button>
      <Drawer anchor="right" open={isOpen} onClose={() => toggleDrawer(false)}>
        <BadgesDrawerContent badges={badges} toggleDrawer={toggleDrawer} />
      </Drawer>
    </>
  );
};
