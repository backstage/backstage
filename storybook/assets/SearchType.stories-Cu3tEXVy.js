import{ah as v,ai as f,aj as h,ak as T,q as y,j as e,T as x,$ as S}from"./iframe-DXt6I_1q.js";import{C as V}from"./MenuBook-BPhohWvU.js";import{U as j}from"./Person-Dh1kcEt3.js";import{S as s}from"./SearchType-B2UquJIh.js";import{s as _,M as g}from"./api-GAYfXGd9.js";import{S as D}from"./SearchContext-BNcIiRVU.js";import{S as u}from"./Grid-S6xSP1g4.js";import"./preload-helper-D9Z9MdNV.js";import"./ExpandMore-CSLlRCsy.js";import"./useAsync-uNXDDhwP.js";import"./useMountedState-BEJ2TW9Z.js";import"./translation-S0z9MrVh.js";import"./Box-BQB-mg8-.js";import"./styled-Dla1Uw7W.js";import"./AccordionDetails-BnUWlxaJ.js";import"./index-DnL3XN75.js";import"./Collapse-DtNym6qB.js";import"./List-PtSETj5l.js";import"./ListContext-C4_dHRNu.js";import"./Divider-rqAQKIY3.js";import"./ListItem-CNHhXRSS.js";import"./ListItemIcon-BkHLCJmT.js";import"./ListItemText-CaGb_JPi.js";import"./Tabs-BvvoKJzN.js";import"./KeyboardArrowRight-ClZ7Ql0y.js";import"./FormLabel-Df8u9uma.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-33OhtJEr.js";import"./InputLabel-DSc4Qx10.js";import"./Select-D7XYnLRf.js";import"./Popover-B0QqOIFJ.js";import"./Modal-O3HFvYR5.js";import"./Portal-DOTL7Yad.js";import"./MenuItem-CtKi2Sct.js";import"./Checkbox-BVkliRD-.js";import"./SwitchBase-BVxutwRW.js";import"./Chip-Cvf4rAVZ.js";import"./lodash-CwBbdt2Q.js";import"./useAnalytics-CGIT0JTN.js";var r={},n;function I(){if(n)return r;n=1;var i=v(),l=f();Object.defineProperty(r,"__esModule",{value:!0}),r.default=void 0;var c=l(h()),m=i(T()),d=(0,m.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return r.default=d,r}var q=I();const R=y(q),ve={title:"Plugins/Search/SearchType",component:s,decorators:[i=>e.jsx(x,{apis:[[_,new g]],children:e.jsx(D,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(i,{})})})})})]},p=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:p,defaultValue:p[0]})}),o=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(V,{})},{value:"value-2",name:"Value Two",icon:e.jsx(R,{})},{value:"value-3",name:"Value Three",icon:e.jsx(j,{})}]}),t=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"Accordion"};t.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
