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

import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  CSSProperties,
} from 'react';

import { useDebounce } from 'react-use';

import { DrawerProvider } from '../contexts/drawer-provider';
import type { RealDrawer } from '../contexts/types';
import { combineClasses } from '../ui/styles';

import { DrawerHeader } from './drawer-header';
import { commonSizes } from './types';
import { useRenderableComponent } from './use-renderable-component';
import { useStyles } from './styles';

export interface DrawerProps {
  drawer: RealDrawer;
  index: number;
  left: number;
  onSize: (width: number, index: number) => void;
}

export function DrawerPane({ drawer, index, left, onSize }: DrawerProps) {
  const { extraDrawerSticky, extraDrawerHiding, extraDrawer } = useStyles();
  const [show, setShow] = useState(false);

  const hide = useCallback(() => setShow(false), [setShow]);

  const component = useRenderableComponent(drawer.content);

  const hasContent = !!drawer.content;

  useEffect(() => {
    onSize(400, index);
  }, [onSize, index]);

  useEffect(() => {
    if (hasContent) setShow(true);
  }, [hasContent]);

  useDebounce(
    () => {
      if (!hasContent) setShow(false);
    },
    200,
    [setShow, hasContent],
  );

  const drawerStyles = useMemo(
    (): CSSProperties => ({
      left,
      width: 400,
      height: `calc(100vh - ${commonSizes.panelMargin * 2}px)`,
      zIndex: 1000 - index,
    }),
    [left, index],
  );

  const renderComponent = () => {
    if (component?.Standalone) {
      return <component.Standalone />;
    }
    if (component?.WithPath) {
      return (
        <component.WithPath.Component
          params={{}}
          path={component.WithPath.path}
        />
      );
    }
    return null;
  };

  return !show ? null : (
    <div className={extraDrawerSticky}>
      <div
        className={combineClasses(
          extraDrawer,
          !component ? extraDrawerHiding : '',
        )}
        style={drawerStyles}
      >
        <div>
          <DrawerProvider drawer={drawer}>
            <DrawerHeader hide={hide} path={component?.WithPath?.path} />
            {renderComponent()}
          </DrawerProvider>
        </div>
      </div>
    </div>
  );
}
