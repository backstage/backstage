export type GitHubUserEntity = {
  login: string;
  avatar_url: string;
};

export type GitHubIssueApiEntity = { //using this to map API data locally.
  url: string;
  html_url: string;
  title: string;
  body: string;
  user: GitHubUserEntity;
};

export interface GitHubIssueApi {
  getIssues(repoName: String): Promise<GitHubIssueApiEntity[]>;
}
