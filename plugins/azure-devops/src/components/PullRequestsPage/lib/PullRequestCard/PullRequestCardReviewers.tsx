/*
 * Copyright 2021 The Backstage Authors
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

import { PullRequestCardReviewer } from './PullRequestCardReviewer';
import React from 'react';
import { Reviewer } from '@backstage/plugin-azure-devops-common';
import { reviewerFilter } from '../utils';
import { styled } from '@material-ui/core/styles';

const PullRequestCardReviewersContainer = styled('div')({
  '& > *': {
    marginTop: 4,
    marginBottom: 4,
  },
});

type PullRequestCardReviewersProps = {
  reviewers: Reviewer[];
};

export const PullRequestCardReviewers = ({
  reviewers,
}: PullRequestCardReviewersProps) => (
  <PullRequestCardReviewersContainer>
    {reviewers.filter(reviewerFilter).map(reviewer => (
      <PullRequestCardReviewer key={reviewer.id} reviewer={reviewer} />
    ))}
  </PullRequestCardReviewersContainer>
);
