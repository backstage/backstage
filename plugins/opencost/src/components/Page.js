import { makeStyles } from '@material-ui/styles'
import React from 'react'

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    flexFlow: 'column',
    flexGrow: 1,
    margin: '20px 30px 0 30px',
    minWidth: 800,
  },
  flexGrow: {
    display: 'flex',
    flexFlow: 'column',
    flexGrow: 1,
  }
})

const Page = props => {
  const classes = useStyles()

  return (
    <div className={classes.flexGrow}>
      <div className={classes.wrapper}>
        <div className={classes.flexGrow}>
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default Page
