import React, { FunctionComponent } from 'react';
import { Box, Chip } from '@material-ui/core';
import { getApprovedReviews, getCommentedReviews } from '../../utils/functions';
import { Card } from '../Card';
import { Reviews, Author } from '../../utils/types';

type Props = {
  title: string;
  createdAt: string;
  updatedAt?: string;
  author: Author;
  url: string;
  reviews: Reviews;
  repositoryName: string;
  isDraft: boolean;
}

const SmallPullRequestCard: FunctionComponent<Props> = (props: Props) => {
  const {
    title,
    createdAt,
    updatedAt,
    author,
    url,
    reviews,
    repositoryName,
    isDraft,
  } = props;

  const approvedReviews = getApprovedReviews(reviews);
  const commentsReviews = getCommentedReviews(reviews);

  const containReviews = !!approvedReviews.length || !!commentsReviews.length;
  const cardTitle = isDraft ? `🔧 DRAFT - ${title}` : title;

  return (
      <Card
        title={cardTitle}
        createdAt={createdAt}
        updatedAt={updatedAt}
        authorName={author.login}
        authorAvatar={author.avatarUrl}
        repositoryName={repositoryName}
        prUrl={url}
      >
        {
          containReviews && (
            <Box display='flex' width='100%' marginY={1}>
              {!!approvedReviews.length && (
                <Box marginX={1}>
                  <Chip
                    color='secondary'
                    variant='outlined'
                    size='small'
                    label={`${approvedReviews.length} approvals 👍`}
                  />
                </Box>
              )}
              {!!commentsReviews.length && (
                <Chip
                  color='primary'
                  variant='outlined'
                  size='small'
                  label={`${commentsReviews.length} comments 💬`}
                />
              )}
            </Box>
          )
        }
    </Card>
  );
};

export default SmallPullRequestCard;
