import React, { Fragment } from 'react';
import { IconButton, List, ListItem, ListItemIcon, ListItemText, Popover } from '@material-ui/core';
import { KebabMenuIcon } from 'shared/icons';

const ActionItem = ({ label, secondaryLabel, icon, disabled = false, onClick, WrapperComponent = React.Fragment }) => {
  return (
    <WrapperComponent>
      <ListItem
        data-testid="header-action-item"
        disabled={disabled}
        button
        onClick={event => {
          if (onClick) {
            onClick(event);
          }
        }}
      >
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText primary={label} secondary={secondaryLabel} />
      </ListItem>
    </WrapperComponent>
  );
};

const HeaderActionMenu = ({ actionItems }) => {
  const [open, setOpen] = React.useState(false);
  const anchorElRef = React.useRef(null);

  return (
    <Fragment>
      <IconButton
        onClick={() => setOpen(true)}
        data-testid="header-action-menu"
        ref={anchorElRef}
        style={{ color: 'white', height: 56, width: 56, marginRight: -4, padding: 0 }}
      >
        <KebabMenuIcon titleAccess={'menu'} style={{ fontSize: 40 }} />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorElRef.current}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        onClose={() => setOpen(false)}
      >
        <List>
          {actionItems.map(actionItem => {
            return <ActionItem key={actionItem.label} {...actionItem} />;
          })}
        </List>
      </Popover>
    </Fragment>
  );
};

export default HeaderActionMenu;
