import backstage_backend_json from './backstage-backend.json';

export function getOpenProxyHost() {
  return 'mocked-proxy';
}

export default {
  client: {
    query: jest.fn().mockImplementation(() => {
      return new Promise(resolve => {
        resolve(backstage_backend_json);
      });
    }),
  },
};

throw new Error('This file is not used');
