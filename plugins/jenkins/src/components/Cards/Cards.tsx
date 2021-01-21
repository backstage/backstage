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
import { DateTime, Duration } from 'luxon';
import { Link, Theme, makeStyles, LinearProgress } from '@material-ui/core';
import { InfoCard, StructuredMetadataTable } from '@backstage/core';
import ExternalLinkIcon from '@material-ui/icons/Launch';
import { useBuilds } from '../useBuilds';
import { JenkinsRunStatus } from '../BuildsPage/lib/Status';
import { useProjectSlugFromEntity } from '../useProjectSlugFromEntity';

const useStyles = makeStyles<Theme>({
  externalLinkIcon: {
    fontSize: 'inherit',
    verticalAlign: 'bottom',
  },
});

const WidgetContent = ({
  loading,
  latestRun,
}: {
  loading?: boolean;
  latestRun: any;
  branch: string;
}) => {
  const classes = useStyles();
  if (loading || !latestRun) return <LinearProgress />;
  const displayDate = DateTime.fromMillis(latestRun.timestamp).toRelative();
  // TODO This works, but hard codes as minutes. Would prefer something smarter/relative.
  const durationInMinutes = Math.round(
    Duration.fromMillis(latestRun.duration).as('minutes'),
  );
  const displayDuration = `${durationInMinutes} minute${
    durationInMinutes > 1 ? 's' : ''
  }`;
  return (
    <StructuredMetadataTable
      metadata={{
        status: (
          <>
            <JenkinsRunStatus
              status={latestRun.building ? 'running' : latestRun.result}
            />
          </>
        ),
        build: latestRun.fullDisplayName,
        'latest run': displayDate,
        duration: displayDuration,
        link: (
          <Link href={latestRun.url} target="_blank">
            See more on Jenkins{' '}
            <ExternalLinkIcon className={classes.externalLinkIcon} />
          </Link>
        ),
      }}
    />
  );
};

export const LatestRunCard = ({
  branch = 'master',
  variant,
}: {
  branch: string;
  variant?: string;
}) => {
  const { owner, repo } = useProjectSlugFromEntity();
  const [{ builds, loading }] = useBuilds(owner, repo, branch);
  const latestRun = builds ?? {};
  return (
    <InfoCard title={`Latest ${branch} build`} variant={variant}>
      <WidgetContent loading={loading} branch={branch} latestRun={latestRun} />
    </InfoCard>
  );
};
