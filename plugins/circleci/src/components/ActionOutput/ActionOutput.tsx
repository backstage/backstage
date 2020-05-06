import React, { useEffect, useState, FC, Suspense } from 'react';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { BuildStepAction } from 'circleci-api';

const LazyLog = React.lazy(() => import('react-lazylog/build/LazyLog'));

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
  return (
    <ExpansionPanel TransitionProps={{ unmountOnExit: true }}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${name}-content`}
        id={`panel-${name}-header`}
      >
        <Typography>{name}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {messages.length === 0 ? (
          'Nothing here...'
        ) : (
          <Suspense fallback="...">
            <div style={{ height: '200px', width: '100%' }}>
              <LazyLog text={messages.join('\n')} extraLines={1} enableSearch />
            </div>
          </Suspense>
        )}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
