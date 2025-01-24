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
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
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
import { ClusterAttributes } from '@backstage/plugin-kubernetes-common';
import { ManifestYaml } from './ManifestYaml';
import { useApi } from '@backstage/core-plugin-api';
import { kubernetesClusterLinkFormatterApiRef } from '../../api';
import useAsync from 'react-use/esm/useAsync';

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

/**
 *
 *
 * @public
 */
export type LinkErrorPanelProps = {
  cluster: ClusterAttributes;
  errorMessage?: string;
  children?: React.ReactNode;
};

/**
 *
 *
 * @public
 */
export const LinkErrorPanel = ({
  cluster,
  errorMessage,
}: LinkErrorPanelProps) => (
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

/**
 *
 *
 * @public
 */
export interface KubernetesDrawerable {
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

const KubernetesStructuredMetadataTableDrawerContent = <
  T extends KubernetesDrawerable,
>({
  toggleDrawer,
  object,
  renderObject,
  kind,
}: KubernetesStructuredMetadataTableDrawerContentProps<T>) => {
  const [isYaml, setIsYaml] = useState<boolean>(false);

  const formatter = useApi(kubernetesClusterLinkFormatterApiRef);
  const classes = useDrawerContentStyles();
  const cluster = useContext(ClusterContext);
  const { value: clusterLink, error } = useAsync(
    async () =>
      formatter.formatClusterLink({
        dashboardUrl: cluster.dashboardUrl,
        dashboardApp: cluster.dashboardApp,
        dashboardParameters: cluster.dashboardParameters,
        object,
        kind,
      }),
    [cluster, object, kind, formatter],
  );

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
      {error && (
        <div className={classes.errorMessage}>
          <LinkErrorPanel
            cluster={cluster}
            errorMessage={error.message || error.toString()}
          />
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
            options={{ nestedValuesAsYaml: true }}
          />
        )}
      </div>
    </>
  );
};

/**
 *
 * @public
 */
export interface KubernetesStructuredMetadataTableDrawerProps<
  T extends KubernetesDrawerable,
> {
  object: T;
  renderObject: (obj: T) => object;
  buttonVariant?: 'h5' | 'subtitle2';
  kind: string;
  expanded?: boolean;
  children?: React.ReactNode;
}

/**
 *
 * @public
 */
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
