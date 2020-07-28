import React from 'react';
import { useWorkflowRuns } from '../useWorkflowRuns';
import { WorkflowRun } from '../WorkflowRunsTable';
import { Entity } from '@backstage/catalog-model';
import { WorkflowRunStatusIcon } from '../WorkflowRunStatusIcon';
import { Link, Theme, makeStyles } from '@material-ui/core';
import { InfoCard, StructuredMetadataTable } from '@backstage/core';
import ExternalLinkIcon from '@material-ui/icons/Launch';

const useStyles = makeStyles<Theme>({
  externalLinkIcon: {
    fontSize: 'inherit',
    verticalAlign: 'bottom',
  },
});

export const Widget = ({
  entity,
  branch = 'master',
}: {
  entity: Entity;
  branch: string;
}) => {
  const classes = useStyles();
  const [owner, repo] = (
    entity?.metadata.annotations?.['backstage.io/github-actions-id'] ?? '/'
  ).split('/');
  const [tableProps] = useWorkflowRuns({
    owner,
    repo,
    branch,
  });
  const lastRun = tableProps.runs?.[0] ?? ({} as WorkflowRun);
  return (
    <InfoCard title={`Last ${branch} build`}>
      <StructuredMetadataTable
        metadata={{
          status: <WorkflowRunStatusIcon status={lastRun.status} />,
          message: lastRun.message,
          url: (
            <Link href={lastRun.githubUrl} target="_blank">
              See more on GitHub{' '}
              <ExternalLinkIcon className={classes.externalLinkIcon} />
            </Link>
          ),
        }}
      />
    </InfoCard>
  );
};
