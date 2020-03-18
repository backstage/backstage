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
import Button from '@material-ui/core/Button';
import { Theme } from '../Page/Page';

class BackButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Button variant="contained" color="primary"
        onClick={this.props.history.goBack}>
          Back
      </Button>
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
            <div className={classes.errorBg} />
             <div className={classes.title}>
               {status}
             </div>
             <div className={classes.subtitle}>{errorTitle}</div>
             <div className={classes.info}>{errorBody}</div>
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
     background: 'linear-gradient(87.29deg,' + theme.palette.bursts.backgroundColor.accent + ' 17.71%,' + theme.palette.bursts.backgroundColor.default + ' 80.85%)'
   },
   title: {
     color: theme.palette.bursts.fontColor,
     lineHeight: '1.0em',
     wordBreak: 'break-all',
     fontSize: 'calc(64px + 6 * ((100vw - 320px) / 680))',
     margin: '25vh 0 0 0',
     'text-align':'center',
   },
   subtitle: {
     color: 'rgba(255, 255, 255, 0.8)',
     fontSize: 'calc(30px + 6 * ((100vw - 320px) / 680))',
     'text-align':'center',
   },
   info: {
     fontSize: 'calc(16px + 6 * ((100vw - 320px) / 680))',
     'text-align':'center',
     margin: '5vh 0 0 0',
     color: theme.palette.bursts.fontColor,
   },
});

export default withStyles(styles)(ErrorPage);
