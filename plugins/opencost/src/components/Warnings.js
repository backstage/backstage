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
