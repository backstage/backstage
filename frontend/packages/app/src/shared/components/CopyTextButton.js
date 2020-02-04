import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Tooltip, withStyles } from '@material-ui/core';
import { CopyIcon } from 'shared/icons';

const buttonStyles = theme => ({
  button: {
    '&:hover': {
      backgroundColor: theme.palette.highlight,
      cursor: 'pointer',
    },
  },
});

/**
 * Copy text button with visual feedback in the form of
 *  - a hover color
 *  - click ripple
 *  - Tooltip shown when user has clicked
 *
 *  Properties:
 *  - text: the text to be copied
 *  - tooltipDelay: Number os ms to show the tooltip, default: 1000ms
 *  - tooltipText: Text to show in the tooltip when user has clicked the button, default: "Text
 * copied to clipboard"
 *
 * Example:
 *    <CopyTextButton text="My text that I want to be copied to the clipboard" />
 */
class CopyTextButton extends React.Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    tooltipDelay: PropTypes.number,
    tooltipText: PropTypes.string,
  };

  static defaultProps = {
    tooltipDelay: 1000,
    tooltipText: 'Text copied to clipboard',
  };

  state = {
    open: false,
  };

  handleTooltipClose = () => {
    this.setState({ open: false });
  };

  handleTooltipOpen = () => {
    this.setState({ open: true });
  };

  handleCopyClick = e => {
    e.stopPropagation();
    this.handleTooltipOpen();
    try {
      this.clipboardInput.select();
      document.execCommand('copy');
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const { classes, text, tooltipDelay, tooltipText } = this.props;

    return (
      <Fragment>
        <input
          ref={el => (this.clipboardInput = el)}
          type="text"
          style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}
          defaultValue={text}
        />
        <Tooltip
          id="copy-test-tooltip"
          title={tooltipText}
          placement="top"
          leaveDelay={tooltipDelay}
          onClose={this.handleTooltipClose}
          open={this.state.open}
        >
          <IconButton onClick={this.handleCopyClick} className={classes.button}>
            <CopyIcon />
          </IconButton>
        </Tooltip>
      </Fragment>
    );
  }
}

export default withStyles(buttonStyles)(CopyTextButton);
