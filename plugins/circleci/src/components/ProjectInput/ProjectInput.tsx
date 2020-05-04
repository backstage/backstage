import { useState, FC } from "react";
import { List, ListItem, TextField, Button } from "@material-ui/core";
import React from "react";

export const ProjectInput:FC<{
    setGitInfo: (info: {owner: string, repo: string}) => void
  }> = ({setGitInfo}) => {
    
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  
  return (
    <List>
      <ListItem>
        <TextField
          name="circleci-owner"
          label="Owner"
          value={owner}
          onChange={e => setOwner(e.target.value)}
        />
      </ListItem>
      <ListItem>
        <TextField
          name="circleci-repo"
          label="Repo"
          value={repo}
          onChange={e => setRepo(e.target.value)}
        />
      </ListItem>
      <ListItem>
        <Button
          data-testid="load-build-button"
          variant="outlined"
          color="primary"
          onClick={() => setGitInfo({ owner, repo })}
        >
          Load
        </Button>
      </ListItem>
    </List>
  );
};