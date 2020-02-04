import { getOverrideUser, setOverrideUser } from './overrideUtils';

describe('overrideUtils', () => {
  beforeEach(() => {
    delete window.location;
    window.location = { search: '' } as Location;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should read from local storage', () => {
    expect(getOverrideUser()).toBeUndefined();
    localStorage.setItem('usernameOverride', '"mocky"');
    expect(getOverrideUser()).toBe('mocky');
    localStorage.removeItem('usernameOverride');
    expect(getOverrideUser()).toBeUndefined();
    setOverrideUser('mocky');
    expect(getOverrideUser()).toBe('mocky');
  });

  it('should read from query params', () => {
    expect(getOverrideUser()).toBeUndefined();

    window.location.search = '?bypassLogin';
    expect(localStorage.getItem('usernameOverride')).toBeNull();
    expect(getOverrideUser()).toBe('anonymous');
    expect(localStorage.getItem('usernameOverride')).toBe('"anonymous"');

    window.location.search = '?bypassLogin&overrideUser=mocky';
    expect(localStorage.getItem('usernameOverride')).toBe('"anonymous"');
    expect(getOverrideUser()).toBe('mocky');
    expect(localStorage.getItem('usernameOverride')).toBe('"mocky"');
    setOverrideUser();
    expect(localStorage.getItem('usernameOverride')).toBeNull();
    expect(getOverrideUser()).toBe('mocky');
    expect(localStorage.getItem('usernameOverride')).toBe('"mocky"');

    window.location.search = '';
    expect(localStorage.getItem('usernameOverride')).toBe('"mocky"');
    expect(getOverrideUser()).toBe('mocky');
    expect(localStorage.getItem('usernameOverride')).toBe('"mocky"');
    setOverrideUser();
    expect(localStorage.getItem('usernameOverride')).toBeNull();
    expect(getOverrideUser()).toBeUndefined();
  });
});
