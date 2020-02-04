import { normalizeComponent } from './sysmodelUtils';

describe('normalizeComponent', () => {
  it('normalizes urls for ghe', () => {
    const component = {
      componentInfoLocationUrl: 'https://ghe.spotify.net/raw/build/build-artifact-archiver/master/service-info.yaml',
    };
    const normalized = normalizeComponent(component);
    expect(normalized.serviceInfoLocation).toBe(
      'https://ghe.spotify.net/build/build-artifact-archiver/tree/master/service-info.yaml',
    );
    expect(normalized.gheRepoUrl).toBe('https://ghe.spotify.net/build/build-artifact-archiver/');
  });
  it('normalizes urls for github', () => {
    const component = {
      componentInfoLocationUrl: 'https://raw.githubusercontent.com/spotify/missinglink/master/lib-info.yaml',
    };
    const normalized = normalizeComponent(component);
    expect(normalized.serviceInfoLocation).toBe('https://github.com/spotify/missinglink/tree/master/lib-info.yaml');
    expect(normalized.gheRepoUrl).toBe('https://github.com/spotify/missinglink/');
  });

  it('handles abornal URLs', () => {
    const component = {
      componentInfoLocationUrl: '',
    };
    const normalized = normalizeComponent(component);
    expect(normalized.serviceInfoLocation).toBe('');
    expect(normalized.gheRepoUrl).toBe('');
  });
});
