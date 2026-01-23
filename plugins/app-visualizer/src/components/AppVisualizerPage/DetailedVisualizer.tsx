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
  coreExtensionData,
  ApiBlueprint,
  NavItemBlueprint,
  ThemeBlueprint,
  useApi,
  routeResolutionApiRef,
} from '@backstage/frontend-plugin-api';
import { Box, Flex, Link, Text, Tooltip, TooltipTrigger } from '@backstage/ui';
import {
  RiInputField as InputIcon,
  RiCloseCircleLine as DisabledIcon,
} from '@remixicon/react';
import { Focusable } from 'react-aria-components';
import { memo, useMemo, useState, useEffect, useRef } from 'react';

function getContrastColor(bgColor: string): string {
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
}

function createOutputColorGenerator(
  colorMap: { [extDataId: string]: string },
  availableColors: string[],
) {
  const map = new Map<string, { backgroundColor: string; color: string }>();
  let i = 0;

  return function getOutputColor(id: string) {
    let backgroundColor: string;
    if (id in colorMap) {
      backgroundColor = colorMap[id];
    } else {
      const cached = map.get(id);
      if (cached) {
        return cached;
      }
      backgroundColor = availableColors[i];
      i += 1;
      if (i >= availableColors.length) {
        i = 0;
      }
    }
    const result = {
      backgroundColor,
      color: getContrastColor(backgroundColor),
    };
    map.set(id, result);
    return result;
  };
}

const getOutputColor = createOutputColorGenerator(
  {
    [coreExtensionData.reactElement.id]: '#4caf50',
    [coreExtensionData.routePath.id]: '#ffeb3b',
    [coreExtensionData.routeRef.id]: '#9c27b0',
    [ApiBlueprint.dataRefs.factory.id]: '#2196f3',
    [ThemeBlueprint.dataRefs.theme.id]: '#cddc39',
    [NavItemBlueprint.dataRefs.target.id]: '#ff9800',
  },

  ['#90caf9', '#ffcc80', '#a5d6a7', '#ef9a9a', '#fff59d', '#ce93d8', '#e6ee9c'],
);

// Helper function to get border color based on depth
function getBorderColor(depth: number): string {
  const greyLevels = [8, 7, 6, 5]; // darker levels that contrast well with background
  const index = depth % greyLevels.length;
  const level = greyLevels[index];
  return `var(--bui-gray-${level})`;
}

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

function collectAllNodes(node: AppNode): AppNode[] {
  const nodes: AppNode[] = [node];
  for (const children of node.edges.attachments.values()) {
    for (const child of children) {
      nodes.push(...collectAllNodes(child));
    }
  }
  return nodes;
}

function useProgressiveRender(rootNode: AppNode) {
  const [renderedNodes, setRenderedNodes] = useState<Set<string>>(new Set());
  const [isComplete, setIsComplete] = useState(false);
  const processingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (processingRef.current) {
      return undefined;
    }

    processingRef.current = true;
    const allNodes = collectAllNodes(rootNode);

    const batchSize = 10;
    let currentIndex = 0;
    const rendered = new Set<string>();

    const processBatch = () => {
      const endIndex = Math.min(currentIndex + batchSize, allNodes.length);
      for (let i = currentIndex; i < endIndex; i++) {
        rendered.add(allNodes[i].spec.id);
      }
      currentIndex = endIndex;

      setRenderedNodes(new Set(rendered));

      if (currentIndex < allNodes.length) {
        timeoutRef.current = setTimeout(processBatch, 0);
      } else {
        setIsComplete(true);
        processingRef.current = false;
        timeoutRef.current = null;
      }
    };

    rendered.add(rootNode.spec.id);
    setRenderedNodes(new Set(rendered));
    currentIndex = 1;

    if (allNodes.length > 1) {
      timeoutRef.current = setTimeout(processBatch, 0);
    } else {
      setIsComplete(true);
      processingRef.current = false;
    }

    return () => {
      processingRef.current = false;
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [rootNode]);

  return { renderedNodes, isComplete };
}

const Output = memo(
  function Output(props: {
    dataRef: ExtensionDataRef<unknown>;
    node?: AppNode;
  }) {
    const { dataRef, node } = props;
    const { id } = dataRef;
    const instance = node?.instance;

    const routeResolutionApi = useApi(routeResolutionApiRef);

    const { backgroundColor, color } = getOutputColor(id);

    const chipStyle: React.CSSProperties = {
      height: 20,
      padding: '0 10px',
      borderRadius: '10px',
      color,
      backgroundColor,
      display: 'flex',
      alignItems: 'center',
      fontWeight:
        'var(--bui-font-weight-regular)' as React.CSSProperties['fontWeight'],
    };

    if (id === coreExtensionData.routeRef.id && node) {
      try {
        const routeRef = props.node?.instance?.getData(
          coreExtensionData.routeRef,
        );
        const link = routeRef && routeResolutionApi.resolve(routeRef)?.();
        if (link) {
          return (
            <TooltipTrigger>
              <Link href={link} style={chipStyle}>
                link
              </Link>
              <Tooltip>{id}</Tooltip>
            </TooltipTrigger>
          );
        }
      } catch {
        /* ignore */
      }
    }

    let tooltip = id;
    let text: string | undefined = undefined;
    if (id === coreExtensionData.routePath.id) {
      text = String(instance?.getData(dataRef) ?? '');
      tooltip = getFullPath(node);
    }

    return (
      <TooltipTrigger>
        <Focusable>
          <Text style={{ ...chipStyle, cursor: 'help' }}>{text}</Text>
        </Focusable>
        <Tooltip style={{ maxWidth: 'unset' }}>{tooltip}</Tooltip>
      </TooltipTrigger>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.dataRef.id === nextProps.dataRef.id &&
      prevProps.node?.spec.id === nextProps.node?.spec.id
    );
  },
);

function AttachmentsComponent(props: {
  node: AppNode;
  enabled: boolean;
  depth: number;
  renderedNodes: Set<string>;
}) {
  const { node, depth, renderedNodes } = props;
  const { attachments } = node.edges;

  const sortedAttachments = useMemo(() => {
    return [...attachments.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [attachments]);

  if (attachments.size === 0) {
    return null;
  }

  return (
    <Flex direction="column" gap="4">
      {sortedAttachments.map(([key, children], idx) => {
        return (
          <Box key={key}>
            <Flex
              p="2"
              align="center"
              style={{
                borderTopWidth: 'var(--bui-space-1_5)',
                borderTopStyle: 'solid',
                borderTopColor: getBorderColor(depth),
                borderTop: idx === 0 ? 'none' : undefined,
                width: 'fit-content',
              }}
            >
              <InputIcon size={16} />
              <div style={{ marginLeft: 'var(--bui-space-2)' }}>{key}</div>
            </Flex>
            <Flex ml="2" mb="2" direction="column" align="start" gap="1">
              {children.map(childNode => (
                <ExtensionComponent
                  key={childNode.spec.id}
                  node={childNode}
                  depth={depth + 1}
                  renderedNodes={renderedNodes}
                />
              ))}
            </Flex>
          </Box>
        );
      })}
    </Flex>
  );
}

function ExtensionComponent(props: {
  node: AppNode;
  depth: number;
  renderedNodes: Set<string>;
}) {
  const { node, depth, renderedNodes } = props;

  const enabled = Boolean(node.instance);

  const tooltipText = useMemo(() => {
    const tooltipParts = [];
    let currentNode = node;
    tooltipParts.push(currentNode.spec.id);
    while (currentNode.edges.attachedTo) {
      const input = currentNode.edges.attachedTo.input;
      currentNode = currentNode.edges.attachedTo.node;
      tooltipParts.push(`${currentNode.spec.id} [${input}]`);
    }
    tooltipParts.reverse();
    return tooltipParts.join('\n');
  }, [node]);

  const sortedDataRefs = useMemo(() => {
    if (!node.instance) {
      return [];
    }
    const dataRefs = [...node.instance.getDataRefs()];
    return dataRefs.sort((a, b) => a.id.localeCompare(b.id));
  }, [node.instance]);

  const shouldRender = renderedNodes.has(node.spec.id);

  if (!shouldRender) {
    return null;
  }

  return (
    <Box
      key={node.spec.id}
      style={{
        borderLeftWidth: 'var(--bui-space-1_5)',
        borderLeftStyle: 'solid',
        borderLeftColor: getBorderColor(depth),
      }}
    >
      <Flex
        py="1"
        px="2"
        align="center"
        style={{
          width: 'fit-content',
          color: enabled ? 'var(--bui-fg-primary)' : 'var(--bui-fg-disabled)',
          background: 'var(--bui-bg-surface-1)',
          borderTopRightRadius: 'var(--bui-radius-2)',
          borderBottomRightRadius: 'var(--bui-radius-2)',
        }}
      >
        <TooltipTrigger>
          <Focusable>
            <Text style={{ userSelect: 'all' }}>{node.spec.id}</Text>
          </Focusable>
          <Tooltip style={{ maxWidth: 'unset' }}>
            <Text style={{ whiteSpace: 'pre-wrap' }}>{tooltipText}</Text>
          </Tooltip>
        </TooltipTrigger>
        <Flex ml="2" align="center" gap="2">
          {sortedDataRefs.length > 0 &&
            sortedDataRefs.map(ref => (
              <Output key={ref.id} dataRef={ref} node={node} />
            ))}
          {!enabled && <DisabledIcon size={16} />}
        </Flex>
      </Flex>
      <AttachmentsComponent
        node={node}
        enabled={enabled}
        depth={depth}
        renderedNodes={renderedNodes}
      />
    </Box>
  );
}

const Extension = memo(ExtensionComponent, (prevProps, nextProps) => {
  if (
    prevProps.node.spec.id !== nextProps.node.spec.id ||
    prevProps.depth !== nextProps.depth
  ) {
    return false;
  }

  const nodeId = prevProps.node.spec.id;
  const wasRendered = prevProps.renderedNodes.has(nodeId);
  const isRendered = nextProps.renderedNodes.has(nodeId);

  if (wasRendered !== isRendered) {
    return false;
  }

  if (prevProps.renderedNodes.size !== nextProps.renderedNodes.size) {
    return false;
  }

  for (const children of prevProps.node.edges.attachments.values()) {
    for (const child of children) {
      const wasChildRendered = prevProps.renderedNodes.has(child.spec.id);
      const isChildRendered = nextProps.renderedNodes.has(child.spec.id);
      if (wasChildRendered !== isChildRendered) {
        return false;
      }
    }
  }

  return true;
});

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
      p="2"
      style={{
        display: 'grid',
        maxWidth: 600,
        grid: 'auto-flow / repeat(3, 1fr)',
        gap: 'var(--bui-space-4)',
      }}
    >
      {Object.entries(legendMap).map(([label, dataRef]) => (
        <Flex key={dataRef.id} gap="2" align="center">
          <Output dataRef={dataRef} />
          <div>{label}</div>
        </Flex>
      ))}
    </Box>
  );
}

export function DetailedVisualizer({ tree }: { tree: AppTree }) {
  const { renderedNodes } = useProgressiveRender(tree.root);

  return (
    <Flex direction="column" style={{ height: '100%', flex: '1 1 100%' }}>
      <Box ml="4" mt="4" style={{ flex: '1 1 0', overflow: 'auto' }}>
        <Extension node={tree.root} depth={0} renderedNodes={renderedNodes} />
      </Box>

      <Box
        m="2"
        style={{
          flex: '0 0 auto',
          background: 'var(--bui-bg-surface-1)',
          border: '1px solid var(--bui-border)',
          borderRadius: 'var(--bui-radius-2)',
        }}
      >
        <Legend />
      </Box>
    </Flex>
  );
}
