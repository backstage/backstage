import{ah as v,ai as f,aj as h,ak as T,s as y,j as e,T as x,a0 as S}from"./iframe-CIM5duhm.js";import{C as V}from"./MenuBook-BcSo15hc.js";import{U as j}from"./Person-BZLGLhP3.js";import{S as s}from"./SearchType-s-TjPxy9.js";import{s as _,M as g}from"./api-Bslp_G49.js";import{S as D}from"./SearchContext-Gzflvs0o.js";import{S as u}from"./Grid-Duc3jmgA.js";import"./preload-helper-D9Z9MdNV.js";import"./ExpandMore-D2DOioK9.js";import"./useAsync-BVaj5mJ5.js";import"./useMountedState-BMP6C5TD.js";import"./translation-zTj9lAz0.js";import"./Box-BD8Uu_7H.js";import"./styled-Co6KhZ4u.js";import"./AccordionDetails-D4PSfG9Y.js";import"./index-DnL3XN75.js";import"./Collapse-BWkOwJIQ.js";import"./List-CGOBvW-t.js";import"./ListContext-BKDMM4_S.js";import"./Divider-DA-kCS2y.js";import"./ListItem-C8QkAD_t.js";import"./ListItemIcon-DLWEhI4p.js";import"./ListItemText-BZPfuyb-.js";import"./Tabs-BQSWQJ5H.js";import"./KeyboardArrowRight-DZKFtyLW.js";import"./FormLabel-CuaxJ3_s.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CqwH1Vk0.js";import"./InputLabel-CFyjP1Jo.js";import"./Select-Ba1SeKF4.js";import"./Popover-B59RL4fp.js";import"./Modal-CTawIxqI.js";import"./Portal-6z5sMs7a.js";import"./MenuItem-CDmTRL41.js";import"./Checkbox-DiGgPqcE.js";import"./SwitchBase-CCvWjkg4.js";import"./Chip-BM8GRuCG.js";import"./lodash-CwBbdt2Q.js";import"./useAnalytics-BRyHidSV.js";var r={},n;function I(){if(n)return r;n=1;var i=v(),l=f();Object.defineProperty(r,"__esModule",{value:!0}),r.default=void 0;var c=l(h()),m=i(T()),d=(0,m.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return r.default=d,r}var R=I();const q=y(R),ve={title:"Plugins/Search/SearchType",component:s,decorators:[i=>e.jsx(x,{apis:[[_,new g]],children:e.jsx(D,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(i,{})})})})})]},p=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:p,defaultValue:p[0]})}),o=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(V,{})},{value:"value-2",name:"Value Two",icon:e.jsx(q,{})},{value:"value-3",name:"Value Three",icon:e.jsx(j,{})}]}),t=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"Accordion"};t.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchType name="Search type" values={values} defaultValue={values[0]} />
    </Paper>;
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  return <SearchType.Accordion name="Result Types" defaultValue="value-1" types={[{
    value: 'value-1',
    name: 'Value One',
    icon: <CatalogIcon />
  }, {
    value: 'value-2',
    name: 'Value Two',
    icon: <DocsIcon />
  }, {
    value: 'value-3',
    name: 'Value Three',
    icon: <UsersGroupsIcon />
  }]} />;
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  return <SearchType.Tabs defaultValue="value-1" types={[{
    value: 'value-1',
    name: 'Value One'
  }, {
    value: 'value-2',
    name: 'Value Two'
  }, {
    value: 'value-3',
    name: 'Value Three'
  }]} />;
}`,...t.parameters?.docs?.source}}};const fe=["Default","Accordion","Tabs"];export{o as Accordion,a as Default,t as Tabs,fe as __namedExportsOrder,ve as default};
