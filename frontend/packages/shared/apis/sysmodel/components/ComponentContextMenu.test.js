import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { wrapInThemedTestApp, Keyboard } from 'testUtils';
import SysmodelClient from 'shared/apis/sysmodel/SysmodelClient';
import ComponentContextMenu from './ComponentContextMenu';

jest.mock('shared/auth/GheComposable');
jest.mock('shared/apis/backstage/graphqlClient', () => ({
  evictGraphqlCacheEntity: jest.fn(),
}));

const minProps = {
  componentId: 'test-component',
  componentType: 'other',
  componentLocation: 'example/service-info.yaml',
  history: '',
};

describe('<ComponentContextMenu />', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders without exploding', () => {
    render(wrapInThemedTestApp(<ComponentContextMenu {...minProps} />));
  });

  it('should move a component', async () => {
    const rendered = render(wrapInThemedTestApp(<ComponentContextMenu {...minProps} />));

    jest.spyOn(SysmodelClient, 'moveComponentLocation').mockResolvedValue();
    jest.spyOn(SysmodelClient, 'generateSysmodelUri').mockImplementation(uri => uri);

    fireEvent.click(rendered.getByTitle('menu'));
    fireEvent.click(rendered.getByText('Move repository'));

    const newLocation = 'http://ghe.spotify.net/new-location.yaml';
    await Keyboard.type(rendered, `<Tab> ${newLocation} <Tab> <Tab> <Enter>`);

    expect(SysmodelClient.moveComponentLocation).toHaveBeenCalledWith('example/service-info.yaml', newLocation);
  });

  it('should unregister a component', async () => {
    const rendered = render(wrapInThemedTestApp(<ComponentContextMenu {...minProps} />));

    jest.spyOn(SysmodelClient, 'unregisterComponent').mockResolvedValue();

    fireEvent.click(rendered.getByTitle('menu'));
    fireEvent.click(rendered.getByText('Unregister component'));

    rendered.queryByText('me');

    await Keyboard.type(rendered, '<Tab> <Tab> <Enter>');

    expect(SysmodelClient.unregisterComponent).toHaveBeenCalledWith('test-component', 'example/service-info.yaml');
  });
});
