import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Menu, MenuItem } from '@material-ui/core';
import Link from 'shared/components/Link';
import Button from 'shared/components/Button';
import ConfirmPrompt from 'shared/components/ConfirmPrompt';

/*
 * Example of implementation:
 * {
 *   name: 'actions',
 *   getCellValue: row => [
 *     <DropdownCell.ConfirmAction key="action" content="Do thing" action={doThing} promptText="Are you sure you want to do the thing?"/>,
 *     <DropdownCell.Action key="instant" content="Do instant thing" action={doInstantThing} />,
 *     <DropdownCell.Link key="link" content="Go to link" to="#" />,
 *     <DropdownCell.Action key="fav" action={toggleFav} keepOpen>
 *       <Icon>favorite</Icon>
 *     </DropdownCell.Action>
 *   ],
 *   renderer: props => <DropdownCell {...props} />,
 * }
 */

export default class DropdownCell extends Component {
  static propTypes = {
    value: PropTypes.arrayOf(PropTypes.element),
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  };

  static defaultProps = {
    value: [],
    title: 'Choose...',
  };

  state = {
    anchorEl: null,
  };

  openMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  closeMenu = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const { value, title } = this.props;

    return (
      <React.Fragment>
        <Button
          onClick={this.openMenu}
          aria-haspopup="true"
          size="small"
          style={{ textTransform: 'none', fontWeight: 'normal' }}
          data-testid="datagrid-dropdown-btn"
          disabled={value.length === 0}
        >
          {title} <Icon>arrow_drop_down</Icon>
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.closeMenu}>
          {value.map(item => React.cloneElement(item, { close: this.closeMenu }))}
        </Menu>
      </React.Fragment>
    );
  }

  static closeAfterAction = ({ action, close, keepOpen }) => {
    if (keepOpen) {
      return action;
    } else {
      return async () => {
        try {
          await action();
          if (close) close();
        } catch (e) {
          throw Error(e);
        }
      };
    }
  };

  static ConfirmAction(props) {
    const {
      promptText,
      promptTitle,
      confirmText,
      confirmButtonDisabled,
      successMessage,
      failureMessage,
      content,
      children,
      gacontext,
    } = props;
    const onConfirm = DropdownCell.closeAfterAction(props);

    return (
      <ConfirmPrompt
        onConfirm={onConfirm}
        title={promptTitle}
        content={promptText}
        confirmButtonText={confirmText}
        confirmButtonDisabled={confirmButtonDisabled}
        successMessage={successMessage}
        failureMessage={failureMessage}
        ContainerElement={MenuItem}
        gacontext={gacontext}
        maxWidth="md"
      >
        {content || children}
      </ConfirmPrompt>
    );
  }

  static Action(props) {
    const { content, children, ...otherProps } = props;
    delete otherProps.action;
    delete otherProps.keepOpen;
    delete otherProps.close;
    const onClick = DropdownCell.closeAfterAction(props);

    return (
      <MenuItem onClick={onClick} {...otherProps}>
        {content || children}
      </MenuItem>
    );
  }

  static Link(props) {
    const { to, content, children, ...otherProps } = props;
    delete otherProps.close;
    return (
      <MenuItem component={Link} to={to} {...otherProps}>
        {content || children}
      </MenuItem>
    );
  }
}
