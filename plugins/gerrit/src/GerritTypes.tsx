export type GerritChange = {
  subject: string;
  owner: {
    _account_id: string;
    name: string;
  };
  reviewers: {
    REVIEWER: []
  }
  project: string;
  branch: string;
  created: string;
  updated: string;
  status: string;
  change_id: string;
  _number: string;
  total_comment_count: string;
  unresolved_comment_count: string;
  insertions: 0;
  deletions: 0;
  labels: {
    "Code-Review": { approved: string };
    "Commit-Message": { approved: string };
    Verified: { approved: string };
  }
}

export type DenseTableProps = {
  gerritChangesList: GerritChange[];
  tableTitle: any;
  repoView?: boolean;
};

export type GerritReviewProps = {
  request: string;
  tableTitle: string;
};