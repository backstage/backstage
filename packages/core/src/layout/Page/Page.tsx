import React, { FC } from 'react';
import { PageTheme, pageTheme } from './PageThemeProvider';
import { makeStyles } from '@material-ui/core';

export const Theme = React.createContext<PageTheme>(pageTheme.service);

const useStyles = makeStyles(() => ({
  root: {
    display: 'grid',
    gridTemplateAreas:
      "'pageHeader pageHeader pageHeader' 'pageSubheader pageSubheader pageSubheader' 'pageNav pageContent pageSidebar'",
    gridTemplateRows: 'auto auto 1fr',
    gridTemplateColumns: 'auto 1fr auto',
    minHeight: '100%',
  },
}));

type Props = {
  theme?: PageTheme;
};

const Page: FC<Props> = ({ theme = pageTheme.home, children }) => {
  const classes = useStyles();
  return (
    <Theme.Provider value={theme}>
      <div className={classes.root}>{children}</div>
    </Theme.Provider>
  );
};

export default Page;
