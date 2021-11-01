import { IndexableDocument, DocumentCollator } from '@backstage/search-common';
import { Config } from '@backstage/config';
// import { Logger } from 'winston';
import { GitHubIssueApi, GitHubIssueApiEntity } from './types/api';
import { GitHubIssuesClient } from './utilities/GitHubIssuesClient';

export interface GitHubIssueEntityDocument extends IndexableDocument {
  user: string;
  image: string;
}

export class DefaultGitHubIssuesCollator implements DocumentCollator {
  public readonly type: string = 'github-issue';
  protected readonly githubIssuesClient: GitHubIssueApi;
  // protected logger: Logger;

  static fromConfig(
    _config: Config,
    // options: {
    //   logger: Logger;
    // },
  ) {
    return new DefaultGitHubIssuesCollator({
      // ...options,
    });
  }

  constructor({
    githubIssuesClient,
  }: {
    githubIssuesClient?: GitHubIssueApi;
  }) {
    this.githubIssuesClient = githubIssuesClient || new GitHubIssuesClient();
  }

  async execute() {
    const response = await this.githubIssuesClient.getIssues(
      'backstage/backstage',
    );
    // this.logger.warn(JSON.stringify(response));
    return response.map(
      (ghIssue: GitHubIssueApiEntity): GitHubIssueEntityDocument => {
        return {
          location: ghIssue.html_url,
          text: ghIssue.body,
          title: ghIssue.title,
          user: ghIssue.user.login,
          image: ghIssue.user.avatar_url,
        };
      },
    );
  }
}
