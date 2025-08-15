export interface Config {
  /**
   * Configuration options for the UptimeRobot plugin frontend
   */
  uptimerobot?: {
    /**
     * UptimeRobot API key (used by backend)
     * @visibility secret
     */
    apiKey?: string;
  };
}