import search_system_z_backend_json from './search_system-z-backend.json';

export function getOpenProxyHost() {
  return 'mocked-proxy';
}

export default {
  client: {
    query: jest.fn().mockImplementation(() => {
      return new Promise(resolve => {
        resolve(search_system_z_backend_json);
      });
    }),
  },
};

throw new Error('This file is not used');
