import React from 'react';
import { Router } from 'react-router';
import { Switch } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render } from '@testing-library/react';

import { PluginBase, PluginManager, PluginRoute, PluginRedirect } from 'shared/pluginApi/index';

import { SystemZPlugin } from 'plugins/_systemz';

jest.mock('plugins/whoami/api/IAMApi', () => ({
  async getCurrentUser() {
    return {};
  },
}));

const pluginDefinitions = [];

let cl;
let cw;
let ce;

describe('PluginManager', () => {
  beforeEach(() => {
    cl = console.log;
    cw = console.warn;
    ce = console.error;

    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
  });

  afterEach(() => {
    console.log = cl;
    console.warn = cw;
    console.error = ce;
  });

  it('instantiates without error and properly handles arguments', () => {
    let setupMenuCalled = false;

    const pm = new PluginManager([], () => {
      setupMenuCalled = true;
    });

    expect(pm.pluginDefinitions).toEqual(pluginDefinitions);
    expect(setupMenuCalled).toBe(true);
  });

  it('throws an error with an improper plugin definition type (1/3)', () => {
    expect(() => {
      let pm = new PluginManager(['bad type'], () => {});
      expect(pm).toBeDefined();
    }).toThrowError(/is not a class/);
  });

  it('throws an error with an improper plugin definition type (2/3)', () => {
    expect(() => {
      let pm = new PluginManager([Object], () => {});
      expect(pm).toBeDefined();
    }).toThrowError(/does not extend PluginBase/);
  });

  it('throws an error with an improper plugin definition type (3/3)', () => {
    expect(() => {
      let pm = new PluginManager([class AFistFullOfCoconuts {}], () => {});
      expect(pm).toBeDefined();
    }).toThrowError(/does not extend PluginBase/);
  });

  it('properly verifies that a plugin has a valid manifest', () => {
    expect(() => {
      let pm = new PluginManager([PluginBase], () => {});
      expect(pm).toBeDefined();
    }).toThrowError(/does not have a manifest/);

    class IncompleteManifest extends PluginBase {
      manifest = {
        id: 'id',
        title: 'title',
        description: 'description',
      };
    }
    expect(() => {
      let pm = new PluginManager([IncompleteManifest], () => {});
      expect(pm).toBeDefined();
    }).toThrowError(/property 'owner'/);
  });

  it('properly verifies that there are no duplicate plugins by id', () => {
    expect(() => {
      let pm = new PluginManager([SystemZPlugin, SystemZPlugin], () => {});
      expect(pm).toBeDefined();
    }).toThrowError(/more than one plugin have the same id/);
  });

  it('properly handles the root plugin', () => {
    const pm = new PluginManager([SystemZPlugin], () => {});

    expect(pm.rootPlugin).not.toBe(undefined);
    expect(pm.rootPlugin instanceof SystemZPlugin).toBe(true);
  });

  it('throws when given an invalid plugin route', () => {
    expect(() => {
      const pm = new PluginManager([], () => {});
      pm.activeRootPluginRoute = {};
    }).toThrowError(/does not extend PluginRoute/);
  });

  it('throws when trying to register an invalid route', () => {
    expect(() => {
      const pm = new PluginManager([], () => {});
      pm.registerRoute('not-a-route');
    }).toThrowError(/an extension of the PluginRoute/);
  });

  it('throws when trying to register an invalid redirect', () => {
    expect(() => {
      const pm = new PluginManager([], () => {});
      pm.registerRedirect('not-a-route');
    }).toThrowError(/an extension of the PluginRedirect/);
  });

  it('throws when trying construct an invalid route', () => {
    expect(() => new PluginRoute('not-a-plugin', '/a', true, () => {})).toThrowError(
      /pluginOwner must extend PluginBase/,
    );
  });

  it('throws when trying construct an invalid redirect', () => {
    expect(() => new PluginRedirect('not-a-plugin', '/a', true, () => {})).toThrowError(
      /pluginOwner must extend PluginBase/,
    );
  });
});

describe('PluginManager routing', () => {
  const A = ({
    match: {
      params: { name = 'none' },
    },
  }) => <span>a: {name}</span>;

  class PluginA extends PluginBase {
    manifest = { id: 'a', title: 'A', description: 'plugin A', owner: 'user-a' };
    initialize() {
      this.registerRoute(new PluginRoute(this, '/a', true, A));
      this.registerRoute(new PluginRoute(this, '/a/:name', true, A));
    }
  }

  const B = () => <span>b</span>;

  class PluginB extends PluginBase {
    manifest = { id: 'b', title: 'B', description: 'plugin B', owner: 'user-b' };
    initialize() {
      this.registerRoute(new PluginRoute(this, '/b', false, B));
    }
  }

  class PluginC extends PluginBase {
    manifest = { id: 'c', title: 'C', description: 'plugin C', owner: 'user-c' };
    initialize() {
      this.registerRedirect(new PluginRedirect(this, '/c', '/a', true));
      this.registerRedirect(new PluginRedirect(this, '/c/:name', '/a/:name'));
      this.registerRedirect(new PluginRedirect(this, '/c-any', '/a'));
      this.registerRedirect(new PluginRedirect(this, '/c-query', '/a/:name'));
    }
  }

  it('should route while updating active plugin and root route', () => {
    const pm = new PluginManager([PluginA, PluginB, PluginC], () => {});
    expect(pm.activePlugin).toBeUndefined();
    expect(pm.activeRootPluginRoute).toBeUndefined();

    const history = createMemoryHistory({ initialEntries: ['/a'] });
    pm.history = history;

    const rendered = render(
      <Router history={history}>
        <Switch>
          {pm.renderRedirects()}
          {pm.renderRoutes()}
        </Switch>
      </Router>,
    );

    rendered.getByText('a: none');
    expect(pm.activePlugin).toBeInstanceOf(PluginA);
    expect(pm.activeRootPluginRoute.path).toBe('/a');

    history.push('/b');
    rendered.getByText('b');
    expect(pm.activePlugin).toBeInstanceOf(PluginB);
    expect(pm.activeRootPluginRoute.path).toBe('/b');

    history.push('/b/not-exact');
    rendered.getByText('b');
    expect(pm.activePlugin).toBeInstanceOf(PluginB);
    expect(pm.activeRootPluginRoute.path).toBe('/b');

    history.push('/a/x');
    rendered.getByText('a: x');
    expect(pm.activePlugin).toBeInstanceOf(PluginA);
    expect(pm.activeRootPluginRoute.path).toBe('/a/:name');

    history.push('/c');
    rendered.getByText('a: none');
    expect(pm.activePlugin).toBeInstanceOf(PluginA);
    expect(pm.activeRootPluginRoute.path).toBe('/a');

    history.push('/c-any/notexact');
    rendered.getByText('a: none');
    expect(pm.activePlugin).toBeInstanceOf(PluginA);
    expect(pm.activeRootPluginRoute.path).toBe('/a');

    history.push('/c/redirected');
    rendered.getByText('a: redirected');
    expect(pm.activePlugin).toBeInstanceOf(PluginA);
    expect(pm.activeRootPluginRoute.path).toBe('/a/:name');

    history.push('/c-query?name=query-redirect');
    rendered.getByText('a: query-redirect');
    expect(pm.activePlugin).toBeInstanceOf(PluginA);
    expect(pm.activeRootPluginRoute.path).toBe('/a/:name');
  });
});
