import { GitHubIssueApi, GitHubIssueApiEntity } from '../types/api';
import fetch from 'cross-fetch';
import { mockGitHubData } from '../mock-data/api-limit-mock';

export class GitHubIssuesClient implements GitHubIssueApi {
  async getIssues(repoName: String): Promise<GitHubIssueApiEntity[]> {
    let response = await fetch(
      `https://api.github.com/repos/${repoName}/issues`,
    );

    if (response.status !== 200) {
      // Sending Mockup Data for API rate limit reached.
      return mockGitHubData;
    }
    return response.json();
  }
}
