import React, { useEffect, useState, FC, Suspense } from 'react';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
} from '@material-ui/core';
import moment from 'moment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import { BuildStepAction } from 'circleci-api';

const LazyLog = React.lazy(() => import('react-lazylog/build/LazyLog'));
moment.relativeTimeThreshold('ss', 0);
const useStyles = makeStyles({
  expansionPanelDetails: {
    padding: 0,
  },
  button: {
    order: -1,
    marginRight: 0,
    // FIXME: how not to hardcode this
    marginLeft: '-20px',
  },
});

export const ActionOutput: FC<{
  url: string;
  name: string;
  className?: string;
  action: BuildStepAction;
}> = ({ url, name, className, action }) => {
  const classes = useStyles();

  const [messages, setMessages] = useState([]);
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((actionOutput) => {
        actionOutput &&
          setMessages(
            actionOutput.map(({ message }: { message: string }) => message),
          );
      });
  }, [url]);

  const timeElapsed = moment
    .duration(
      moment(action.end_time || moment()).diff(moment(action.start_time)),
    )
    .humanize();
  return (
    <ExpansionPanel
      TransitionProps={{ unmountOnExit: true }}
      className={className}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-${name}-content`}
        id={`panel-${name}-header`}
        IconButtonProps={{
          className: classes.button,
        }}
      >
        <Typography variant="button">
          {name} ({timeElapsed})
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.expansionPanelDetails}>
        {messages.length === 0 ? (
          'Nothing here...'
        ) : (
          <Suspense fallback="...">
            <div style={{ height: '20vh', width: '100%' }}>
              <LazyLog text={messages.join('\n')} extraLines={1} enableSearch />
            </div>
          </Suspense>
        )}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
