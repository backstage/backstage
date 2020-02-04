import { FC, ComponentType } from 'react';
import { createPlugin, PluginManager } from 'shared/pluginApi';
import { RouteOptions, RedirectOptions } from './createPlugin';
import BackstageMenuItem from 'shared/apis/menu/BackstageMenuItem';

import { registerFeatureFlag } from 'shared/apis/featureFlags/featureFlagsActions';
import FeatureFlags from 'shared/apis/featureFlags/featureFlags';

jest.mock('shared/apis/featureFlags/featureFlagsActions');
jest.mock('shared/apis/featureFlags/featureFlags');

describe('createPlugin', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('creates simple plugin', () => {
    const MyPlugin = createPlugin({
      manifest: { id: 'my-plugin' },
      register() {},
    });
    const plugin = new MyPlugin({} as PluginManager);
    expect(plugin.id).toBe('my-plugin');
  });

  it('adds some routes', () => {
    const Component1: FC<{}> = () => null;
    const Component2: FC<{}> = () => null;
    const Component3: FC<{}> = () => null;

    const mockManager = {
      routes: [],
      registerRoute: jest.fn<void, [string, ComponentType<any>, RouteOptions | undefined]>(),
    };

    const MyPlugin = createPlugin({
      manifest: { id: 'my-plugin' },
      register({ router }) {
        router.registerRoute('/route1', Component1);
        router.registerRoute('/route2', Component2, { exact: false });
        router.registerRoute('/route3', Component3, { exact: true });
      },
    });

    const plugin = new MyPlugin((mockManager as unknown) as PluginManager);

    expect(mockManager.registerRoute).toHaveBeenCalledTimes(0);
    plugin.initialize();
    expect(mockManager.registerRoute).toHaveBeenCalledTimes(3);

    const [[route1], [route2], [route3]] = mockManager.registerRoute.mock.calls;
    expect(route1).toMatchObject({ path: '/route1', component: Component1, exact: true });
    expect(route2).toMatchObject({ path: '/route2', component: Component2, exact: false });
    expect(route3).toMatchObject({ path: '/route3', component: Component3, exact: true });
  });

  it('adds some redirects', () => {
    const mockManager = {
      registerRedirect: jest.fn<void, [string, string, RedirectOptions | undefined]>(),
    };

    const MyPlugin = createPlugin({
      manifest: { id: 'my-plugin' },
      register({ router }) {
        router.registerRedirect('/from1', '/to1');
        router.registerRedirect('/from2', '/to2', { exact: false });
        router.registerRedirect('/from3', '/to3', { exact: true });
      },
    });

    const plugin = new MyPlugin((mockManager as unknown) as PluginManager);

    expect(mockManager.registerRedirect).toHaveBeenCalledTimes(0);
    plugin.initialize();
    expect(mockManager.registerRedirect).toHaveBeenCalledTimes(3);

    const [[route1], [route2], [route3]] = mockManager.registerRedirect.mock.calls;
    expect(route1).toMatchObject({ from: '/from1', to: '/to1', exactMatch: true });
    expect(route2).toMatchObject({ from: '/from2', to: '/to2', exactMatch: false });
    expect(route3).toMatchObject({ from: '/from3', to: '/to3', exactMatch: true });
  });

  it('adds a menu item', () => {
    const mockManager = {
      menu: {
        add: jest.fn<void, [BackstageMenuItem]>(),
        getByIdPath() {
          return this;
        },
      },
    };

    const MyPlugin = createPlugin({
      manifest: { id: 'my-plugin' },
      register({ menu }) {
        menu.add({ id: 'my-item', title: 'My Item' });
      },
    });

    const plugin = new MyPlugin((mockManager as unknown) as PluginManager);

    expect(mockManager.menu.add).toHaveBeenCalledTimes(0);
    plugin.initialize();
    expect(mockManager.menu.add).toHaveBeenCalledTimes(1);

    const [[menuItem]] = mockManager.menu.add.mock.calls;
    expect(menuItem).toMatchObject({ title: 'My Item' });
  });

  it('adds and reads feature flags', () => {
    const MyPlugin = createPlugin({
      manifest: { id: 'my-plugin' },
      register({ featureFlags }) {
        featureFlags.get('flag1');
        featureFlags.register('flag2');
      },
    });

    const plugin = new MyPlugin({} as PluginManager);

    expect(FeatureFlags.getItem).toHaveBeenCalledTimes(0);
    expect(registerFeatureFlag).toHaveBeenCalledTimes(0);
    plugin.initialize();
    expect(FeatureFlags.getItem).toHaveBeenCalledWith('flag1');
    expect(registerFeatureFlag).toHaveBeenCalledWith('flag2');
  });
});
