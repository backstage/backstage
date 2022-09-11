export interface AzureFunctionsAllowedSubscriptionsConfig {
    name: string;
    id: string;
}

export type FunctionsData = {
    href: string;
    logstreamHref: string;
    functionName: string;
    location: string;
    state: string;
    usageState: string;
    containerSize: number;
    lastModifiedDate: Date;
};