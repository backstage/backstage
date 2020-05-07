import { useState, FC, useEffect } from 'react';
import { ListItem, TextField, Button } from '@material-ui/core';
import React from 'react';

export const ProjectInput: FC<{
  setGitInfo: (info: { owner: string; repo: string }) => void;
  apiGitInfo?: { owner?: string; repo?: string };
}> = ({ setGitInfo, apiGitInfo = {} }) => {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');

  useEffect(() => {
    if (apiGitInfo.owner !== owner && apiGitInfo.owner)
      setOwner(apiGitInfo.owner);
    if (apiGitInfo.repo !== repo && apiGitInfo.repo) setRepo(apiGitInfo.repo);
  }, [apiGitInfo]);

  return (
    <>
      <ListItem>
        <TextField
          name="circleci-owner"
          label="Owner"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
        />
      </ListItem>
      <ListItem>
        <TextField
          name="circleci-repo"
          label="Repo"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
        />
      </ListItem>
      <ListItem>
        <Button
          data-testid="load-build-button"
          variant="outlined"
          color="primary"
          onClick={() => setGitInfo({ owner, repo })}
        >
          Save
        </Button>
      </ListItem>
    </>
  );
};
