import{aC as v,aD as f,aE as h,aF as T,a4 as y,j as e,T as x,Z as S}from"./iframe-BY8lR-L8.js";import{C as V}from"./MenuBook-DhpduqON.js";import{U as j}from"./Person-C5BxDg9M.js";import{S as s}from"./SearchType-CosE5ZcB.js";import{s as _,M as g}from"./api-ZUH36i94.js";import{S as D}from"./SearchContext-PkY0VTIp.js";import{S as u}from"./Grid-BjrJvsR3.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-fkHecgaQ.js";import"./useAsync-DNLOGNju.js";import"./useMountedState-DwTRr6Bf.js";import"./translation-C4a__HRE.js";import"./Box-COui6GIh.js";import"./styled-Ckl9NdN2.js";import"./AccordionDetails-Fks5AbbD.js";import"./index-B9sM2jn7.js";import"./Collapse-B6v7_Lug.js";import"./List-Zd71n2FM.js";import"./ListContext-CBZm9pJe.js";import"./Divider-C9c6KGoD.js";import"./ListItem-CGZ3ypeU.js";import"./ListItemIcon-BUUsm_I5.js";import"./ListItemText-BFb2Grym.js";import"./Tabs-uBXG9BGx.js";import"./KeyboardArrowRight-DMkibHBi.js";import"./FormLabel-BTmno_qp.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-DQzfReps.js";import"./InputLabel-C_1lyP9G.js";import"./Select-D8Je2o65.js";import"./Popover-C5Oe9S6O.js";import"./Modal-ob7ZinQq.js";import"./Portal-9M61fEx6.js";import"./MenuItem-j4N1CzUe.js";import"./Checkbox-1pjU2CIe.js";import"./SwitchBase-CnsDPG4Q.js";import"./Chip-DFDuSRb0.js";import"./lodash-Y_-RFQgK.js";import"./useAnalytics-BVxeCBFY.js";var r={},n;function I(){if(n)return r;n=1;var i=v(),l=f();Object.defineProperty(r,"__esModule",{value:!0}),r.default=void 0;var c=l(h()),m=i(T()),d=(0,m.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return r.default=d,r}var R=I();const q=y(R),ve={title:"Plugins/Search/SearchType",component:s,decorators:[i=>e.jsx(x,{apis:[[_,new g]],children:e.jsx(D,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(i,{})})})})})]},p=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:p,defaultValue:p[0]})}),o=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(V,{})},{value:"value-2",name:"Value Two",icon:e.jsx(q,{})},{value:"value-3",name:"Value Three",icon:e.jsx(j,{})}]}),t=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"Accordion"};t.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
