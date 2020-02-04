import React from 'react';
import { Modal } from '@material-ui/core';

const getModalStyles = () => {
  return {
    position: 'fixed',
    width: '80%',
    height: '80%',
    top: '10%',
    left: '10%',
    // margin: '0 auto',
    padding: 10,
    backgroundColor: '#fff',
  };
};

class ModalView extends React.Component {
  render() {
    const { open, onClose } = this.props;
    return (
      <Modal open={open} onClose={onClose}>
        <div style={getModalStyles()}>{this.props.children}</div>
      </Modal>
    );
  }
}

export default ModalView;
