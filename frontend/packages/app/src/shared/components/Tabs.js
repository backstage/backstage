import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { toClass } from 'recompose';
import { Button } from '@material-ui/core';
import { COLORS } from 'core/app/Themes';

// NavLink is a stateless functional component. Due to a peculiarity in React, we can't use it as
// the container element for something else, because then we'll get a console warning that it's not
// possible to put refs on stateless functional components. So we use this handy toClass helper to
// turn the link into a proper class.
const NavLinkAsClass = toClass(NavLink);

const styles = {
  tabs: {
    position: 'relative',
    lineHeight: 0,
    boxShadow: '0 7px 9px -9px rgba(0,0,0,0.5)',
    marginBottom: '16px',
  },
  tab: {
    display: 'inline-block',
  },
  label: {
    color: '#509BF5',
  },
};

// project-infinite-sharks - This should be removed in favor of MUI Tabs
export const Tabs = ({ children }) => <div style={styles.tabs}>{children}</div>;

export const _Tab = ({ label, path, exact, match, onClick }) => (
  <NavLinkAsClass
    to={`${match.url}${path}`}
    exact={!!exact}
    onClick={onClick}
    style={styles.tab}
    activeStyle={{
      borderBottom: `4px solid ${COLORS.COMPONENT_TYPES.SERVICE}`,
    }}
  >
    <Button style={styles.label}>{label}</Button>
  </NavLinkAsClass>
);

export const Tab = withRouter(_Tab);
