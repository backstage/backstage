/*
 * Copyright 2022 The Backstage Authors
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

import React from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { WebFileSystemAccess } from '../../lib/filesystem';

const useStyles = makeStyles(theme => ({
  introText: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
  card: {
    position: 'relative',
    maxWidth: 340,
    marginTop: theme.spacing(4),
    margin: theme.spacing(0, 2),
  },
  infoIcon: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
}));

interface EditorIntroProps {
  style?: JSX.IntrinsicElements['div']['style'];
  onSelect?: (option: 'local' | 'form') => void;
}

export function TemplateEditorIntro(props: EditorIntroProps) {
  const classes = useStyles();
  const supportsLoad = WebFileSystemAccess.isSupported();

  const cardLoadLocal = (
    <Card className={classes.card} elevation={4}>
      <CardActionArea
        disabled={!supportsLoad}
        onClick={() => props.onSelect?.('local')}
      >
        <CardContent>
          <Typography
            variant="h5"
            gutterBottom
            color={supportsLoad ? undefined : 'textSecondary'}
            style={{ display: 'flex', flexFlow: 'row nowrap' }}
          >
            Load Template Directory
          </Typography>
          <Typography
            variant="body1"
            color={supportsLoad ? undefined : 'textSecondary'}
          >
            Load a local template directory, allowing you to both edit and try
            executing your own template.
          </Typography>
        </CardContent>
      </CardActionArea>
      {!supportsLoad && (
        <div className={classes.infoIcon}>
          <Tooltip
            placement="top"
            title="Only supported in some Chromium-based browsers"
          >
            <InfoOutlinedIcon />
          </Tooltip>
        </div>
      )}
    </Card>
  );

  const cardFormEditor = (
    <Card className={classes.card} elevation={4}>
      <CardActionArea onClick={() => props.onSelect?.('form')}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Edit Template Form
          </Typography>
          <Typography variant="body1">
            Preview and edit a template form, either using a sample template or
            by loading a template from the catalog.
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  return (
    <div style={props.style}>
      <Typography variant="h6" className={classes.introText}>
        Get started by choosing one of the options below
      </Typography>
      <div
        style={{
          display: 'flex',
          flexFlow: 'row wrap',
          alignItems: 'flex-start',
          justifyContent: 'center',
          alignContent: 'flex-start',
        }}
      >
        {supportsLoad && cardLoadLocal}
        {cardFormEditor}
        {!supportsLoad && cardLoadLocal}
      </div>
    </div>
  );
}
