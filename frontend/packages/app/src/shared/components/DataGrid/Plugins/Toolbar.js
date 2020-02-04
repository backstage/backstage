import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { Plugin, Template, TemplatePlaceholder } from '@devexpress/dx-react-core';
import {
  CardHeader,
  Checkbox,
  Icon,
  ListItem,
  List,
  ListItemText,
  Popover,
  Toolbar as ToolbarMUI,
  withStyles,
} from '@material-ui/core';
import IconButton from 'shared/components/IconButton';
import { sendGAEvent, getGAContext } from 'shared/apis/events';
import GoogleAnalyticsEvent, {
  GA_DEFAULT_PLUGIN_OWNER,
  GA_DEFAULT_PLUGIN_ID,
} from 'shared/apis/events/GoogleAnalyticsEvent';
import { withPluginContext } from 'core/app/withPluginContext';

const BoldHeader = withStyles({ title: { fontWeight: '700' } })(CardHeader);

const styles = theme => ({
  checkbox: {
    width: 'auto',
    height: 'auto',
  },
  columnName: {
    textTransform: 'capitalize',
  },
  toolbar: {
    '& > *': {
      marginLeft: theme.spacing(1),
    },
    '& > *:first-child': {
      marginLeft: 0,
    },
    '& > *:last-child': {
      marginLeft: 'auto',
    },
  },
});

class Toolbar extends Component {
  static defaultProps = {
    manualVisibility: true,
  };

  static propTypes = {
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        alwaysVisible: PropTypes.bool,
      }),
    ),
    hidden: PropTypes.arrayOf(PropTypes.string),
    manualVisibility: PropTypes.bool,
    toggleHiddenColumn: PropTypes.func,
  };

  state = {
    menuOpen: false,
    anchorEl: null,
  };

  button = null;

  openMenu = () => {
    this.setState({ anchorEl: findDOMNode(this.button), menuOpen: true });
  };

  closeMenu = () => {
    this.setState({ menuOpen: false });
  };

  toggleColumn = name => {
    const { plugin, toggleHiddenColumn, hidden } = this.props;
    toggleHiddenColumn(name);
    sendGAEvent(
      plugin && plugin.id ? plugin.id : GA_DEFAULT_PLUGIN_ID,
      GoogleAnalyticsEvent.BTN_CLICK,
      `Toggle ${name} column`,
      hidden.includes(name) ? 1 : 0,
      plugin && plugin.owner ? plugin.owner : GA_DEFAULT_PLUGIN_OWNER,
      getGAContext(this),
    );
  };

  render() {
    const { anchorEl, menuOpen } = this.state;
    const { children, classes, columns, hidden, manualVisibility, title } = this.props;

    if (!children && !title && !manualVisibility) return null;
    const toggleVisibleColumns = manualVisibility && (
      <React.Fragment>
        <IconButton
          data-testid="datagrid-column-toggle"
          onClick={this.openMenu}
          gaprops={{ label: 'DataGrid Toolbar Menu' }}
          ref={node => {
            this.button = node;
          }}
        >
          <Icon>more_vert</Icon>
        </IconButton>
        <Popover
          open={menuOpen}
          anchorEl={anchorEl}
          onClose={this.closeMenu}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <List>
            {columns.map(column => (
              <ListItem
                data-testid={`${column.name}-toggle`}
                key={column.name}
                dense
                button
                onClick={() => this.toggleColumn(column.name)}
                disabled={column.alwaysVisible}
              >
                <Checkbox checked={!hidden.includes(column.name)} className={classes.checkbox} />
                <ListItemText className={classes.columnName} primary={column.title || column.name} />
              </ListItem>
            ))}
          </List>
        </Popover>
      </React.Fragment>
    );
    return (
      <Plugin name="Toolbar">
        <Template name="header">
          <ToolbarMUI disableGutters className={classes.toolbar}>
            {title && <BoldHeader title={title} />}
            <TemplatePlaceholder name="toolbarContent" />
            {children}
            <div className={classes.menu}>{toggleVisibleColumns}</div>
          </ToolbarMUI>
        </Template>
      </Plugin>
    );
  }
}

export default withPluginContext(withStyles(styles)(Toolbar));
