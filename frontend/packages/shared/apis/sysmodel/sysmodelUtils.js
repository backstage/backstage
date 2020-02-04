/**
 * Returns the ghe/github repo url.
 * @param url example https://ghe.spotify.net/build/build-artifact-archiver/edit/master/service-info.yaml
 * @return example https://ghe.spotify.net/build/build-artifact-archiver/
 */
const _getRepoUrl = url => {
  if (!url) {
    return url;
  }
  // matches <someprotocol>://<host>/<user>/<repo>
  //
  let match = url.match(/(.+:\/\/[^/]+\/[^/]+\/[^/]+\/).*/);
  return match ? match[1] : '';
};

/**
 * Takes a locationInfo URL and returns a normalized URL for the service-info.yaml
 * @param url example https://ghe.spotify.net/raw/build/build-artifact-archiver/master/service-info.yaml
 * @return example https://ghe.spotify.net/build/build-artifact-archiver/tree/master/service-info.yaml
 */
export function getServiceInfoYamlUrl(url) {
  if (!url) {
    return url;
  }

  url =
    url.indexOf('githubusercontent') > -1
      ? url.replace('raw.githubusercontent', 'github').replace('/master/', '/tree/master/')
      : url.replace('/master/', '/tree/master/').replace('/raw/', '/');

  return url;
}

/**
 * Normalize a sysmodel Component
 * It adds serviceInfoLocation and gheRepoUrl as properties
 */
export function normalizeComponent(component) {
  const serviceInfoLocation = getServiceInfoYamlUrl(component.componentInfoLocationUrl);
  const gheRepoUrl = _getRepoUrl(serviceInfoLocation);
  return {
    ...component,
    serviceInfoLocation,
    gheRepoUrl,
  };
}
