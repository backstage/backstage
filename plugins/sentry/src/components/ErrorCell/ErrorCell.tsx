import React, { FC } from 'react';
import { SentryIssue } from '../../data/sentry-issue';
import { Link, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { BackstageTheme } from '@backstage/theme';

function stripText(text: string, maxLength: number) {
  return text.length > maxLength ? `${text.substr(0, maxLength)}...` : text;
}
const useStyles = makeStyles<BackstageTheme>(theme => ({
  root: {
    minWidth: 260,
    position: 'relative',
    '&::before': {
      left: -16,
      position: 'absolute',
      width: '4px',
      height: '100%',
      content: '""',
      backgroundColor: theme.palette.status.error,
      borderRadius: 2,
    },
  },
  text: {
    marginBottom: 0,
  },
}));

export const ErrorCell: FC<{ sentryIssue: SentryIssue }> = ({
  sentryIssue,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Link href={sentryIssue.permalink}>
        <Typography variant="body1" gutterBottom className={classes.text}>
          {sentryIssue.metadata.type
            ? stripText(sentryIssue.metadata.type, 28)
            : '[No type]'}
        </Typography>
      </Link>
      <Typography
        variant="caption"
        display="block"
        gutterBottom
        className={classes.text}
      >
        {sentryIssue.metadata.value &&
          stripText(sentryIssue.metadata.value, 48)}
      </Typography>
    </div>
  );
};
