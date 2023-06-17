/*
 * Copyright 2023 The Backstage Authors
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

import React from 'react'
import { makeStyles } from '@material-ui/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import WarningIcon from '@material-ui/icons/Warning'

const useStyles = makeStyles({
  root: {},
})

const Warnings = ({warnings}) => {
  const classes = useStyles()

  if (!warnings || warnings.length === 0) {
    return null
  }

  return (
    <Paper className={classes.root}>
      <List>
        {warnings.map((warn, i) => (
          <ListItem key={i}>
            <ListItemIcon>
              <WarningIcon />
            </ListItemIcon>
            <ListItemText primary={warn.primary} secondary={warn.secondary} />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export default Warnings
