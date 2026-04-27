import{aP as h,aQ as y,aR as S,aS as T,aE as x,j as e,P as _,a2 as V}from"./iframe-UdCk74ed.js";import{M as j}from"./MenuBook-GDMO7ep0.js";import{S as u}from"./SearchType-DopFjr69.js";import{s as P,M as R}from"./api-ST6kqXaL.js";import{S as g}from"./SearchContext-Cv6UnX9N.js";import{S as m}from"./Grid-DwqHvQ9E.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-DwTkoc5e.js";import"./useAsync-BWSDTMlV.js";import"./useMountedState-7chJbMUP.js";import"./translation-uQxXzAMD.js";import"./Box-sbiym-y5.js";import"./styled-BN87Jrul.js";import"./AccordionDetails-DsLxbANW.js";import"./index-B9sM2jn7.js";import"./Collapse-Dq_oeJyM.js";import"./List-CFWP97D4.js";import"./ListContext-C8Zyt_3h.js";import"./Divider-CtW3oCa7.js";import"./ListItem-D0ITxQe3.js";import"./ListItemIcon-fBCHDIjQ.js";import"./ListItemText-C5Zs7Dtn.js";import"./makeStyles-EOk-SryI.js";import"./Tabs-D8sjjNcG.js";import"./KeyboardArrowRight-DrZ4A9-2.js";import"./FormLabel-C8fbt-l2.js";import"./formControlState-DDtdeAfY.js";import"./InputLabel-CAWiZp1s.js";import"./Select-BPQdorpW.js";import"./Popover-CKDAusRL.js";import"./Modal-88nru509.js";import"./Portal-B_bZnr3n.js";import"./MenuItem-Dn2wl6H5.js";import"./Checkbox-BKZetU6d.js";import"./SwitchBase-B4cpjSI7.js";import"./Chip-ClK69h0e.js";import"./useAnalytics-DsUIDtns.js";import"./lodash-BPf5Z96Y.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(S()),l=r(T()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=x(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(S()),l=r(T()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var A=M();const E=x(A),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[P,new R]],children:e.jsx(g,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(E,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
