import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import { Card } from '@material-ui/core';
import { Link, useApi, githubAuthApiRef } from '@backstage/core';

/**
 * Show a issue counter for a docs site
 */

type GitHubIssuesProps = {
  attachTo: HTMLElement;
};

export const GitHubIssuesPlugin = ({ attachTo }: GitHubIssuesProps) => {
  const [githubToken, setGithubToken] = useState<string | undefined>();
  const githubApi = useApi(githubAuthApiRef);

  const handleGheSignIn = async () => {
    setGithubToken(await githubApi.getAccessToken('repo'));
  };

  const getGithubIssueCount = () => {

  };

  return ReactDOM.createPortal(
    <Card data-testid="issues-container">
      {repoInfo.hasToken ? (
        <Link
          to={`https://ghe.spotify.net/${org}/${repo}/${
            issuesEnabled ? 'issues' : 'settings'
          }`}
          target="_blank"
        >
          <h4 data-testid="issue-counter">
            {issuesEnabled ? totalIssues : 'not enabled'}
          </h4>
          <h4>Open Issues</h4>
        </Link>
      ) : (
        <div>
          <h4>Open Issues</h4>
          <button onClick={() => handleGheSignIn()} data-testid="issue-counter">
            Sign in to GitHub
          </button>
        </div>
      )}
    </Card>,
    attachTo,
  );
};
