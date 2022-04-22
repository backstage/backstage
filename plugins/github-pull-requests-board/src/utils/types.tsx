export type GraphQlPullRequest<T> = {
  repository: {
    pullRequest: T
  }
}

export type GraphQlPullRequests<T> = {
  repository: {
    pullRequests: {
      edges: T
    }
  }
}

export type PullRequestsNumber = {
  node: {
    number: number;
  }
}

export type Review = {
  state:
  | 'PENDING'
  | 'COMMENTED'
  | 'APPROVED'
  | 'CHANGES_REQUESTED'
  | 'DISMISSED';
  author: Author;
};

export type Reviews = Review[];

export type Author = {
  login: string;
  avatarUrl: string;
  id: string;
  email: string;
  name: string;
};

export type PullRequest = {
  id: string;
  repository: {
    name: string;
  };
  title: string;
  url: string;
  lastEditedAt: string;
  latestReviews: {
    nodes: Reviews;
  };
  mergeable: boolean;
  state: string;
  reviewDecision: ReviewDecision | null;
  isDraft: boolean;
  createdAt: string;
  author: Author
};

export type PullRequests = PullRequest[];

export type PullRequestsColumn = {
  title: string;
  content: PullRequests;
};

export type PRCardFormating = 'compacted' | 'fullscreen' | 'draft';

export type ReviewDecision = 'IN_PROGRESS' | 'APPROVED' | 'REVIEW_REQUIRED'