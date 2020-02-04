/**
 * Class which aims to be compliant with the feature flags functionality in
 * the angular codebase of system-z. See src/legacy/_modules/systemZCore/modules/featureFlags/featureFlagsProvider.js
 */

// Polyfill needed for protractor on jenkins to work
import 'url-search-params-polyfill';

type FlagObject = { [key: string]: boolean };
type ChangeHandler = (flagValue: boolean) => void;

class FeatureFlags {
  private static instance: FeatureFlags;
  private changeHandlers: Map<string, ChangeHandler> = new Map();
  private featureFlags: FlagObject = {};

  constructor() {
    if (FeatureFlags.instance) {
      return FeatureFlags.instance;
    }
    this.readFlagsFromStorage();
    this.processFeatureFlagsFromLocationSearch();
    FeatureFlags.instance = this;
  }

  /**
   * Get a feature flag
   */
  public getItem(flag: string): boolean {
    return !!this.featureFlags[flag];
  }

  /**
   * Get all feature flags
   */
  public getFlags(): FlagObject {
    return Object.assign({}, this.featureFlags);
  }

  /**
   * Register a changeHandler that will be invoked when a flag changes
   */
  public onChange(flagName: string, changeHandler: ChangeHandler) {
    this.changeHandlers.set(flagName, changeHandler);
  }

  /**
   * Sets a feature flag to true
   */
  public enable(flag: string) {
    this.featureFlags[flag] = true;
    this.callChangeHandler(flag);
    this.writeFlagsToStorage();
  }

  /**
   * Stores the entire opbject
   */
  public storeAll(flags: FlagObject) {
    const changedFlags = Object.keys(flags).filter(flagName => !!this.featureFlags[flagName] !== !!flags[flagName]);
    this.featureFlags = flags;
    changedFlags.forEach(flag => this.callChangeHandler(flag));
    this.writeFlagsToStorage();
  }

  /**
   * Sets a feature flag to false
   */
  public disable(flag: string) {
    this.featureFlags[flag] = false;
    this.callChangeHandler(flag);
    this.writeFlagsToStorage();
  }

  private callChangeHandler(flag: string) {
    const handler = this.changeHandlers.get(flag);
    if (handler) {
      handler(!!this.featureFlags[flag]);
    }
  }

  private readFlagsFromStorage() {
    const flagsString = localStorage.getItem('featureFlags');
    if (!flagsString) {
      this.featureFlags = {};
    } else {
      try {
        this.featureFlags = JSON.parse(flagsString);
        let tmpFlags: FlagObject = {};
        // Backstage angular stores an object as a key which messes up the flags
        Object.entries(this.featureFlags)
          .filter(([key]) => key !== '[object Object]')
          .forEach(([key, value]) => {
            tmpFlags[key] = value;
          });
        this.featureFlags = tmpFlags;
      } catch (e) {
        console.warn('Feature flags parse error. Initializing new empty storage.');
        localStorage.removeItem('featureFlags');
        this.featureFlags = {};
      }
    }
  }

  private writeFlagsToStorage() {
    // Filter out false flags as in angular system-z
    const trimmedFlags: FlagObject = Object.entries(this.featureFlags)
      .filter(([, value]) => value)
      .reduce((agg, [key, value]) => {
        agg[key] = value;
        return agg;
      }, {} as FlagObject);

    const flagsString = JSON.stringify(trimmedFlags);
    window.localStorage.setItem('featureFlags', flagsString);
    this.readFlagsFromStorage();
  }

  /**
   * Will modify the feature flags according to the location.search
   * functionality as in the angular system-z.
   * valid parameters are *flag*, *flagsOn* and *flagsOff:
   */
  private processFeatureFlagsFromLocationSearch() {
    const tmpFeatureFlags = Object.assign({}, this.featureFlags);

    const params = new URLSearchParams(document.location.search.substring(1));
    const flagsOff = params.getAll('flagsOff');
    flagsOff.forEach(flag => {
      tmpFeatureFlags[flag] = false;
    });

    const flagsOn = params.getAll('flagsOn').concat(params.getAll('flags'));
    flagsOn.forEach(flag => {
      tmpFeatureFlags[flag] = true;
    });
    this.featureFlags = tmpFeatureFlags;
    this.writeFlagsToStorage();
  }
}

let _instance = new FeatureFlags();

export default _instance;
