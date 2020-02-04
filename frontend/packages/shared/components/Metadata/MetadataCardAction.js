import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Divider, Button } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Cached';

export default class MetadataCardAction extends Component {
  static propTypes = {
    refresh: PropTypes.func,
    cardActions: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.req,
        link: PropTypes.string,
        target: PropTypes.target,
        icon: PropTypes.node,
        onClick: PropTypes.func,
      }),
    ),
  };

  static defaultProps = {
    cardActions: [],
    refresh: null,
  };

  renderActionButtons(actions) {
    return actions.map((action, i) => {
      const target = action.target || '_blank';
      return (
        <Button key={i} href={action.link} target={target} onClick={action.onClick}>
          {action.title}
          {action.icon}
        </Button>
      );
    });
  }

  render() {
    const { refresh, cardActions } = this.props;
    const actionButtons = this.renderActionButtons(cardActions);
    return (
      <Fragment>
        <Divider />
        {refresh && (
          <Button color="primary" onClick={refresh}>
            <RefreshIcon />
            &nbsp;Refresh
          </Button>
        )}
        {actionButtons}
      </Fragment>
    );
  }
}
