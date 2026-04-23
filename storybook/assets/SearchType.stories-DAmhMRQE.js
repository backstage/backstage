import{aP as h,aQ as y,aR as S,aS as T,aE as x,j as e,P as _,a2 as V}from"./iframe-D4ojcRBn.js";import{M as j}from"./MenuBook-BjJVCT8t.js";import{S as u}from"./SearchType-nyj4dRsk.js";import{s as P,M as R}from"./api-CG7Yri57.js";import{S as g}from"./SearchContext-Bwuvkf_B.js";import{S as m}from"./Grid-DTyJ7xkb.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-VVYq8_kD.js";import"./useAsync-BUOFjVsl.js";import"./useMountedState-Dd8_3eVW.js";import"./translation-m4Z2FeYY.js";import"./Box-laszcGHL.js";import"./styled-DZLwQIlI.js";import"./AccordionDetails-C_SvNiGJ.js";import"./index-B9sM2jn7.js";import"./Collapse-DFs2mBo2.js";import"./List-F0S5B9Dv.js";import"./ListContext-S6LlGKy0.js";import"./Divider-DPJDNd0s.js";import"./ListItem-B4NcQ-mY.js";import"./ListItemIcon-DFfD_X0n.js";import"./ListItemText-DqjEjuKL.js";import"./makeStyles-Cl-w1ABh.js";import"./Tabs-v25_eZiW.js";import"./KeyboardArrowRight-nD3tSXqr.js";import"./FormLabel-CKacr3k-.js";import"./formControlState-DPQG6hOS.js";import"./InputLabel-b8Oxmg5H.js";import"./Select-BLtFOxar.js";import"./Popover-Br3Mvmbr.js";import"./Modal-DJW-GyYR.js";import"./Portal-CTav-3Kk.js";import"./MenuItem-Cff9LskS.js";import"./Checkbox-D0WerLZg.js";import"./SwitchBase-B8te7Ba6.js";import"./Chip-B7KiQxvh.js";import"./useAnalytics-09trSmCC.js";import"./lodash-B6rdiaVd.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(S()),l=r(T()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=x(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(S()),l=r(T()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var A=M();const E=x(A),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[P,new R]],children:e.jsx(g,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(E,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchType name="Search type" values={values} defaultValue={values[0]} />
    </Paper>;
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const Se=["Default","Accordion","Tabs"];export{i as Accordion,t as Default,s as Tabs,Se as __namedExportsOrder,ye as default};
