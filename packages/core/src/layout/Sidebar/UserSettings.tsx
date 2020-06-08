import React, { useState, useContext, useEffect, useRef } from 'react';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import { SidebarContext } from './config';
import { SidebarItem, SidebarDivider } from './Items';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Divider from '@material-ui/core/Divider';
import { useApi, googleAuthApiRef, ProfileInfo } from '@backstage/core-api';
import { Avatar, IconButton } from '@material-ui/core';
import PowerButton from '@material-ui/icons/PowerSettingsNew';
import { SidebarThemeToggle } from './SidebarThemeToggle';

export function SidebarUserSettings() {
  const { isOpen: sidebarOpen } = useContext(SidebarContext);
  const [open, setOpen] = React.useState(false);
  const ref = useRef<Element>(); // for scrolling down when collapse item opens

  const googleAuth = useApi(googleAuthApiRef);
  const [profile, setProfile] = useState<ProfileInfo>();

  // TODO(soapraj): List all the providers supported by the app and let user log in from here
  // TODO(soapraj): How to observe if the user is logged in
  useEffect(() => {
    googleAuth.getProfile({ optional: true }).then(googleProfile => {
      setProfile(googleProfile);
    });
  }, [googleAuth, open]);

  const handleClick = () => {
    setOpen(!open);
    setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth' }), 300);
  };

  // Close the provider list when sidebar collapse
  useEffect(() => {
    if (!sidebarOpen && open) setOpen(false);
  }, [sidebarOpen]);

  // Handle main auth info that is shown on the collapsible SidebarItem
  let avatar;
  let displayName;
  if (profile) {
    // const classes = useStyles();
    const email = profile.email;
    const name = profile.name;
    const imageUrl = profile.picture;
    const avatarFallback = email.charAt(0).toUpperCase() + email.slice(1);
    const emailTrimmed = email.split('@')[0];
    const displayEmail =
      emailTrimmed.charAt(0).toUpperCase() + emailTrimmed.slice(1);
    displayName = name ?? displayEmail;
    avatar = imageUrl
      ? () => <Avatar alt={name} src={imageUrl} />
      : () => <Avatar alt={name}>{avatarFallback[0]}</Avatar>;
  }

  return (
    <>
      <Divider innerRef={ref} />
      <SidebarItem
        text={displayName || 'Sign In'}
        onClick={handleClick}
        icon={avatar || AccountCircleIcon}
        disableSelected
      >
        {open ? <ExpandMore /> : <ExpandLess />}
      </SidebarItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <SidebarItem text="Google" icon={StarBorder} disableSelected>
          <IconButton
            onClick={() =>
              profile ? googleAuth.logout() : googleAuth.getAccessToken()
            }
          >
            <PowerButton color={profile ? 'primary' : 'disabled'} />
          </IconButton>
        </SidebarItem>
      </Collapse>
    </>
  );
}
