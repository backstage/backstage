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
import React, { useEffect } from 'react';
import {
  useShadowRootElements,
  useTechDocsReaderPage,
} from '@backstage/plugin-techdocs-react';
import { useNavigate } from 'react-router';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});
export const RedirectsAddon = () => {
  const links = useShadowRootElements(['a']) as HTMLLinkElement[];
  const navigate = useNavigate();
  const classes = useStyles();

  const { entityMetadata } = useTechDocsReaderPage();
  const componentName = entityMetadata?.value?.metadata?.name;

  const redirectLink =
    links.find(link => link.textContent?.startsWith('techdocs_redirect'))
      ?.href ?? undefined;

  const currentUrlObj = new URL(window.location.href);
  const redirectUrlObj = redirectLink ? new URL(redirectLink) : undefined;
  const isExternalRedirect =
    !!redirectUrlObj && redirectUrlObj.hostname !== currentUrlObj.hostname;

  useEffect(() => {
    const redirectToNewLocation = (url: string | undefined) => {
      if (!url) return;
      if (isExternalRedirect) {
        const currentTechDocPath = currentUrlObj.pathname;
        if (!componentName) return;
        const indexOfSiteHome = currentTechDocPath.indexOf(componentName);
        const techDocsHomePath = currentTechDocPath.slice(
          0,
          indexOfSiteHome + componentName.length,
        );
        navigate(techDocsHomePath);
      } else {
        const docPath = url.replace(/^https?:\/\/[^\/]*/, '');
        navigate(docPath);
      }
    };

    const timer = setTimeout(() => {
      redirectToNewLocation(redirectLink);
    }, 4000);

    return () => clearTimeout(timer);
  }, [
    redirectLink,
    componentName,
    isExternalRedirect,
    currentUrlObj.pathname,
    navigate,
  ]);

  if (!redirectLink) return null;

  return isExternalRedirect ? (
    <Alert className={classes.root} severity="error">
      This TechDocs page has been decommissioned. Invalid redirect provided.
      Falling back to TechDocs site home.{' '}
    </Alert>
  ) : (
    <Alert className={classes.root} severity="info">
      This TechDocs page has been decommissioned. Redirecting to the new
      documentation location...{' '}
    </Alert>
  );
};
