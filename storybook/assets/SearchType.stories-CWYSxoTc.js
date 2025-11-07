import{ag as v,ah as f,ai as h,aj as T,s as y,j as e,T as x,a0 as S}from"./iframe-C4yti0TH.js";import{C as V}from"./MenuBook-DhEB8FOH.js";import{U as j}from"./Person-CCT4uocw.js";import{S as s}from"./SearchType-BslmEiL_.js";import{s as g,M as _}from"./api-DA5O3fCt.js";import{S as D}from"./SearchContext-CczJflgI.js";import{S as u}from"./Grid-v0xxfd_1.js";import"./preload-helper-D9Z9MdNV.js";import"./ExpandMore-C2bx2cGu.js";import"./useAsync-D8arkYRP.js";import"./useMountedState-Cru6FRlT.js";import"./translation-CNZz3zsN.js";import"./Box-a1543Axe.js";import"./styled-DNUHEHW0.js";import"./AccordionDetails-DTv3HEFi.js";import"./index-DnL3XN75.js";import"./Collapse-BxjtCAeZ.js";import"./List-BRXiU0XK.js";import"./ListContext-BOYwBhLf.js";import"./Divider-CU5IM_SK.js";import"./ListItem-Cb_9Twd1.js";import"./ListItemIcon-BVOcAzHN.js";import"./ListItemText-BWf0pAiq.js";import"./Tabs-Diol6wdm.js";import"./KeyboardArrowRight-vFDhU7Bj.js";import"./FormLabel-BzcOsTWE.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CmTUajr5.js";import"./InputLabel-BiLRbSYU.js";import"./Select-C_CXebeo.js";import"./Popover-C0oEerqE.js";import"./Modal-Bq63ThXv.js";import"./Portal-JPlxc26l.js";import"./MenuItem-lTxBVbJM.js";import"./Checkbox-EhXMUHs5.js";import"./SwitchBase-DJM2Sst8.js";import"./Chip-De4Lbvur.js";import"./lodash-CwBbdt2Q.js";import"./useAnalytics--K1VOgoc.js";var r={},n;function I(){if(n)return r;n=1;var i=v(),l=f();Object.defineProperty(r,"__esModule",{value:!0}),r.default=void 0;var c=l(h()),m=i(T()),d=(0,m.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return r.default=d,r}var R=I();const q=y(R),ve={title:"Plugins/Search/SearchType",component:s,decorators:[i=>e.jsx(x,{apis:[[g,new _]],children:e.jsx(D,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(i,{})})})})})]},p=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:p,defaultValue:p[0]})}),o=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(V,{})},{value:"value-2",name:"Value Two",icon:e.jsx(q,{})},{value:"value-3",name:"Value Three",icon:e.jsx(j,{})}]}),t=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"Accordion"};t.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
