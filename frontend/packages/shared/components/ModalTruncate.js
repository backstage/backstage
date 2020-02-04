import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Paper } from '@material-ui/core';
import { withState } from 'recompose';

/**
 * A component which truncates text that is beyond the provided maximum length and makes
 * it so that activating the text will display the entire contents in a modal with
 * code/pre-formatting. This is primarily useful for long blobs of content from the backend
 * such as stack traces or moderate sized logs.
 *
 * Truncated content will have a cursor-style applied to make it clear to the user that
 * it is interactive. Additionally, aria-label, tabindex, and keyPress attributes
 * are defined for non-mouse and non-visual accessibility.
 *
 * Properties:
 * - body: The text to optionally truncate and make clickable/selectable for modal expansion
 * - maxLength: The maximum length of the text allowed before truncation. Default: 512
 *
 * Any additional properties supplied will be added onto the container element. In some cases
 * it may be necessary to supply a "key" property, for example.
 */
const ModalTruncate = withState(
  'expanded',
  'setExpanded',
  false,
)(({ expanded, setExpanded, body, maxLength = 512, ...props }) => {
  if (body.length > maxLength) {
    const onClose = () => setExpanded(false);
    const truncated = `${body.slice(0, maxLength)}...`;
    const children = [
      truncated,
      <Modal open={!!expanded} onClose={onClose} key="modal">
        <Paper style={{ width: '80%', height: '80%', margin: 'auto', padding: '16px', overflow: 'scroll' }}>
          <code>
            <pre>{body}</pre>
          </code>
        </Paper>
      </Modal>,
    ];
    const onClick = e => {
      e.preventDefault();
      setExpanded(true);
    };
    return (
      <div
        aria-label="View the entire contents of this text"
        tabIndex="0"
        role="button"
        style={{ cursor: 'pointer' }}
        onClick={onClick}
        onKeyPress={onClick}
        {...props}
      >
        {children}
      </div>
    );
  }
  return <div {...props}>{body}</div>;
});

ModalTruncate.propTypes = {
  body: PropTypes.string.isRequired,
  maxLength: PropTypes.number,
};

export default ModalTruncate;
