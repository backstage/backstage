import{aW as h,aX as y,aY as T,aZ as x,aN as S,j as e,P as _,a3 as V}from"./iframe-BboAvpku.js";import{M as j}from"./MenuBook-ClpWFxvc.js";import{S as u}from"./SearchType-BxtYXTp1.js";import{s as g,M as P}from"./api-BKmu6aKy.js";import{S as R}from"./SearchContext-CNkU5QLw.js";import{S as m}from"./Grid-BGOrXcY9.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-BjuwtgxK.js";import"./useAsync-C5cukq2r.js";import"./useMountedState-Bzk4ehad.js";import"./translation-CFYdIsXO.js";import"./Box-AqVT1Pws.js";import"./styled-DoG2XfKF.js";import"./AccordionDetails-DX8tynby.js";import"./index-B9sM2jn7.js";import"./Collapse-Cw4T2uQ_.js";import"./List-OZSHlN34.js";import"./ListContext-BOEEedU_.js";import"./Divider-SqGTKvAo.js";import"./ListItem-Dkgy1Td7.js";import"./ListItemIcon-CzcYjLS8.js";import"./ListItemText-YTyAL1wR.js";import"./makeStyles-iFGDkJwR.js";import"./Tabs-BLY8zBuh.js";import"./KeyboardArrowRight-UniaMfvi.js";import"./FormLabel-BE6kvav3.js";import"./formControlState-Bj1RmNF4.js";import"./InputLabel-C7qWds46.js";import"./Select-BcFNlC-7.js";import"./Popover-CgRHUBb5.js";import"./Modal-CbraGSLf.js";import"./Portal-CDVCSIuc.js";import"./MenuItem-B3-BLOav.js";import"./Checkbox-DvBv8LWa.js";import"./SwitchBase-CzpP6v38.js";import"./Chip-D9jzgiaO.js";import"./useAnalytics-CgDc_Zie.js";import"./lodash-DkpW-IpZ.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=S(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var A=M();const b=S(A),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[g,new P]],children:e.jsx(R,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(b,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const Te=["Default","Accordion","Tabs"];export{i as Accordion,t as Default,s as Tabs,Te as __namedExportsOrder,ye as default};
