import{ag as v,ah as f,ai as h,aj as T,s as y,j as e,T as x,a0 as S}from"./iframe-DKl1TaBY.js";import{C as V}from"./MenuBook-SsFhHyKK.js";import{U as j}from"./Person-CkH3oW70.js";import{S as s}from"./SearchType-DkJm6xb1.js";import{s as g,M as _}from"./api-CzWMH9sB.js";import{S as D}from"./SearchContext-Dh6i_bMc.js";import{S as u}from"./Grid-DucnE1Qv.js";import"./preload-helper-D9Z9MdNV.js";import"./ExpandMore-SNT8Gr9W.js";import"./useAsync-6VrnLR2E.js";import"./useMountedState-Bg5ZLpHR.js";import"./translation-haz9RaEa.js";import"./Box-8sIy39Mn.js";import"./styled-DuPROqdG.js";import"./AccordionDetails-5IM8yJG8.js";import"./index-DnL3XN75.js";import"./Collapse-DRCUh2Je.js";import"./List-BKhl6P7T.js";import"./ListContext-Df16DwNz.js";import"./Divider-DdBr9tFd.js";import"./ListItem-Cik-ImzB.js";import"./ListItemIcon-ClgSqD8f.js";import"./ListItemText-X8gsxozg.js";import"./Tabs-yrte2RZ5.js";import"./KeyboardArrowRight-C3Rjqlpm.js";import"./FormLabel-BnQER_VI.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-ivci966F.js";import"./InputLabel-BD4uJDC-.js";import"./Select-DQrTgl6q.js";import"./Popover-CYX2rhOY.js";import"./Modal-Dg-OYacR.js";import"./Portal-t3ECfreD.js";import"./MenuItem-DFRTJYZD.js";import"./Checkbox-bPCgQ04X.js";import"./SwitchBase-Dt7-H3SR.js";import"./Chip-Bg0W3qFH.js";import"./lodash-CwBbdt2Q.js";import"./useAnalytics-CECp0-UO.js";var r={},n;function I(){if(n)return r;n=1;var i=v(),l=f();Object.defineProperty(r,"__esModule",{value:!0}),r.default=void 0;var c=l(h()),m=i(T()),d=(0,m.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return r.default=d,r}var R=I();const q=y(R),ve={title:"Plugins/Search/SearchType",component:s,decorators:[i=>e.jsx(x,{apis:[[g,new _]],children:e.jsx(D,{children:e.jsx(u,{container:!0,direction:"row",children:e.jsx(u,{item:!0,xs:4,children:e.jsx(i,{})})})})})]},p=["value-1","value-2","value-3"],a=()=>e.jsx(S,{style:{padding:10},children:e.jsx(s,{name:"Search type",values:p,defaultValue:p[0]})}),o=()=>e.jsx(s.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(V,{})},{value:"value-2",name:"Value Two",icon:e.jsx(q,{})},{value:"value-3",name:"Value Three",icon:e.jsx(j,{})}]}),t=()=>e.jsx(s.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});a.__docgenInfo={description:"",methods:[],displayName:"Default"};o.__docgenInfo={description:"",methods:[],displayName:"Accordion"};t.__docgenInfo={description:"",methods:[],displayName:"Tabs"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
