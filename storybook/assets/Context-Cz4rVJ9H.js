import{r as o,ao as a,j as m}from"./iframe-M9O-K8SB.js";import{p as y}from"./ref-C0VTUPuL.js";const s=e=>{const t=Object.keys(a),n=e%t.length;return a[t[n]][0]},u=e=>{try{return y(e?.entityRef??"")}catch{return}},d=e=>{const t=s(0),n=u(e);if(!n)return t;const r=["component","template","api","group","user","resource","system","domain","location"].indexOf(n.kind.toLocaleLowerCase("en-US"));return r===-1?t:s(r+1)},l=e=>(u(e)?.kind??"Other").toLocaleLowerCase("en-US"),c=o.createContext({getChipColor:d,getLabel:l}),p=({children:e,getChipColor:t=d,getLabel:n=l})=>{const i={getChipColor:t,getLabel:n};return m.jsx(c.Provider,{value:i,children:e})},v=()=>{const e=o.useContext(c);if(!e)throw new Error("useVisitDisplay must be used within a VisitDisplayProvider");return e};p.__docgenInfo={description:`Provider component for VisitDisplay customization
@public`,methods:[],displayName:"VisitDisplayProvider",props:{children:{required:!0,tsType:{name:"ReactNode"},description:""},getChipColor:{required:!1,tsType:{name:"signature",type:"function",raw:"(visit: Visit) => string",signature:{arguments:[{type:{name:"signature",type:"object",raw:`{
  /**
   * The auto-generated visit identification.
   */
  id: string;
  /**
   * The visited entity, usually an entity id.
   */
  name: string;
  /**
   * The visited url pathname, usually the entity route.
   */
  pathname: string;
  /**
   * An individual view count.
   */
  hits: number;
  /**
   * Last date and time of visit. Format: unix epoch in ms.
   */
  timestamp: number;
  /**
   * Optional entity reference. See stringifyEntityRef from catalog-model.
   */
  entityRef?: string;
}`,signature:{properties:[{key:"id",value:{name:"string",required:!0},description:"The auto-generated visit identification."},{key:"name",value:{name:"string",required:!0},description:"The visited entity, usually an entity id."},{key:"pathname",value:{name:"string",required:!0},description:"The visited url pathname, usually the entity route."},{key:"hits",value:{name:"number",required:!0},description:"An individual view count."},{key:"timestamp",value:{name:"number",required:!0},description:"Last date and time of visit. Format: unix epoch in ms."},{key:"entityRef",value:{name:"string",required:!1},description:"Optional entity reference. See stringifyEntityRef from catalog-model."}]}},name:"visit"}],return:{name:"string"}}},description:"",defaultValue:{value:`(visit: Visit): string => {
  const defaultColor = getColorByIndex(0);
  const entity = maybeEntity(visit);
  if (!entity) return defaultColor;

  // IDEA: Use or replicate useAllKinds hook thus supporting all software catalog
  //       registered kinds. See:
  //       plugins/catalog-react/src/components/EntityKindPicker/kindFilterUtils.ts
  //       Provide extension point to register your own color code.
  const entityKinds = [
    'component',
    'template',
    'api',
    'group',
    'user',
    'resource',
    'system',
    'domain',
    'location',
  ];
  const foundIndex = entityKinds.indexOf(
    entity.kind.toLocaleLowerCase('en-US'),
  );
  return foundIndex === -1 ? defaultColor : getColorByIndex(foundIndex + 1);
}`,computed:!1}},getLabel:{required:!1,tsType:{name:"signature",type:"function",raw:"(visit: Visit) => string",signature:{arguments:[{type:{name:"signature",type:"object",raw:`{
  /**
   * The auto-generated visit identification.
   */
  id: string;
  /**
   * The visited entity, usually an entity id.
   */
  name: string;
  /**
   * The visited url pathname, usually the entity route.
   */
  pathname: string;
  /**
   * An individual view count.
   */
  hits: number;
  /**
   * Last date and time of visit. Format: unix epoch in ms.
   */
  timestamp: number;
  /**
   * Optional entity reference. See stringifyEntityRef from catalog-model.
   */
  entityRef?: string;
}`,signature:{properties:[{key:"id",value:{name:"string",required:!0},description:"The auto-generated visit identification."},{key:"name",value:{name:"string",required:!0},description:"The visited entity, usually an entity id."},{key:"pathname",value:{name:"string",required:!0},description:"The visited url pathname, usually the entity route."},{key:"hits",value:{name:"number",required:!0},description:"An individual view count."},{key:"timestamp",value:{name:"number",required:!0},description:"Last date and time of visit. Format: unix epoch in ms."},{key:"entityRef",value:{name:"string",required:!1},description:"Optional entity reference. See stringifyEntityRef from catalog-model."}]}},name:"visit"}],return:{name:"string"}}},description:"",defaultValue:{value:`(visit: Visit): string => {
  const entity = maybeEntity(visit);
  return (entity?.kind ?? 'Other').toLocaleLowerCase('en-US');
}`,computed:!1}}}};export{p as V,v as u};
