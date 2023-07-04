import {
    CatalogProcessor,
    CatalogProcessorCache,
    CatalogProcessorEmit, processingResult,
  } from '@backstage/plugin-catalog-node';
  import {Entity, getCompoundEntityRef, parseEntityRef} from '@backstage/catalog-model';
  import { LocationSpec } from '@backstage/plugin-catalog-common';
  
  
  class ConsumingData {
    private _from: string = '';
    private _data: string[] = [];
  
  
    get from(): string {
      return this._from;
    }
  
    set from(value: string) {
      this._from = value;
    }
  
    get data(): string[] {
      return this._data;
    }
  
    set data(value: string[]) {
      this._data = value;
    }
  }
  
  class ProvidingData {
    private _to: string = '';
    private _data: string[] = [];
  
  
    get to(): string {
      return this._to;
    }
  
    set to(value: string) {
      this._to = value;
    }
  
    get data(): string[] {
      return this._data;
    }
  
    set data(value: string[]) {
      this._data = value;
    }
  }
  
  export class DataRelationProcessor implements CatalogProcessor {
    getProcessorName(): string {
      return 'DataRelationProcessor';
    }
  
    // Run first
    async preProcessEntity(
      entity: Entity,
      location: LocationSpec,
      emit: CatalogProcessorEmit,
      originLocation: LocationSpec,
      cache: CatalogProcessorCache,
    ): Promise<Entity> {
  
      const selfRef = getCompoundEntityRef(entity);
  
      function doEmit(
        targets: string | string[] | undefined,
        context: { defaultKind?: string; defaultNamespace: string },
        outgoingRelation: string,
        incomingRelation: string
      ): void {
        if (!targets) {
          return;
        }
        for (const target of [targets].flat()) {
          const targetRef = parseEntityRef(target, context);
          emit(
            processingResult.relation({
              source: selfRef,
              type: outgoingRelation,
              target: {
                kind: targetRef.kind,
                namespace: targetRef.namespace,
                name: targetRef.name,
              }
            }),
          );
          emit(
            processingResult.relation({
              source: {
                kind: targetRef.kind,
                namespace: targetRef.namespace,
                name: targetRef.name,
              },
              type: incomingRelation,
              target: selfRef,
            }),
          );
        }
      }
  
      if (entity.spec?.consumesData) {
        for (const item of [entity.spec.consumesData].flat()) {
          const consumingData: ConsumingData = Object.assign(new ConsumingData(), item);
          if (consumingData.from !== null) {
            console.log(consumingData);
            doEmit(
              consumingData.from,
              { defaultNamespace: selfRef.namespace },
              'consumesData',
              'dataConsumedBy',
            );
          }
        }
      }
  
      if (entity.spec?.providesData) {
        for (const item of [entity.spec.providesData].flat()) {
          const providingData: ProvidingData = Object.assign(new ProvidingData(), item);
          if (providingData.to !== null) {
            console.log(providingData);
            doEmit(
              providingData.to,
              { defaultNamespace: selfRef.namespace },
              'providesData',
              'dataProvidedBy',
            );
          }
        }
      }
  
      return entity;
    }
  }
  