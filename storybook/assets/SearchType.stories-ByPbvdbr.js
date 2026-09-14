import{cd as h,ce as y,ch as T,cc as x,bs as S,bQ as e,P as _,a4 as V}from"./iframe-DXdR4xPj.js";import{M as j}from"./MenuBook-oJGt5hsF.js";import{S as u}from"./SearchType-uWvTvylk.js";import{s as g,M as P}from"./api-C2sdP6MI.js";import{S as R}from"./SearchContext-DKpD-fNO.js";import{S as m}from"./Grid-DrAuN9Lo.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-Cn9fsZkL.js";import"./useAsync-BqpLlOup.js";import"./useMountedState-ONEV228w.js";import"./translation-BOCENZDg.js";import"./Box-BJkHSLqZ.js";import"./styled-CiGmUP6u.js";import"./AccordionDetails-CcwoEpnL.js";import"./index-B9sM2jn7.js";import"./Collapse-D3SHWrK_.js";import"./List-lTcp28bB.js";import"./ListContext-D9s9W3--.js";import"./Divider-Czk8sHFY.js";import"./ListItem-BOMvkCzo.js";import"./ListItemIcon-CUjJmTtb.js";import"./ListItemText-OsK-woHh.js";import"./makeStyles-BSWJde_H.js";import"./Tabs-K4PAzYvB.js";import"./KeyboardArrowRight--f8gp7Zo.js";import"./FormLabel-Bj78RAgv.js";import"./formControlState-CCy3lDXZ.js";import"./InputLabel-GnW6vpC_.js";import"./Select-C_uXqyOx.js";import"./Popover-Cnoxr92_.js";import"./Modal-0mYCwSY0.js";import"./Portal-BrV34s_5.js";import"./MenuItem-QeP5OLH1.js";import"./Checkbox-BcjdF_d9.js";import"./SwitchBase-BPd0tGz9.js";import"./Chip-BJxQc-Mu.js";import"./useAnalytics-Bc97N_iw.js";import"./lodash-CmjgS8yt.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=S(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var b=M();const A=S(b),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[g,new P]],children:e.jsx(R,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),s=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(A,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),i=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"Accordion"};i.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchType name="Search type" values={values} defaultValue={values[0]} />
    </Paper>;
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};const Te=["Default","Accordion","Tabs"];export{s as Accordion,t as Default,i as Tabs,Te as __namedExportsOrder,ye as default};
