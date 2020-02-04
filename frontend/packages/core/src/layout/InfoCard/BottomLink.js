import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from '@material-ui/core';
import { Divider, ListItemText } from '@material-ui/core';
import { ListItem, ListItemIcon } from '@material-ui/core';
import ArrowIcon from '@material-ui/icons/ArrowForward';

export default class BottomLink extends Component {
  static propTypes = {
    link: PropTypes.string,
    title: PropTypes.string,
    onClick: PropTypes.func,
  };

  render() {
    const { link, title, onClick } = this.props;
    return (
      <div>
        <Divider />
        <Link to={link} onClick={onClick} highlight="none">
          <ListItem>
            <ListItemIcon>
              <ArrowIcon />
            </ListItemIcon>
            <ListItemText>{title}</ListItemText>
          </ListItem>
        </Link>
      </div>
    );
  }
}
