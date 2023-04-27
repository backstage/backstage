/*
 * Copyright 2020 The Backstage Authors
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

import React, { ChangeEvent, useContext, useState } from 'react';
import {
  Button,
  Typography,
  makeStyles,
  IconButton,
  createStyles,
  Theme,
  Drawer,
  Switch,
  FormControlLabel,
  Grid,
} from '@material-ui/core';
import Close from '@material-ui/icons/Close';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { V1ObjectMeta } from '@kubernetes/client-node';
import { withStyles } from '@material-ui/core/styles';
import {
  LinkButton as BackstageButton,
  StructuredMetadataTable,
  WarningPanel,
} from '@backstage/core-components';
import { ClusterContext } from '../../hooks';
import { formatClusterLink } from '../../utils/clusterLinks';
import { ClusterAttributes } from '@backstage/plugin-kubernetes-common';
import { FormatClusterLinkOptions } from '../../utils/clusterLinks/formatClusterLink';
import { ManifestYaml } from './ManifestYaml';

const useDrawerStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '50%',
      justifyContent: 'space-between',
      padding: theme.spacing(2.5),
    },
  }),
);

const useDrawerContentStyles = makeStyles((_: Theme) =>
  createStyles({
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    errorMessage: {
      marginTop: '1em',
      marginBottom: '1em',
    },
    options: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    icon: {
      fontSize: 20,
    },
    content: {
      height: '80%',
    },
  }),
);

const PodDrawerButton = withStyles({
  root: {
    padding: '6px 5px',
  },
  label: {
    textTransform: 'none',
  },
})(Button);

type ErrorPanelProps = {
  cluster: ClusterAttributes;
  errorMessage?: string;
  children?: React.ReactNode;
};

export const LinkErrorPanel = ({ cluster, errorMessage }: ErrorPanelProps) => (
  <WarningPanel
    title="There was a problem formatting the link to the Kubernetes dashboard"
    message={`Could not format the link to the dashboard of your cluster named '${
      cluster.name
    }'. Its dashboardApp property has been set to '${
      cluster.dashboardApp || 'standard'
    }.'`}
  >
    {errorMessage && (
      <Typography variant="body2">Errors: {errorMessage}</Typography>
    )}
  </WarningPanel>
);

interface KubernetesDrawerable {
  metadata?: V1ObjectMeta;
}

interface KubernetesStructuredMetadataTableDrawerContentProps<
  T extends KubernetesDrawerable,
> {
  toggleDrawer: (e: ChangeEvent<{}>, isOpen: boolean) => void;
  object: T;
  renderObject: (obj: T) => object;
  kind: string;
}

function replaceNullsWithUndefined(someObj: any) {
  const replacer = (_: any, value: any) =>
    String(value) === 'null' || String(value) === 'undefined'
      ? undefined
      : value;

  return JSON.parse(JSON.stringify(someObj, replacer));
}

function tryFormatClusterLink(options: FormatClusterLinkOptions) {
  try {
    return {
      clusterLink: formatClusterLink(options),
      errorMessage: '',
    };
  } catch (err) {
    return {
      clusterLink: '',
      errorMessage: err.message || err.toString(),
    };
  }
}

const KubernetesStructuredMetadataTableDrawerContent = <
  T extends KubernetesDrawerable,
>({
  toggleDrawer,
  object,
  renderObject,
  kind,
}: KubernetesStructuredMetadataTableDrawerContentProps<T>) => {
  const [isYaml, setIsYaml] = useState<boolean>(false);

  const classes = useDrawerContentStyles();
  const cluster = useContext(ClusterContext);
  const { clusterLink, errorMessage } = tryFormatClusterLink({
    dashboardUrl: cluster.dashboardUrl,
    dashboardApp: cluster.dashboardApp,
    dashboardParameters: cluster.dashboardParameters,
    object,
    kind,
  });

  return (
    <>
      <div className={classes.header}>
        <Grid container justifyContent="flex-start" alignItems="flex-start">
          <Grid item xs={11}>
            <Typography variant="h5">
              {object.metadata?.name ?? 'unknown name'}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              key="dismiss"
              title="Close the drawer"
              onClick={e => toggleDrawer(e, false)}
              color="inherit"
            >
              <Close className={classes.icon} />
            </IconButton>
          </Grid>
          <Grid item xs={11}>
            <Typography color="textSecondary" variant="body1">
              {kind}
            </Typography>
          </Grid>
          <Grid item xs={11}>
            <FormControlLabel
              control={
                <Switch
                  checked={isYaml}
                  onChange={event => {
                    setIsYaml(event.target.checked);
                  }}
                  name="YAML"
                />
              }
              label="YAML"
            />
          </Grid>
        </Grid>
      </div>
      {errorMessage && (
        <div className={classes.errorMessage}>
          <LinkErrorPanel cluster={cluster} errorMessage={errorMessage} />
        </div>
      )}
      <div className={classes.options}>
        <div>
          {clusterLink && (
            <BackstageButton
              variant="outlined"
              color="primary"
              size="small"
              to={clusterLink}
              endIcon={<OpenInNewIcon />}
            >
              Open Kubernetes Dashboard
            </BackstageButton>
          )}
        </div>
      </div>
      <div className={classes.content}>
        {isYaml && <ManifestYaml object={object} />}
        {!isYaml && (
          <StructuredMetadataTable
            metadata={renderObject(replaceNullsWithUndefined(object))}
          />
        )}
      </div>
    </>
  );
};
interface KubernetesStructuredMetadataTableDrawerProps<
  T extends KubernetesDrawerable,
> {
  object: T;
  renderObject: (obj: T) => object;
  buttonVariant?: 'h5' | 'subtitle2';
  kind: string;
  expanded?: boolean;
  children?: React.ReactNode;
}

export const KubernetesStructuredMetadataTableDrawer = <
  T extends KubernetesDrawerable,
>({
  object,
  renderObject,
  kind,
  buttonVariant = 'subtitle2',
  expanded = false,
  children,
}: KubernetesStructuredMetadataTableDrawerProps<T>) => {
  const [isOpen, setIsOpen] = useState(expanded);
  const classes = useDrawerStyles();

  const toggleDrawer = (e: ChangeEvent<{}>, newValue: boolean) => {
    e.stopPropagation();
    setIsOpen(newValue);
  };

  return (
    <>
      <PodDrawerButton
        onClick={e => toggleDrawer(e, true)}
        onFocus={event => event.stopPropagation()}
      >
        {children === undefined ? (
          <Typography variant={buttonVariant}>
            {object.metadata?.name ?? 'unknown object'}
          </Typography>
        ) : (
          children
        )}
      </PodDrawerButton>
      <Drawer
        classes={{
          paper: classes.paper,
        }}
        anchor="right"
        open={isOpen}
        onClose={(e: any) => toggleDrawer(e, false)}
        onClick={event => event.stopPropagation()}
      >
        <KubernetesStructuredMetadataTableDrawerContent
          kind={kind}
          toggleDrawer={toggleDrawer}
          object={object}
          renderObject={renderObject}
        />
      </Drawer>
    </>
  );
};
