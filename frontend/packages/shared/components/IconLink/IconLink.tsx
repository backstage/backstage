import React, { FC } from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import classNames from 'classnames';
import { Link } from '../';

const useStyles = makeStyles(theme => ({
  listItem: {
    listStyle: 'none',
    display: 'inline-block',
    maxWidth: 70,
    margin: theme.spacing(0, 2, 0, 0),
  },
  link: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    color: '#2e77d0',
    '& > span': {
      lineHeight: 1.4,
      fontSize: 12,
      fontWeight: 'bold',
    },
  },
  linkIcon: {
    width: 'auto',
    height: 24,
    margin: theme.spacing(0, 0, 0.5),
    '& > svg': {
      fill: '#2e77d0',
      width: 'auto',
      height: 24,
    },
  },
  disabled: {
    pointerEvents: 'none',
    '& a': {
      color: '#BDBDBD',
    },
    '& svg': {
      fill: '#BDBDBD',
    },
  },
}));

type LinkProps = {
  to?: string;
  email?: string;
  slackChannel?: string;
  slackUser?: string;
  gaprops?: {
    label: string;
    value: number;
  };
  highlight?: 'always' | 'hover' | 'none';
  classes?: any;
};
type IconLinkProps = LinkProps & {
  disabled?: boolean;
  label: string;
};
const IconLink: FC<IconLinkProps> = ({ children, disabled, label, ...props }) => {
  const classes = useStyles();

  return (
    <li className={classNames(classes.listItem, { [classes.disabled]: disabled })}>
      <Link target="_blank" {...props} className={classes.link}>
        <div className={classes.linkIcon}>{children}</div>
        {label && <Typography variant="button">{label}</Typography>}
      </Link>
    </li>
  );
};

export default IconLink;
