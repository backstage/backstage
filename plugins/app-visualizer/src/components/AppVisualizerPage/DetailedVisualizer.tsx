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

import {
  AppNode,
  AppTree,
  ExtensionDataRef,
  RouteRef,
  coreExtensionData,
  ApiBlueprint,
  NavItemBlueprint,
  ThemeBlueprint,
  useRouteRef,
} from '@backstage/frontend-plugin-api';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import * as colors from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import InputIcon from '@material-ui/icons/InputSharp';
import DisabledIcon from '@material-ui/icons/NotInterestedSharp';
import { Link } from 'react-router-dom';

function createOutputColorGenerator(
  colorMap: { [extDataId: string]: string },
  availableColors: string[],
) {
  const map = new Map<string, string>();
  let i = 0;

  return function getOutputColor(id: string) {
    if (id in colorMap) {
      return colorMap[id];
    }
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

const getOutputColor = createOutputColorGenerator(
  {
    [coreExtensionData.reactElement.id]: colors.green[500],
    [coreExtensionData.routePath.id]: colors.yellow[500],
    [coreExtensionData.routeRef.id]: colors.purple[500],
    [ApiBlueprint.dataRefs.factory.id]: colors.blue[500],
    [ThemeBlueprint.dataRefs.theme.id]: colors.lime[500],
    [NavItemBlueprint.dataRefs.target.id]: colors.orange[500],
  },

  [
    colors.blue[200],
    colors.orange[200],
    colors.green[200],
    colors.red[200],
    colors.yellow[200],
    colors.purple[200],
    colors.lime[200],
  ],
);

interface StyleProps {
  enabled: boolean;
  depth: number;
}

const config = {
  borderWidth: 0.75,
};

const useStyles = makeStyles(theme => ({
  extension: {
    borderLeftWidth: theme.spacing(config.borderWidth),
    borderLeftStyle: 'solid',
    borderLeftColor: ({ depth }: StyleProps) =>
      colors.grey[(700 - (depth % 6) * 100) as keyof typeof colors.grey],
    cursor: 'pointer',

    '&:hover $extensionHeader': {
      color: ({ enabled }: StyleProps) =>
        enabled ? theme.palette.primary.main : theme.palette.text.secondary,
    },
  },
  extensionHeader: {
    display: 'flex',
    alignItems: 'center',
    width: 'fit-content',

    padding: theme.spacing(0.5, 1),
    color: ({ enabled }: StyleProps) =>
      enabled ? theme.palette.text.primary : theme.palette.text.disabled,
    background: theme.palette.background.paper,

    borderTopRightRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
  },
  extensionHeaderId: {
    userSelect: 'all',
  },
  extensionHeaderOutputs: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(1),
    gap: theme.spacing(1),
  },
  attachments: {
    gap: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  attachmentsInput: {
    '&:first-child $attachmentsInputTitle': {
      borderTop: 0,
    },
  },
  attachmentsInputTitle: {
    display: 'flex',
    alignItems: 'center',
    width: 'fit-content',
    padding: theme.spacing(1),

    borderTopWidth: theme.spacing(config.borderWidth),
    borderTopStyle: 'solid',
    borderTopColor: ({ depth }: StyleProps) =>
      colors.grey[(700 - (depth % 6) * 100) as keyof typeof colors.grey],
  },
  attachmentsInputName: {
    marginLeft: theme.spacing(1),
  },
  attachmentsInputChildren: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(0.5),
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const useOutputStyles = makeStyles(theme => ({
  output: ({ color }: { color: string }) => ({
    padding: `0 10px`,
    height: 20,
    borderRadius: 10,
    color: theme.palette.getContrastText(color),
    backgroundColor: color,
  }),
}));

function getFullPath(node?: AppNode): string {
  if (!node) {
    return '';
  }
  const parent = node.edges.attachedTo?.node;
  const part = node.instance?.getData(coreExtensionData.routePath);
  if (!part) {
    return getFullPath(parent);
  }
  return getFullPath(parent) + part;
}

function OutputLink(props: {
  dataRef: ExtensionDataRef<unknown>;
  node?: AppNode;
  className: string;
}) {
  const routeRef = props.node?.instance?.getData(coreExtensionData.routeRef);

  try {
    const link = useRouteRef(routeRef as RouteRef<undefined>);

    return (
      <Tooltip title={<Typography>{props.dataRef.id}</Typography>}>
        <Box className={props.className}>
          {link ? <Link to={link()}>link</Link> : null}
        </Box>
      </Tooltip>
    );
  } catch (ex) {
    // eslint-disable-next-line no-console
    console.warn(
      props.node?.spec.id
        ? `Unable to generate output link for ${props.node.spec.id}`
        : 'Unable to generate output link',
      ex,
    );
    return null;
  }
}

function Output(props: { dataRef: ExtensionDataRef<unknown>; node?: AppNode }) {
  const { dataRef, node } = props;
  const { id } = dataRef;
  const instance = node?.instance;

  const classes = useOutputStyles({ color: getOutputColor(id) });

  if (id === coreExtensionData.routePath.id) {
    return (
      <Tooltip title={<Typography>{getFullPath(node)}</Typography>}>
        <Box className={classes.output}>
          {String(instance?.getData(dataRef) ?? '')}
        </Box>
      </Tooltip>
    );
  }

  if (id === coreExtensionData.routeRef.id) {
    return <OutputLink {...props} className={classes.output} />;
  }

  return (
    <Tooltip title={<Typography>{id}</Typography>}>
      <Box className={classes.output} />
    </Tooltip>
  );
}

function Attachments(props: {
  node: AppNode;
  enabled: boolean;
  depth: number;
}) {
  const { node, enabled, depth } = props;
  const { attachments } = node.edges;

  const classes = useStyles({ enabled, depth });

  if (attachments.size === 0) {
    return null;
  }

  return (
    <Box className={classes.attachments}>
      {[...attachments.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, children]) => {
          return (
            <Box key={key} className={classes.attachmentsInput}>
              <Box className={classes.attachmentsInputTitle}>
                <InputIcon />
                <Typography className={classes.attachmentsInputName}>
                  {key}
                </Typography>
              </Box>
              <Box className={classes.attachmentsInputChildren}>
                {children.map(childNode => (
                  <Extension
                    key={childNode.spec.id}
                    node={childNode}
                    depth={depth + 1}
                  />
                ))}
              </Box>
            </Box>
          );
        })}
    </Box>
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
        <Typography key={part}>{part}</Typography>
      ))}
    </>
  );
}

function Extension(props: { node: AppNode; depth: number }) {
  const { node, depth } = props;

  const enabled = Boolean(node.instance);
  const classes = useStyles({ enabled, depth });

  const dataRefs = node.instance && [...node.instance.getDataRefs()];

  return (
    <Box key={node.spec.id} className={classes.extension}>
      <Box className={classes.extensionHeader}>
        <Tooltip title={<ExtensionTooltip node={node} />}>
          <Typography className={classes.extensionHeaderId}>
            {node.spec.id}
          </Typography>
        </Tooltip>
        <Box className={classes.extensionHeaderOutputs}>
          {dataRefs &&
            dataRefs.length > 0 &&
            dataRefs
              .sort((a, b) => a.id.localeCompare(b.id))
              .map(ref => <Output key={ref.id} dataRef={ref} node={node} />)}
          {!enabled && <DisabledIcon fontSize="small" />}
        </Box>
      </Box>
      <Attachments node={node} enabled={enabled} depth={depth} />
    </Box>
  );
}

const legendMap = {
  'React Element': coreExtensionData.reactElement,
  'Utility API': ApiBlueprint.dataRefs.factory,
  'Route Path': coreExtensionData.routePath,
  'Route Ref': coreExtensionData.routeRef,
  'Nav Target': NavItemBlueprint.dataRefs.target,
  Theme: ThemeBlueprint.dataRefs.theme,
};

function Legend() {
  return (
    <Box
      display="grid"
      maxWidth={600}
      p={1}
      style={{
        grid: 'auto-flow / repeat(3, 1fr)',
        gap: 16,
      }}
    >
      {Object.entries(legendMap).map(([label, dataRef]) => (
        <Box
          key={dataRef.id}
          display="flex"
          style={{ gap: 8 }}
          alignItems="center"
        >
          <Output dataRef={dataRef} />
          <Typography>{label}</Typography>
        </Box>
      ))}
    </Box>
  );
}

export function DetailedVisualizer({ tree }: { tree: AppTree }) {
  return (
    <Box display="flex" height="100%" flex="1 1 100%" flexDirection="column">
      <Box flex="1 1 0" overflow="auto" ml={2} mt={2}>
        <Extension node={tree.root} depth={0} />
      </Box>

      <Box component={Paper} flex="0 0 auto" m={1}>
        <Legend />
      </Box>
    </Box>
  );
}
