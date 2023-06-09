import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { endOfDay, startOfDay } from 'date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import Button from '@material-ui/core/Button'
import DateFnsUtils from '@date-io/date-fns'
import FormControl from '@material-ui/core/FormControl'
import Link from '@material-ui/core/Link'
import Popover from '@material-ui/core/Popover'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { isValid } from 'date-fns'
import { find, get } from 'lodash'

const useStyles = makeStyles({
  dateContainer: {
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 6,
    paddingBottom: 18,
    display: 'flex',
    flexFlow: 'row',
  },
  dateContainerColumn: {
    display: 'flex',
    flexFlow: 'column',
  },
  formControl: {
    margin: 8,
    width: 120,
  },
})

const SelectWindow = ({ windowOptions, window, setWindow }) => {
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = useState(null)
  
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [intervalString, setIntervalString] = useState(null)
  
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget)
    }
  
    const handleClose = () => {
      setAnchorEl(null)
    }
  
    const handleStartDateChange = (date) => {
      if (isValid(date)) {
        setStartDate(startOfDay(date))
      }
    }
  
    const handleEndDateChange = (date) => {
      if (isValid(date)) {
        setEndDate(endOfDay(date))
      }
    }
  
    const handleSubmitPresetDates = (dateString) => {
      setWindow(dateString)
      setStartDate(null)
      setEndDate(null)
      handleClose()
    }
  
    const handleSubmitCustomDates = () => {
      if (intervalString !== null) {
        setWindow(intervalString)
        handleClose()
      }
    }
  
    useEffect(() => {
      if (startDate !== null && endDate !== null) {
        // Note: getTimezoneOffset() is calculated based on current system locale, NOT date object
        let adjustedStartDate = new Date(startDate - startDate.getTimezoneOffset() * 60000)
        let adjustedEndDate = new Date(endDate - endDate.getTimezoneOffset() * 60000)
        setIntervalString(
          adjustedStartDate.toISOString().split('.')[0] + "Z" 
          + "," 
          + adjustedEndDate.toISOString().split('.')[0] + "Z"
        )
      }
    }, [startDate, endDate])
  
    const open = Boolean(anchorEl)
    const id = open ? 'date-range-popover' : undefined
  
    return (
      <>
        <FormControl className={classes.formControl}>
          <TextField
          id="filled-read-only-input"
          label="Date Range"
          value={get(find(windowOptions, { value: window }), "name", "Custom")}
          onClick={e => handleClick(e)}
          inputProps={{
            readOnly: true,
            style: { cursor: 'pointer' },
          }}
          />
        </FormControl>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <div className={classes.dateContainer}>
            <div className={classes.dateContainerColumn}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                style={{ width: '144px' }}
                autoOk={true}
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-start"
                label="Start Date"
                value={startDate}
                maxDate={new Date()}
                maxDateMessage="Date should not be after today."
                onChange={handleStartDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
              <KeyboardDatePicker
                style={{ width: '144px' }}
                autoOk={true}
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-end"
                label="End Date"
                value={endDate}
                maxDate={new Date()}
                maxDateMessage="Date should not be after today."
                onChange={handleEndDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
              <div>
                <Button 
                  style={{ marginTop: 16 }} 
                  variant="contained" 
                  color="default"
                  onClick={handleSubmitCustomDates}
                >
                  Apply
                </Button>
              </div>
            </div>
            <div className={classes.dateContainerColumn} style={{ paddingTop: 12, marginLeft: 18 }}>
              {windowOptions.map(opt => 
              <Typography key={opt.value}
              >
                <Link
                  style={{ cursor: "pointer" }}
                  key={opt.value}
                  value={opt.value}
                  onClick={() => handleSubmitPresetDates(opt.value)}
                >
                  {opt.name}
                </Link>
              </Typography>
              )}
            </div>
          </div>
        </Popover>
      </>
    )
  }

  export default React.memo(SelectWindow)