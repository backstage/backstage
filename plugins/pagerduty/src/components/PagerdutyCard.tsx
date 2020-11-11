import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Link,
  makeStyles,
} from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import classnames from 'classnames';
import Pagerduty from '../assets/pd.svg';
import PagerdutyIcon from './Pd';

// TODO: create a general component to use it in pagerduty and aboutCard

const useStyles = makeStyles(theme => ({
  links: {
    margin: theme.spacing(2, 0),
    display: 'grid',
    gridAutoFlow: 'column',
    gridAutoColumns: 'min-content',
    gridGap: theme.spacing(3),
  },
  link: {
    display: 'grid',
    justifyItems: 'center',
    gridGap: 4,
    textAlign: 'center',
  },
  label: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    fontWeight: 600,
    letterSpacing: 1.2,
  },
  trigger: {
    color: theme.palette.secondary.main,
  },
  svgButtonImage: {
    height: '1.5em',
    color: theme.palette.primary.main,
  },
}));

type SubHeaderProps = {
  ViewPagerduty: { title: string; href: string };
  TriggerAlarm: { title: string; action: React.ReactNode };
};

type PagerdutyCardProps = {
  title: string;
  subheader: SubHeaderProps;
  content: React.ReactNode;
};

type VerticalIconProps = {
  label: string;
  href?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
};

const VerticalIcon = ({
  label,
  href,
  icon = <LinkIcon />,
  action,
}: VerticalIconProps) => {
  const classes = useStyles();
  if (action) {
    return (
      <>
        <Link className={classnames(classes.link, classes.trigger)} href={href}>
          {icon}
          {action}
        </Link>
      </>
    );
  }
  return (
    <>
      <Link className={classes.link} href={href}>
        {icon}
        <span className={classes.label}>{label}</span>
      </Link>
    </>
  );
};
export const PagerdutyCard = ({
  title,
  subheader,
  content,
}: PagerdutyCardProps) => {
  const classes = useStyles();
  const getSubheader = ({ ViewPagerduty, TriggerAlarm }: SubHeaderProps) => {
    return (
      <nav className={classes.links}>
        <VerticalIcon
          label={ViewPagerduty.title}
          href={ViewPagerduty.href}
          icon={
            // <LinkIcon />
            // <img
            //   src={Pagerduty}
            //   alt="View in PagerDuty"
            //   className={classes.svgButtonImage}
            // />
            <PagerdutyIcon viewBox="0 0 100 100" />
          }
        ></VerticalIcon>
        <VerticalIcon
          label={TriggerAlarm.title}
          icon={<ReportProblemIcon />}
          action={TriggerAlarm.action}
        ></VerticalIcon>
      </nav>
    );
  };

  return (
    <Card>
      <CardHeader
        title={title}
        subheader={getSubheader(subheader)}
      ></CardHeader>
      <Divider />
      <CardContent>{content}</CardContent>
    </Card>
  );
};
