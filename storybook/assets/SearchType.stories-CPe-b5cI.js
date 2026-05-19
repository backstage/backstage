import{aR as h,aS as T,aT as y,aU as S,aE as x,j as e,P as _,a2 as V}from"./iframe-BCuiGO18.js";import{M as j}from"./MenuBook-B6EPx1hO.js";import{S as u}from"./SearchType-reynHjBa.js";import{s as R,M as g}from"./api-0IOqnvCu.js";import{S as P}from"./SearchContext-Bi8yukTC.js";import{S as m}from"./Grid-ks1F9Ab_.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-Yv_q-kXu.js";import"./useAsync-Cj0IJRXY.js";import"./useMountedState-HGb4mU5a.js";import"./translation-B99ZNoCi.js";import"./Box-DF0subjV.js";import"./styled-n3Xk8m2M.js";import"./AccordionDetails-kOY2jM_p.js";import"./index-B9sM2jn7.js";import"./Collapse-rzCTC0c6.js";import"./List-DYKyo639.js";import"./ListContext-DefbUR_f.js";import"./Divider-DQRcUmcz.js";import"./ListItem-D5tv8MX2.js";import"./ListItemIcon-DULFlkD5.js";import"./ListItemText-BF4AZnbO.js";import"./makeStyles-BiC0-IRq.js";import"./Tabs-sDawgit4.js";import"./KeyboardArrowRight-DtLulVwL.js";import"./FormLabel-C414RHUJ.js";import"./formControlState-D7uetKle.js";import"./InputLabel-CJxicx2h.js";import"./Select-CMVAeCz_.js";import"./Popover-CyM8W8X-.js";import"./Modal-BjSLJdmT.js";import"./Portal-Bdh2rISL.js";import"./MenuItem-D6_iPtny.js";import"./Checkbox-DG6zO0vu.js";import"./SwitchBase-mp3WW75C.js";import"./Chip-weePpAxC.js";import"./useAnalytics-CLav7vMM.js";import"./lodash-LxfdXjj1.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=T();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(y()),l=r(S()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=x(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=T();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(y()),l=r(S()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var A=M();const E=x(A),Te={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[R,new g]],children:e.jsx(P,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(E,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const ye=["Default","Accordion","Tabs"];export{i as Accordion,t as Default,s as Tabs,ye as __namedExportsOrder,Te as default};
