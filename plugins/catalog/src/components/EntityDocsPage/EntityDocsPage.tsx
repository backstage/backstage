import React from 'react';
import { Entity } from '@backstage/catalog-model';
import { Reader } from '@backstage/plugin-techdocs';
import { Content } from '@backstage/core';

export const EntityDocsPage = ({ entity }: { entity: Entity }) => {
  return (
    <Content>
      <Reader
        entityId={{
          kind: entity.kind,
          namespace: entity.metadata.namespace,
          name: entity.metadata.name,
        }}
      />
    </Content>
  );
};
