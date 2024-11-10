import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "features/search/api/search",
    },
    {
      type: "category",
      label: "UNTAGGED",
      items: [
        {
          type: "doc",
          id: "features/search/api/query",
          label: "Query",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
