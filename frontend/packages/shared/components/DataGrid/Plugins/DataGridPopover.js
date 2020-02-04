import React, { useContext } from 'react';
import { Popover, Typography, withStyles } from '@material-ui/core';
import DataGridContext from 'shared/components/DataGrid/Plugins/DataGridContext';

const styles = theme => ({
  typography: {
    margin: theme.spacing(1),
  },
  popover: {
    fontSize: '0.8125rem',
    marginLeft: theme.spacing(-1), // aligns the popover text with the cell text
  },
});

export function DataGridPopover({ classes }) {
  const { popoverAnchorEl, popoverValue, setPopoverAnchorEl, setPopoverValue } = useContext(DataGridContext);
  const open = Boolean(popoverAnchorEl);

  const handleClose = () => {
    setPopoverAnchorEl(null);
    setPopoverValue(null);
  };

  return (
    <Popover
      data-testid="data-grid-popover"
      className={classes.popover}
      open={open}
      anchorEl={popoverAnchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'left',
      }}
    >
      <Typography className={classes.typography}>{popoverValue}</Typography>
    </Popover>
  );
}

export default withStyles(styles)(DataGridPopover);
