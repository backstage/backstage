import{aC as v,aD as f,aE as h,aF as T,a4 as y,j as e,T as x,Z as S}from"./iframe-DVMaQ9oH.js";import{C as V}from"./MenuBook-CGUUuxrC.js";import{U as j}from"./Person-B55i-YKU.js";import{S as s}from"./SearchType-BYRRpFNs.js";import{s as _,M as g}from"./api-DaZsx-8u.js";import{S as D}from"./SearchContext-Cebx7tfZ.js";import{S as u}from"./Grid-BnNe0SDT.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-BkRt0N0x.js";import"./useAsync-C7ceDp4n.js";import"./useMountedState-CB6VIth1.js";import"./translation-ChsQuvug.js";import"./Box-CFSsj6ua.js";import"./styled-BBv6xD1v.js";import"./AccordionDetails-DDgGuMuh.js";import"./index-B9sM2jn7.js";import"./Collapse-DjiqELor.js";import"./List-Dti-y3i6.js";import"./ListContext-BKfPcfO0.js";import"./Divider-DFSugnoU.js";import"./ListItem-D0hmS8se.js";import"./ListItemIcon-Cmz4If-S.js";import"./ListItemText-1_kgrXU9.js";import"./Tabs-DNgo0naX.js";import"./KeyboardArrowRight-Ct-umqKm.js";import"./FormLabel-BSBgtsp9.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-8YqLOjLb.js";import"./InputLabel-OP04NGxS.js";import"./Select-CkqUWOUP.js";import"./Popover-BAi_Nv0a.js";import"./Modal-CJ1fn4qg.js";import"./Portal-B9YgpH-D.js";import"./MenuItem-Bh5YSOIJ.js";import"./Checkbox-CteSubDO.js";import"./SwitchBase-kRjnQcFL.js";import"./Chip-Dc9QAB2j.js";import"./lodash-Y_-RFQgK.js";import"./useAnalytics-D_e6aR87.js";var r={},n;function I(){if(n)return r;n=1;var i=v(),l=f();Object.defineProperty(r,"__esModule",{value:!0}),r.default=void 0;var c=l(h()),m=i(T()),d=(0,m.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return r.default=d,r}var R=I();const q=y(R),ve={title:"Plugins/Search/SearchType",component:s,decorators:[i=>e.jsx(x,{apis:[[_,new g]],children:e.jsx(D,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(i,{})})})})})]},p=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:p,defaultValue:p[0]})}),o=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(V,{})},{value:"value-2",name:"Value Two",icon:e.jsx(q,{})},{value:"value-3",name:"Value Three",icon:e.jsx(j,{})}]}),t=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"Accordion"};t.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
