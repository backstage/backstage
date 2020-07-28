/*
 * Copyright 2020 Spotify AB
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
import { Entity } from '@backstage/catalog-model';
import {
  Link,
  Theme,
  makeStyles,
  LinearProgress,
} from '@material-ui/core';
import {
  InfoCard,
  StructuredMetadataTable,
} from '@backstage/core';
import ExternalLinkIcon from '@material-ui/icons/Launch';
import {useBuilds} from "../../state";
import {JenkinsRunStatus} from "../../pages/BuildsPage/lib/Status";

const useStyles = makeStyles<Theme>({
  externalLinkIcon: {
    fontSize: 'inherit',
    verticalAlign: 'bottom',
  },
});

const WidgetContent = ({
                         loading,
                         lastRun,
                       }: {
  loading?: boolean;
  lastRun: any;
  branch: string;
}) => {
  const classes = useStyles();
  if (loading || !lastRun) return <LinearProgress />;
  return (
    <StructuredMetadataTable
      metadata={{
        status: (
          <>
            <JenkinsRunStatus status={lastRun.building ? 'running': lastRun.result} />
          </>
        ),
        build: lastRun.fullDisplayName,
        url: (
          <Link href={lastRun.url} target="_blank">
            See more on Jenkins{' '}
            <ExternalLinkIcon className={classes.externalLinkIcon} />
          </Link>
        ),
      }}
    />
  );
};

export const JenkinsLastBuildWidget = ({
                         entity,
                         branch = 'master',
                       }: {
  entity: Entity;
  branch: string;
}) => {
  const [owner, repo] = (
    entity?.metadata.annotations?.['backstage.io/jenkins-github-folder'] ?? '/'
  ).split('/');
  const [
    {loading, value}
  ] = useBuilds(owner, repo, branch);
  
  const lastRun = value ?? {} ;
  
  return (
    <InfoCard title={`Last ${branch} build`}>
      <WidgetContent
        loading={loading}
        branch={branch}
        lastRun={lastRun}
      />
    </InfoCard>
  );
};
