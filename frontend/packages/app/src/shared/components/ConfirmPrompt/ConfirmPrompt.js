import React from 'react';
import { connect } from 'react-redux';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

import { snackbarOpenSuccess } from 'shared/apis/snackbar/actions';
import ProgressOverlay from 'shared/components/ProgressOverlay';
import ErrorPanel from 'shared/components/ErrorPanel';
import Button from 'shared/components/Button';

/**
 * Confirmation prompt.
 *
 * Wrap e.g. a button in this component to trigger a confirmation modal.
 * Errors in the onConfirm handler is handled by this component and informs the user.
 */
class ConfirmPrompt extends React.Component {
  state = {
    loading: false,
    error: null,
    open: false,
    errorId: null,
  };

  open = () => {
    this.setState({ open: true });
  };

  close = () => {
    this.setState({ open: false });
  };

  reset = () => {
    // we're never unmounted so we reset state
    this.setState({ error: null, loading: false, errorId: null });
  };

  handleConfirm = async () => {
    const { successMessage = 'Success!', onConfirm, snackbarOpenSuccess } = this.props;

    this.setState({ loading: true, error: null });
    try {
      await onConfirm();
      if (successMessage) {
        snackbarOpenSuccess(successMessage);
      }
      this.close();
    } catch (e) {
      const errorId = Math.random()
        .toString(36)
        .substring(7);
      this.setState({ error: e, loading: false, errorId });
    }
  };

  render() {
    const {
      children,
      content = 'Are you sure?',
      title = 'Confirm',
      onConfirm,
      confirmButtonText = 'Ok',
      confirmButtonDisabled = false,
      failureMessage = 'Operation failed.',
      longFailureMessage,
      ContainerElement = 'span',
      gacontext = 'Confirm Prompt',
      ...other
    } = this.props;
    delete other.successMessage;
    delete other.snackbarOpenSuccess;
    const { open, error, loading, errorId } = this.state;

    return (
      <React.Fragment>
        <Dialog onExited={this.reset} open={open} {...other}>
          <ProgressOverlay show={loading}>
            <DialogTitle style={{ minWidth: 400 }}>{title}</DialogTitle>
            <DialogContent>
              <div>{content}</div>
            </DialogContent>
            <DialogActions gacontext={gacontext}>
              {onConfirm ? (
                <Button data-testid="prompt-cancel" onClick={(...args) => this.close(...args)}>
                  Cancel
                </Button>
              ) : null}
              <Button
                data-testid="prompt-confirm"
                onClick={onConfirm ? this.handleConfirm : this.close}
                disabled={confirmButtonDisabled}
                color="primary"
              >
                {confirmButtonText}
              </Button>
            </DialogActions>
            {error && (
              <ErrorPanel
                onViewLogsClick={this.close}
                message={failureMessage}
                error={error}
                errorId={errorId}
                longFailureMessage={longFailureMessage}
              />
            )}
          </ProgressOverlay>
        </Dialog>
        <ContainerElement onClick={this.open}>{children}</ContainerElement>
      </React.Fragment>
    );
  }
}

export default connect(null, { snackbarOpenSuccess })(ConfirmPrompt);
