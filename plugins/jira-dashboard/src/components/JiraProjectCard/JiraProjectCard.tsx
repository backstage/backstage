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
import { Card, Box, Divider, Typography } from '@material-ui/core';
import { Avatar } from '@backstage/core-components';
import { LinkButton } from '@backstage/core-components';
import type { Project } from '../../types';
import { getProjectUrl } from '../../lib';
import { ProjectInfoLabel } from './ProjectInfoLabel';

type JiraProjectCardProps = {
  project: Project;
};

export const JiraProjectCard = ({ project }: JiraProjectCardProps) => {
  return (
    <Card style={{ padding: 20, height: '100%' }}>
      <Box display="inline-flex" alignItems="center" mb={2}>
        <Avatar
          picture={project.avatarUrls}
          customStyles={{
            width: 50,
            height: 50,
          }}
        />

        <Typography style={{ fontSize: 20, marginLeft: 3 }}>
          {project.name} | {project.projectTypeKey}
        </Typography>
      </Box>
      <Box ml={1}>
        <Divider style={{ marginBottom: 10 }} />
        <ProjectInfoLabel label="Project key" value={project.key} />
        <ProjectInfoLabel
          label="Category"
          value={project.projectCategory.name}
        />
        {project.description && (
          <ProjectInfoLabel label="Description" value={project.description} />
        )}
        <ProjectInfoLabel label="Project lead" value={project.lead.key} />

        <LinkButton
          color="primary"
          variant="contained"
          to={getProjectUrl(project)}
          style={{ marginTop: 35 }}
        >
          Go to project
        </LinkButton>
      </Box>
    </Card>
  );
};
