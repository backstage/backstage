import MockFirestoreStorage from './MockFirestoreStorage';

describe('MockFirestoreStorage', () => {
  it('should be constructed', async () => {
    const storage = new MockFirestoreStorage();
    expect(storage).toBeDefined();

    storage.set('/', { hello: 'world' });
    await expect(storage.get('/')).resolves.toMatchObject({ data: { hello: 'world' } });
  });

  it('should observe a doc', async () => {
    const storage = new MockFirestoreStorage();
    const next = jest.fn();
    const next2 = jest.fn();

    const subscription = storage.observe('/foo/bar').subscribe(next);
    storage.observe('/foo/baz').subscribe(next2);

    await storage.set('/foo/bar', { foo: 'bar' });
    expect(next).toHaveBeenNthCalledWith(1, { id: 'bar', path: '/foo/bar', exists: false, data: undefined });
    expect(next).toHaveBeenLastCalledWith({ id: 'bar', path: '/foo/bar', exists: true, data: { foo: 'bar' } });
    await storage.update('/foo/bar', { foo: 1 });
    expect(next).toHaveBeenLastCalledWith({ id: 'bar', path: '/foo/bar', exists: true, data: { foo: 1 } });
    await storage.merge('/foo/bar', { bar: 2 });
    expect(next).toHaveBeenLastCalledWith({
      id: 'bar',
      path: '/foo/bar',
      exists: true,
      data: { foo: 1, bar: 2 },
    });

    await expect(storage.get('/foo/bar')).resolves.toEqual({
      id: 'bar',
      path: '/foo/bar',
      exists: true,
      data: { foo: 1, bar: 2 },
    });
    await storage.delete('/foo/bar');
    expect(next).toHaveBeenLastCalledWith({ id: 'bar', path: '/foo/bar', exists: false, data: undefined });
    await expect(storage.get('/foo/bar')).resolves.toEqual({
      id: 'bar',
      path: '/foo/bar',
      exists: false,
      data: undefined,
    });

    await expect(storage.update('/foo/bar', { bar: 2 })).rejects.toThrow(
      new Error('Update failed, no document found at /foo/bar'),
    );
    await storage.merge('/foo/bar', { bar: 2 });
    expect(next).toHaveBeenLastCalledWith({ id: 'bar', path: '/foo/bar', exists: true, data: { bar: 2 } });

    next.mockClear();
    subscription.unsubscribe();
    await storage.set('/foo/bar', { bar: 3 });
    expect(next).not.toHaveBeenCalled();

    expect(next2).toHaveBeenCalledTimes(1);
    expect(next2).toHaveBeenCalledWith({ id: 'baz', path: '/foo/baz', exists: false, data: undefined });
  });

  it('should observe a query', async () => {
    const storage = new MockFirestoreStorage();
    const next1 = jest.fn();
    const next2 = jest.fn();
    const next3 = jest.fn();

    const subscription1 = storage.observeQuery({ path: '/foo/', limit: 2 }).subscribe(next1);
    storage.observeQuery({ path: '/foo/', orderBy: { field: 'x', direction: 'asc', startAfter: 1 } }).subscribe(next2);

    const path = await storage.add('/foo/', { x: 1 });
    const id = path.replace(/.*\//, '');
    expect(next1).toHaveBeenNthCalledWith(1, { docs: [] });
    expect(next2).toHaveBeenNthCalledWith(1, { docs: [] });
    expect(next1).toHaveBeenNthCalledWith(2, {
      docs: [{ id, path, exists: true, data: { x: 1 } }],
    });
    expect(next2).toHaveBeenNthCalledWith(2, { docs: [] });
    await storage.set('/foo/bar', { x: 2 });
    expect(next1).toHaveBeenLastCalledWith({
      docs: [
        { id, path, exists: true, data: { x: 1 } },
        { id: 'bar', path: '/foo/bar', exists: true, data: { x: 2 } },
      ],
    });
    expect(next2).toHaveBeenLastCalledWith({
      docs: [{ id: 'bar', path: '/foo/bar', exists: true, data: { x: 2 } }],
    });
    await storage.delete(path);
    expect(next1).toHaveBeenLastCalledWith({
      docs: [{ id: 'bar', path: '/foo/bar', exists: true, data: { x: 2 } }],
    });
    expect(next2).toHaveBeenLastCalledWith({
      docs: [{ id: 'bar', path: '/foo/bar', exists: true, data: { x: 2 } }],
    });
    await storage.set('/foo/foo', { x: 1 });
    const subscription3 = storage
      .observeQuery({ path: '/foo/', where: { field: 'x', op: '==', value: 1 } })
      .subscribe(next3);
    await storage.set('/foo/baz', { x: 3 });
    expect(next3).toHaveBeenCalledTimes(2);
    expect(next3).toHaveBeenNthCalledWith(1, { docs: [{ id: 'foo', path: '/foo/foo', exists: true, data: { x: 1 } }] });
    subscription3.unsubscribe();
    await storage.set('/foo/wut', { x: 4 });
    expect(next3).toHaveBeenCalledTimes(2);
    expect(next1).toHaveBeenLastCalledWith({
      docs: [
        { id: 'bar', path: '/foo/bar', exists: true, data: { x: 2 } },
        { id: 'foo', path: '/foo/foo', exists: true, data: { x: 1 } },
      ],
    });
    expect(next2).toHaveBeenLastCalledWith({
      docs: [
        { id: 'bar', path: '/foo/bar', exists: true, data: { x: 2 } },
        { id: 'baz', path: '/foo/baz', exists: true, data: { x: 3 } },
        { id: 'wut', path: '/foo/wut', exists: true, data: { x: 4 } },
      ],
    });

    next1.mockClear();
    next2.mockClear();

    subscription1.unsubscribe();
    await storage.delete('/foo/wut');

    expect(next1).not.toHaveBeenCalled();
    expect(next2).toHaveBeenCalledWith({
      docs: [
        { id: 'bar', path: '/foo/bar', exists: true, data: { x: 2 } },
        { id: 'baz', path: '/foo/baz', exists: true, data: { x: 3 } },
      ],
    });
  });

  it('should make some queries', async () => {
    const storage = new MockFirestoreStorage();

    const item1 = { data: { x: 1, y: 'foo', z: 1 }, exists: true, path: '/foo/1', id: '1' };
    const item2 = { data: { x: 2, y: 'bar', z: 1 }, exists: true, path: '/foo/2', id: '2' };
    const item3 = { data: { x: 3, y: 'baz', z: 2 }, exists: true, path: '/foo/3', id: '3' };
    const item4 = { data: { x: 4, y: 'lol', z: 2 }, exists: true, path: '/foo/4', id: '4' };
    const item5 = { data: { x: 5, y: 'wut', z: 2 }, exists: true, path: '/foo/5', id: '5' };

    await Promise.all([item1, item2, item3, item4, item5].map(({ path, data }) => storage.set(path, data)));

    const path = '/foo/';

    await expect(storage.query({ path })).resolves.toEqual({ docs: [item1, item2, item3, item4, item5] });

    await expect(storage.query({ path, orderBy: { field: 'y' } })).resolves.toEqual({
      docs: [item2, item3, item1, item4, item5],
    });

    await expect(storage.query({ path, orderBy: { field: 'x', startAt: 3 } })).resolves.toEqual({
      docs: [item3, item4, item5],
    });

    await expect(storage.query({ path, orderBy: { field: 'x', endBefore: 2 } })).resolves.toEqual({
      docs: [item1],
    });

    await expect(storage.query({ path, orderBy: { field: 'x', endBefore: 2, direction: 'desc' } })).resolves.toEqual({
      docs: [item5, item4, item3],
    });

    await expect(storage.query({ path, orderBy: { field: 'x', startAfter: 2, endAt: 4 } })).resolves.toEqual({
      docs: [item3, item4],
    });

    await expect(
      storage.query({ path, orderBy: { field: 'x', startAfter: 2, endAt: 4, direction: 'desc' } }),
    ).resolves.toEqual({ docs: [] });

    await expect(
      storage.query({
        path,
        orderBy: [
          { field: 'z', direction: 'desc', startAt: 2 },
          { field: 'x', direction: 'asc' },
        ],
      }),
    ).resolves.toEqual({ docs: [item3, item4, item5, item1, item2] });

    await expect(storage.query({ path, where: { field: 'x', op: '<', value: 2 } })).resolves.toEqual({
      docs: [item1],
    });

    await expect(
      storage.query({
        path,
        where: [
          { field: 'x', op: '>=', value: 2 },
          { field: 'x', op: '<=', value: 4 },
        ],
      }),
    ).resolves.toEqual({ docs: [item2, item3, item4] });

    await expect(storage.query({ path, where: [{ field: 'z', op: '==', value: 1 }] })).resolves.toEqual({
      docs: [item1, item2],
    });

    await expect(storage.query({ path, where: [{ field: 'z', op: '>', value: 6 }] })).resolves.toEqual({
      docs: [],
    });

    await expect(storage.query({ path, startAt: '/foo/4' })).resolves.toEqual({ docs: [item4, item5] });
    await expect(storage.query({ path, startAfter: '/foo/4' })).resolves.toEqual({ docs: [item5] });
    await expect(storage.query({ path, endAt: '/foo/4' })).resolves.toEqual({ docs: [item1, item2, item3, item4] });
    await expect(storage.query({ path, endBefore: '/foo/4' })).resolves.toEqual({ docs: [item1, item2, item3] });

    await expect(storage.query({ path, endBefore: '/foo/4', limit: 2 })).resolves.toEqual({ docs: [item1, item2] });

    await expect(storage.query({ path, where: [{ field: 'z', op: 'derp' as '>', value: 6 }] })).rejects.toThrow(
      "Invalid where filter op 'derp'",
    );
  });

  it('should handle some more things', async () => {
    const storage = new MockFirestoreStorage();

    await expect(storage.add('/foo/bar/baz/', { x: 1 })).resolves.toMatch(/^\/foo\/bar\/baz\/[a-z0-9]+$/);

    await expect(storage.get('')).rejects.toThrow("Storage document path must start with '/', got ''");
    await expect(storage.get('col')).rejects.toThrow("Storage document path must start with '/', got 'col'");
    await expect(storage.get('/col/doc/')).rejects.toThrow(
      "Storage document path must not end with '/', got '/col/doc/'",
    );
    await expect(storage.get('/col')).rejects.toThrow(
      "Storage document path must have an even number of path components, got '/col'",
    );
    await expect(storage.get('/col/doc/col2')).rejects.toThrow(
      "Storage document path must have an even number of path components, got '/col/doc/col2'",
    );

    await expect(storage.query({ path: '' })).rejects.toThrow("Storage collection path must start with '/', got ''");
    await expect(storage.query({ path: 'col/' })).rejects.toThrow(
      "Storage collection path must start with '/', got 'col/'",
    );
    await expect(storage.query({ path: '/col' })).rejects.toThrow(
      "Storage collection path must end with '/', got '/col'",
    );
    await expect(storage.query({ path: '/' })).rejects.toThrow(
      "Storage collection path must have an odd number of path components, got '/'",
    );
    await expect(storage.query({ path: '/col/doc/' })).rejects.toThrow(
      "Storage collection path must have an odd number of path components, got '/col/doc/'",
    );
    await expect(storage.query({ path: '/col/doc/col2/doc2/' })).rejects.toThrow(
      "Storage collection path must have an odd number of path components, got '/col/doc/col2/doc2/'",
    );
  });
});
