import FirestoreSettingsStore from './FirestoreSettingsStore';
import MockFirestoreStorage from 'shared/apis/firestore/MockFirestoreStorage';

describe('FirestoreSettingsStore', () => {
  it('should be created', async () => {
    const storage = new MockFirestoreStorage();
    const store = new FirestoreSettingsStore(storage);
    expect(store).toBeDefined();
  });

  it('should forward value to storage', async () => {
    const storage = new MockFirestoreStorage();
    const store = new FirestoreSettingsStore(storage);
    await expect(storage.get('/')).resolves.toMatchObject({ exists: false });
    await store.set('my.setting', 3);
    await expect(storage.get('/')).resolves.toEqual({
      exists: true,
      data: {
        settings: { 'my.setting': 3 },
      },
      path: '/',
      id: 'me',
    });
  });

  it('should not forward unchanged values', async () => {
    const storage = new MockFirestoreStorage();
    storage.set('/', { settings: { 'my.setting': 3 } });
    jest.spyOn(storage, 'set');

    const store = new FirestoreSettingsStore(storage);
    expect(storage.set).not.toHaveBeenCalled();
    await store.set('my.setting', 3);
    expect(storage.set).not.toHaveBeenCalled();
  });

  it('should subscribe to changes', async () => {
    const storage = new MockFirestoreStorage();
    const store = new FirestoreSettingsStore(storage);

    const subscribeFn1 = jest.fn();
    const unsubscribe1 = store.subscribe('my.setting', subscribeFn1);
    const subscribeFn2 = jest.fn();
    const unsubscribe2 = store.subscribe('my.missingSetting', subscribeFn2);

    expect(subscribeFn1).not.toHaveBeenCalled();
    expect(subscribeFn2).not.toHaveBeenCalled();

    await storage.merge('/', { settings: { 'my.setting': 4 } });
    expect(subscribeFn1).toHaveBeenCalledTimes(2);
    expect(subscribeFn1).toHaveBeenLastCalledWith(4);
    expect(subscribeFn2).toHaveBeenCalledTimes(1);
    expect(subscribeFn2).toHaveBeenLastCalledWith(undefined);

    // unchanged values should be ignored
    await storage.merge('/', { settings: { 'my.setting': 4 } });
    expect(subscribeFn1).toHaveBeenCalledTimes(2);
    expect(subscribeFn2).toHaveBeenCalledTimes(1);

    // unchanged values should be ignored
    await storage.merge('/', { settings: { 'my.setting': 5 } });
    expect(subscribeFn1).toHaveBeenCalledTimes(3);
    expect(subscribeFn2).toHaveBeenCalledTimes(1);

    unsubscribe1();
    unsubscribe2();

    await storage.merge('/', { settings: { 'my.setting': 6 } });
    expect(subscribeFn1).toHaveBeenCalledTimes(3);
    expect(subscribeFn2).toHaveBeenCalledTimes(1);
  });
});
