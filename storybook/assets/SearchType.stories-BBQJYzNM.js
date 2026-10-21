import{aV as h,aW as y,aX as T,aY as x,aM as S,j as e,P as V,a3 as _}from"./iframe-CSz7VfT3.js";import{M as j}from"./MenuBook-nHz2XuIu.js";import{S as u}from"./SearchType-YPJNGESK.js";import{s as g,M as P}from"./api-DoTntPif.js";import{S as R}from"./SearchContext-CSXRfjme.js";import{S as m}from"./Grid-BK-uRE6j.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-CT8H60wv.js";import"./useAsync-4c1pdS8b.js";import"./useMountedState-Bb4Yyk9k.js";import"./translation-CNzSNPoU.js";import"./Box-Bz86QYYh.js";import"./styled-BZdOrxc2.js";import"./AccordionDetails-DXova11v.js";import"./index-B9sM2jn7.js";import"./Collapse-B_-gM8xf.js";import"./List-BSep9TdZ.js";import"./ListContext-PRAg6M82.js";import"./Divider-C-NbBHFJ.js";import"./ListItem-CIKs1J7B.js";import"./ListItemIcon-Do6ROgfC.js";import"./ListItemText-Dii_m3Om.js";import"./makeStyles-CC8EE5Qs.js";import"./Tabs-CaGcQ0C0.js";import"./KeyboardArrowRight-BgTWG4ng.js";import"./FormLabel-DrcUBHen.js";import"./formControlState-gZGQdiG6.js";import"./InputLabel-CCN19SO-.js";import"./Select-CEvvN0Eb.js";import"./Popover-kVmgLK9-.js";import"./Modal-FfDXHIjA.js";import"./Portal-Cd8SI1ja.js";import"./MenuItem-DvmhyYn4.js";import"./Checkbox-C7DuNooE.js";import"./SwitchBase-C2Uo1QFg.js";import"./Chip-RifSOEaA.js";import"./useAnalytics-CbLpUIzI.js";import"./lodash-KZId8LWf.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=S(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var A=M();const b=S(A),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(_,{apis:[[g,new P]],children:e.jsx(R,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(V,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(b,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
