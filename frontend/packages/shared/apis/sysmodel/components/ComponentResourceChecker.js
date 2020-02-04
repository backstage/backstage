import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { withGheAuth } from 'shared/auth/GheComposable';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import Progress from 'shared/components/Progress';
import TugApi from 'plugins/tugboat/lib/TugApi';
import useResourceChecker from 'shared/apis/sysmodel/hooks/useResourceChecker';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    marginTop: theme.spacing(2),
    marginLeft: 0,
    marginRight: 0,
  },
  icon: {
    height: theme.spacing(5),
    width: theme.spacing(5),
    marginRight: theme.spacing(1),
  },
  warningIcon: {
    color: theme.palette.status.warning,
  },
  errorIcon: {
    color: theme.palette.status.error,
  },
}));

const ComponentResourceChecker = ({ componentType, componentId, roles, gheApi }) => {
  const classes = useStyles();
  const tugboatApi = React.useMemo(() => new TugApi(gheApi), [gheApi]);
  const [loading, error, { instanceCount, machineCount, hasUniqueRoles }] = useResourceChecker({
    componentId,
    componentType,
    roles,
    tugboatApi,
  });

  if (loading) {
    return <Progress />;
  }

  if (error) {
    return (
      <div className={classes.container}>
        <ErrorIcon className={`${classes.icon} ${classes.errorIcon}`} />
        {error.message}
      </div>
    );
  }

  if (!instanceCount && !machineCount) {
    return null;
  }

  const message = [
    `Note that this service has ${instanceCount} running container instances`,
    hasUniqueRoles ? ` and ${machineCount} machines provisioned in CPM` : '',
    '.',
  ].join('');

  return (
    <div className={classes.warningContainer}>
      <WarningIcon className={`${classes.icon} ${classes.warningIcon}`} />
      {message}
    </div>
  );
};

ComponentResourceChecker.propTypes = {
  componentType: PropTypes.string.isRequired,
  componentId: PropTypes.string.isRequired,
  roles: PropTypes.arrayOf(PropTypes.object),
};

export default withGheAuth()(ComponentResourceChecker);
