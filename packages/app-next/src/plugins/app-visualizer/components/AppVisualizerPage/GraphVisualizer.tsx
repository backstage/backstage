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

import { AppNode, AppTree } from '@backstage/frontend-plugin-api';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import * as colors from '@material-ui/core/colors';
import { Theme, makeStyles } from '@material-ui/core/styles';
import InputIcon from '@material-ui/icons/InputSharp';
import React from 'react';

function createOutputColorGenerator(availableColors: string[]) {
  const map = new Map<string, string>();
  let i = 0;

  return function getOutputColor(id: string) {
    let color = map.get(id);
    if (color) {
      return color;
    }
    color = availableColors[i];
    i += 1;
    if (i >= availableColors.length) {
      i = 0;
    }
    map.set(id, color);
    return color;
  };
}

const getOutputColor = createOutputColorGenerator([
  colors.green[500],
  colors.blue[500],
  colors.yellow[500],
  colors.purple[500],
  colors.orange[500],
  colors.red[500],
  colors.lime[500],
  colors.green[200],
  colors.blue[200],
  colors.yellow[200],
  colors.purple[200],
  colors.orange[200],
  colors.red[200],
  colors.lime[200],
]);

interface StyleProps {
  enabled: boolean;
}

function mainColor(theme: Theme) {
  return ({ enabled }: StyleProps) =>
    enabled ? theme.palette.primary.main : colors.grey[600];
}

function hoverColor(theme: Theme) {
  return ({ enabled }: StyleProps) =>
    enabled ? theme.palette.primary.dark : colors.grey[500];
}

const useStyles = makeStyles(theme => ({
  extension: {
    borderLeftWidth: theme.spacing(1),
    borderLeftStyle: 'solid',
    borderLeftColor: mainColor(theme),
    marginBottom: theme.spacing(0.5),
    cursor: 'pointer',
    fontSize: theme.typography.h6.fontSize,

    '&:hover': {
      borderLeftColor: hoverColor(theme),
    },
    '&:hover $extensionHeader': {
      background: hoverColor(theme),
    },
  },
  extensionHeader: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    width: 'fit-content',
    padding: theme.spacing(0.5, 1),
    background: mainColor(theme),
  },
  extensionHeaderId: {
    flex: '0 0 auto',
    color: theme.palette.primary.contrastText,
  },
  extensionHeaderOutputs: {
    margin: theme.spacing(0, 0.5),
    marginTop: 1,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
  },
  extensionTooltip: {
    fontSize: theme.typography.h6.fontSize,
    maxWidth: 'unset',
  },
  output: {
    marginLeft: theme.spacing(1),
    width: theme.spacing(2.3),
    height: theme.spacing(2.3),
    borderRadius: '50%',
  },
  outputId: {
    maxWidth: 'unset',
    padding: theme.spacing(1),
    fontSize: theme.typography.h6.fontSize,
  },
  extensionDisabledIcon: {
    marginLeft: theme.spacing(1),
  },
  attachments: {},
  attachmentsInput: () => ({
    marginBottom: theme.spacing(1),

    '&:not(:first-child) $attachmentsInputTitle': {
      borderTopWidth: theme.spacing(1),
      borderTopStyle: 'solid',
      borderTopColor: mainColor(theme),
    },
    '&:not(:first-child):hover $attachmentsInputTitle': {
      borderTopColor: hoverColor(theme),
    },
  }),
  attachmentsInputTitle: () => ({
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    width: 'fit-content',
    padding: theme.spacing(1, 2),
  }),
  attachmentsInputIcon: {},
  attachmentsInputName: {
    marginLeft: theme.spacing(1),
    color: theme.palette.text.primary,
  },
  attachmentsInputChildren: {
    marginLeft: theme.spacing(1),
  },
}));

function Output(props: { id: string; enabled: boolean }) {
  const { id, enabled } = props;
  const classes = useStyles({ enabled });

  return (
    <Tooltip title={id} classes={{ tooltip: classes.outputId }}>
      <div
        className={classes.output}
        style={{ background: getOutputColor(id) }}
      />
    </Tooltip>
  );
}

function Attachments(props: {
  attachments: ReadonlyMap<string, AppNode[]>;
  enabled: boolean;
}) {
  const { attachments, enabled } = props;

  const classes = useStyles({ enabled });

  if (attachments.size === 0) {
    return null;
  }

  return (
    <div className={classes.attachments}>
      {[...attachments.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, v]) => {
          const children = v.sort((a, b) => a.spec.id.localeCompare(b.spec.id));

          return (
            <div key={key} className={classes.attachmentsInput}>
              <div className={classes.attachmentsInputTitle}>
                <InputIcon className={classes.attachmentsInputIcon} />
                <div className={classes.attachmentsInputName}>{key}</div>
              </div>
              <div className={classes.attachmentsInputChildren}>
                {children.map(node => (
                  <Extension key={node.spec.id} node={node} />
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
}

function ExtensionTooltip(props: { node: AppNode }) {
  const parts = [];
  let node = props.node;
  parts.push(node.spec.id);
  while (node.edges.attachedTo) {
    const input = node.edges.attachedTo.input;
    node = node.edges.attachedTo.node;
    parts.push(`${node.spec.id} [${input}]`);
  }
  parts.reverse();

  return (
    <>
      {parts.map(part => (
        <div key={part}>{part}</div>
      ))}
    </>
  );
}

function Extension(props: { node: AppNode }) {
  const { node } = props;

  const enabled = Boolean(node.instance);
  const classes = useStyles({ enabled });

  const dataRefIds =
    node.instance && [...node.instance.getDataRefs()].map(r => r.id);

  return (
    <div key={node.spec.id} className={classes.extension}>
      <div className={classes.extensionHeader}>
        <Tooltip
          title={<ExtensionTooltip node={node} />}
          classes={{ tooltip: classes.extensionTooltip }}
        >
          <div className={classes.extensionHeaderId}>{node.spec.id}</div>
        </Tooltip>
        <div className={classes.extensionHeaderOutputs}>
          {dataRefIds &&
            dataRefIds.length > 0 &&
            [...dataRefIds]
              .sort()
              .map(id => <Output key={id} id={id} enabled={enabled} />)}
        </div>
      </div>
      <Attachments attachments={node.edges.attachments} enabled={enabled} />
    </div>
  );
}

export function GraphVisualizer({ tree }: { tree: AppTree }) {
  return (
    <Box margin={3}>
      <Extension node={tree.root} />
    </Box>
  );
}
