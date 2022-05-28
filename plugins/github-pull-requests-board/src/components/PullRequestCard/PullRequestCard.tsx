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
import React, { FunctionComponent } from 'react';
import {
  getApprovedReviews,
  getChangeRequests,
  getCommentedReviews,
} from '../../utils/functions';
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
};

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
        <UserHeaderList
          label="👍"
          users={approvedReviews.map(
            ({ author: reviewAuthor }) => reviewAuthor,
          )}
        />
      )}
      {!!commentsReviews.length && (
        <UserHeaderList
          label="💬"
          users={commentsReviews.map(
            ({ author: reviewAuthor }) => reviewAuthor,
          )}
        />
      )}
      {!!changeRequests.length && (
        <UserHeaderList
          label="🚧"
          users={changeRequests.map(({ author: reviewAuthor }) => reviewAuthor)}
        />
      )}
    </Card>
  );
};

export default PullRequestCard;
