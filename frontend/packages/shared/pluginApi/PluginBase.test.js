import React, { Component } from 'react';
import { render } from '@testing-library/react';

import BackstageMenuItem from 'shared/apis/menu/BackstageMenuItem';
import { PluginBase } from 'shared/pluginApi';
import PluginContext from 'shared/pluginApi/PluginContext';
import { withPluginContext } from 'core/app/withPluginContext';

const TestComponent = withPluginContext(
  class TestComponent extends Component {
    render() {
      return <div>prop: {this.props.plugin.testProperty}</div>;
    }
  },
);

describe('withPluginContext', () => {
  it('does not explode', () => {
    expect(TestComponent).toBeTruthy();
  });

  it('properly injects', () => {
    const plugin = new PluginBase();
    plugin.testProperty = '123';

    const rendered = render(
      <PluginContext.Provider value={{ plugin: plugin }}>
        <TestComponent />
      </PluginContext.Provider>,
    );

    expect(rendered.getByText('prop: 123')).toBeInTheDocument();
  });

  it('properly injects functions', () => {
    const TestComponent = withPluginContext(
      class TestComponent extends Component {
        render() {
          return <div>{this.props.plugin.func()}</div>;
        }
      },
    );

    const plugin = new PluginBase();
    plugin.aValue = '123';
    plugin.func = function() {
      return `value: ${this.aValue}`;
    };

    const rendered = render(
      <PluginContext.Provider value={{ plugin: plugin }}>
        <TestComponent />
      </PluginContext.Provider>,
    );

    expect(rendered.getByText('value: 123')).toBeInTheDocument();
  });

  it('renders without HOC', () => {
    const NoPropsComponent = withPluginContext(
      class NoPropsComponent extends Component {
        render() {
          return <div>no-props</div>;
        }
      },
    );

    const rendered = render(
      <PluginContext.Provider value={{ plugin: new PluginBase() }}>
        <NoPropsComponent />
      </PluginContext.Provider>,
    );
    rendered.getByText('no-props');
  });
});

describe('PluginBase', () => {
  it('can declare manifest as a prop', () => {
    class MyPlugin extends PluginBase {
      manifest = {
        id: 'my-plugin',
        title: 'My Plugin',
        owner: 'me',
        facts: {
          stackoverflow_tags: ['tag-a'],
        },
      };
    }

    const myPlugin = new MyPlugin(null);
    expect(myPlugin.id).toBe('my-plugin');
    expect(myPlugin.name).toBeUndefined();
    expect(myPlugin.owner).toBe('me');
    expect(myPlugin.toString()).toBe('My Plugin (me)');
    expect(myPlugin.stackoverflowTags).toEqual(['tag-a']);
  });

  it('allows empty stackoverflow tags', () => {
    class MyPlugin extends PluginBase {
      manifest = {
        title: 'my-plugin',
        owner: 'me',
      };
    }

    const myPlugin = new MyPlugin(null);
    expect(myPlugin.stackoverflowTags).toEqual([]);
  });

  it('should add to root menu', () => {
    class MyPlugin extends PluginBase {
      manifest = {
        title: 'my-plugin',
        owner: 'me',
      };
    }

    const myPlugin = new MyPlugin({ menu: new BackstageMenuItem(new MyPlugin(null), 'id', 'Title') });
    myPlugin.addMenuItem({ id: 'an-id', title: 'A Title', parentIdPath: null });
    expect(myPlugin.pluginManager.menu.children.length).toBe(1);
    expect(myPlugin.pluginManager.menu.children[0].id).toBe('an-id');
  });

  it('should fail to add menu item with unknown path', () => {
    class MyPlugin extends PluginBase {
      manifest = {
        title: 'my-plugin',
        owner: 'me',
      };
    }

    const myPlugin = new MyPlugin({ menu: new BackstageMenuItem(new MyPlugin(null), 'id', 'Title') });
    expect(() => {
      myPlugin.addMenuItem({ id: 'an-id', title: 'A Title', parentIdPath: 'unknown' });
    }).toThrowError(/could not find the menu/i);
  });
});
