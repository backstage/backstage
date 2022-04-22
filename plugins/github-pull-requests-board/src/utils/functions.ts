import { Entity } from '@backstage/catalog-model';
import moment from 'moment';
import { Reviews, PullRequests, ReviewDecision, PullRequestsColumn, Author } from './types';
import { COLUMNS } from './constants';

const GITHUB_PULL_REQUESTS_ANNOTATION = 'github.com/project-slug';


export const getProjectNameFromEntity = (entity: Entity): string => {
  return entity?.metadata.annotations?.[GITHUB_PULL_REQUESTS_ANNOTATION] ?? '';
};

export const getApprovedReviews = (reviews: Reviews = []): Reviews => {
  return reviews.filter(({ state }) => state === 'APPROVED');
};

export const getCommentedReviews = (reviews: Reviews = []): Reviews => {
  return reviews.filter(({ state }) => state === 'COMMENTED');
};
export const getChangeRequests = (reviews: Reviews = []): Reviews => {
  return reviews.filter(({ state }) => state === 'CHANGES_REQUESTED');
};

export const filterSameUser = (users: Author[]): Author[] => {
  return users.reduce((acc, curr) => {
    const contaisUser = acc.find(({ login }) => login === curr.login);

    if(!contaisUser) {
      return [ ...acc, curr ];
    }

    return acc;
  }, [] as Author[]);
}

export const getElapsedTime = (start: string): string => {
  return moment(start).fromNow();
};

export const formatPRsByReviewDecision = (prs: PullRequests): PullRequestsColumn[] => {
  const reviewDecisions = prs.reduce((acc, curr) => {
    const decision = curr.reviewDecision || 'REVIEW_REQUIRED';

    if(decision !== 'APPROVED' && curr.latestReviews.nodes.length === 0) {
      return {
        ...acc,
        REVIEW_REQUIRED: [...acc.REVIEW_REQUIRED, curr]
      }
    }

    if(decision !== 'APPROVED' && curr.latestReviews.nodes.length > 0) {
      return {
        ...acc,
        IN_PROGRESS: [...acc.IN_PROGRESS, curr]
      }
    }

    if(decision === 'APPROVED') {
      return {
        ...acc,
        APPROVED: [...acc.APPROVED, curr]
      }
    }

    return acc;
  }, {
    REVIEW_REQUIRED: [],
    IN_PROGRESS: [],
    APPROVED: []
  } as Record<ReviewDecision, PullRequests>);

  return [
    { title: COLUMNS.REVIEW_REQUIRED, content: reviewDecisions.REVIEW_REQUIRED },
    { title: COLUMNS.REVIEW_IN_PROGRESS, content: reviewDecisions.IN_PROGRESS },
    { title: COLUMNS.APPROVED, content: reviewDecisions.APPROVED },
  ];
};