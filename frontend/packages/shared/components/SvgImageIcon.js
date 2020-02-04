import React, { Component } from 'react';

const styles = {
  root: {
    width: 24,
    height: 24,
    padding: 2,
    display: 'inline-block',
  },
};
// A wrapper to make icons stored in svg files look as similar as the material UI SvgIcon as possible
// The icons stored in svg files do not allow styling the icon color
// Assuming the image has viewBox="0 0 20 20"
// Should be replaced with svg icons defined using SvgIcon
export default class SvgImageIcon extends Component {
  render() {
    return <img style={styles.root} src={this.props.src} alt={this.props.alt} />;
  }
}
