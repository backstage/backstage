/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from '@material-ui/core';
import { Divider, ListItemText, withStyles } from '@material-ui/core';
import { ListItem, ListItemIcon } from '@material-ui/core';
import ArrowIcon from '@material-ui/icons/ArrowForward';
import grey from '@material-ui/core/colors/grey';

const LinkBottomText = withStyles({
  primary: {
    fontWeight: '700',
    color: grey[900],
  },
})(ListItemText);

const ListItemBottom = withStyles({
  root: {
    maxWidth: 'fit-content',
    padding: '16px 16px 16px 20px',
  },
})(ListItem);

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
        <Link href={link} onClick={onClick} highlight="none">
          <ListItemBottom>
            <LinkBottomText>{title}</LinkBottomText>
            <ListItemIcon>
              <ArrowIcon />
            </ListItemIcon>
          </ListItemBottom>
        </Link>
      </div>
    );
  }
}
