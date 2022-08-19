/*
 * Copyright 2022 The Backstage Authors
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

import { Box, Button, makeStyles } from '@material-ui/core';
import {
  InfoCard,
  Progress,
  MarkdownContent,
  EmptyState,
  ErrorPanel,
} from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useProjectRepoFromEntity } from '../../hooks';
import { useApi } from '@backstage/core-plugin-api';
import React from 'react';
import { azureDevOpsApiRef } from '../../api';
import useAsync from 'react-use/lib/useAsync';

const useStyles = makeStyles(theme => ({
  readMe: {
    overflowY: 'auto',
    paddingRight: theme.spacing(1),
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#F5F5F5',
      borderRadius: '5px',
    },
    '&::-webkit-scrollbar': {
      width: '5px',
      backgroundColor: '#F5F5F5',
      borderRadius: '5px',
    },
    '&::-webkit-scrollbar-thumb': {
      border: '1px solid #555555',
      backgroundColor: '#555',
      borderRadius: '4px',
    },
  },
}));

type Props = {
  maxHeight?: number;
};

type ErrorProps = {
  error: Error;
};

function isNotFoundError(error: any): boolean {
  return error?.response?.status === 404;
}

const ReadmeCardError = ({ error }: ErrorProps) => {
  if (isNotFoundError(error))
    return (
      <EmptyState
        title="No README available for this entity"
        missing="field"
        description="You can add a README to your entity by following the Azure DevOps documentation."
        action={
          <Button
            variant="contained"
            color="primary"
            href="https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops"
          >
            Read more
          </Button>
        }
      />
    );
  return <ErrorPanel title={error.message} error={error} />;
};

export const ReadmeCard = (props: Props) => {
  const classes = useStyles();
  const api = useApi(azureDevOpsApiRef);
  const { entity } = useEntity();
  const { project, repo } = useProjectRepoFromEntity(entity);

  const { loading, error, value } = useAsync(
    () =>
      api.getReadme({
        project,
        repo,
      }),
    [api, project, repo, entity],
  );

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ReadmeCardError error={error} />;
  }

  return (
    <InfoCard
      title="Readme"
      deepLink={{
        link: value!.url,
        title: 'Readme',
      }}
    >
      <Box className={classes.readMe} sx={{ maxHeight: props.maxHeight }}>
        <MarkdownContent content={value?.content ?? ''} />
      </Box>
    </InfoCard>
  );
};
