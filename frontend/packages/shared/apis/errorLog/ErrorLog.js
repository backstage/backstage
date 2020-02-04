import React from 'react';
import { connect } from 'react-redux';
import { Drawer, IconButton, List, ListItemSecondaryAction, ListSubheader, withStyles } from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import FeaturedPlayListIcon from '@material-ui/icons/FeaturedPlayList';

import { errorLogClose } from './actions';
import ErrorLogEntry from './ErrorLogEntry';

const closeButtonStyles = {
  root: {
    color: 'black',
  },
};

const drawerStyles = {
  paperAnchorBottom: {
    maxHeight: 'auto',
    height: '45vh',
  },
};

const listSubheaderStyles = {
  sticky: {
    backgroundColor: '#fafafa',
  },
};

const listStyles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
};

const CloseButton = withStyles(closeButtonStyles)(({ classes }) => (
  <IconButton key="close" classes={classes} aria-label="Close" color="inherit">
    <CloseIcon />
  </IconButton>
));

const noErrorsStyle = theme => ({
  errorLogNoErrors: {
    flex: '1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.palette.textVerySubtle,
    fontSize: '24px',
  },
});

const errorLogHeaderIconStyles = {
  root: {
    marginBottom: '-7px',
    marginRight: '9px',
  },
};

const NoErrors = withStyles(noErrorsStyle)(({ classes }) => (
  <li className={classes.errorLogNoErrors}>
    <Check style={{ fontSize: 13 }} />
    &nbsp;All good
  </li>
));

const ListSubheaderStyled = withStyles(listSubheaderStyles)(ListSubheader);
const DrawerStyled = withStyles(drawerStyles)(Drawer);
const ListStyled = withStyles(listStyles)(List);
const FeaturedPlayListIconStyled = withStyles(errorLogHeaderIconStyles)(FeaturedPlayListIcon);

const ErrorLogDrawer = ({ errorLog, onClose }) => {
  const { open, selectedErrorId, errors } = errorLog;

  const errorList = errors.map(error => (
    <ErrorLogEntry key={error.id} {...error} highlight={selectedErrorId === error.id} />
  ));

  return (
    <DrawerStyled anchor="bottom" open={open} onClose={onClose} ModalProps={{ 'data-testid': 'error-log-modal' }}>
      <ListStyled
        subheader={
          <ListSubheaderStyled component="div">
            <FeaturedPlayListIconStyled />
            ERROR LOG
            <ListItemSecondaryAction onClick={onClose}>
              <CloseButton />
            </ListItemSecondaryAction>
          </ListSubheaderStyled>
        }
      >
        {errorList && errorList.length ? errorList : <NoErrors />}
      </ListStyled>
    </DrawerStyled>
  );
};

export default connect(({ errorLog }) => ({ errorLog }), { onClose: errorLogClose })(ErrorLogDrawer);
