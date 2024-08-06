/*
 * Copyright 2024 The Backstage Authors
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

import { Transformer } from './transformer';
import { normalizeUrl } from './rewriteDocLinks';
import Snackbar from '@material-ui/core/Snackbar';
import React, { useState } from 'react';
import { renderReactElement } from './renderReactElement';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

type RedirectNotificationProps = {
  handleButtonClick: () => void;
  message: string;
  autoHideDuration: number;
};

const useStyles = makeStyles(theme => ({
  button: {
    color: theme.palette.primary.light,
    textDecoration: 'underline',
  },
}));
const RedirectNotification = ({
  message,
  handleButtonClick,
  autoHideDuration,
}: RedirectNotificationProps) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(prev => !prev);
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={autoHideDuration}
      color="primary"
      onClose={handleClose}
      message={message}
      action={
        <Button
          classes={{ root: classes.button }}
          size="small"
          onClick={handleButtonClick}
        >
          Redirect now
        </Button>
      }
    />
  );
};

export const handleMetaRedirects = (
  navigate: (to: string) => void,
  entityName: string,
): Transformer => {
  const redirectAfterMs = 4000;
  const determineRedirectURL = (metaUrl: string) => {
    const normalizedCurrentUrl = normalizeUrl(window.location.href);
    // If metaUrl is relative, it will be resolved with base href. If it is absolute, it will replace the base href when creating URL object.
    const absoluteRedirectObj = new URL(metaUrl, normalizedCurrentUrl);
    const isExternalRedirect =
      absoluteRedirectObj.hostname !== window.location.hostname;

    if (isExternalRedirect) {
      const currentTechDocPath = window.location.pathname;
      const indexOfSiteHome = currentTechDocPath.indexOf(entityName);
      const siteHomePath = currentTechDocPath.slice(
        0,
        indexOfSiteHome + entityName.length,
      );
      return siteHomePath;
    }
    // The navigate function from dom.tsx is a wrapper around react-router navigate function that helps absolute url redirects.
    return absoluteRedirectObj.href;
  };

  return dom => {
    for (const elem of Array.from(dom.querySelectorAll('meta'))) {
      if (elem.getAttribute('http-equiv') === 'refresh') {
        const metaContentParameters = elem
          .getAttribute('content')
          ?.split('url=');
        if (!metaContentParameters || metaContentParameters.length < 2) {
          continue;
        }
        const metaUrl = metaContentParameters[1];
        const redirectURL = determineRedirectURL(metaUrl);
        const container = document.createElement('div');

        renderReactElement(
          <RedirectNotification
            message="This TechDocs page is no longer maintained. Will automatically redirect to the designated replacement."
            handleButtonClick={() => navigate(redirectURL)}
            autoHideDuration={redirectAfterMs}
          />,
          container,
        );
        document.body.appendChild(container);

        setTimeout(() => {
          navigate(redirectURL);
        }, redirectAfterMs);

        return dom;
      }
    }
    return dom;
  };
};
