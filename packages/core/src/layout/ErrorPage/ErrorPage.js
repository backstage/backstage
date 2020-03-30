/*
 * Copyright 2020 Ryan Pannell <r.pannell1993@gmail.com>
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
import { Typography, withStyles, Tooltip } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { Theme } from '../Page/Page';
import MicDrop from './MicDrop';

class BackButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Fragment>
      <Link onClick={this.props.history.goBack}>
          Go back
      </Link>... or if you think this is a bug,
      please file an <Link href="https://github.com/spotify/backstage/issues">
      issue</Link>.
      </Fragment>
    )
  }
}
class ErrorPage extends Component {
   constructor(props) {
     super(props);
   }
   render() {
     const { status, errorTitle, errorBody, classes, backButton } = this.props;

     return (
       <Fragment>
       <Theme.Consumer>
         {theme => (
           <div>
            <div className={classes.errorBg}>
            <MicDrop />
            </div>
            <div className={classes.subtitle}>ERROR {status}: {errorTitle}</div>
             <div className={classes.title}>
               Looks like someone dropped the mic!
             </div>
             <div className={classes.info}>
             { backButton && <BackButton {...this.props} /> }
             </div>
           </div>
         )}
       </Theme.Consumer>
       </Fragment>
     );
   }
}

const styles = theme => ({
   errorBg: {
     height: '100%',
     width: '100%',
     top: 0,
     bottom: 0,
     left: 0,
     right: 0,
     position: 'absolute',
     'z-index': -1,
   },
   title: {
     lineHeight: '1.0em',
     wordBreak: 'break-all',
     fontSize: 'calc(42px + 6 * ((100vw - 320px) / 680))',
     width: '35vw',
     padding: '0 8vh 0 4vw',
     'word-break': 'normal',
   },
   subtitle: {
     color: theme.palette.textSubtle,
     fontSize: 'calc(12px + 6 * ((100vw - 320px) / 680))',
     padding: '8vh 0 0 4vw',
     'word-break': 'normal',
   },
   info: {
     fontSize: 'calc(16px + 6 * ((100vw - 320px) / 680))',
     color: theme.palette.textSubtle,
     padding: '8vh 0 0 4vw',
     width: "35vw",
     'word-break': 'normal',
   },
});

export default withStyles(styles)(ErrorPage);
