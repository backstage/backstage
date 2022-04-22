import React, { FunctionComponent } from 'react';
import { getApprovedReviews, getChangeRequests, getCommentedReviews } from '../../utils/functions';
import { Reviews, Author } from '../../utils/types';
import { Card } from '../Card';
import { UserHeaderList } from '../UserHeaderList';

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

const PullRequestCard: FunctionComponent<Props> = (props: Props) => {
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
  const changeRequests = getChangeRequests(reviews);

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
      {!!approvedReviews.length && (
        <UserHeaderList label='👍' users={approvedReviews.map(({ author: reviewAuthor }) => reviewAuthor)}/>
      )}
      {!!commentsReviews.length && (
        <UserHeaderList
          label='💬'
          users={commentsReviews.map(({ author: reviewAuthor }) => reviewAuthor)}
        />
      )}
      {!!changeRequests.length && (
        <UserHeaderList label='🚧' users={changeRequests.map(({ author: reviewAuthor }) => reviewAuthor)}/>
      )}
    </Card>
  );
};

export default PullRequestCard;
