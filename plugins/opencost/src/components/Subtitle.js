import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { upperFirst } from 'lodash'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
import Typography from '@material-ui/core/Typography'
import { toVerboseTimeRange } from '../util';

const useStyles = makeStyles({
  root: {
    '& > * + *': {
      marginTop: 2,
    },
  },
  link: {
    cursor: "pointer",
  },
})

const Subtitle = ({ report }) => {
  const classes = useStyles()

  const { aggregateBy, window } = report

  return (
    <div className={classes.root}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {aggregateBy && aggregateBy.length > 0 ? (
          <Typography>{toVerboseTimeRange(window)} by {upperFirst(aggregateBy)}</Typography>
        ) : (
          <Typography>{toVerboseTimeRange(window)}</Typography>
        )}
      </Breadcrumbs>
    </div>
  )
}

export default React.memo(Subtitle)
