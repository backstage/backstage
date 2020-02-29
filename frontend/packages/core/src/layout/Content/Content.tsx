import React, { FC } from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    gridArea: 'pageContent',
    minWidth: 0,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    ...theme.mixins.gutters({}),
  },
  centered: {
    maxWidth: 1600,
    justifySelf: 'center',
  },
  centerWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  centerContent: {
    width: '100%',
    maxWidth: 1600,
  },
}));

type Props = {
  centered?: boolean;
  className?: string;
};

const Content: FC<Props> = ({ centered = false, className = '', children, ...props }) => {
  const classes = useStyles();

  if (centered) {
    return (
      <article {...props} className={classNames(classes.root, className, classes.centerWrapper)}>
        <div className={classes.centerContent}>{children}</div>
      </article>
    );
  }

  return (
    <article {...props} className={classNames(classes.root, className)}>
      {children}
    </article>
  );
};

export default Content;
