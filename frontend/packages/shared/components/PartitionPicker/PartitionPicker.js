import React from 'react';
import { TextField, withStyles, Icon } from '@material-ui/core';
import moment from 'moment';

const HOURS_PARTITIONING = 'HOURS';

const iconBaseStyles = {
  opacity: 0.5,
  '&:hover': {
    transform: 'scale(1.2)',
  },
};

const styles = {
  leftIcon: {
    ...iconBaseStyles,
    marginRight: '10px',
  },
  rightIcon: {
    ...iconBaseStyles,
    marginLeft: '10px',
  },
  datepicker: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '5px',
  },
};

const dateStyles = {
  fontSize: '24px',
};

export const isHoursPartitioning = p => p === HOURS_PARTITIONING;

export const getPartitionFromUtc = m => `${m.format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS)}Z`;

export const getInputTypeFromPartitioning = partitioning =>
  isHoursPartitioning(partitioning) ? 'datetime-local' : 'date';

export const formatMomentForDatePicker = (m, partitioning) =>
  m
    .utc()
    .startOf('hour')
    .format(isHoursPartitioning(partitioning) ? moment.HTML5_FMT.DATETIME_LOCAL : moment.HTML5_FMT.DATE);

const PartitionPicker = ({ partition, partitioning, handlePartitionChange, setPartition, classes }) => {
  const updatePartition = increment => {
    const updated = moment(partition)
      .utc()
      .clone()
      .add(increment ? 1 : -1, isHoursPartitioning(partitioning) ? 'hours' : 'days');
    setPartition(getPartitionFromUtc(updated));
  };

  return (
    <div className={classes.datepicker}>
      <Icon className={classes.leftIcon} onClick={() => updatePartition(false)}>
        chevron_left
      </Icon>
      <TextField
        id="partition-select"
        type={getInputTypeFromPartitioning(partitioning)}
        onChange={handlePartitionChange}
        inputProps={{ style: dateStyles }}
        value={formatMomentForDatePicker(moment(partition), partitioning)}
      />
      <Icon className={classes.rightIcon} onClick={() => updatePartition(true)}>
        chevron_right
      </Icon>
    </div>
  );
};

export default withStyles(styles)(PartitionPicker);
