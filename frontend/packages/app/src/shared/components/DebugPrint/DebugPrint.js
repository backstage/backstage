import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FeatureFlags from 'shared/apis/featureFlags/featureFlags';

import { Button } from '@material-ui/core';

const styles = {
  root: {
    fontFamily: 'monospace',
    color: '#ffc600',
  },
  text: {
    margin: 0,
    overflow: 'scroll',
    backgroundColor: '#193549',
    padding: '5px 10px',
    fontSize: 11,
  },
  button: {
    color: 'inherit',
    fontSize: '12px',
    backgroundColor: '#193549',
    padding: 0,
    border: '1px solid rgb(0,0,0)',
    borderRadius: '8px',
    minWidth: '45px',
    minHeight: '16px',
    height: '20px',
    lineHeight: '18px',
  },
  label: {
    padding: 0,
    border: 'none',
    fontWeight: 'bold',
    fontStyle: 'normal',
    lineHeight: '18px',
  },
};

class DebugPrint extends Component {
  static propTypes = {
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  };

  state = {
    show: false,
  };

  toggle = () => {
    this.setState({ show: !this.state.show });
  };

  render() {
    if (!FeatureFlags.getItem('debugmode.enabled')) {
      return null;
    }

    return (
      <div style={styles.root}>
        <Button onClick={this.toggle} style={styles.button}>
          <span style={styles.label}>debug</span>
        </Button>
        {this.state.show ? <pre style={styles.text}>{JSON.stringify(this.props.data, null, 2)}</pre> : null}
      </div>
    );
  }
}

export default DebugPrint;
