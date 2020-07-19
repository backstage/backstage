import { createApiRef, ConfigApi } from '@backstage/core';
import { Entity } from '@backstage/catalog-model';
import path from 'path';

type Registry = Map<string, React.ComponentType>;

export class CatalogShadowRegistry {
  private registries = new Map<Entity['kind'], Registry>();

  constructor(someStuff: any, config: ConfigApi) {
    // console.log(someStuff.resolve());
    const shadowRoot = config.getString('catalog.shadowSrc');
    const cache = {};

    function importAll(r: any) {
      return r.keys().map(key => [key, r(key)]);
    }
    // Todo: how to pass this dynamically?
    const all = importAll(
      require.context('../../../../packages/app/src/catalog', true, /\.tsx?$/),
    );
    all.forEach(([key, _module]) => {
      const [
        DOT,
        kind,
        name_,
        name = name_.replace(/\.tsx?$/g, ''),
      ] = key.split('/');
      console.log({ kind, name });
      this.register(kind, name, _module.default);
    });
    console.log(this.getRegistry('service'));
  }

  public register(kind: string, name: string, component: React.ComponentType) {
    if (!this.registries.has(kind)) {
      this.registries.set(kind, new Map() as Registry);
    }
    const registry = this.registries.get(kind);
    registry!.set(name, component);
  }
  public getRegistry(kind: string) {
    return this.registries.get(kind);
  }
  public getRegistryKeys(kind: string) {
    return Array.from(this.registries.get(kind)?.keys() ?? []);
  }
}

export const catalogShadowRegistryApiRef = createApiRef<CatalogShadowRegistry>({
  id: 'plugin.catalog.shadow-registry',
  description: 'Used by the Catalog plugin to render views',
});
