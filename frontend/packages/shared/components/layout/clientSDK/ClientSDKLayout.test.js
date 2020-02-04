import { buildComponentInApp } from 'testUtils';
import ClientSDKLayout from 'shared/components/layout/clientSDK/ClientSDKLayout';

describe('<ClientSDKLayout />', () => {
  it('Renders a progress bar while loading', async () => {
    const { getByTestId } = buildComponentInApp(ClientSDKLayout)
      .withProps({ id: 'test' })
      .withApolloLoading()
      .render();
    expect(getByTestId('progress')).toBeInTheDocument();
  });

  it('Renders client sdk layout', async () => {
    const rendered = buildComponentInApp(ClientSDKLayout)
      .withTheme()
      .withProps({ id: 'test' })
      .withRouterEntries(['/client-sdks/test'])
      .withApolloData({
        clientSdk: {
          id: 'test',
          componentType: 'client-sdk',
          owner: {
            id: 'test-squad',
            name: 'test-squad',
            type: 'squad',
          },
        },
      })
      .render();

    rendered.getByText('Client SDK');
    rendered.getByText('test-squad');
  });
});
