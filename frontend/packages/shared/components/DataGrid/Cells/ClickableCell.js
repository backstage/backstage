import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { CardContent, CardHeader, Popover } from '@material-ui/core';
import { InfoIcon } from 'shared/icons';

import Link from 'shared/components/Link';

const ClickableCellDetails = ({ children, title }) => (
  <Fragment>
    {title && <CardHeader title={title} />}
    <CardContent>{children}</CardContent>
  </Fragment>
);

/**
 * Creates a DataGrid Cell with popover when the text or the info icon is clicked
 */
class ClickableCell extends Component {
  static propTypes = {
    linkText: PropTypes.string.isRequired,
    title: PropTypes.string,
    showIcon: PropTypes.bool,
    horizontalAlign: PropTypes.string,
  };

  static defaultProps = {
    title: null,
    showIcon: true,
    horizontalAlign: 'left',
  };

  state = {
    dropdownAnchorElement: null,
  };

  onOpenDropdown = event => {
    this.setState({
      dropdownAnchorElement: event.currentTarget,
    });
    event.preventDefault();
  };

  onCloseDropdown = () => {
    this.setState({
      dropdownAnchorElement: null,
    });
  };

  render() {
    const { linkText, horizontalAlign, showIcon, title, children } = this.props;
    const { dropdownAnchorElement } = this.state;
    return (
      <Fragment>
        {dropdownAnchorElement && (
          <Popover
            open={true}
            anchorEl={dropdownAnchorElement}
            anchorOrigin={{ vertical: 'top', horizontal: horizontalAlign }}
            transformOrigin={{ vertical: 'top', horizontal: horizontalAlign }}
            onClose={this.onCloseDropdown}
            PaperProps={{ style: { backgroundColor: 'rgba(255, 255, 255, 0.95)' } }}
          >
            <ClickableCellDetails title={title} onClose={this.onCloseDropdown}>
              {children}
            </ClickableCellDetails>
          </Popover>
        )}
        <Link onClick={this.onOpenDropdown}>
          {linkText} {showIcon && <InfoIcon style={{ position: 'relative', top: 2, fontSize: 13 }} />}
        </Link>
      </Fragment>
    );
  }
}

export default ClickableCell;
