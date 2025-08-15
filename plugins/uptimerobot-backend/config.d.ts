export interface Config {
  /**
   * Configuration options for the UptimeRobot plugin
   */
  uptimerobot?: {
    /**
     * UptimeRobot API key
     * @visibility secret
     */
    apiKey?: string;
  };
}