/*
 * Copyright 2023 The Backstage Authors
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
import { Card, Box, Divider, Typography, makeStyles } from '@material-ui/core';
import { Avatar } from '@backstage/core-components';
import { LinkButton } from '@backstage/core-components';
import type { Project } from '../../types';
import { getProjectUrl } from '../../lib';

const useStyles = makeStyles({
  root: {
    padding: '1rem',
    fontSize: '18px',
    height: '100%',
  },
  section: {
    marginTop: '1rem',
    marginBottom: '2rem',
  },
  label: {
    marginTop: '1rem',
    color: '#A9A9A9',
  },
  value: {
    fontWeight: 800,
    margin: '0.3rem 0 1rem 0 ',
  },
  button: {
    textDecoration: 'none',
    margin: '1rem 0',
  },
});

type JiraProjectCardProps = {
  project: Project;
};

export const JiraProjectCard = ({ project }: JiraProjectCardProps) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <Box display="inline-flex" alignItems="center">
        <Avatar
          picture={project.avatarUrls}
          customStyles={{
            width: '40px',
            height: '40px',
          }}
        />

        <Box ml={1}>
          {project.name} | {project.projectTypeKey}
        </Box>
      </Box>
      <Box ml={1} className={classes.section}>
        <Divider />
        <Typography className={classes.label}>Project key</Typography>
        <Typography className={classes.value}>{project.key}</Typography>

        <Typography className={classes.label}>Category</Typography>
        <Typography className={classes.value}>
          {project.projectCategory.name}
        </Typography>

        {project.description && (
          <>
            <Typography className={classes.label}>Description</Typography>
            <Typography className={classes.value}>
              {project.description}
            </Typography>
          </>
        )}

        <Typography className={classes.label}>Project lead</Typography>
        <Box style={{ display: 'flex' }}>
          <Typography className={classes.value}>{project.lead.key}</Typography>
        </Box>

        <LinkButton
          color="primary"
          variant="contained"
          className={classes.button}
          to={getProjectUrl(project)}
        >
          Go to project
        </LinkButton>
      </Box>
    </Card>
  );
};
