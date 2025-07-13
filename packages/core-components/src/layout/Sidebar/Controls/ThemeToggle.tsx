

import { IconButton, Tooltip, makeStyles } from '@material-ui/core';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import { useApi, appThemeApiRef } from '@backstage/core-plugin-api';
import useObservable from 'react-use/lib/useObservable';

const useStyles = makeStyles(theme => ({
  button: {
    color: theme.palette.navigation.color,
    width: '40px',
    height: '40px',
  },
}));

export const ThemeToggle = () => {
  const classes = useStyles();
  const appThemeApi = useApi(appThemeApiRef);
  const themeId = useObservable(
    appThemeApi.activeThemeId$(),
    appThemeApi.getActiveThemeId(),
  );

  const isDark = themeId === 'dark';

  const handleToggle = () => {
    appThemeApi.setActiveThemeId(isDark ? 'light' : 'dark');
  };

  return (
    <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} theme`}>
      <IconButton 
        onClick={handleToggle} 
        className={classes.button}
        size="small"
      >
        {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
}; 