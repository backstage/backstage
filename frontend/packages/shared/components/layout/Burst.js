import React, { Component } from 'react';
import 'assets/bursts/bursts.css';

class Burst extends Component {
  render() {
    const { theme } = this.props;

    return (
      <div className="burst" style={{ backgroundImage: theme.gradient }}>
        <div className="burst-shape" style={theme.burstShape} />
      </div>
    );
  }
}

export default Burst;
