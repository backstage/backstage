import{ah as v,ai as f,aj as h,ak as T,s as y,j as e,T as x,a0 as S}from"./iframe-cIBAsfTm.js";import{C as V}from"./MenuBook-BTx3Jd4V.js";import{U as j}from"./Person-CZ8GErgK.js";import{S as s}from"./SearchType-7wNMDk83.js";import{s as _,M as g}from"./api-FGhT9qVs.js";import{S as D}from"./SearchContext-KUHwwAnu.js";import{S as u}from"./Grid-Dgo5ACik.js";import"./preload-helper-D9Z9MdNV.js";import"./ExpandMore-Fefrqwki.js";import"./useAsync-DPpw4t_L.js";import"./useMountedState-DDQ1veKw.js";import"./translation-CJSbrCM9.js";import"./Box-5_AhqNAq.js";import"./styled-6iTZXECK.js";import"./AccordionDetails-DeQbQa7K.js";import"./index-DnL3XN75.js";import"./Collapse-BkfRpfT3.js";import"./List-BJcgiIVB.js";import"./ListContext-CvDEkeuW.js";import"./Divider-Cpot2Ubt.js";import"./ListItem-DDKzfBu6.js";import"./ListItemIcon-MZjq3RFx.js";import"./ListItemText-CP0ZRpAu.js";import"./Tabs-r35qRNvI.js";import"./KeyboardArrowRight-h3J2i1_s.js";import"./FormLabel-DmnX46Bz.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DpGllqyr.js";import"./InputLabel-C0VpW_02.js";import"./Select-BfkLSqHW.js";import"./Popover-BkYTo63x.js";import"./Modal-BGf4XJgV.js";import"./Portal-C3RNSs6Y.js";import"./MenuItem-C7RX92pZ.js";import"./Checkbox-DFnPJHFV.js";import"./SwitchBase-DuMfNZYh.js";import"./Chip-D5tGryFv.js";import"./lodash-CwBbdt2Q.js";import"./useAnalytics-Cn11G-Da.js";var r={},n;function I(){if(n)return r;n=1;var i=v(),l=f();Object.defineProperty(r,"__esModule",{value:!0}),r.default=void 0;var c=l(h()),m=i(T()),d=(0,m.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return r.default=d,r}var R=I();const q=y(R),ve={title:"Plugins/Search/SearchType",component:s,decorators:[i=>e.jsx(x,{apis:[[_,new g]],children:e.jsx(D,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(i,{})})})})})]},p=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:p,defaultValue:p[0]})}),o=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(V,{})},{value:"value-2",name:"Value Two",icon:e.jsx(q,{})},{value:"value-3",name:"Value Three",icon:e.jsx(j,{})}]}),t=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"Accordion"};t.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
