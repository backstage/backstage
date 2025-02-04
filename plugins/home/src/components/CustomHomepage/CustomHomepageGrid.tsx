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

import React, { useCallback, useMemo } from 'react';
import { Layout, Layouts, Responsive, WidthProvider } from 'react-grid-layout';
import {
  ElementCollection,
  getComponentData,
  storageApiRef,
  useApi,
  useElementFilter,
} from '@backstage/core-plugin-api';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import Dialog from '@material-ui/core/Dialog';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';
import { compact } from 'lodash';
import useObservable from 'react-use/esm/useObservable';
import { ContentHeader, ErrorBoundary } from '@backstage/core-components';
import Typography from '@material-ui/core/Typography';
import { WidgetSettingsOverlay } from './WidgetSettingsOverlay';
import { AddWidgetDialog } from './AddWidgetDialog';
import { CustomHomepageButtons } from './CustomHomepageButtons';
import {
  CustomHomepageGridProps,
  CustomHomepageGridStateV1,
  CustomHomepageGridStateV1Schema,
  GridWidget,
  LayoutConfiguration,
  LayoutConfigurationSchema,
  Widget,
  WidgetSchema,
} from './types';
import { CardConfig } from '@backstage/plugin-home-react';

// eslint-disable-next-line new-cap
const ResponsiveGrid = WidthProvider(Responsive);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    responsiveGrid: {
      '& .react-grid-item > .react-resizable-handle:after': {
        position: 'absolute',
        content: '""',
        borderStyle: 'solid',
        borderWidth: '0 0 20px 20px',
        borderColor: `transparent transparent ${theme.palette.primary.light} transparent`,
      },
    },
    contentHeaderBtn: {
      marginLeft: theme.spacing(2),
    },
    widgetWrapper: {
      '& > div[class*="MuiCard-root"]': {
        width: '100%',
        height: '100%',
      },
      '& div[class*="MuiCardContent-root"]': {
        overflow: 'auto',
      },
      '& + .react-grid-placeholder': {
        backgroundColor: theme.palette.primary.light,
      },
      '&.edit > :active': {
        cursor: 'move',
      },
    },
  }),
);

function useHomeStorage(
  defaultWidgets: GridWidget[],
): [GridWidget[], (value: GridWidget[]) => void] {
  const key = 'home';
  const storageApi = useApi(storageApiRef).forBucket('home.customHomepage');
  // TODO: Support multiple home pages
  const setWidgets = useCallback(
    (value: GridWidget[]) => {
      const grid: CustomHomepageGridStateV1 = {
        version: 1,
        pages: {
          default: value,
        },
      };
      storageApi.set(key, JSON.stringify(grid));
    },
    [key, storageApi],
  );
  const homeSnapshot = useObservable(
    storageApi.observe$<string>(key),
    storageApi.snapshot(key),
  );
  const widgets: GridWidget[] = useMemo(() => {
    if (homeSnapshot.presence === 'absent') {
      return defaultWidgets;
    }
    try {
      const grid: CustomHomepageGridStateV1 = JSON.parse(homeSnapshot.value!);
      return CustomHomepageGridStateV1Schema.parse(grid).pages.default;
    } catch (e) {
      return defaultWidgets;
    }
  }, [homeSnapshot, defaultWidgets]);

  return [widgets, setWidgets];
}

const convertConfigToDefaultWidgets = (
  config: LayoutConfiguration[],
  availableWidgets: Widget[],
): GridWidget[] => {
  const ret = config.map((conf, i) => {
    const c = LayoutConfigurationSchema.parse(conf);
    const name = React.isValidElement(c.component)
      ? getComponentData(c.component, 'core.extensionName')
      : (c.component as unknown as string);
    if (!name) {
      return null;
    }
    const widget = availableWidgets.find(w => w.name === name);
    if (!widget) {
      return null;
    }
    const widgetId = `${widget.name}__${i}${Math.random()
      .toString(36)
      .slice(2)}`;
    return {
      id: widgetId,
      layout: {
        i: widgetId,
        x: c.x,
        y: c.y,
        w: Math.min(widget.maxWidth ?? Number.MAX_VALUE, c.width),
        h: Math.min(widget.maxHeight ?? Number.MAX_VALUE, c.height),
        minW: widget.minWidth,
        maxW: widget.maxWidth,
        minH: widget.minHeight,
        maxH: widget.maxHeight,
        isDraggable: false,
        isResizable: false,
      },
      settings: {},
      movable: conf.movable,
      deletable: conf.deletable,
      resizable: conf.resizable,
    };
  });
  return compact(ret);
};

const availableWidgetsFilter = (elements: ElementCollection) => {
  return elements
    .selectByComponentData({
      key: 'core.extensionName',
    })
    .getElements<Widget>()
    .flatMap(elem => {
      const config = getComponentData<CardConfig>(elem, 'home.widget.config');
      return [
        WidgetSchema.parse({
          component: elem,
          name: getComponentData<string>(elem, 'core.extensionName'),
          title: getComponentData<string>(elem, 'title'),
          description: getComponentData<string>(elem, 'description'),
          settingsSchema: config?.settings?.schema,
          uiSchema: config?.settings?.uiSchema,
          width: config?.layout?.width?.defaultColumns,
          minWidth: config?.layout?.width?.minColumns,
          maxWidth: config?.layout?.width?.maxColumns,
          height: config?.layout?.height?.defaultRows,
          minHeight: config?.layout?.height?.minRows,
          maxHeight: config?.layout?.height?.maxRows,
        }),
      ];
    });
};

/**
 * A component that allows customizing components in home grid layout.
 *
 * @public
 */
export const CustomHomepageGrid = (props: CustomHomepageGridProps) => {
  const styles = useStyles();
  const theme = useTheme();
  const availableWidgets = useElementFilter(
    props.children,
    availableWidgetsFilter,
    [props],
  );
  const defaultLayout = useMemo(() => {
    return props.config
      ? convertConfigToDefaultWidgets(props.config, availableWidgets)
      : [];
  }, [props.config, availableWidgets]);
  const [widgets, setWidgets] = useHomeStorage(defaultLayout);
  const [addWidgetDialogOpen, setAddWidgetDialogOpen] = React.useState(false);
  const editModeOn = widgets.find(w => w.layout.isResizable) !== undefined;
  const [editMode, setEditMode] = React.useState(editModeOn);
  const getWidgetByName = (name: string) => {
    return availableWidgets.find(widget => widget.name === name);
  };

  const getWidgetNameFromKey = (key: string) => {
    return key.split('__')[0];
  };

  const handleAdd = (widget: Widget) => {
    const widgetId = `${widget.name}__${widgets.length + 1}${Math.random()
      .toString(36)
      .slice(2)}`;

    setWidgets([
      ...widgets,
      {
        id: widgetId,
        layout: {
          i: widgetId,
          x: 0,
          y: Math.max(...widgets.map(w => w.layout.y + w.layout.h)) + 1,
          w: Math.min(widget.maxWidth ?? Number.MAX_VALUE, widget.width ?? 12),
          h: Math.min(widget.maxHeight ?? Number.MAX_VALUE, widget.height ?? 4),
          minW: widget.minWidth,
          maxW: widget.maxWidth,
          minH: widget.minHeight,
          maxH: widget.maxHeight,
          isResizable: editMode,
          isDraggable: editMode,
        },
        settings: {},
        movable: widget.movable,
        deletable: widget.deletable,
        resizable: widget.resizable,
      },
    ]);
    setAddWidgetDialogOpen(false);
  };

  const handleRemove = (widgetId: string) => {
    setWidgets(widgets.filter(w => w.id !== widgetId));
  };

  const handleSettingsSave = (
    widgetId: string,
    widgetSettings: Record<string, any>,
  ) => {
    const idx = widgets.findIndex(w => w.id === widgetId);
    if (idx >= 0) {
      const widget = widgets[idx];
      widget.settings = widgetSettings;
      widgets[idx] = widget;
      setWidgets(widgets);
    }
  };

  const clearLayout = () => {
    setWidgets([]);
  };

  const changeEditMode = (mode: boolean) => {
    setEditMode(mode);
    setWidgets(
      widgets.map(w => {
        const resizable = w.resizable === false ? false : mode;
        const movable = w.movable === false ? false : mode;
        return {
          ...w,
          layout: { ...w.layout, isDraggable: movable, isResizable: resizable },
        };
      }),
    );
  };

  const handleLayoutChange = (newLayout: Layout[], _: Layouts) => {
    if (editMode) {
      const newWidgets = newLayout.map(l => {
        const widget = widgets.find(w => w.id === l.i);
        return {
          ...widget,
          layout: l,
        } as GridWidget;
      });
      setWidgets(newWidgets);
    }
  };

  const handleRestoreDefaultConfig = () => {
    setWidgets(
      defaultLayout.map(w => {
        const resizable = w.resizable === false ? false : editMode;
        const movable = w.movable === false ? false : editMode;
        return {
          ...w,
          layout: {
            ...w.layout,
            isDraggable: movable,
            isResizable: resizable,
          },
        };
      }),
    );
  };

  return (
    <>
      <ContentHeader title="">
        <CustomHomepageButtons
          editMode={editMode}
          numWidgets={widgets.length}
          clearLayout={clearLayout}
          setAddWidgetDialogOpen={setAddWidgetDialogOpen}
          changeEditMode={changeEditMode}
          defaultConfigAvailable={props.config !== undefined}
          restoreDefault={handleRestoreDefaultConfig}
        />
      </ContentHeader>
      <Dialog
        open={addWidgetDialogOpen}
        onClose={() => setAddWidgetDialogOpen(false)}
      >
        <AddWidgetDialog widgets={availableWidgets} handleAdd={handleAdd} />
      </Dialog>
      {!editMode && widgets.length === 0 && (
        <Typography variant="h5" align="center">
          No widgets added. Start by clicking the 'Add widget' button.
        </Typography>
      )}
      <ResponsiveGrid
        className={styles.responsiveGrid}
        measureBeforeMount
        compactType={props.compactType}
        style={props.style}
        allowOverlap={props.allowOverlap}
        preventCollision={props.preventCollision ?? true}
        draggableCancel=".overlayGridItem,.widgetSettingsDialog,.disabled"
        containerPadding={props.containerPadding}
        margin={props.containerMargin}
        breakpoints={
          props.breakpoints ? props.breakpoints : theme.breakpoints.values
        }
        cols={
          props.cols
            ? props.cols
            : { xl: 12, lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
        }
        rowHeight={props.rowHeight ?? 60}
        onLayoutChange={handleLayoutChange}
        layouts={{ xl: widgets.map(w => w.layout) }}
      >
        {widgets.map((w: GridWidget) => {
          const l = w.layout;
          const widgetName = getWidgetNameFromKey(l.i);
          const widget = getWidgetByName(widgetName);
          if (!widget || !widget.component) {
            return null;
          }

          const widgetProps = {
            ...widget.component.props,
            ...(w.settings ?? {}),
          };

          return (
            <div
              key={l.i}
              className={`${styles.widgetWrapper} ${editMode && 'edit'} ${
                w.movable === false && 'disabled'
              }`}
            >
              <ErrorBoundary>
                <widget.component.type {...widgetProps} />
              </ErrorBoundary>
              {editMode && (
                <WidgetSettingsOverlay
                  id={l.i}
                  widget={widget}
                  handleRemove={handleRemove}
                  handleSettingsSave={handleSettingsSave}
                  settings={w.settings}
                  deletable={w.deletable}
                />
              )}
            </div>
          );
        })}
      </ResponsiveGrid>
    </>
  );
};
