

import { IconButton, Tooltip, makeStyles } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const useStyles = makeStyles(theme => ({
  button: {
    color: theme.palette.navigation.color,
    width: '40px',
    height: '40px',
  },
}));

export interface SidebarToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const SidebarToggle = ({ isCollapsed, onToggle }: SidebarToggleProps) => {
  const classes = useStyles();

  return (
    <Tooltip title={`${isCollapsed ? 'Expand' : 'Collapse'} sidebar`}>
      <IconButton 
        onClick={onToggle} 
        className={classes.button}
        size="small"
      >
        {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </IconButton>
    </Tooltip>
  );
}; 
