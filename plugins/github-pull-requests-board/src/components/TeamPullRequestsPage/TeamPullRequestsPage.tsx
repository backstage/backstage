import React, { FunctionComponent, useState } from 'react';
import { Grid, Typography } from '@material-ui/core';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import { Progress, InfoCard } from '@backstage/core-components';

import { InfoCardHeader } from '../../components/InfoCardHeader';
import { PullRequestBoardOptions } from '../../components/PullRequestBoardOptions';
import { Wrapper } from '../../components/Wrapper';
import { SmallPullRequestCard } from '../../components/SmallPullRequestCard';
import { PullRequestCard } from '../../components/PullRequestCard';
import { usePullRequestsByTeam } from '../../hooks/usePullRequestsByTeam';
import { PRCardFormating } from '../../utils/types';
import { DraftPrIcon } from '../../components/icons/DraftPr'
import { useUserRepositories } from '../../hooks/useUserRepositories';

const TeamPullRequestsPage: FunctionComponent = () => {
  const [infoCardFormat, setInfoCardFormat] = useState<PRCardFormating[]>([]);
  const { repositories } = useUserRepositories();
  const { loading, pullRequests, refreshPullRequests } = usePullRequestsByTeam(repositories);

  const CardComponent = infoCardFormat.includes('compacted')
    ? SmallPullRequestCard
    : PullRequestCard;

  const header = (
    <InfoCardHeader onRefresh={refreshPullRequests}>
      <PullRequestBoardOptions
        onClickOption={(newFormats) => setInfoCardFormat(newFormats)}
        value={infoCardFormat}
        options={[
          {
            icon: <ViewModuleIcon />,
            value: 'compacted',
            ariaLabel: 'Cards compacted'
          },
          {
            icon: <DraftPrIcon />,
            value: 'draft',
            ariaLabel: 'Show draft PRs'
          },
        ]}
      />
    </InfoCardHeader>
  );

  const getContent = () => {
    if (loading) {
      return <Progress />;
    }

    return (
      <Grid container spacing={2}>
        {pullRequests.length ? (
          pullRequests.map(({ title: columnTitle, content }) => (
            <Wrapper
              key={columnTitle}
              fullscreen
            >
              <Typography variant="overline">
                {columnTitle}
              </Typography>
              {content.map(({
                id,
                title,
                createdAt,
                lastEditedAt,
                author,
                url,
                latestReviews,
                repository,
                isDraft
              }, index) => (
                isDraft ? (infoCardFormat.includes('draft') === isDraft) &&
                  <CardComponent
                    key={`pull-request-${id}-${index}`}
                    title={title}
                    createdAt={createdAt}
                    updatedAt={lastEditedAt}
                    author={author}
                    url={url}
                    reviews={latestReviews.nodes}
                    repositoryName={repository.name}
                    isDraft={isDraft}
                  />
                  : <CardComponent
                    key={`pull-request-${id}-${index}`}
                    title={title}
                    createdAt={createdAt}
                    updatedAt={lastEditedAt}
                    author={author}
                    url={url}
                    reviews={latestReviews.nodes}
                    repositoryName={repository.name}
                    isDraft={isDraft}
                  />
              ))}
            </Wrapper>
          ))
        ) : (
          <Typography variant="overline">No pull requests found</Typography>
        )}
      </Grid>
    );
  };

  return <InfoCard title={header}>{getContent()}</InfoCard>;
};

export default TeamPullRequestsPage;
