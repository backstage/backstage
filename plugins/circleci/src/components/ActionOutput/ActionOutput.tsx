import React, { useEffect, useState, FC } from 'react';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { BuildStepAction } from 'circleci-api';

export const ActionOutput: FC<{
  url: string;
  name: string;
  action: BuildStepAction;
}> = ({ url, name }) => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(actionOutput => {
        actionOutput &&
          setMessages(
            actionOutput.map(({ message }: { message: string }) => message),
          );
      });
  }, [url]);
  console.log(messages);
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{name}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {messages.length === 0
          ? 'Nothing here...'
          : messages.map(message => (
              <p style={{ whiteSpace: 'pre-wrap' }}>{message}</p>
            ))}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
