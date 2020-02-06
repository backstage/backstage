import React, { FC, Fragment, useEffect, useState } from 'react';
import { InfoCard, TemplateList } from '@backstage/core';
import { scaffolderV1 } from '@backstage/protobuf-definitions';

const CreateEntityPage: FC<{}> = () => {
  const [templates, setTemplates] = useState<
    scaffolderV1.Template.AsObject[]
  >();

  useEffect(() => {
    const client = new scaffolderV1.Client('http://localhost:8080');
    const req = new scaffolderV1.Empty();
    client.listTemplates(req).then((res: scaffolderV1.ListTemplatesReply) => {
      console.log(res.toObject().templatesList);
      setTemplates(res.toObject().templatesList);
    });
  }, []);

  return (
    <Fragment>
      <InfoCard title="Create New ...">
        {templates && <TemplateList items={templates}></TemplateList>}
      </InfoCard>
    </Fragment>
  );
};

export default CreateEntityPage;
