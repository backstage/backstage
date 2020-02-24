import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { BuildStatus } from '../../apis/builds';
import FailureIcon from '@material-ui/icons/Error';
import SuccessIcon from '@material-ui/icons/CheckCircle';
import ProgressIcon from '@material-ui/icons/Autorenew';
import UnknownIcon from '@material-ui/icons/Help';
import { IconComponent } from '@spotify-backstage/core';

type Props = {
  status?: BuildStatus;
};

type StatusStyle = {
  icon: IconComponent;
  color: string;
};

const styles: { [key in BuildStatus]: StatusStyle } = {
  [BuildStatus.Null]: {
    icon: UnknownIcon,
    color: '#f49b20',
  },
  [BuildStatus.Success]: {
    icon: SuccessIcon,
    color: '#1db855',
  },
  [BuildStatus.Failure]: {
    icon: FailureIcon,
    color: '#CA001B',
  },
  [BuildStatus.Pending]: {
    icon: UnknownIcon,
    color: '#5BC0DE',
  },
  [BuildStatus.Running]: {
    icon: ProgressIcon,
    color: '#BEBEBE',
  },
};

const useStyles = makeStyles<Theme, StatusStyle>({
  icon: style => ({
    color: style.color,
  }),
});

const BuildStatusIndicator: FC<Props> = props => {
  const { status } = props;
  const style = (status && styles[status]) || styles[BuildStatus.Null];

  const classes = useStyles(style);

  const IconComponent = style.icon;

  return (
    <div className={classes.icon}>
      <IconComponent />
    </div>
  );
};

export default BuildStatusIndicator;
