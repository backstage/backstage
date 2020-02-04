import { FormHelperText, withStyles } from '@material-ui/core';

const style = theme => ({
  root: {
    marginTop: 0,
    marginBottom: theme.spacing(1),
  },
});

export default withStyles(style)(FormHelperText);
