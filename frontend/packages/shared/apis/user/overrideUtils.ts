const KEY = 'usernameOverride';
const BYPASS_PARAM = 'bypassLogin';
const OVERRIDE_PARAM = 'overrideUser';

export const getOverrideUser = (): string | undefined => {
  const params = new URLSearchParams(window.location.search);

  if (params.has(BYPASS_PARAM)) {
    const id = params.get(OVERRIDE_PARAM) || 'anonymous';
    setOverrideUser(id);
    return id;
  }

  const stored = localStorage.getItem(KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      /* ignored */
    }
  }

  return undefined;
};

export const setOverrideUser = (user?: string) => {
  if (!user) {
    localStorage.removeItem(KEY);
    return;
  }
  localStorage.setItem(KEY, JSON.stringify(user));
};
