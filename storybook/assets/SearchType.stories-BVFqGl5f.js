import{ah as v,ai as f,aj as h,ak as T,a3 as y,j as e,T as x,Z as S}from"./iframe-DDGN0cGv.js";import{C as V}from"./MenuBook-03YdKpIc.js";import{U as j}from"./Person-eo_0dnly.js";import{S as s}from"./SearchType-BPkQkDzv.js";import{s as _,M as g}from"./api-QlE9xgJi.js";import{S as D}from"./SearchContext-CENdRfZX.js";import{S as u}from"./Grid-D5cwdvdp.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-DdbG_Iny.js";import"./useAsync-2V8xCCu6.js";import"./useMountedState-DWcF_6cb.js";import"./translation-BUa1tb2S.js";import"./Box-Ddxf02Aa.js";import"./styled-BpU391Me.js";import"./AccordionDetails-D8hpySZx.js";import"./index-B9sM2jn7.js";import"./Collapse-1BtLbcFp.js";import"./List-B6XxVgNa.js";import"./ListContext-BfPeZX-c.js";import"./Divider-nJoj97pl.js";import"./ListItem-B4p-bJZY.js";import"./ListItemIcon-DzLg1Qai.js";import"./ListItemText-D6aBcig9.js";import"./Tabs-6UGAgJ6N.js";import"./KeyboardArrowRight-CtJLJr1F.js";import"./FormLabel-Cvs8umqz.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BrQ4BsJz.js";import"./InputLabel-xEVhEFxf.js";import"./Select-C5MBmxAB.js";import"./Popover-BIEPvO5s.js";import"./Modal-y_bxeVJ1.js";import"./Portal-BqHzn-UB.js";import"./MenuItem-DotvnHD1.js";import"./Checkbox-B2s7QLiP.js";import"./SwitchBase-BKApDkHi.js";import"./Chip-CrmC8B9P.js";import"./lodash-Y_-RFQgK.js";import"./useAnalytics-CyvQxdhU.js";var r={},n;function I(){if(n)return r;n=1;var i=v(),l=f();Object.defineProperty(r,"__esModule",{value:!0}),r.default=void 0;var c=l(h()),m=i(T()),d=(0,m.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return r.default=d,r}var R=I();const q=y(R),ve={title:"Plugins/Search/SearchType",component:s,decorators:[i=>e.jsx(x,{apis:[[_,new g]],children:e.jsx(D,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(i,{})})})})})]},p=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:p,defaultValue:p[0]})}),o=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(V,{})},{value:"value-2",name:"Value Two",icon:e.jsx(q,{})},{value:"value-3",name:"Value Three",icon:e.jsx(j,{})}]}),t=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"Accordion"};t.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
