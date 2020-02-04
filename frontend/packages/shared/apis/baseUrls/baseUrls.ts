import Api from 'shared/pluginApi/Api';

const BACKSTAGE_PROXY_URL = 'https://backstage-proxy.spotify.net';
const BACKSTAGE_PUBLIC_URL = 'https://backstage.spotify.net';

export const urls: Urls = {
  get public() {
    return BACKSTAGE_PUBLIC_URL;
  },
  get proxy() {
    return BACKSTAGE_PROXY_URL;
  },
  get openProxy() {
    if (window.location.hostname === 'backstage.spotify.net') {
      return BACKSTAGE_PUBLIC_URL;
    }
    // If we're not on the public URL we'll assume local dev/e2e and use the internal proxy, since GLB/IAP authentication won't work.
    return BACKSTAGE_PROXY_URL;
  },
  get sysmodel() {
    return 'https://sysmodel.spotify.net';
  },
  get ghe() {
    return 'https://ghe.spotify.net';
  },
};

/**
 * A collection of common urls used in the backstage-frontend.
 *
 * Import and use directly.
 *
 * ```typescript
 * import { urls } from 'shared/apis/baseUrls';
 *
 * fetch(`${urls.proxy}/api/my-backend/my-api`)
 * ```
 */
export type Urls = {
  /** Public URL that Backstage is served from. */
  public: string;
  /** Internal Backstage proxy URL. */
  proxy: string;
  /**
   * URL to the Backstage open proxy, which does not require access to the
   * Spotify network if possible.
   */
  openProxy: string;
  /** Internal sysmodel URL. */
  sysmodel: string;
  /** Internal GHE URL. */
  ghe: string;
};

export const urlsApi = new Api<Urls>({
  id: 'urls',
  title: 'Common URLs',
  description: 'A collection of common urls used in the backstage-frontend',
});
