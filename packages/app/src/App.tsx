/*
 * Copyright 2020 Spotify AB
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
  createApp,
  AlertDisplay,
  OAuthRequestDialog,
  SignInPage,
  createRouteRef,
} from '@backstage/core';
import { HotKeys } from 'react-hotkeys';
import { Dialog, DialogTitle, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { FC, useState } from 'react';
import Root from './components/Root';
import * as plugins from './plugins';
import { apis } from './apis';
import { hot } from 'react-hot-loader/root';
import { providers } from './identityProviders';
import { Router as CatalogRouter } from '@backstage/plugin-catalog';
import { Router as DocsRouter } from '@backstage/plugin-techdocs';
import { Router as GraphiQLRouter } from '@backstage/plugin-graphiql';
import { Router as TechRadarRouter } from '@backstage/plugin-tech-radar';
import { Router as LighthouseRouter } from '@backstage/plugin-lighthouse';
import { Router as RegisterComponentRouter } from '@backstage/plugin-register-component';
import { Router as SettingsRouter } from '@backstage/plugin-user-settings';
import { Route, Routes, Navigate, useNavigate } from 'react-router';
import { EntityPage } from './components/catalog/EntityPage';

const app = createApp({
  apis,
  plugins: Object.values(plugins),
  components: {
    SignInPage: props => {
      return (
        <SignInPage
          {...props}
          providers={['guest', 'custom', ...providers]}
          title="Select a sign-in method"
          align="center"
        />
      );
    },
  },
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();
const deprecatedAppRoutes = app.getRoutes();

const catalogRouteRef = createRouteRef({
  path: '/catalog',
  title: 'Service Catalog',
});

const AppRoutes = () => (
  <Routes>
    <Navigate key="/" to="/catalog" />
    <Route
      path={`${catalogRouteRef.path}/*`}
      element={<CatalogRouter EntityPage={EntityPage} />}
    />
    <Route path="/docs/*" element={<DocsRouter />} />
    <Route
      path="/tech-radar"
      element={<TechRadarRouter width={1500} height={800} />}
    />
    <Route path="/graphiql" element={<GraphiQLRouter />} />
    <Route path="/lighthouse/*" element={<LighthouseRouter />} />
    <Route
      path="/register-component"
      element={<RegisterComponentRouter catalogRouteRef={catalogRouteRef} />}
    />
    <Route path="/settings" element={<SettingsRouter />} />
    {...deprecatedAppRoutes}
  </Routes>
);

const keyMap = {
  SHOW_QUICK_JUMP: 'command+/',
  HIDE_QUICK_JUMP: ['escape', 'enter', 'command+?'],
};

const quickJumpPaths = [
  { label: '/' },
  { label: '/Component/playback-order' },
  { label: '/Component/searcher' },
  { label: '/Component/shuffle-api' },
];

const QuickJump = (props: { onClose: Function; open: boolean }) => {
  const { onClose, open } = props;
  const navigate = useNavigate();
  const handleClose = () => {
    onClose();
  };

  const [text, setText] = useState<string>('');

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle>
      <form
        onSubmit={e => {
          if (text) {
            navigate(`/catalog/${text}`);
            onClose();
          }
          e.preventDefault();
        }}
      >
        <Autocomplete
          id="combo-box-demo"
          options={quickJumpPaths}
          getOptionLabel={option => option.label ?? ''}
          style={{ width: 300 }}
          value={{ label: text }}
          onChange={(e, v) => {
            setText(v?.label ?? '');
          }}
          openOnFocus
          renderInput={params => (
            <TextField
              {...params}
              // eslint-disable-next-line
              autoFocus
              variant="outlined"
              InputProps={{
                inputRef: params.InputProps.ref,
                ...params.inputProps,
              }}
            />
          )}
        />
      </form>
    </Dialog>
  );
};

const App: FC<{}> = () => {
  const [open, setOpen] = useState(false);
  const showQuickJump = React.useCallback(() => {
    setOpen(true);
  }, []);
  const hideQuickJump = React.useCallback(() => {
    setOpen(false);
  }, []);

  const handlers = {
    SHOW_QUICK_JUMP: showQuickJump,
    HIDE_QUICK_JUMP: hideQuickJump,
  };
  return (
    <HotKeys keyMap={keyMap}>
      <HotKeys handlers={handlers}>
        <AppProvider>
          <AlertDisplay />
          <OAuthRequestDialog />
          <AppRouter>
            <QuickJump open={open} onClose={hideQuickJump} />
            <Root>
              <AppRoutes />
            </Root>
          </AppRouter>
        </AppProvider>
      </HotKeys>
    </HotKeys>
  );
};

export default hot(App);
