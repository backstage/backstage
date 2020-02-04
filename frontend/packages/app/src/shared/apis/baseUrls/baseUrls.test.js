import { urls } from './baseUrls';

describe('baseUrls', () => {
  it('urls should be base urls', () => {
    Object.values(urls).forEach(url => {
      expect(typeof url).toBe('string');
      expect(url).toMatch(/^https?:\/\/(?:[a-z.-]+)$/);
    });
  });
});
