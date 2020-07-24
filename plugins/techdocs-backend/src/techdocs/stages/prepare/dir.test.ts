import { DirectoryPreparer } from './dir';

const createMockEntity = (annotations: {}) => {
  return {
    apiVersion: 'version',
    kind: 'TestKind',
    metadata: {
      name: 'testName',
      annotations: {
        ...annotations,
      },
    },
  };
};

describe('directory preparer', () => {
  it('should merge managed-by-location and techdocs-ref when techdocs-ref is relative', async () => {
    const directoryPreparer = new DirectoryPreparer();

    const mockEntity = createMockEntity({
      'backstage.io/managed-by-location':
        'file:/directory/documented-component.yaml',
      'backstage.io/techdocs-ref': 'dir:./our-documentation',
    });

    expect(await directoryPreparer.prepare(mockEntity)).toEqual(
      '/directory/our-documentation',
    );
  });

  it('should merge managed-by-location and techdocs-ref when techdocs-ref is absolute', async () => {
    const directoryPreparer = new DirectoryPreparer();

    const mockEntity = createMockEntity({
      'backstage.io/managed-by-location':
        'file:/directory/documented-component.yaml',
      'backstage.io/techdocs-ref': 'dir:/our-documentation/techdocs',
    });

    expect(await directoryPreparer.prepare(mockEntity)).toEqual(
      '/our-documentation/techdocs',
    );
  });
});
