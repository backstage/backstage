import { gerritPlugin, isGerritRepo, EntityGerritReviewsContentPage, EntityGerritReviewsCard } from './plugin';
import { GERRIT_ANNOTATION } from './components/RepoGerritReviews'
import { Entity } from '@backstage/catalog-model'

describe('gerrit', () => {
  it('should export isGerritRepo', () => {
    expect(isGerritRepo).toBeDefined();
  });
  it('should return true when entity has Gerrit annotation', () => {
    const mockEntity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: "repo1",
        annotations: {
          [GERRIT_ANNOTATION]: `aGerritRepo`,
        },
        spec: {
          type: 'service',
          owner: 'guest',
        }
      }
    } as Entity
    const result = isGerritRepo(mockEntity);
    expect(result).toBe(true);
  });
  it('should return false when entity does not have Gerrit annotation', () => {
    const mockEntity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: "repo1",
        annotations: { },
        spec: {
          type: 'service',
          owner: 'guest',
        }
      }
    } as Entity
    const result = isGerritRepo(mockEntity);
    expect(result).toBe(false);
  });
  it('should export gerrit plugin', () => {
    expect(gerritPlugin).toBeDefined();
  });
  it('should export EntityGerritReviewsContentPage', () => {
    expect(EntityGerritReviewsContentPage).toBeDefined();
  });
  it('should export EntityGerritReviewsCard', () => {
    expect(EntityGerritReviewsCard).toBeDefined();
  });
});
