export interface Config {
    azureFunctions: {
        /** @visibility backend  */
        tenantId: string;
        /** @visibility backend  */
        clientId: string;
        /** @visibility secret  */
        clientSecret: string;
        /** @visibility backend  */
        domain: string;
        /** @visibility backend  */
        allowedSubscriptions: [{
            /** @visibility backend */
            name: string;
            /** @visibility backend  */
            id: string;
        }]
    };
}