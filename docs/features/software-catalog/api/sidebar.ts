import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "features/software-catalog/api/catalog",
    },
    {
      type: "category",
      label: "Entity",
      items: [
        {
          type: "doc",
          id: "features/software-catalog/api/refresh-entity",
          label: "RefreshEntity",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "features/software-catalog/api/get-entities",
          label: "GetEntities",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "features/software-catalog/api/get-entity-by-uid",
          label: "GetEntityByUid",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "features/software-catalog/api/delete-entity-by-uid",
          label: "DeleteEntityByUid",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "features/software-catalog/api/get-entity-by-name",
          label: "GetEntityByName",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "features/software-catalog/api/get-entity-ancestry-by-name",
          label: "GetEntityAncestryByName",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "features/software-catalog/api/get-entities-by-refs",
          label: "GetEntitiesByRefs",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "features/software-catalog/api/get-entities-by-query",
          label: "GetEntitiesByQuery",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "features/software-catalog/api/get-entity-facets",
          label: "GetEntityFacets",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "features/software-catalog/api/validate-entity",
          label: "ValidateEntity",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Locations",
      items: [
        {
          type: "doc",
          id: "features/software-catalog/api/create-location",
          label: "CreateLocation",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "features/software-catalog/api/get-locations",
          label: "GetLocations",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "features/software-catalog/api/get-location",
          label: "GetLocation",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "features/software-catalog/api/delete-location",
          label: "DeleteLocation",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "features/software-catalog/api/get-location-by-entity",
          label: "getLocationByEntity",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "features/software-catalog/api/analyze-location",
          label: "AnalyzeLocation",
          className: "api-method post",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
