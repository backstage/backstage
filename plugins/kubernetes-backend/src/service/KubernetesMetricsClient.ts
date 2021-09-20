
import { Logger } from 'winston';
import {
    PodMetric,
  } from '@backstage/plugin-kubernetes-common';
import { KubeConfig } from '@kubernetes/client-node';
import fetch from 'node-fetch';
import https from 'https';

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });


export interface Usage {
    cpu: string;
    memory: string;
}

export interface Container {
    name: string;
    usage: Usage;
}

export interface Item {
    metadata: {
        name: string;
        namespace: string;
        selfLink: string;
        creationTimestamp: Date;
    };
    timestamp: Date;
    window: string;
    containers: Container[];
}

export interface Response {
    kind: string;
    apiVersion: string;
    metadata: {
        selfLink: string;
    };
    items: Item[];
}

const responseToPodMetrics = (r: Response):Array<PodMetric> => {

    return r.items.map(item => {
        return {
            podName: item.metadata.name,
            containerMetrics: item.containers.map(container => {
                return {
                    containerName: container.name,
                    cpuUsage: container.usage.cpu,
                    memoryUsage: container.usage.memory,
                };
            })
        }
    })
}


export class KubernetesMetricsClient {

    private readonly logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }
    

    getClustermetricsByConfig(kubeConfig: KubeConfig): Promise<{ body: { items: Array<PodMetric>}, response: any}>  {

        const currentCluster = kubeConfig.getCurrentCluster()
        const currentUserToken = kubeConfig.getCurrentUser()?.token;

        if (currentCluster && currentUserToken) {
            const podsUrl = currentCluster.server + "/apis/metrics.k8s.io/v1beta1/pods"
            return fetch(podsUrl,{
                agent: httpsAgent,
                headers: {
                    Authorization: `bearer ${currentUserToken}`
                }
              })
            .then(r => r.json())
            .then((r: Response) => {
                return {
                    body: {
                        items: responseToPodMetrics(r),
                    },
                    response: null,
                }
            })
        }

    
        return Promise.resolve({
            body: {
                items: []
            },
            response: null,
        });
    }
}
