import React, { Fragment } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import HelpIcon from '@material-ui/icons/HelpOutline';
import { withState } from 'recompose';
import Link from 'shared/components/Link';

const styles = {
  root: {
    paddingLeft: 5,
    paddingBottom: 10,
    paddingTop: 5,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    cursor: 'pointer',
  },
  title: {
    margin: '10px 0',
    display: 'inline-block',
  },
  nested: {
    paddingLeft: 10,
    marginLeft: 13,
    borderLeft: '1px solid #ccc',
  },
  collapsibleContainer: {
    overflow: 'hidden',
  },
  collapsible: {
    transform: 'translateY(0%)',
    transition: 'transform .3s ease-in-out',
  },
  collapsed: {
    transform: 'translateY(-100%)',
    height: 0,
  },
  expandIcon: {
    transition: 'transform .3s ease-in',
    transform: 'rotate(0deg)',
    fontSize: 20,
    color: '#777',
  },
  expandLessIcon: {
    transform: 'rotate(180deg)',
  },
  divider: {
    borderTop: '1px solid #BDBDBD',
  },
  helpIcon: {
    color: '#000',
    fontSize: 16,
    display: 'inline-block',
    verticalAlign: 'middle',
    marginLeft: 5,
  },
};

const FilterSet = ({
  classes,
  collapsed,
  helpUrl,
  isCollapsible,
  isNested,
  children,
  title,
  toggleCollapse,
  hideBorder,
}) => (
  <Fragment>
    <div
      className={classNames(classes.root, { [classes.nested]: isNested, [classes.divider]: !isNested && !hideBorder })}
    >
      {title && (
        <div
          role="button"
          tabIndex={0}
          className={classes.header}
          onClick={() => isCollapsible && toggleCollapse(!collapsed)}
          onKeyPress={() => isCollapsible && toggleCollapse(!collapsed)}
        >
          <div>
            <h5 className={classes.title}>{title}</h5>
            {helpUrl && (
              <Link to={helpUrl} onClick={e => e.stopPropagation()}>
                <HelpIcon className={classes.helpIcon} />
              </Link>
            )}
          </div>
          {isCollapsible && (
            <ExpandMoreIcon className={classNames(classes.expandIcon, { [classes.expandLessIcon]: collapsed })} />
          )}
        </div>
      )}
      <div className={classNames({ [classes.collapsibleContainer]: isCollapsible })}>
        <div className={classNames(classes.collapsible, { [classes.collapsed]: collapsed })}>{children}</div>
      </div>
    </div>
  </Fragment>
);

export default withState('collapsed', 'toggleCollapse', false)(withStyles(styles)(FilterSet));
