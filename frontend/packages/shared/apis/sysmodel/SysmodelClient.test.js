import SysmodelClient from './SysmodelClient';
import axios from 'axios';
import { mockAccessToken } from 'shared/apis/googleAuthV2/MockAuthHelper';

describe('SysmodelClient', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('generateSysmodelUri should return a sysmodel URI', function() {
    const input = [
      ['https://ghe.spotify.net/tools/testing', 'service-info.yaml'],
      ['https://ghe.spotify.net/tools/testing', 'my-service-info.yaml'],
      ['https://ghe.spotify.net/tools/testing'],
      ['ghe.spotify.net/tools/testing', 'service-info.yaml'],
      ['https://ghe.spotify.net/user/repo/blob/master/service-info.yaml'],
      ['http://ghe.spotify.net/user/repo/blob/master/folder/service-info.yaml'],
      ['https://ghe.spotify.net/user/repo/blob/master/one/two/three/service-info.yaml'],
      ['https://ghe.spotify.net/user/repo/blob/master/service-info.yaml', 'my-service-info.yaml'],
    ];
    const output = [
      'ghe:/tools/testing/service-info.yaml',
      'ghe:/tools/testing/my-service-info.yaml',
      'ghe:/tools/testing/service-info.yaml',
      'ghe:/tools/testing/service-info.yaml',
      'ghe:/user/repo/service-info.yaml',
      'ghe:/user/repo/folder/service-info.yaml',
      'ghe:/user/repo/one/two/three/service-info.yaml',
      'ghe:/user/repo/service-info.yaml',
    ];

    [0, 1, 2, 3, 4, 5, 6, 7].forEach(idx => {
      expect(SysmodelClient.generateSysmodelUri(...input[idx])).toEqual(output[idx]);
    });
  });

  it('generateSysmodelUri should throw error', function() {
    const input = [
      ['asd://ghe.spotify.net/tools/testing', 'service-info.yaml'],
      ['ghe://ghe.spotify.net/tools/testing', 'service-info.yaml'],
      ['incorrectFormat', 'service-info.yaml'],
    ];

    [0, 1, 2].forEach(idx => {
      expect(() => {
        SysmodelClient.generateSysmodelUri(...input[idx]);
      }).toThrow();
    });
  });

  it('registerComponentFromGheUrl should handle errors', async () => {
    const url = 'http://ghe.spotify.net/a/b/blob/master/.yaml';
    const spy = jest.spyOn(axios, 'post').mockReturnValue();

    spy.mockRejectedValueOnce({ response: { data: { reason: 'it', error: 'broke' } } });
    expect(SysmodelClient.registerComponentFromGheUrl(url)).rejects.toMatchObject({ message: 'it: broke' });

    spy.mockRejectedValueOnce({ response: 3 });
    expect(SysmodelClient.registerComponentFromGheUrl(url)).rejects.toMatchObject({
      message: 'Request failed with status code undefined: undefined',
    });

    spy.mockRejectedValueOnce(new Error('nope'));
    expect(SysmodelClient.registerComponentFromGheUrl(url)).rejects.toMatchObject({ message: 'nope' });
  });

  it('should unregister a component', async () => {
    jest.spyOn(axios, 'delete').mockReturnValue();

    await SysmodelClient.unregisterComponent('a', 'loc');

    expect(axios.delete).toHaveBeenNthCalledWith(1, 'https://sysmodel.spotify.net/v1/components/a');
    expect(axios.delete).toHaveBeenNthCalledWith(2, 'https://sysmodel.spotify.net/v1/locations/loc');
  });

  it('link existing gcp project', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({
      data: [
        { gcpProjectId: 'gcp-1', id: 'id-1' },
        { gcpProjectId: 'gcp-2', id: 'id-2' },
      ],
    });
    jest.spyOn(axios, 'post').mockReturnValue();
    jest.spyOn(axios, 'put').mockReturnValue();

    await SysmodelClient.linkRoleToGcpProject('role1', 'gcp-2');

    expect(axios.post).toHaveBeenCalledWith('https://backstage-proxy.spotify.net/api/backend/graphql/evict/roles');
    expect(axios.put).toHaveBeenCalledWith('https://sysmodel.spotify.net/v2-alpha/projects/id-2/roles/role1', null, {
      headers: {
        Authorization: `Bearer ${mockAccessToken}`,
      },
    });
  });

  it('link nonexistent gcp project', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({
      data: [
        { gcpProjectId: 'gcp-1', id: 'id-1' },
        { gcpProjectId: 'gcp-2', id: 'id-2' },
      ],
    });
    jest.spyOn(axios, 'post').mockReturnValue();
    jest.spyOn(axios, 'put').mockReturnValue();

    await SysmodelClient.linkRoleToGcpProject('role1', 'gcp-3');

    expect(axios.post).toHaveBeenNthCalledWith(1, 'https://sysmodel.spotify.net/v2-alpha/projects', {
      gcpProjectId: 'gcp-3',
      id: 'gcp-3',
    });
    expect(axios.post).toHaveBeenNthCalledWith(
      2,
      'https://backstage-proxy.spotify.net/api/backend/graphql/evict/roles',
    );
    expect(axios.put).toHaveBeenCalledWith('https://sysmodel.spotify.net/v2-alpha/projects/gcp-3/roles/role1', null, {
      headers: {
        Authorization: `Bearer ${mockAccessToken}`,
      },
    });
  });

  it('unlink gcp project', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({ data: [{ gcpProjectId: 'gcp-2', id: 'id-2' }] });
    jest.spyOn(axios, 'post').mockReturnValue();
    jest.spyOn(axios, 'delete').mockReturnValue();

    await SysmodelClient.unlinkRoleFromGcpProject('role1', 'gcp-2');

    expect(axios.post).toHaveBeenCalledWith('https://backstage-proxy.spotify.net/api/backend/graphql/evict/roles');
    expect(axios.delete).toHaveBeenCalledWith('https://sysmodel.spotify.net/v2-alpha/projects/id-2/roles/role1', {
      headers: {
        Authorization: `Bearer ${mockAccessToken}`,
      },
    });
  });
});
