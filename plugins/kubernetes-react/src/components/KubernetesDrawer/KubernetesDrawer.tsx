/*
 * Copyright 2023 The Backstage Authors
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
import React, { ChangeEvent, useState } from 'react';

import { IObjectMeta } from '@kubernetes-models/apimachinery/apis/meta/v1/ObjectMeta';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { ManifestYaml } from './ManifestYaml';

const useDrawerContentStyles = makeStyles((_theme: Theme) =>
  createStyles({
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    content: {
      height: '80%',
    },
    icon: {
      fontSize: 20,
    },
  }),
);

/**
 * The type of object that can be represented by the Drawer
 *
 * @public
 */
export interface KubernetesObject {
  kind: string;
  metadata?: IObjectMeta;
}

interface KubernetesDrawerContentProps {
  close: () => void;
  kubernetesObject: KubernetesObject;
  header?: React.ReactNode;
  children?: React.ReactNode;
}

const KubernetesDrawerContent = ({
  children,
  header,
  kubernetesObject,
  close,
}: KubernetesDrawerContentProps) => {
  const classes = useDrawerContentStyles();
  const [isYaml, setIsYaml] = useState<boolean>(false);

  return (
    <>
      <div className={classes.header}>
        <Grid container justifyContent="flex-start" alignItems="flex-start">
          <Grid item xs={11}>
            <Typography variant="h5">
              {kubernetesObject.metadata?.name}
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              key="dismiss"
              title="Close the drawer"
              onClick={() => close()}
              color="inherit"
            >
              <CloseIcon className={classes.icon} />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            {header}
          </Grid>
          <Grid item xs={12}>
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
      <div className={classes.content}>
        {isYaml && <ManifestYaml object={kubernetesObject} />}
        {!isYaml && children}
      </div>
    </>
  );
};

/**
 * Props of KubernetesDrawer
 *
 * @public
 */
export interface KubernetesDrawerProps {
  open?: boolean;
  kubernetesObject: KubernetesObject;
  label: React.ReactNode;
  drawerContentsHeader?: React.ReactNode;
  children?: React.ReactNode;
}

const useDrawerStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '50%',
      justifyContent: 'space-between',
      padding: theme.spacing(2.5),
    },
  }),
);

const DrawerButton = withStyles({
  root: {
    padding: '6px 5px',
  },
  label: {
    textTransform: 'none',
  },
})(Button);

/**
 * Button/Drawer component for Kubernetes Objects
 *
 * @public
 */
export const KubernetesDrawer = ({
  open,
  label,
  drawerContentsHeader,
  kubernetesObject,
  children,
}: KubernetesDrawerProps) => {
  const classes = useDrawerStyles();
  const [isOpen, setIsOpen] = useState<boolean>(open ?? false);

  const toggleDrawer = (e: ChangeEvent<{}>, newValue: boolean) => {
    e.stopPropagation();
    setIsOpen(newValue);
  };

  return (
    <>
      <DrawerButton onClick={() => setIsOpen(true)}>{label}</DrawerButton>
      <Drawer
        classes={{
          paper: classes.paper,
        }}
        anchor="right"
        open={isOpen}
        onClose={(e: any) => toggleDrawer(e, false)}
        onClick={event => event.stopPropagation()}
      >
        {isOpen && (
          <KubernetesDrawerContent
            header={drawerContentsHeader}
            kubernetesObject={kubernetesObject}
            children={children}
            close={() => setIsOpen(false)}
          />
        )}
      </Drawer>
    </>
  );
};
