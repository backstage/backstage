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

import React, { Component, Fragment } from 'react';
import { Typography, withStyles } from '@material-ui/core';
import Helmet from 'react-helmet';
// import FavoriteButton from 'shared/components/layout/FavoriteButton';

const styles = theme => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  leftItemsBox: {
    flex: '1 1 auto',
    marginBottom: theme.spacing(1),
    minWidth: 0,
    overflow: 'visible',
  },
  rightItemsBox: {
    flex: '0 1 auto',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
    minWidth: 0,
    overflow: 'visible',
  },
  description: {},
  title: {
    display: 'inline-flex',
  },
});

class ContentHeader extends Component {
  static defaultProps = {
    favoriteable: true,
    title: 'Unknown page',
    titleComponent: undefined,
  };

  render() {
    const {
      title,
      description,
      /* favoriteable,*/ children,
      classes,
    } = this.props;
    const TitleComponent = this.props.titleComponent;
    const renderedTitle =
      TitleComponent !== undefined ? (
        <TitleComponent />
      ) : (
        <Typography
          variant="h4"
          className={classes.title}
          data-testid="header-title"
        >
          {title}
        </Typography>
      );

    return (
      <Fragment>
        <Helmet title={title} />
        <div className={classes.container}>
          <div className={classes.leftItemsBox}>
            {renderedTitle}
            {/* favoriteable && <FavoriteButton /> */}
            {description && (
              <Typography className={classes.description} variant="body2">
                {description}
              </Typography>
            )}
          </div>
          <div className={classes.rightItemsBox}>{children}</div>
        </div>
      </Fragment>
    );
  }
}

export default withStyles(styles)(ContentHeader);
